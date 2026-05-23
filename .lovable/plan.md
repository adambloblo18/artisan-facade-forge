Plan :

1. Vérifier et corriger la balise robots dans `src/routes/__root.tsx` pour supprimer tout risque de `noindex` détecté, en gardant seulement une directive indexable.

2. Corriger l’erreur de syntaxe dans `src/components/MultiStepForm.tsx`, car elle peut empêcher le rendu SSR et faire remonter une ancienne version ou un état incohérent aux outils SEO.

3. Vérifier `public/robots.txt` et le sitemap : ils sont déjà en `Allow: /`, je ne les changerai que si nécessaire.

4. Après correction, relancer une vérification ciblée pour confirmer qu’il ne reste aucun `noindex` dans le code.