# A06.5 — Lot 4 : 21 lieux littoraux/naturels et 17 prestataires

**Statut : branche de développement, 2 novembre 2026.** Contenu non destiné à la publication automatique sur les applications publiques. Ce lot prolonge les PR A06.1–A06.5 (#10–#16).

## Couverture du Planner — 83/83 dossiers examinés (niveau hétérogène)

| Groupe | Nombre | Type de vérification |
| --- | ---: | --- |
| Faits géographiques et patrimoniaux des lots 1–3 | 45 | Description stable FR/IT/EN/ES, lien documentaire identifié |
| Plages, localités et espaces naturels du lot 4 | 21 | Description géographique en quatre langues, lien de contexte/site, qualité de source classée |
| Prestataires thermaux, spas et sorties en bateau du lot 4 | 17 | Page de l'opérateur ou du réseau hôtelier identifiée, **aucune disponibilité ni réservation confirmée** |
| **Total** | **83** | **Toutes les fiches classées**, qualité et actualité non homogènes |

L'index fusionné demeure **126 identités distinctes** (83 lieux Planner et 43 fiches Il Volo conservées séparément). Les 50 fiches Il Volo ont été inventoriées ; 5 restent héritées « à revoir » et 15 sans coordonnées ; le fait de les avoir recensées ne constitue pas une revue indépendante de leur contenu.

## 21 lieux littoraux et naturels

Les 21 éléments nouveaux sont stockés dans `dist/a06-poi-reviews.js`, cumul désormais **66 dossiers géographiques/patrimoniaux**. Chaque fiche a une description courte en FR/IT/EN/ES, les tags de zone préexistants, une URL de source et un **périmètre documentaire** :
- `site-or-area` : source portant directement sur le site ou sur la zone naturelle.
- `regional-or-municipal-context` : page de présentation de la région, de la côte ou de la commune seulement. **Ne pas déduire qu'elle prouve les détails d'un point précis.**

Sélection de sources de référence : [Région Pouilles — Pescoluse](https://interregaismart.regione.puglia.it/en/-/pescoluse-spiagge-1), [Région Pouilles — San Pietro in Bevagna](https://interregaismart.regione.puglia.it/web/guest/-/spiaggia-di-san-pietro-in-bevagna-spiagge-1), [Torre dell'Orso](https://viaggiareinpuglia.it/it/dettaglio-attrattore/torre-orso-2768), [Parks.it — Stornara](https://www.parks.it/riserva.statale.stornara/) et [Bosco di Cerano](https://www.parks.it/riserva.bosco.cerano/par.php).

Les accès aux baies (parfois privés ou saisonniers), les conditions de baignade, la baignabilité, les tarifs de parkings, les points de départ des sentiers et le temps de route sont **hors vérification**. Les descriptions ne doivent jamais être assimilées à un diagnostic de sécurité sur place.

## 17 opérateurs commerciaux : séparation obligatoire des preuves

`dist/a06-commercial-audit.js` référence les **17 fiches de spas/établissements thermaux et prestataires de bateau** de `dist/catalog-v2.js`. Le statut `operator-website-content-observed` signifie **seulement** qu'une page de l'opérateur ou de la chaîne hôtelière décrit publiquement son activité, et non qu'un créneau est libre, qu'un tarif est garanti ou qu'une licence a été vérifiée.

Exemples vérifiés par consultation des pages publiques :
- [Terme Margherita di Savoia](https://termemargherita.it/) : traitements/établissement présentés ; les horaires affichés ne remplacent pas une confirmation.
- [Terme di Torre Canne](https://www.termeditorrecanne.it/) : la page annonce au 2 novembre 2026 une **fermeture saisonnière avec retour prévu au printemps 2027**. Ne pas présenter comme ouvert.
- [Vair SPA](https://vairspa.com/), [Masseria Torre Coccaro](https://masseriatorrecoccaro.com/en/spa), [Canne Bianche](https://www.cannebianche.com/it/spa-e-wellness/), [Borgobianco](https://borgobianco.it/servizi/), [Relais Histò](https://www.relaishisto.it/centro-benessere-e-spa-taranto), [Borgo de li Santi](https://borgodelisanti.it/spa-wellness) : pages d'équipements et de services, pas de stock de réservation.
- [Basiliani / CDSHotels](https://cdshotels.it/fr/basiliani/), [Pietrablu](https://cdshotels.it/en/pietrablu-resort-spa/), [Risorgimento Resort / Best Western](https://www.bestwestern.com/fr-fr/book/hotel/lecce/risorgimento-resort/86158), [Acaya Golf Resort](https://www.acayagolfresort.com/en) : établissements et équipements présentés, accès SPA/horaires saisonniers à confirmer.
- Bateaux : [Dorino Polignano](https://dorinogiteinbarca.com/), [Vieste Sea Adventure](https://viesteseadventure.it/en/tours/), [Nautica Livio Licci](https://www.nauticaliviolicci.it/) et [Alexander Leuca](https://www.alexanderleuca.com/servizi). Conditions météo, capacité, autorisations, prix et dates de départ **non certifiés**.
- [Terme di Santa Cesarea](https://termesantacesarea.it/) : calendrier 2026 publié, sans requête temps réel sur les places.

Les anciens liens du catalogue sont conservés. Les références actualisées figurent dans une **couche de provenance distincte**, sans modifier les POI et les voyages.

## Contrats de sécurité du moteur

- `A06POIReviews` : 66 descriptions documentées (45 précédentes + 21 nouvelles), avec mention visible de la différence **source directe** / **source de contexte**.
- `A06CommercialAudit` : 17 pages identifiées, 1 avertissement de fermeture saisonnière daté, **0 réservation/stock/prix/horaire actuel certifié**.
- `A06DataQuality` : 83 pins existants toujours `inherited-not-geocoded`, 0 entrée vérifiée indépendamment, 6 regroupements de macrozone à revoir, 15 pins Il Volo manquants et état des 17 prestataires.
- `A06PugliaKnowledge` : un lien commercial est clairement libellé « site du prestataire, disponibilité non vérifiée » ; les contenus des 17 opérateurs sont descriptifs, pas prescriptifs.
- `A06RouteProposals` : **exclut les 17 opérateurs commerciaux** des propositions d'itinéraires tant qu'aucune disponibilité et permission commerciale ne sont vérifiées. L'ajout via le dialogue natif des lieux géographiques reste soumis à la double confirmation et au contrôle des rôles.
- **Pas d'écriture de voyage, migration Supabase, accès à un inventaire commercial ou envoi d'informations utilisateur**.

## Tests et suite vers Aracne Lab

```bash
npm ci --ignore-scripts
npm test
node tests/a06-commercial-audit.cjs
python3 build-locales.py
```

Tests requis sur les quatre langues : 66 descriptions, 21 nouvelles sources typées, 17 opérateurs, fermeture saisonnière, absence de prix/horaires/places certifiés, exclusion des opérateurs des suggestions automatiques, conservation des données utilisateur et de l'index virtuel à 126 identités.

**Étape suivante :** consolider les PR #10 à #17 en un point de contrôle unique sur la branche pilote, puis effectuer la recette mobile dans un **Lab à données entièrement fictives**, sans réutiliser le Supabase des testeurs. Un environnement complet de staging isolé n'existe pas encore ; il ne doit pas être confondu avec le simple portail Vercel publié.
