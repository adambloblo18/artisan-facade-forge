import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transpileModule, ScriptTarget } from "typescript";

const rootSource = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
const bannerSource = readFileSync(new URL("./CookieBanner.tsx", import.meta.url), "utf8");
const formSource = readFileSync(new URL("./MultiStepForm.tsx", import.meta.url), "utf8");
const lifetime = 15552000000;

function script(name: string) {
  const value = rootSource.match(new RegExp(`const ${name} = \x60([\\s\\S]*?)\x60;`))?.[1];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function consentEnvironment(consent: unknown = null) {
  const timers: { run: () => void; delay: number }[] = [];
  const inserted: Record<string, unknown>[] = [];
  const window: Record<string, unknown> = {};
  const context = {
    window,
    document: {
      readyState: "complete",
      createElement: () => ({}),
      head: { appendChild: (element: Record<string, unknown>) => inserted.push(element) },
    },
    localStorage: { getItem: () => JSON.stringify(consent) },
    setTimeout: (run: () => void, delay: number) => timers.push({ run, delay }),
    Date: { now: () => 20000000000 },
  };
  Object.defineProperty(context, "dataLayer", { get: () => window["dataLayer"] });
  runInNewContext(script("consentScript"), context);
  return { context, window, timers, inserted };
}

test("no audience loader runs without an accepted choice", () => {
  const env = consentEnvironment();
  for (const name of ["uetScript", "clarityScript", "posthogScript"]) {
    runInNewContext(script(name), env.context);
  }
  assert.equal(env.timers.length, 0);
  assert.equal((env.window["lcmChargeurs"] as unknown[]).length, 3);
  assert.equal(env.window["posthog"], undefined);
  assert.equal(env.window["clarity"], undefined);
  assert.equal(env.window["uetq"], undefined);
  assert.equal(env.inserted.length, 1);
  assert.equal(env.inserted[0]?.["src"], "https://www.googletagmanager.com/gtag/js?id=AW-11400865534");
});

test("explicit refusal does not schedule audience measurement", () => {
  const env = consentEnvironment({ status: "refused", timestamp: 19999999999 });
  assert.equal(env.timers.length, 0);
});

test("acceptance expires after the specified 15552000000 milliseconds", () => {
  const env = consentEnvironment({ status: "accepted", timestamp: 20000000000 - lifetime });
  assert.equal(env.timers.length, 0);
});

test("a valid saved acceptance schedules measurement after 1500 milliseconds", () => {
  const env = consentEnvironment({ status: "accepted", timestamp: 20000000000 - lifetime + 1 });
  assert.deepEqual(env.timers.map((timer) => timer.delay), [1500]);
});

test("explicit acceptance runs queued and late loaders only once", () => {
  const env = consentEnvironment();
  let runs = 0;
  const queue = env.window["lcmChargeurs"] as (() => void)[];
  queue.push(() => { runs += 1; });
  const start = env.window["lcmChargerMesure"];
  if (typeof start !== "function") throw new Error("Missing consent manager");
  start();
  start();
  assert.equal(runs, 0);
  assert.equal(env.timers.length, 1);
  env.timers[0]?.run();
  assert.equal(runs, 1);
  queue.push(() => { runs += 1; });
  assert.equal(runs, 2);
});

test("granting consent updates Google before starting measurement", () => {
  const body = bannerSource.match(/function applyGranted\(\) \{([\s\S]*?)\n\}/)?.[1];
  if (!body) throw new Error("Missing grant handler");
  const calls: unknown[][] = [];
  runInNewContext(body, {
    window: {
      gtag: (...args: unknown[]) => calls.push(args),
      lcmChargerMesure: () => calls.push(["measurement"]),
    },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted",
    }],
    ["measurement"],
  ]);
});

test("PostHog masks all form inputs", () => {
  const env = consentEnvironment();
  let configuration: Record<string, unknown> = {};
  env.window["posthog"] = {
    __SV: 1,
    init: (_key: string, config: Record<string, unknown>) => { configuration = config; },
  };
  Object.defineProperty(env.context, "posthog", { get: () => env.window["posthog"] });
  runInNewContext(script("posthogScript"), env.context);
  const queue = env.window["lcmChargeurs"] as (() => void)[];
  queue[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(configuration["session_recording"])), {
    sampleRate: 1, minimumDurationMilliseconds: 0, maskAllInputs: true,
  });
});

