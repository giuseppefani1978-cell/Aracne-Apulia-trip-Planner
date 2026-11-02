# Aracne Lab — Prévisualisation Intelligence A06.5

Ce répertoire contient un **prototype consultatif autonome** destiné aux tests mobiles, distinct du portail Aracne V4, du Trip Planner et d’Hirundu.

## Fonctionnement

- Interface FR/IT/EN/ES, questions touristiques et parcours indicatifs jusqu’à quatre étapes.
- Sources et niveaux de provenance visibles : 45 fiches statiques revues, 21 fiches géographiques avec source candidate dont l’exactitude précise reste à confirmer, 17 pages/URL commerciales suivies (dont certaines non confirmées).
- Base logique : 83 POI Planner + 43 fiches Il Volo sans équivalence sûre = 126 identités.
- Toutes les dépendances sont chargées localement depuis les fichiers `dist/a06-*.js` du commit figé. Un déploiement autonome copie ces fichiers dans `dist/` à côté de `index.html`.
- **Aucune connexion Supabase**, aucun jeton, login, voyage réel, invitation ou méthode `openNativeAdd` n'est présente. `connect-src 'none'` interdit toute connexion réseau initiée par script.
- Le navigateur n'est pas utilisé pour géocoder ou réserver, et les liens de référence s’ouvrent uniquement sur clic externe.

## Limites fondamentales

Ce prototype ne remplace **pas** un environnement de staging complet du Planner. En particulier, il ne recouvre pas le partage multi-utilisateurs, les conflits Supabase, les rôles sur vrais objets de voyage ni la reproduction complète des écrans du Planner. Ces parcours sont couverts uniquement par les tests isolés JSDOM et devront être essayés ensuite sur un Lab Supabase distinct avec des voyages fictifs, sans réutiliser les secrets ou utilisateurs de la bêta.

Les 21 nouvelles descriptions géographiques sont `source-linked-draft` et ne doivent pas être présentées comme indépendamment vérifiées ; les 17 pages commerciales ne certifient aucun créneau ou tarif. Un avertissement particulier concerne la fermeture saisonnière annoncée par Terme di Torre Canne (consultation au 2 novembre 2026).

## Revue/CI

```sh
npm ci --ignore-scripts
node tests/a06-lab-preview.cjs
npm test
```

Le Lab statique ne doit **jamais** être publié sur les deux domaines de production. Le lien Vercel doit demeurer un projet de test distinct et sans variables d'environnement. Aucune migration Supabase ni abonnement payant n'est requis pour ce prototype.
