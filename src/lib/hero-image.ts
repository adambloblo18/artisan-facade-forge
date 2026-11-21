import hero640 from "@/assets/hero-castor-640.webp.asset.json";
import hero960 from "@/assets/hero-castor-960.webp.asset.json";

export const heroSrcSet = `${hero640.url} 640w, ${hero960.url} 960w, /images/hero-castor.webp 1280w`;
export const heroSizes = "(min-width: 1280px) 580px, (min-width: 1024px) calc((100vw - 120px) / 2), (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)";