// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      target: "es2020",
      minify: "esbuild",
      cssMinify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("cmdk") || id.includes("vaul") || id.includes("sonner")) {
              return "vendor-ui";
            }
            if (id.includes("zod") || id.includes("clsx") || id.includes("tailwind-merge") || id.includes("class-variance-authority") || id.includes("date-fns")) {
              return "vendor-utils";
            }
          },
        },
      },
    },
  },
});
