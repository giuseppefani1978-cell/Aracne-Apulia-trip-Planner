# A06 — Il Volo × Aracne Planner : premier jalon en lecture seule

## Objectif

Le Planner existant reste le socle (voyages, invitations, éditions, carnet et Supabase). Aracne Intelligence est ajoutée comme **panneau d'assistance touristique distinct des cinq vues existantes**. Hirundu demeure un deuxième produit public indépendant, uniquement accessible par le portail commun.

## Sources et versions figées

- Moteur `dist/a06-intelligence.js` : copie du `aracne-intelligence.js` v1.1.9 d'Il Volo, dépôt `giuseppefani1978-cell/ilVolodAracne-`, commit `47be31086bcbbf19391e8fdef9ce2416885a6ac4`, fichier d'origine `aracne-intelligence.js`.
- Données `dist/a06-knowledge.js` : même source/commit, `aracne-knowledge.js` v1.0.0, fiches territoriales multilingues et sources citées.
- `dist/a06-places.js` : 50 POI extraits du tableau `poiData` du `index.html` du même commit, avec identifiants **Il Volo conservés**, sans collision avec les IDs `p0`, etc. du Planner.
- `dist/a06-adapter.js` : adaptateur qui ne transmet à ce moteur **aucune** méthode mutatrice, aucune session ni donnée de voyage.
- `dist/a06-panel.js` : panneau mobile et bureau ajoutant les questions et les sources sans sixième onglet Planner.

## Garanties A06.1

- Consultation touristique et réponses en FR/IT/EN/ES ; contexte limité aux connaissances Il Volo.
- Les requêtes d'itinéraire, d'ajout/suppression de lieu, de navigation, de journal et d'outils sont **rejetées avant `engine.execute()`**. Le bridge ne contient aucune méthode de mutation, même si la détection change.
- Pas d'appel direct à Supabase ou au backend, pas de stockage local, pas de nouvelle PWA, aucune lecture/écriture du document `state` ni des permissions.
- Le texte est rendu avec `textContent` ; les liens de sources sont filtrés HTTPS et affichés séparément. Les horaires, prix et événements sont volatils et non garantis à jour.
- Ne pas injecter les IDs Il Volo dans les tableaux de lieux ou les sauvegardes du Planner : correspondance locale par nom/coordonnées à concevoir, recetter et contrôler avant A06.2.
- L'ancien moteur conserve des textes spécifiques à Hirundu : requêtes sur les capacités bloquées pour éviter les promesses trompeuses. Pas d'activation de modules 1.2/1.3 non publiés.

## Tests et validation

```sh
npm ci --ignore-scripts
node tests/a06-readonly.cjs
npm test
python3 build-locales.py  # doit préserver les injections A06 sur les 4 pages
```

- Tests `tests/a06-readonly.cjs` : consultations dans les quatre langues, refus de la création d'un parcours et de l'ajout dans le programme, aucune écriture de stockage ou accès aux scripts beta.
- CI existante `Aracne QA` sur PR vers `develop`; pas de déploiement de `main`.
- Restent à vérifier avant publication : rendu Safari sur iPhone réel et Chrome Android, contrastes/accessibilité, compatibilité avec la barrière d'accès beta, orthographe des réponses et provenance des sources, cas de géolocalisation et requêtes ambiguës.
- L'environnement Lab complet avec Supabase synthétique demeure non provisionné : pas de nouveau coût.

## Suite A06.2 (non développée)

Faire correspondre de manière explicite les fiches de lieux du Planner et les 50 POI de la base Il Volo. Sur demande d'un utilisateur habilité, **proposer** une liste d'étapes et demander une confirmation avant toute modification. Tester en local avec données fictives, rôles lecteur/éditeur/organisateur et invitations ; ne pas déployer de migrations ou de nouvelle couche RAG en production avant recette.

**Statut** : prototype de fusion sur branche de développement seulement. Ni `main`, ni le Planner beta, ni Hirundu ni Supabase ne changent avec cette PR.
