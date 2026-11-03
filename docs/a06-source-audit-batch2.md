# A06.5 — Lot 2 : revue de 15 POI Planner et inventaire des 50 POI Il Volo

**Branche de travail uniquement, 2 novembre 2026.** Dépend du premier lot A06.5 (PR #14) et des PR A06.1–A06.4. Ne pas fusionner vers `main` ni publier sur les domaines des testeurs.

## Résultat cumulé

- **Planner : 29 / 83 fiches** disposent maintenant d'une affirmation touristique statique, de traductions FR/IT/EN/ES et d'un lien documentaire spécifique. Lot précédent : 14 ; ce lot : **15**.
- **Planner : 54 / 83 lieux** restent à examiner individuellement (dont la plupart des opérateurs commerciaux V2 : hôtels, spas et sorties bateau).
- **Il Volo : 50 / 50 fiches inventoriées** sans mutation : **45 marquées `verified` dans la base héritée**, **5 marquées `legacy-pending`**, **15 dépourvues de coordonnées**. Ce recensement ne signifie **pas** que les 45 ont été revérifiées ici.
- La base virtuelle garde **126 identités distinctes** (83 Planner + 43 Il Volo non fusionnées). Aucun identifiant POI existant n'a été supprimé ou renommé.

### Les 15 nouvelles fiches et preuves

| Zone Planner | ID | Lieu | Source de référence |
| --- | --- | --- | --- |
| Gargano | `p1` | Peschici | [Italia.it — Peschici](https://www.italia.it/it/puglia/peschici) |
| Gargano | `p3` | Monte Sant’Angelo | [UNESCO — site lombard de San Michele](https://whc.unesco.org/en/list/1318/maps/) : seul **le sanctuaire** fait partie de cette inscription, pas toute la ville |
| Gargano | `p4` | Bovino | [Italia.it — Bovino](https://www.italia.it/it/puglia/bovino) |
| Gargano | `p6` | Îles Tremiti | [Italia.it — Isole Tremiti](https://www.italia.it/it/puglia/cosa-fare/isole-tremiti-in-inverno-cosa-vedere) |
| Puglia Imperiale | `p8` | Barletta | [Italia.it — Barletta](https://www.italia.it/it/puglia/barletta) |
| Bari & côte | `p13` | Monopoli | [Italia.it — Monopoli](https://www.italia.it/it/puglia/monopoli) |
| Vallée d’Itria | `p17` | Locorotondo | [Italia.it — Locorotondo](https://www.italia.it/it/puglia/bari/locorotondo) |
| Vallée d’Itria | `p18` | Martina Franca | [Italia.it — Martina Franca](https://www.italia.it/it/puglia/martina-franca) |
| Vallée d’Itria | `p19` | Cisternino | [Italia.it — Cisternino](https://www.italia.it/it/puglia/cisternino) |
| Vallée d’Itria | `p20` | Ostuni | [Italia.it — Ostuni](https://www.italia.it/it/puglia/brindisi/ostuni) |
| Murgia & Taranto | `p23` | Gravina in Puglia | [Italia.it — Gravina](https://www.italia.it/it/puglia/bari/gravina-di-puglia) |
| Murgia & Taranto | `p24` | Laterza | [Italia.it — Ginosa, Laterza, Mottola](https://www.italia.it/it/puglia/cosa-fare/ginosa-laterza-mottola-cosa-vedere-fare) |
| Salento | `p28` | Gallipoli | [Italia.it — Gallipoli](https://www.italia.it/it/puglia/lecce/gallipoli) |
| Salento | `p30` | Otranto | [Italia.it — Otranto / mosaïque de la cathédrale](https://www.italia.it/it/puglia/otranto/torre-dell-orologio-di-otranto) |
| Salento (catégorie existante Planner) | `p34` | Brindisi | [Italia.it — Brindisi](https://www.italia.it/it/puglia/brindisi) |

Sources utilisées pour des **faits patrimoniaux stables uniquement**. Les horaires, prix, conditions d'accès, coordonnées des pins et réservations ne sont **pas certifiés**. Le label `static-claim-reviewed` n'est pas un contrôle opérationnel de l'établissement et n'a aucune valeur de garantie.

### Lieux Il Volo en attente de vérification d'identité

| ID hérité | Désignation héritée | Coordonnées héritées |
| --- | --- | --- |
| `lecce` | Basilica di S.M. Annunziata, Lecce | Présentes, non revérifiées |
| `scarra` | Bosco della Scarra | Absentes |
| `enea` | Porto Enea | Absentes |
| `ripe` | Torre di Ripe | Absentes |
| `giurupi` | Palazzo Giurupi | Absentes |

L'inventaire technique compte **15 fiches sans coordonnées** au total, dont les quatre `legacy-pending` indiquées ci-dessus. Il serait dangereux de leur attribuer automatiquement les coordonnées d'une ville homonyme, d'une autre tour ou d'une plage voisine. Le statut `verified` des 45 autres reste un **statut historique Il Volo**, qui doit être réexaminé séparément.

### Modifications techniques

- `dist/a06-poi-reviews.js` : 14 + 15 = **29 fiches** de faits fixes et sources spécialisées, sans remaniement des objets Planner.
- `dist/a06-legacy-audit.js` : inventaire statique non destructif de **50 enregistrements** hérités, avec statut/source/présence de coordonnées conservés à l’identique et `fusionVerified:false`.
- `dist/a06-puglia-knowledge.js` : le résumé de provenance expose les 5 fiches en attente, les 15 coordonnées manquantes et le total documentaire 29 ; l'index 126 noms ne change pas.
- `build-locales.py` et les quatre HTML `dist/index*.html` : chargement du recensement avant le module d’intelligence régionale.
- `tests/a06-source-audit.cjs` : vérification des **29 fiches**, y compris les nouvelles, en quatre langues avec liens source explicites.
- `tests/a06-legacy-inventory.cjs` : comparateur en lecture seule contre les **véritables enregistrements Il Volo** gelés ; nombre de fiches, noms, statuts, présence/absence de coordonnées, sources héritées, absence de fusion.
- `package.json` : les tests s'ajoutent à `npm test`.

### Phase suivante avant déploiement

1. Examiner les **54 fiches Planner restantes** : priorité aux sites naturels stables, puis aux prestations commerciales dont les conditions peuvent changer. Distinguer vérification de l’existence de l’établissement et vérification de son offre du jour.
2. Contrôler la justesse des **83 pins Planner et 50 pins hérités**, en distinguant centroïdes de territoire, entrées réelles, lieux sans emplacement ouvert au public et opérations saisonnières. Les 15 pins absents restent nuls tant qu'aucune preuve fiable ne permet de les fixer.
3. Identifier précisément les cinq noms historiques `legacy-pending` et valider les autres fiches héritées **une par une** ; ne pas promouvoir un statut historique `verified` en vérification indépendante.
4. Revoir la taxonomie : Brindisi et Torre Guaceto sont dans le regroupement `salento` hérité du Planner ; cela ne doit pas être interprété comme une délimitation géographique administrative.
5. Validation finale dans un Lab **réellement isolé**, puis recette Safari iPhone et Chrome Android avec les invitations et les droits de lecture/édition avant diffusion.

**Aucune mutation de Supabase, Hirundu, des voyages ou des sites publics.**
