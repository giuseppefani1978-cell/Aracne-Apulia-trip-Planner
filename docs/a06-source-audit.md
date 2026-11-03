# A06.5 — Première revue documentaire des points d’intérêt des Pouilles

**Statut : premier lot de développement sur branche isolée, 2 novembre 2026. Non publié.** Dépend des PR #10 à #13.

## Travail réalisé

La base virtuelle A06.4 conserve **126 identités distinctes** (83 lieux existants du Planner + 43 fiches historiques d’Il Volo sans correspondance sûre). A06.5 ne crée ni fusion ni nouveau lieu : cette phase enrichit la **qualité documentaire** de fiches déjà présentes.

- `dist/a06-poi-reviews.js` : **14 premières fiches**, réparties sur les 6 zones du Planner, chacune liée à une source propre (UNESCO, Italia.it, administration de parc, Région Pouilles, WWF ou gestionnaire de réserve). Pour chaque fiche : ID Planner stable, source, date de consultation, affirmation **statique** en FR/IT/EN/ES et limites de validation.
- `dist/a06-duplicate-audit.js` : **7 relations de proximité ou de nom**, toutes explicitement `keep-separate`. Une ville et une plage, ou une station thermale et sa commune, ne sont **pas** des doublons même lorsque leurs noms se ressemblent.
- `dist/a06-puglia-knowledge.js` : les 14 affirmations révisées sont prioritaires dans la réponse locale, avec liens directs et niveau `poi-static-checked`. Les autres descriptions continuent à afficher leur degré de provenance (« contexte régional » ou « source du catalogue à revérifier »).
- `dist/a06-panel.js` : distinction visible entre source de fiche révisée, source officielle de **contexte régional uniquement** et source non revérifiée.
- Quatre pages `dist/index*.html` et `build-locales.py` : chargement des audits avant le moteur de recherche.
- `tests/a06-source-audit.cjs` : 14 IDs existants, couverture des six zones et quatre langues, sources HTTPS, 7 décisions `keep-separate`, absence de fusion des 126 identités, aucune écriture ni appel réseau.

## Sélection des 14 fiches de ce premier lot

| Zone | Identifiants Planner | Lieux |
| --- | --- | --- |
| Gargano / Daunia | `p0`, `p2` | Vieste ; Foresta Umbra (seules certaines composantes UNESCO) |
| Puglia Imperiale | `p7`, `p9`, `nature-alta-murgia` | Trani ; Castel del Monte ; Parco Nazionale dell’Alta Murgia |
| Bari / côte | `p11`, `p12`, `beach-lama` | Bari Vecchia ; Polignano a Mare ; Lama Monachile |
| Vallée d’Itria | `p16` | Alberobello et ses trulli |
| Murgia / Taranto | `p22`, `p25` | Altamura ; Taranto et le MArTA |
| Salento (zone Planner) | `p27`, `nature-cesine`, `p36` | Lecce ; Oasi WWF Le Cesine ; Torre Guaceto |

L’affectation de la zone `salento` pour Torre Guaceto provient du **catalogue Planner antérieur**. Il faudra la traiter explicitement lors de la révision taxonomique ; ne pas supposer qu’elle désigne une délimitation géographique administrative exacte. L'affectation de l'Alta Murgia à `imperiale` est également héritée du Planner et ne traduit pas les limites physiques du parc.

## Sources consultées et ce qu’elles prouvent

- UNESCO, [Castel del Monte](https://whc.unesco.org/en/list/398/) : l’édifice médiéval de Frédéric II.
- UNESCO, [Trulli of Alberobello](https://whc.unesco.org/en/list/787/) : les trulli et leur construction en pierre sèche.
- UNESCO, [Ancient and Primeval Beech Forests — geographical data](https://whc.unesco.org/en/list/1133/maps/) : seules les composantes Falascone et Pavari-Sfilzi de la Foresta Umbra sont nommées dans l’inscription.
- Italia.it : [Vieste](https://www.italia.it/en/puglia/vieste), [Trani](https://www.italia.it/en/puglia/trani), [Bari Vecchia](https://www.italia.it/en/puglia/bari/bari-vecchia), [Polignano a Mare](https://www.italia.it/en/puglia/bari/polignano), [Altamura](https://www.italia.it/en/puglia/altamura), [Taranto](https://www.italia.it/en/puglia/taranto) et [Lecce](https://www.italia.it/en/puglia/lecce/guide-history-facts).
- Parco dell'Alta Murgia, [fiche géographique](https://www.parcoaltamurgia.it/lalta-murgia) : écosystèmes, communes et périmètre général du parc.
- Région Pouilles, [Lama Monachile / Cala Porto](https://www.viaggiareinpuglia.it/fr/dettaglio-attrattore/lama-monachile-cala-porto) : plage de galets dans Polignano a Mare. Les **horaires 2023 affichés sur cette page ne constituent PAS des horaires actuels**.
- WWF Italia, [Le Cesine](https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/le-cesine/) : caractéristiques de l'oasis, nécessité d'un accompagnement et de réserver (modalités à recontrôler avant la visite).
- Consorzio di Gestione Torre Guaceto, [réserve littorale et marine](https://www.riservaditorreguaceto.it/index.php/it/che-cosa-e-aspim/2-riserva) : milieux protégés et statut de réserve.

**« Fiche statique vérifiée » ne veut pas dire « site opérationnel / horaires / tarifs / météo / itinéraire vérifiés ».** Les sources de catalogue restantes ne deviennent pas fiables par héritage ou voisinage. Les descriptions révisées ne sont pas copiées intégralement des sources.

## Les sept cas traités en « non-doublon »

- `p12` Polignano a Mare **≠** `beach-lama` Lama Monachile : commune et plage.
- `p21` Torre Canne **≠** `spa-torre-canne` : localité et établissement thermal.
- `p35` Santa Cesarea Terme **≠** `spa-cesarea` : commune et prestation thermale.
- `p0` Vieste **≠** `boat-vieste` : ville et opérateur de bateau.
- `p27` Lecce **≠** `spa-risorgimento` : ville et spa commercial.
- `p31` Porto Cesareo **≠** `beach-torre-lapillo` : commune et plage voisine.
- `p7` Trani **≠** `nature-alta-murgia` : ville et vaste parc.

Aucune suppression, renumérotation, consolidation ni changement des 7 correspondances Il Volo/Planner déjà contrôlées.

## Limitations et prochaine phase

Ce lot traite 14 lieux sur **83 Planner / 126 référencés** ; une vérification systématique de tous les lieux et de **leurs coordonnées** reste à faire. Les 7 cas ne sont qu'une liste initiale de relations suspectes, pas un dédoublonnage exhaustif. Les catégories du Planner et l'affectation territoriale héritée demandent une revue. Les opérateurs de bateau, spas et hôtels présentent des risques élevés de liens ou conditions périmées ; leurs offres ne sont **pas validées** dans ce lot.

Avant toute publication : compléter les autres fiches, vérifier les coordonnées avec sources cartographiques de confiance, auditer les doublons quasi identiques à grande échelle, puis tester sur **Aracne Lab hébergé séparément**, Safari iPhone et Chrome Android. Le Lab isolé avec base Supabase de test n’est pas encore provisionné.

## Exécution CI

```sh
npm ci --ignore-scripts
node tests/a06-source-audit.cjs
npm test
python3 build-locales.py
```

**Aucune écriture Supabase, aucun voyage testeur touché, aucune modification d’Hirundu ou de production.**
