import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

type ImgRef = { src: string; alt: string };

let openLightboxFn: ((img: ImgRef) => void) | null = null;

export function openLightbox(img: ImgRef) {
  openLightboxFn?.(img);
}

export default function Lightbox() {
  const [img, setImg] = useState<ImgRef | null>(null);

  useEffect(() => {
    openLightboxFn = (i) => {
      setImg(i);
      try {
        (window as any).posthog?.capture?.("image_zoom", { image_alt: i.alt, image_src: i.src });
      } catch {}
    };
    return () => { openLightboxFn = null; };
  }, []);

  const close = useCallback(() => setImg(null), []);

  useEffect(() => {
    if (!img) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [img, close]);

  if (!img) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={close}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.94)" }}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Fermer"
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <X className="h-7 w-7" />
      </button>
      <img
        src={img.src}
        alt={img.alt}
        onClick={(e) => e.stopPropagation()}
        className="lightbox-img-enter max-w-[95vw] max-h-[92vh] object-contain shadow-2xl"
      />
    </div>
  );
}

/** Wrap an <img> to make it click-to-zoom. */
export function Zoomable({
  src, alt, className, loading = "lazy", width, height,
}: {
  src: string; alt: string; className?: string;
  loading?: "lazy" | "eager"; width?: number; height?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      onClick={() => openLightbox({ src, alt })}
      className={`cursor-zoom-in ${className ?? ""}`}
    />
  );
}
