import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ImgRef = { src: string; alt: string };

let openLightboxFn: ((img: ImgRef, gallery?: ImgRef[]) => void) | null = null;

export function openLightbox(img: ImgRef, gallery?: ImgRef[]) {
  openLightboxFn?.(img, gallery);
}

export default function Lightbox() {
  const [index, setIndex] = useState<number>(-1);
  const [images, setImages] = useState<ImgRef[]>([]);

  useEffect(() => {
    openLightboxFn = (i, gallery) => {
      const list = gallery && gallery.length > 0 ? gallery : [i];
      const idx = list.findIndex((img) => img.src === i.src && img.alt === i.alt);
      setImages(list);
      setIndex(idx >= 0 ? idx : 0);
      try {
        (window as any).posthog?.capture?.("image_zoom", { image_alt: i.alt, image_src: i.src });
      } catch {}
    };
    return () => { openLightboxFn = null; };
  }, []);

  const close = useCallback(() => { setIndex(-1); setImages([]); }, []);
  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(images.length - 1, i + 1)), [images.length]);

  useEffect(() => {
    if (index < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, goPrev, goNext]);

  useEffect(() => {
    if (index >= 0 && images[index]) {
      try {
        (window as any).posthog?.capture?.("image_zoom", { image_alt: images[index].alt, image_src: images[index].src });
      } catch {}
    }
  }, [index, images]);

  if (index < 0 || !images[index]) return null;
  const img = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

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
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
      >
        <X className="h-7 w-7" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Image précédente"
            disabled={!hasPrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Image suivante"
            disabled={!hasNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
            {index + 1} / {images.length}
          </div>
        </>
      )}

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
  src, alt, className, loading = "lazy", width, height, fetchPriority, images,
}: {
  src: string; alt: string; className?: string;
  loading?: "lazy" | "eager"; width?: number; height?: number;
  fetchPriority?: "high" | "low" | "auto";
  images?: ImgRef[];
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      fetchPriority={fetchPriority}
      decoding="async"
      onClick={() => openLightbox({ src, alt }, images)}
      className={`cursor-zoom-in ${className ?? ""}`}
    />
  );
}
