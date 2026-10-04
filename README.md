# Aracne-Apulia-trip-Planner

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
