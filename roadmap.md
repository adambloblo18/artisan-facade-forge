# Corrections de conformité

- [x] Bloquer les chargeurs d'audience avant consentement explicite et masquer les champs.
- [x] Corriger les textes cookies et rendre les boutons équivalents.
- [x] Retirer les coordonnées de la redirection et ajouter le lien téléphonique.
- [x] Remplacer les affirmations et formulations listées dans la landing et la FAQ.
- [x] Vérifier les corrections et la balise robots inchangée, sans publier.

## Deuxième passe

- [x] Appliquer uniquement les textes, titres de section et données structurées demandés.
- [x] Retirer le stockage publicitaire et des coordonnées ; lire les informations lors de l'envoi.
- [x] Placer les cookies au-dessus des actions sur mobile.
- [x] Vérifier les règles de confidentialité, le formulaire et les textes, sans publier ni changer robots.

## Vitesse mobile

- [x] Alléger la photo de tête et partager srcSet/sizes avec son unique préchargement.
- [x] Vérifier les images différées, précharger uniquement la police principale du H1 et décaler Google Ads après load + 1 s.
- [x] Tester cookies, formulaire simulé, hydratation et requêtes sur l'aperçu local, sans publier.
- [ ] Vérifier le build de production servi localement et les avertissements Circular chunk : aucun artefact de production accessible dans cet environnement.
- [ ] Mesurer Lighthouse publié : deux tentatives interrompues par net::ERR_ABORTED ; objectif LCP < 2,5 s non confirmé.