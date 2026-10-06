# V5 — candidate de validation

La nouvelle version est documentée dans [docs/V5-RELEASE.md](docs/V5-RELEASE.md).
Elle nécessite le RPC V5 avant publication. Les sections ci-dessous décrivent les versions historiques.

# Aracne-Apulia-trip-Planner

## V2.1 — mobile & guide

- Grid columns can shrink on iPhone; date inputs are constrained to their column.
- Language selector inside every introduction frame, preserving the current frame when switching.
- Separate collapsible Help menu: short intro and guided walkthrough of the five actual tabs.
- Automatic walkthrough with pause, next/previous, minimise and close. Reduced-motion preference respected.
- No demo data written into the trip; unfinished form fields restored when closing the guide.
- Default trip titles translate when switching languages; personal titles remain unchanged.
- DOM interaction tests pass in FR / IT / EN / ES. Native Safari date rendering still needs an iPhone check.
- Shared online storage is unchanged and not activated by this UI release.

## V2 de test — experience-planner

- Introduction animée courte, rejouable, avec pause et prise en compte de la réduction des animations.
- 53 lieux, filtres par activité, 5 établissements spa/thermes et 4 offres bateau nommés.
- Descriptions et sources pour les nouveaux lieux, durées conseillées sur place.
- Durées de visites et de transferts modifiables ; total quotidien, amplitude et conflits horaires.
- Estimations voiture indicatives, sans trafic en direct ; trajets en transports et vers les Tremiti à renseigner.
- FR / IT / EN / ES. Sauvegardes V1 conservées. Les modifications restent sur cet appareil.
- **Pas encore de synchronisation entre téléphones** : voir [la proposition de collaboration](docs/V2-COLLABORATION.md).

Les ajouts V2 résident dans `dist/v2.js`, `dist/v2.css`, `dist/catalog-v2.js` et sont chargés
par les quatre pages générées. `build-locales.py` conserve leur inclusion. Les traductions
V2 sont regroupées par clé dans le module et par lieu dans le catalogue.

Tests : `JSDOM_PATH=/chemin/vers/jsdom node tests/v2.dom.cjs` (ou installer `jsdom`).
Tests visuels/interaction navigateur : `node tests/v2.browser.cjs` avec Playwright,
Chromium installé et le serveur local sur le port 8765.

Les tests DOM passent dans les quatre langues. La vérification visuelle navigateur
reste à réaliser : le téléchargement de Chromium a échoué dans l’environnement de travail.

---

Première maquette fonctionnelle multilingue d’**Aracne · Ensemble dans les Pouilles**.
Application distincte d’Il Volo d’Aracne, inspirée de son identité visuelle et de son concept de voyage personnalisable.

## Inclus dans cette version

- Français, italien, anglais et espagnol ; sélection de la langue conservée sur l’appareil.
- EVJF, EVG, amis, couple et famille.
- Groupe, dates, durée, envies, budget cible et rythme.
- Carte Leaflet : 37 lieux répartis dans six territoires des Pouilles.
- Propositions de programme, étapes modifiables, réorganisation et ajouts manuels.
- Comparaison météo Open-Meteo dans la fenêtre de prévision ; aucun temps futur inventé.
- Carnet personnel, dépenses et répartition des remboursements.
- Partage de tout le programme ou d’une journée via WhatsApp et partage natif.
- Google Maps, Waze et image de story 9:16 à publier manuellement.
- Photographie intégrée, visible sur ordinateur **et sur mobile**.

## Limites importantes

Cette maquette reste **individuelle** : les données sont dans le navigateur, pas dans une base partagée. Le partage envoie une copie, pas un lien collaboratif synchronisé. Les exports JSON restent disponibles comme sauvegarde.

La collaboration sans compte, par liens distincts organisateur / contribution / lecture, est une prochaine étape proposée ; elle n’est pas implémentée.

Les liens Splitwise/Tricount ouvrent le groupe externe sans synchroniser les dépenses. Aucune transaction bancaire, réservation ou publication sociale automatique.

Les lieux sont des idées de destination : horaires, événements, accessibilité, transports, disponibilités et conditions de mer doivent être vérifiés.

## Tester localement

```sh
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000/`. La carte, les polices et la météo nécessitent une connexion Internet.

## Structure et modifications

- `dist/` : application prête à servir, avec ses images et ses quatre langues.
- `src/index.fr.html`, `src/app.fr.js` : sources de référence.
- `src/translations.tsv` : dictionnaire FR / IT / EN / ES.
- `build-locales.py` : génération des pages et scripts traduits, sans dépendances Python tierces.
- `dist/style.css` : styles partagés.
- `dist/language-start.js` : restauration de la langue préférée.
- `index.html` : entrée à la racine, vers `dist/index.html`.

Après modification des sources ou des traductions :

```sh
python3 build-locales.py
node --check dist/app.fr.js
node --check dist/app.it.js
node --check dist/app.en.js
node --check dist/app.es.js
```

Modifier les sources puis régénérer les fichiers de `dist/`, plutôt que modifier séparément chaque langue. Ne pas stocker de notes ou données personnelles réelles dans le dépôt.

## Hébergement

Application statique compatible avec GitHub Pages. Pour l’activer : **Settings → Pages → Deploy from a branch → main → / (root)**. Aucun workflow Actions n’est nécessaire. Le dépôt seul ne signifie pas que Pages est activé.

Changer de domaine crée un espace de stockage local différent : les voyages du prototype ChatGPT ne migrent pas automatiquement vers GitHub Pages. Utiliser export/import pour cette migration initiale si nécessaire.

## Crédits

Photo : **acediscovery**, *Panorama Polignano-a-Mare*, Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Image redimensionnée, comprimée et recadrée à l’affichage.
Source : https://commons.wikimedia.org/wiki/File:Panorama_Polignano-a-Mare.jpg

Cartographie : Leaflet et © OpenStreetMap contributors. Météo : Open-Meteo. Police : Outfit via Google Fonts.

© 2026 Il Volo d’Aracne · HIRUNDU. Aucune licence open source n’est accordée au code original par ce dépôt. Les composants et médias tiers conservent leurs licences respectives.


## V2.2 — shared trips

Supabase collaboration without participant accounts: separate editing/viewing links,
owner-only revocation/deletion, personal notes kept local, revision conflict protection
and offline retry. See [shared-trip setup and limitations](docs/SHARED-TRIPS.md).

## V2.3 — welcome and help

Full-page six-step introduction (four languages), visible Skip, replay from a single
header `?` button, and the existing five-tab walkthrough. Sharing starts with two
choices: collaborate on the same trip or send a text snapshot. Invitation buttons
explain editing vs viewing; administrator tools are folded under management.
Recovery controls appear only when needed. Seven help topics explain access,
private notes, backups, revocation and deletion. Supabase schema is unchanged.

DOM regression: `JSDOM_PATH=/tmp/aracne-shared-tests/node_modules/jsdom node tests/experience.dom.cjs`.
Native mobile rendering still requires an iPhone check; Chromium download failed
in this environment, so no new browser screenshot verification is claimed.

### V2.3.1 — automatic cinematic introduction

Distinct photographic presentation with a labeled demo, six timed scenes (36 seconds),
animated examples, progress bars, pause/resume and immediate entry. Completion opens
the existing trip automatically. Hidden tabs pause progression; reduced-motion mode
removes decorative motion while keeping automatic scene progression. DOM checks cover
automatic completion, pause/resume and early entry in all four languages.
