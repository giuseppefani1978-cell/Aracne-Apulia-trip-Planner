# A08 — Aracne Intelligence intégrée à la carte du vrai Planner

Environnement distinct d'A07 et des productions Il Volo / Planner / Hirundu.

## Périmètre
- Reprend les écrans du Trip Planner V5.1 depuis A07, quatre langues et voyage fictif.
- Réutilise les seize modules de connaissances et moteur A06, dont Il Volo 1.1.9, catalogue territorial enrichi, dialogue A06.6, voix A06.8 et logique d'itinéraires A06.3.
- `map-bridge.js` **réutilise la seule carte Leaflet existante** du Planner (aucun nouveau `L.map`), ajoute un groupe de marqueurs de prévisualisation et, si pertinent, des segments à vol d'oiseau clairement signalés comme non routiers. Il n'interfère pas avec les jours enregistrés.
- `intelligence-panel.js` conserve le panneau de conversation A06 mais envoie les actions « voir sur la carte » vers `A08MapBridge`.
- L'ajout à un jour se fait exclusivement via le formulaire natif `choosePlace` du Planner, après correspondance stricte du lieu et réévaluation de l'état du voyage. Aucun ajout automatique.
- Les fiches sans équivalent dans le catalogue natif ne sont pas ajoutables : elles restent visibles et informatives.
- Aucun module Supabase/invitation/bêta n'est embarqué ; aucun passage vers la production. Date, tarifs, réservations et durées ne sont pas garantis. Test audio physique Safari toujours requis.

## Recette et validation
Le test DOM doit couvrir le chargement des trois blocs Planner/Intelligence/Map, les aperçus de lieux et parcours, l'ouverture du formulaire natif, le refus en cas de projet modifié, et les quatre langues. Les tests CI n'assurent pas une recette graphique iPhone/Android.

## Déploiement
Projet Vercel distinct A08. A07 et A06 restent inchangés. Aucun merge vers `main` ou `develop` avant validation.
