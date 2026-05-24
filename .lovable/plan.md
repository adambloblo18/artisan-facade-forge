Plan d'optimisation en 5 étapes. **Go requis avant chaque étape.**

---

## ÉTAPE 1 — `vite.config.ts`

- Ajouter `build.target: 'es2020'`, `build.minify: 'esbuild'`
- Ajouter `rollupOptions.output.manualChunks` :
  - `vendor-react` : react, react-dom
  - `vendor-ui` : @radix-ui/*, lucide-react
  - `vendor-utils` : zod, clsx, tailwind-merge, date-fns…
- Conservé via `defineConfig({ vite: { build: {...} } })` du wrapper `@lovable.dev/vite-tanstack-config` (ne pas casser la config TanStack existante).
- Aucune autre modification.

## ÉTAPE 2 — Lazy loading below-the-fold

Dans `src/routes/index.tsx` :
- `React.lazy()` + `<Suspense>` autour de : marquee galerie, FAQ, MultiStepForm, Lightbox.
- Hero + bandeau preuves restent eager (above-the-fold sur 1284px et mobile).
- Fallback `<Skeleton>` avec hauteur fixe identique à la section (évite CLS).

## ÉTAPE 3 — Images & `index.html` / `__root.tsx`

- Conversion AVIF/WebP qualité 85 hero, 80 autres (script `cwebp` sur `/public/images/*`).
- Dans `__root.tsx` `head().links` : preload `hero-castor.webp` avec `fetchpriority="high"`, preload font woff2 principale, `font-display: swap`.
- Hero `<Zoomable>` : `fetchpriority="high" loading="eager" decoding="async"` + width/height (déjà OK pour ce dernier).
- Autres images : `loading="lazy" decoding="async"`.
- CSS critique above-the-fold inliné dans `<head>` via `head().styles` (extrait des tokens + layout hero).
- Tableau livré : poids avant / après par image.

## ÉTAPE 4 — Quality Score Ads & Schema.org

Dans `src/routes/index.tsx` `head()` :
- Vérifier title / meta description contiennent les KW cibles (enseigne céramique, restaurant, Art Nouveau / Versailles 2024). Signaler sans modifier si écart.
- Ajouter JSON-LD `ProfessionalService` (script application/ld+json) tel que fourni.
- Vérifier H1 (`Une façade qui transforme les passants en clients.`) : ne contient PAS "enseigne" ni "céramique" → je le signalerai, sans le changer.

## ÉTAPE 5 — Frictions conversion (CSS only)

Dans `src/styles.css` :
- `.btn-primary`, `.btn-ghost`, `.btn-gold` : `min-height: 48px`, `padding-inline: 24px`.
- `body` : `font-size: 18px`, `line-height: 1.6` (vérifier non-régression typo).
- Liens `tel:` : `min-height: 48px` sur mobile, déjà partout dans le DOM.
- Contraste boutons : test 7:1 sur tokens existants, alerte si insuffisant.
- `MultiStepForm` : ajouter `autocomplete`, `type="tel"` + `inputmode="tel"` (modif CSS+attributs, pas de logique).
- `public/_headers` : `Cache-Control: public, max-age=31536000, immutable` sur `/assets/*`, `/images/*`, fonts.

---

## Cibles de sortie

- Performance Lighthouse > 80
- LCP < 2,5s, TBT < 300ms
- CTA tactiles ≥ 48px
- Schema validé Rich Results Test

J'attends ton **go pour Étape 1**.
