# A06.4 — Extension Aracne Intelligence à l’ensemble des Pouilles

**Statut : développement en branche isolée**, dépendant de A06.1 (PR #10), A06.2 (PR #11), A06.3 (PR #12). Aucun déploiement sur les domaines publics, aucune mutation des voyages Supabase.

## Point de départ et provenance

Le Planner contient **83 lieux** répartis dans 6 zones, dont 37 issus du tableau V1 dans `app.fr.js` et 46 lieux V2 sourcés dans `catalog-v2.js`. Il Volo historique fournit **50 fiches** avec connaissances territoriales (19 territoires, 48 sources héritées). Le moteur Il Volo v1.1.9 reste le composant d’analyse, avec un adaptateur de sécurité et de diffusion.

**7 équivalences prudentes** ont été identifiées entre les catalogues (4 noms complets et 3 noms abrégés, avec contrôle spatial). Les 43 fiches Il Volo non appariées restent indépendantes. A06.4 expose ainsi un **index virtuel de 126 fiches distinctes** : 83 fiches Planner et 43 fiches héritées non appariées. Ce chiffre ne représente pas 126 destinations ayant fait l’objet d’une vérification éditoriale complète. **Aucune fiche héritée n’a été injectée dans les sauvegardes Planner.**

## Couverture et fichiers

| Zone | Lieux du Planner |
| --- | ---: |
| Gargano & Daunia | 11 |
| Puglia Imperiale | 7 |
| Bari & côte | 10 |
| Vallée d’Itria | 13 |
| Murgia, gravines & Taranto | 10 |
| Salento | 32 |
| **Total** | **83** |

- `dist/a06-puglia-data.js` : données Planner V1/V2 (IDs d’origine et zones préservés), résumés locaux FR/IT/EN/ES pour les six territoires, et provenance par fiche. Les résumés V1 non traduits ne sont PAS automatiquement traduits/inventés dans les autres langues.
- `dist/a06-puglia-knowledge.js` : recherche statique par région, nom de lieu, thème, question « autour de », et nombre de jours mentionné (1–14). Réponses explicites, structurées et régionales, sans serveur LLM ni prétention de recherche Internet en temps réel.
- `dist/a06-adapter.js` : questions régionales aiguillées vers la nouvelle base ; questions précises concernant une fiche Il Volo toujours traitées par le moteur historique avec ses fiches profondes. Références obsolètes à Hirundu retirées du texte visible en fallback, sans donner au moteur de droits d’écriture.
- `dist/a06-proposals.js` : suggestions consultatives d’étapes du catalogue Planner jusqu’à quatre arrêts, y compris en dehors du Salento ; chaque ajout est revérifié et confirmé individuellement par le Planner comme en A06.3. Distance à vol d’oiseau utilisée pour filtrer, pas pour annoncer une route routière.
- `dist/a06-panel.js` : exemples de questions représentatifs des six territoires, liens « Voir sur la carte » pour les IDs Planner.
- `build-locales.py` et quatre pages `dist/index*.html` : chargement ordonné des deux nouveaux modules, puis des suggestions et du panneau.

## Qualité des sources — NE PAS CONFONDRE provenance et vérification

| Classe | Fiches | Interprétation |
| --- | ---: | --- |
| `official-regional-context` | 20 | Sources officielles italiennes fournissant le **contexte de la région ou d’un groupe de lieux**. Ne garantit pas l’exactitude complète de chaque POI. |
| `catalogue-source-unreverified` | 46 | Lien présent dans le catalogue V2 antérieur, **pas revérifié dans cette étape**. Peut concerner des opérateurs commerciaux et des offres susceptibles de changer. |
| `editorial-unverified` | 17 | Descriptions courtes du catalogue V1, sans source spécifique confirmée. |
| Il Volo historique (hors appariement) | 43 | Fiches héritées, statut de vérification et références indépendantes à conserver. |

Références officielles générales : [Italia.it — Puglia](https://www.italia.it/en/puglia), [Bari](https://www.italia.it/en/puglia/bari), [Barletta-Andria-Trani](https://www.italia.it/en/puglia/barletta-andria-trani), [Lecce](https://www.italia.it/en/puglia/lecce), [guide régional](https://www.italia.it/en/puglia/guide-history-facts).

Les heures, tarifs, accessibilité saisonnière, météo, disponibilité de bateau/thermes et réservations sont **volatils** : ne jamais les présenter comme confirmés par cette base statique. Les liens officiels parfois régionaux ne sont pas des fiches de preuve pour chaque opérateur privé.

## Tests et conditions de déploiement

```bash
npm ci --ignore-scripts
npm test
node tests/a06-puglia.cjs
python3 build-locales.py
```

Le nouveau test vérifie les 6 zones, les 4 langues, les 126 identités distinctes sans collisions avec les vrais fichiers Planner, le routage des questions, les sources HTTPS, les suggestions régionales et historiques, et l’absence d’écriture automatique. La suite existante couvre toujours les permissions et les révisions A06.3.

**À ne pas faire :** fusionner cette PR seule, publier sur `main`, migrer Supabase, modifier les invitations ou les données existantes. Une recette indépendante sur Safari iPhone et Chrome Android reste obligatoire avant toute activation publique.

## Suite recommandée (A06.5)

1. Vérifier individuellement chaque fiche, ses coordonnées, les sources, la qualité de traduction et les éventuels doubles quasi identiques, avant d’étendre le catalogue physique au-delà de 83.
2. Séparer les données patrimoniales durables des prestations commerciales et données volatiles, puis structurer les intentions pratiques « que faire ce soir ? » sans inventer les horaires.
3. Affiner les durées de séjour et les déplacements (aucune estimation routière sans moteur de calcul réel) ; distinguer itinéraire indicatif et parcours faisable.
4. Revoir les références fonctionnelles internes encore héritées du moteur Il Volo/Hirundu avant release finale ; la nouvelle couche restreinte ne donne pas d’accès à ces outils historiques.
