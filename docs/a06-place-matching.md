# A06.2 — Correspondance Il Volo ↔ Planner et suggestions consultatives

## Situation de départ

- A06.1 : PR #10, branche `feature/a06-intelligence-readonly-2026-11-01`, **non fusionnée** ; elle fournit l'assistant Il Volo 1.1.9, sa base de connaissances et un panneau consultatif.
- Planner : le tableau V1 de lieux est déclaré dans `dist/app.{lang}.js`, les entrées V2 s'ajoutent à la variable locale `places` dans `dist/v2.js`. Les identifiants du Planner sont utilisés par les voyages partagés et les versions locales ; ils ne doivent jamais être remplacés par les IDs historiques d'Il Volo.
- Il Volo : 50 fiches historiques, avec identifiants, noms, certaines coordonnées absentes et une base multilingue de territoire. Le fichier `a06-places.js` est extrait de la version publiée d'Il Volo.
- Aucune nouvelle base Supabase n'a été créée : Lab reste un montage local synthétique.

## Développement

1. `window.A06PlannerCatalog.list()`, exposé par les quatre versions de `app.{lang}.js` et par `src/app.fr.js`, renvoie des **copies minimales** des fiches publiques du catalogue courant : ID, nom, point indicatif, zone, catégories. Aucune donnée de voyage, session, utilisateur ou permission.
2. `dist/a06-matcher.js` recoupe strictement les 50 fiches Il Volo avec les 83 entrées Planner, à partir d'une égalité de nom normalisé et de points proches :
   - Nom complet identique ET distance maximum 5 km = `exact`.
   - Nom abrégé strictement identique avant virgule ou séparateur ` · ` ET distance maximum 4 km = `alias`.
   - Deux candidats de même niveau ou coordonnées absentes = correspondance refusée.
   - **Jamais** de choix au plus proche : une église ne peut pas être transformée en hôtel adjacent ni une grotte en ville.
3. `dist/a06-panel.js` peut présenter les correspondances liées aux lieux identifiés dans la réponse de l'Intelligence ; les autres sont indiquées `non reliées`. Un clic utilisateur explicite sur `Voir sur la carte` ouvre **seulement** la vue Carte du Planner et recherche le nom du lieu existant. Aucun jour ni étape n'est modifié automatiquement.
4. `build-locales.py` et les quatre pages HTML chargent le matcher avant le panneau. La génération reste reproductible.

## Critères de sécurité

- Le code A06.2 ne lit ni n'écrit `state`, `state.plan`, `localStorage`, `sessionStorage`, `Supabase` ou les invitations ; il n'expose pas de méthode `addPlace` ou de mutation.
- Le catalogue est recalculé au clic ; les lieux inconnus, ambiguës ou incohérents ne produisent pas de bouton de navigation.
- Il n'existe **pas encore** de passerelle d'écriture vers la collaboration : les rôles `owner/edit/read`, les révisions optimistes, et la confirmation de l'organisateur devront être validés avant un A06.3 qui crée ou modifie des étapes.
- Les distances vérifient la compatibilité entre repères géographiques éditoriaux : ce ne sont **pas** des distances routières ni une certification d'entrée précise.

## Tests

```sh
npm ci --ignore-scripts
node tests/a06-readonly.cjs
node tests/a06-matcher.cjs
npm test
python3 build-locales.py
```

Le test de correspondance construit le catalogue à partir des deux **vrais fichiers** `dist/app.fr.js` et `dist/catalog-v2.js`, teste les 50 POI, les doublons, les coordonnées absentes, le refus d'une autre adresse proche, l'absence d'écriture d'un voyage factice et la navigation uniquement sur clic explicite.

Une couverture de **7/50** est attendue sur la base actuelle (4 noms exacts, 3 alias nom abrégé). Les autres lieux restent parfaitement consultables via l'Intelligence mais ne pourront pas être proposés à l'ajout tant qu'une entrée Planner légitime et vérifiée n'existe pas.

## Hors périmètre

- Pas de copie du Planner vers Il Volo ou vice-versa, pas d'enrichissement arbitraire des POI.
- Pas d'ajout silencieux aux itinéraires, pas de modification de rôle, pas de création d'une nouvelle table ou base.
- Pas de publication production ; PR en brouillon et recette mobile iPhone/Android nécessaires.
- A06.3 ultérieur : normaliser/dédupliquer les lieux non reliés, faire valider une fiche canonique, puis mettre en place une **prévisualisation** d'itinéraire et une écriture conditionnée à une confirmation explicite et à des permissions vérifiées.