test("thank-you URL retains value and transaction but no contact details", () => {
  const expression = formSource.match(/const params = new URLSearchParams\(([\s\S]*?)\);/)?.[1];
  if (!expression) throw new Error("Missing redirect parameters");
  const params = runInNewContext(`new URLSearchParams(${expression})`, {
    URLSearchParams, timestamp: 123456789,
    values: { email: "test@example.com", telephone: "0600000000" },
    firstname: "Test", lastname: "Person",
  }) as URLSearchParams;
  assert.equal(params.get("value"), "500");
  assert.equal(params.get("tx"), "LEAD-123456789");
  for (const key of ["email", "phone", "fn", "ln"]) assert.equal(params.has(key), false);
});

test("initial page setup does not persist advertising or navigation data", () => {
  const effect = rootSource.split("function RootComponent()")[1]?.match(/useEffect\(\(\) => \{([\s\S]*?)\n  \}, \[\]\);/)?.[1];
  if (!effect) throw new Error("Missing initial page setup");
  const writes: unknown[] = [];
  runInNewContext(`(() => {${effect}})()`, {
    window: { location: { href: "https://example.com/?gclid=click-123&utm_source=google" } },
    document: {
      referrer: "https://example.org/",
      documentElement: { classList: { add: () => {} } },
      querySelectorAll: () => [],
    },
    sessionStorage: { getItem: () => null, setItem: (...args: unknown[]) => writes.push(args) },
    localStorage: { setItem: (...args: unknown[]) => writes.push(args) },
  });
  assert.deepEqual(writes, []);
});

test("submission reads attribution and navigation directly without storing contact details", async () => {
  const body = formSource.match(/const onSubmit = async \(values: FormValues\) => \{([\s\S]*?)\n  \};/)?.[1];
  if (!body) throw new Error("Missing submit handler");
  const writes: unknown[] = [];
  const logs: unknown[] = [];
  let payload: Record<string, unknown> = {};
  const href = "https://example.com/?gclid=click-123&utm_source=google&utm_medium=cpc&utm_campaign=restaurant&utm_term=enseigne&utm_content=photo&wbraid=wb&gbraid=gb&msclkid=ms";
  const context = {
    window: { location: { href, search: new URL(href).search } },
    document: { referrer: "https://example.org/restaurant" },
    URLSearchParams,
    Date: { now: () => 123456789 },
    mountedAt: { current: 0 },
    setSubmitError: () => {},
    WEB3FORMS_ENDPOINT: "https://api.web3forms.com/submit",
    WEB3FORMS_ACCESS_KEY: "test-key",
    REDIRECT_BASE: "https://example.com/merci/",
    console: { log: (...args: unknown[]) => logs.push(args), warn: () => {}, error: () => {} },
    sessionStorage: { getItem: () => "stale-value", setItem: (...args: unknown[]) => writes.push(args) },
    fetch: async (_url: string, options: { body: string }) => {
      payload = JSON.parse(options.body) as Record<string, unknown>;
      return { json: async () => ({ success: true }) };
    },
  };
  const js = transpileModule(`(async (values: unknown) => {${body}})`, {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  const submit = runInNewContext(js, context) as (values: Record<string, unknown>) => Promise<void>;
  await submit({ nom: "Test", email: "test@example.com", telephone: "0600000000", type: "enseigne", taille: "petit", delai: "explore", botcheck: "" });
  assert.deepEqual(writes, []);
  assert.deepEqual(logs, []);
  for (const [key, value] of new URL(href).searchParams) assert.equal(payload[key], value);
  assert.equal(payload["landing"], href);
  assert.equal(payload["referrer"], "https://example.org/restaurant");
  assert.equal(payload["email"], "test@example.com");
  const redirect = new URL(context.window.location.href);
  assert.equal(redirect.searchParams.get("gclid"), "click-123");
  assert.equal(redirect.searchParams.has("email"), false);
});