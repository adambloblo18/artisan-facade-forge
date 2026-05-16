import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const c = localStorage.getItem("cm_consent");
    if (c === "1" || c === "0") return;
    setVisible(true);

    const onScroll = () => {
      if (window.scrollY > 150) {
        accept();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = () => {
    localStorage.setItem("cm_consent", "1");
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("cm_consent", "0");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[100] max-w-sm bg-white border border-border shadow-[0_20px_50px_-20px_rgba(20,49,59,0.4)] rounded-sm p-5"
    >
      <p className="text-sm text-foreground">
        Nous utilisons des cookies pour mesurer l'audience et améliorer votre expérience.
      </p>
      <div className="mt-4 flex gap-2 justify-end">
        <button
          type="button"
          onClick={refuse}
          className="px-4 py-2 text-sm rounded-sm border border-border hover:bg-muted transition-colors"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={accept}
          className="px-4 py-2 text-sm rounded-sm bg-[color:var(--gold)] text-[color:var(--ink)] font-medium hover:opacity-90 transition-opacity"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
