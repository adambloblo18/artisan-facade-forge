import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import CookieBanner from "../components/CookieBanner";

const consentScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});`;

const googleAdsScript = `gtag('js', new Date()); gtag('config', 'AW-11400865534');`;

const telConversionScript = `document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
    el.addEventListener('click', function() {
      window.gtag && gtag('event', 'conversion', { 'send_to': 'AW-11400865534/LKHFCIKk4d8bEP7Nrbwq' });
    });
  });
});`;

const emailConversionScript = `document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(el) {
    el.addEventListener('click', function() {
      window.gtag && gtag('event', 'conversion', { 'send_to': 'AW-11400865534/xEpOCJ-31J0cEP7Nrbwq' });
    });
  });
});`;

const uetScript = `window.addEventListener("load",function(){setTimeout(function(){(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"343242701"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");},1500);});`;

const clarityScript = `window.addEventListener("load",function(){setTimeout(function(){(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "uhxdrmhaaf");},1500);});`;

const posthogScript = `window.addEventListener("load",function(){setTimeout(function(){!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_oGmkuM4F5je7WmaLZpsF47paa8nv5V5vp58oh74Pwcwy', {
  api_host: 'https://eu.i.posthog.com',
  ui_host: 'https://eu.posthog.com',
  person_profiles: 'identified_only',
  capture_pageview: 'history_change',
  capture_pageleave: true,
  autocapture: true,
  cross_subdomain_cookie: true,
  persistence: 'memory',
  disable_session_recording: true,
  respect_dnt: false,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '.ph-mask, input[type="email"], input[type="tel"]'
  }
});},1200);});`;

const localBusinessLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Store"],
  name: "Les Céramiques Murales du Vésinet",
  url: "https://www.ceramique-murale.com/",
  telephone: "+33670025133",
  priceRange: "€€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 rue Ernest André",
    addressLocality: "Le Vésinet",
    postalCode: "78110",
    addressCountry: "FR",
  },
  founder: { "@type": "Person", name: "Laurence Brecher" },
  award:
    "Premier Prix du Ravalement de la Ville de Versailles 2025, catégorie Restitution de Décors",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl">404</h1>
        <p className="mt-4 text-muted-foreground">Cette page n'existe pas.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">Une erreur est survenue.</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="btn-primary mt-6"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "Enseignes en céramique pour restaurants, Laurence Brecher" },
      {
        name: "description",
        content:
          "Enseignes et décors céramique sur mesure pour restaurants, hôtels et architectes. Prix du Ravalement Versailles 2025. Réponse en 20 minutes.",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#C1583E" },
      { name: "apple-mobile-web-app-title", content: "Céramique Murale Brecher" },
      { name: "application-name", content: "Céramique Murale Brecher" },
      { httpEquiv: "content-language", content: "fr-FR" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "Laurence Brecher · Céramique architecturale" },
      { property: "og:title", content: "Une façade qui transforme les passants en clients | Laurence Brecher" },
      {
        property: "og:description",
        content:
          "Enseignes et décors céramique sur mesure pour restaurants, hôtels et architectes. Prix du Ravalement Versailles 2025.",
      },
      {
        property: "og:image",
        content:
          "https://www.ceramique-murale.com/wp-content/uploads/2023/09/6E2BE403-A759-44F8-B5C1-29F488515E32.jpeg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Une façade qui transforme les passants en clients | Laurence Brecher" },
      {
        name: "twitter:description",
        content: "Céramique architecturale pour restaurants, hôtels et architectes.",
      },
      {
        name: "twitter:image",
        content:
          "https://www.ceramique-murale.com/wp-content/uploads/2023/09/6E2BE403-A759-44F8-B5C1-29F488515E32.jpeg",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "image", href: "/images/hero-castor.webp", fetchPriority: "high" } as any,
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      { children: consentScript },
      { src: "https://www.googletagmanager.com/gtag/js?id=AW-11400865534", async: true },
      { children: googleAdsScript },
      { children: telConversionScript },
      { children: emailConversionScript },
      { children: uetScript },
      { children: clarityScript },
      { children: posthogScript },
      { type: "application/ld+json", children: localBusinessLd },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const adParams = ["gclid", "wbraid", "gbraid", "msclkid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
      adParams.forEach((key) => {
        const val = url.searchParams.get(key);
        if (val) sessionStorage.setItem(`lcm_${key}`, val);
      });
      if (!sessionStorage.getItem("lcm_landing")) {
        sessionStorage.setItem("lcm_landing", window.location.href);
      }
      if (!sessionStorage.getItem("lcm_referrer") && document.referrer) {
        sessionStorage.setItem("lcm_referrer", document.referrer);
      }
    } catch {}

    document.documentElement.classList.add("js-ready");
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    const scan = () =>
      document.querySelectorAll(".reveal-on-scroll:not(.is-visible)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[color:var(--gold)] focus:text-[color:var(--ink)] focus:px-4 focus:py-2 focus:rounded-sm"
      >
        Aller au contenu
      </a>
      <Outlet />
      <CookieBanner />
    </QueryClientProvider>
  );
}
