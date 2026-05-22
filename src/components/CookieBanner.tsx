import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: {
      opt_in_capturing: () => void;
      opt_out_capturing: () => void;
      capture: (event: string, props?: Record<string, unknown>) => void;
      set_config: (config: Record<string, unknown>) => void;
      startSessionRecording: () => void;
      stopSessionRecording: () => void;
    };
  }
}

const STORAGE_KEY = "cookie_consent";
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;
const SCROLL_THRESHOLD = 0.05;

type Consent = { status: "accepted" | "refused"; timestamp: number; method?: string };

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > SIX_MONTHS_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function applyGranted() {
  window.gtag?.("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  // PostHog est déjà actif au chargement (intérêt légitime) — no-op.
}

function applyDenied() {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  // Refus explicite : on coupe PostHog.
  window.posthog?.opt_out_capturing?.();
  window.posthog?.set_config({
    persistence: "memory",
    disable_session_recording: true,
  });
  window.posthog?.stopSessionRecording();
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);
  const decidedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = readConsent();
    if (existing?.status === "accepted") {
      applyGranted();
      decidedRef.current = true;
      return;
    }
    if (existing?.status === "refused") {
      applyDenied();
      decidedRef.current = true;
      return;
    }

    const t = window.setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setShown(true));
    }, 1500);

    let lastRun = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastRun < 200) return;
      lastRun = now;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = window.scrollY / scrollable;
      if (pct > SCROLL_THRESHOLD) {
        accept("scroll");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !decidedRef.current) refuse();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setShown(false);
    window.setTimeout(() => setVisible(false), 300);
  };

  const accept = (method: "click" | "scroll" = "click") => {
    if (decidedRef.current) return;
    decidedRef.current = true;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status: "accepted", timestamp: Date.now(), method }),
    );
    applyGranted();
    window.gtag?.("event", "cookie_consent", { value: "accepted", method });
    window.posthog?.capture("cookie_consent", { status: "accepted", method });
    close();
  };

  const refuse = () => {
    if (decidedRef.current) return;
    decidedRef.current = true;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status: "refused", timestamp: Date.now() }),
    );
    applyDenied();
    window.gtag?.("event", "cookie_consent", { value: "refused" });
    close();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed z-[1000] bg-[#FAF7F2] border border-[#D4A89B] rounded-sm p-5 font-sans"
      style={{
        bottom: "var(--cookie-bottom, 24px)",
        right: 16,
        left: 16,
        maxWidth: 340,
        marginLeft: "auto",
        boxShadow: "0 4px 16px rgba(74, 107, 124, 0.12)",
        transform: shown ? "translateY(0)" : "translateY(20px)",
        opacity: shown ? 1 : 0,
        transition: "all 400ms ease-out",
      }}
    >
      <h2
        id="cookie-title"
        className="text-[15px] font-medium text-[#4A6B7C] m-0"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Cookies et données
      </h2>
      <p
        id="cookie-desc"
        className="text-[13px] text-[#2A2A2A] mt-2"
        style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}
      >
        Nous utilisons des cookies pour mesurer l'audience et améliorer votre expérience.
        En poursuivant votre navigation, vous acceptez leur dépôt.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => accept("click")}
          className="text-[14px] rounded-sm hover:bg-[#5a7a6f] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B8E7F]"
          style={{
            flexGrow: 2,
            padding: "10px 18px",
            background: "#6B8E7F",
            color: "#FAF7F2",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          }}
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={refuse}
          className="text-[14px] rounded-sm hover:opacity-100 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B8E7F]"
          style={{
            flexGrow: 1,
            padding: "10px 18px",
            background: "transparent",
            border: "1px solid rgba(42,42,42,0.2)",
            color: "rgba(42,42,42,0.7)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Refuser
        </button>
      </div>
      <a
        href="https://www.ceramique-murale.com/mentions-legales/"
        target="_blank"
        rel="noreferrer"
        className="block mt-3 text-[11px] text-[#6B6B6B] hover:underline"
        style={{ fontFamily: "Inter, sans-serif", opacity: 0.7 }}
      >
        En savoir plus sur nos cookies
      </a>
    </div>
  );
}
