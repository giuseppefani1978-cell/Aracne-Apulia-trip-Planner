# A06.5 — Lot 3 : patrimoine, espaces naturels et dette de qualité

**Statut : prototype de fusion sur une branche isolée.** Dépend des PR A06.1 à A06.5 (PR #10 à #15). Ce document est une note technique destinée à l'équipe de développement ; ne pas publier sur les sites utilisateurs avant la revue complète.

## Bilan chiffré

- Catalogue Planner : **83** POI, IDs conservés.
- Fiches associées à une affirmation touristique statique documentée : **45/83** (lots précédents 29, nouveau lot **16**).
- Fiches Planner à revoir individuellement : **38/83**, dont **17 offres commerciales** (`spa-*`, `boat-*`) et **21 autres lieux**, en particulier les plages et réserves.
- Fiches historiques d'Il Volo : **50**, dont **43 sans correspondance fiable**, 5 avec statut ancien `legacy-pending` et 15 sans coordonnées.
- Index virtuel actuel : **126 identités**, aucune écriture ni modification des identifiants du Planner.
- **0 coordonnées de lieux validées géodésiquement dans cette phase**. Les pins actuels sont conservés comme indicatifs.
- **6 exceptions de regroupement géographique** notées pour revue et **17 prestations commerciales** explicitement classées « non revérifiées ».

### Nouvelles fiches statiques documentées

| Zone Planner | Identifiant | Lieu | Source |
| --- | --- | --- | --- |
| Gargano / Daunia | `p5` | Lucera | [Italia.it](https://www.italia.it/it/puglia/lucera) |
| Puglia Imperiale | `p10` | Bisceglie | [Italia.it](https://www.italia.it/it/puglia/bisceglie) |
| Puglia Imperiale | `nature-saline-margherita` | Saline di Margherita di Savoia | [Carabinieri Biodiversità](https://rgpbio.it/riserva/salina-di-margherita-di-savoia/) |
| Bari / côte | `p15` | Giovinazzo | [Italia.it](https://www.italia.it/it/puglia/giovinazzo) |
| Bari / côte | `nature-lama-balice` | Parco Lama Balice | [Registre national des parcs](https://www.parks.it/dbparks/Fdettaglio.php?codiceAP=PRBAL) |
| Vallée d'Itria | `nature-dune-costiere` | Parco Dune Costiere | [Commune de Fasano](https://comune.fasano.br.it/area_letturaEntiFond/543/pagsistema.html) |
| Vallée d'Itria | `nature-pianelle` | Bosco delle Pianelle | [Commune de Martina Franca](https://www.comune.martinafranca.ta.it/Vivere-il-comune/Luoghi/Bosco-delle-Pianelle) |
| Murgia / Taranto | `p26` | Castellaneta | [Italia.it](https://www.italia.it/it/puglia/castellaneta) |
| Murgia / Taranto | `nature-oasi-laterza` | Oasi Gravina di Laterza | [LIPU](https://www.lipu.it/oasi-riserve/oasi-gravina-laterza) |
| Salento | `p31` | Porto Cesareo | [Italia.it](https://www.italia.it/it/puglia/porto-cesareo) |
| Salento | `p32` | Nardò | [Italia.it](https://www.italia.it/it/puglia/nardo) |
| Salento | `p33` | Santa Maria di Leuca | [Italia.it](https://www.italia.it/it/puglia/cosa-fare/santa-maria-di-leuca) |
| Salento | `nature-porto-selvaggio` | Parco Porto Selvaggio e Palude del Capitano | [Loi régionale instituant le parc](https://bussolanormativa.consiglio.puglia.it/public/leges/LeggeNavscroll.aspx?id=11542) |
| Salento | `nature-ugento` | Parco Litorale di Ugento | [Ente Parco](https://www.parcolitoralediugento.it/) |
| Salento | `nature-otranto-leuca` | Parco Costa Otranto–Leuca e Bosco di Tricase | [Parks.it](https://www.parks.it/parco.costa.otranto/par.php) |
| Salento | `nature-rauccio` | Bosco e Paludi di Rauccio | [Commune de Lecce](https://www.comune.lecce.it/vivi-lecce/parco-naturale-regionale-bosco-e-paludi-di-rauccio) |

**Portée de la vérification :** faits territoriaux statiques reformulés en FR/IT/EN/ES, provenance explicite. Les sources municipales, les gestionnaires et les registres de parcs sont distingués des opérateurs commerciaux. Une page de contexte régional ne certifie ni l'entrée du parc, ni le tracé d'une randonnée, ni la praticabilité du site.

## Dette de qualité géographique : audit sans changement du Planner

`dist/a06-data-quality.js` expose un relevé de **83 pins hérités** : tous restent `inherited-not-geocoded` ou `missing` ; aucun n'est automatiquement promu comme entrée exacte. Les **15 lieux historiques sans coordonnées** restent explicitement sans point.

Six cas de frontière de macrozone sont signalés sans correction automatique :
1. `p34` Brindisi, classé `salento` dans le Planner ;
2. `p36` Torre Guaceto, classé `salento` ;
3. `nature-cerano`, à proximité de Brindisi, classé `salento` ;
4. `nature-alta-murgia`, parc couvrant un vaste secteur, classé `imperiale` ;
5. `beach-bevagna`, côte de Manduria, classé `murgia` ;
6. `nature-salina-monaci`, Salina dei Monaci, classé `murgia`.

Ces étiquettes sont des **regroupements touristiques**, pas des frontières administratives garanties. Un changement éventuel exige une décision éditoriale puis des tests sur les filtres/itinéraires déjà enregistrés.

## Prestations commerciales — file d'attente distincte

**17 fiches** `spa-*` et `boat-*` sont conservées, mais non promues comme offres actives : tarifs, jours d'ouverture, licence, réservations, URL ou disponibilité sont à revérifier directement auprès de chaque établissement. Cette classification ne signifie pas que les services sont fermés : leur **statut actuel n'a pas été contrôlé**.

Le référentiel contient aussi des villages et plages associés à des activités saisonnières ; ne pas les assimiler automatiquement à un opérateur commercial.

## Tests et garanties

- `tests/a06-source-audit.cjs` : **45 fiches**, 16 nouvelles sources directes, six zones, textes FR/IT/EN/ES, 126 identités uniques, sept relations « keep separate », 83 points non certifiés, six avertissements macrozones, 17 opérateurs en attente et absence d'écriture.
- `tests/a06-legacy-inventory.cjs` : 50 fiches héritées et 15 points manquants, sans géocodage inventé.
- `npm test` couvre les règles d'édition/synchronisation existantes et la confirmation individuelle A06.3.
- `python3 build-locales.py` doit préserver les inclusions dans les quatre langues.

**Aucun déploiement, aucune migration Supabase, aucune modification d'Hirundu, de l'accueil, du Planner public, des invitations ou des voyages.** Avant exposition réelle : recette sur Lab isolé, vérification unitaire des sources restantes et des coordonnées exactes, puis tests Safari iPhone/Chrome Android.
