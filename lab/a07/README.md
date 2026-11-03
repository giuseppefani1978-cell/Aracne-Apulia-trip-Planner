# A07 — Planner V5.1 en laboratoire isolé

Statut : **banc de recette frontend uniquement** (pas un staging collaboratif Supabase).

## Objectif
Répliquer la véritable interface du Trip Planner dans un espace distinct en utilisant la version publiée du Planner `main` (référence au 3 novembre : `7d0930460d871b1e663743c69fe4154d2b95c5ef`). Les quatre pages `index.html`, `index.it.html`, `index.en.html` et `index.es.html` reprennent les mêmes vues, CSS, composants cartographiques et outils de programmation.

## Architecture
- Les modules frontend `app.*.js`, `v2.js`, `v21.js`, `experience.js`, `collaboration-v3.js`, `v5.js`, `beta.js` et leurs feuilles de style proviennent du Planner, sans modification de leur logique touristique ou de navigation. Ils sont chargés depuis `/dist/`.
- `local-bridge.js` **remplace entièrement** `shared-trips.js`. Il fournit une interface locale compatible pour que le reste du frontend fonctionne, mais **n'émet aucune requête** et refuse toute action d'activation, RPC ou partage.
- Le chargement des modules `beta-access.js`, `beta-invitations.js`, `invitations-v51.js`, `shared-hub-v4.js` et de tout client Supabase est interdit.
- `demo-seed.js` prépare un voyage factice Bari / Polignano / Monopoli, quatre personnes fictives, trois jours et une note de test, initialisé uniquement à la première ouverture.
- `local-context.js` restitue le bandeau et les actions Mes voyages, mais refuse de produire de vrais liens d'invitation.
- `lab-chrome.js` affiche en continu un bandeau de sécurité et un bouton de réinitialisation locale.
- CSP des pages : `connect-src 'self' https://api.open-meteo.com`, bloquant les requêtes applicatives vers Supabase ou d'autres backends. Les tuiles OpenStreetMap, Leaflet et polices externes restent consultables.
- Domaine Vercel séparé de la Beta 1 et du laboratoire A06 ; aucun cookie, invitation ou donnée réelle n'est importé.

## Vérifications et limites
`node tests/a07-local-planner.dom.cjs` lance la vraie interface en DOM simulé dans chaque langue et vérifie la présence de la carte, du journal, du carnet, des dépenses, d'un voyage fictif V5, de l'adaptateur local et des restrictions réseau.

Les dépenses, étapes, notes, voyages multiples et exports sont testables **sur cet appareil seulement**, à titre de démonstration. Aucune invitation, synchronisation, sauvegarde serveur, code admin ou permission distante n'est opérante. Aucune donnée privée n'est importée.

**Hors périmètre A07 :** Intelligence Il Volo + catalogue enrichi A06 intégrés aux écrans du Planner (étape A08), optimisation/synthèse des parcours par dialogue, missions Filo Verde, staging Supabase multi-appareil et tests physiques iOS/Android. La présence du logiciel dans GitHub ou d'un statut Vercel READY ne vaut pas validation visuelle sur Safari.

## Publication
Ne pas ajouter de domaine de production. Utiliser un projet Vercel dédié `aracne-lab-a07-planner-preview` ; déployer `lab/a07/deploy-root.html` sous `/index.html`, les quatre pages A07 sous `/lab/a07/` et seulement les fichiers frontend `dist/` sans secret ni module de partage. Ne jamais supprimer/modifier le projet Vercel A06 indépendant.
