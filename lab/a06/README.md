# Aracne Lab A06 — Prévisualisation fonctionnelle à données synthétiques

**Statut : validation UI sur appareil réel. Ce n'est PAS un staging Supabase collaboratif.** Dépend des PR #10 à #17 ; aucune des branches de fusion n'a été publiée sur le Planner ni Hirundu.

## Périmètre technique

Entrée : `lab/a06/index.html`. Charge uniquement les modules autonomes A06 présents dans `dist/` (connaissances, POI, moteur Il Volo 1.1.9, appariement, revues, listes de qualité, propositions, panneau). Aucun `app.fr.js`, `shared-trips.js`, `v5.js`, authentification, client Supabase, PWA/service worker, clés ni environnement réels.

Les 83 lieux proviennent de `dist/a06-puglia-data.js` ; 43 fiches Il Volo supplémentaires n'ont pas été liées à une entrée Planner ; total virtuel **126 identités**. L'interface expose le moteur Aracne Intelligence pour six zones, ainsi que le catalogue filtrable. **Aucune vraie carte Leaflet, aucun géocodage ni calcul routier** ; les marqueurs sont éditoriaux.

Les rôles Organisateur / Éditeur / Lecteur sont des **simulations en mémoire**. Dans un parcours fictif, un utilisateur autorisé :
1. demande une proposition avec un lieu dans la question, puis sélectionne `Préparer l'ajout` ;
2. choisit le jour dans le modal synthétique et clique `Confirmer cet ajout fictif`.

Le rôle Lecteur ne peut pas ouvrir ce modal. Le changement de rôle ou de voyage invalide les snapshots, sans authentifier réellement des utilisateurs. **Le Planner réel assure toujours l'autorisation serveur et la synchronisation ; le Lab de cette étape n'exerce aucun de ces services.**

La démo n'écrit ni dans Supabase, ni dans `localStorage`, ni dans `sessionStorage`, ni sur un serveur. Le programme synthétique disparaît au rechargement. Aucun lien vers une réservation réelle. Les 17 prestations commerciales sont exclues des suggestions d'itinéraires tant que leurs disponibilités et statuts n'ont pas été contrôlés.

## Contrats documentaires et niveaux de preuve

- **45** affirmations touristiques statiques précédemment revues.
- **21** descriptions de plages/localités à niveau `source-linked-draft` : la source citée et les détails nécessitent encore vérification individuelle ; elles ne doivent pas être présentées comme certifiées.
- **17** fiches de prestataires : **10** pages d'opérateurs consultées ; **7** URL historiques non confirmées indépendamment. Aucune disponibilité, prix, horaire actuel ou licence de bateau validé.
- Les `50` fiches Il Volo sont recensées : `5` conservent `legacy-pending` ; `15` n'ont pas de coordonnées. Aucun point n'a été géocodé automatiquement.

## Tests et lancement

```bash
npm ci --ignore-scripts
node tests/a06-lab.dom.cjs
npm test
```

Un déploiement Vercel statique doit placer cette page à `/lab/a06/index.html` et les modules A06 référencés sous `/dist/`. Le domaine de production, les clés Supabase et le repository de jeu ne sont pas liés.

## Prérequis avant vrai staging collaboratif

1. Base et Auth Supabase **séparés** de la production, avec utilisateurs fictifs et aucune invitation externe ; vérifier préalablement les coûts/quotas du compte pour respecter la contrainte de dépense.
2. Adapter les URLs/backend du Planner à cet environnement synthétique, sans clés service_role en client.
3. Rejouer en navigation réelle iPhone Safari et Android Chrome les rôles, invitations, conflits, ajout, révisions, suppression et synchronisation.
4. Recetter sécurité, source et couverture avant fusion séquentielle des PR #10 à #18 ; ne pas utiliser cette démo pour valider le fonctionnement multi-utilisateur en cloud.

**Aucune migration ni mise en production n'est autorisée par ce jalon.**
