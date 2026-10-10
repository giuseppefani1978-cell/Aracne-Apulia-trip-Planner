# Aracne · Développement, préproduction et releases

## Véritable statut des environnements

| Environnement | Source | Accès | Données | Déploiement |
|---|---|---|---|---|
| **Beta 1 (utilisateurs)** | `main` | `myapuliatrip.com/dist/index.html` | Supabase actuel : données réelles des testeurs | GitHub Pages actuel |
| **Laboratoire d'interface** | `main:/lab/` | lien depuis `dist/beta-admin.html` | maquettes fictives uniquement ; vérification de session admin en lecture | GitHub Pages actuel |
| **Développement** | `develop` | GitHub, pas de site dédié pour l'instant | aucun backend public | GitHub uniquement |
| **Staging complet (à créer)** | `develop` / `release/*` | future URL séparée, à provisionner | **un second Supabase**, séparé de la Beta 1 | à configurer |
| **Archives de version** | `release/*`, `backup/*`, tags | GitHub | snapshots de code, pas sauvegardes des données SQL | aucune publication automatique |

**Limite actuelle :** le laboratoire public est un **atelier de maquettes** à partir de `/lab/`, PAS encore une application complète branchée sur un serveur de staging. Il ne doit pas être présenté comme un environnement de recette fonctionnel.

GitHub Pages ne publie qu'une source du dépôt à la fois. Une branche Git `develop` n'expose donc pas à elle seule une seconde URL. Pour une staging complète, prévoir un second site GitHub Pages (sur un autre repo) ou un hébergement de prévisualisation, et configurer un nouveau projet Supabase. Ne jamais réutiliser les clés de capacité et codes admin Beta 1 pour la staging.

## Règles de livraison

1. **Développer** chaque évolution sur `feature/*` issu de `develop`. Aucun travail expérimental directement sur `main`.
2. **Réunir** les changements approuvés via PR dans `develop`, avec tests DOM, sync et invités + revue des migrations.
3. **Visualiser** l'interface dans `/lab/` s'il s'agit d'une maquette sans données. Pour les fonctions complètes, attendre staging avec Supabase isolé.
4. **Préparer** une release `release/YYYY-MM-DD-vX.Y.Z` depuis `develop`. Ne pas partager sa branche pour un vrai voyage.
5. **Recetter** à deux téléphones (iPhone et Android), avec un organisateur et un invité ; langues FR/IT/EN/ES ; invitation et conservation du programme ; réinstallation et perte de réseau ; restauration d'accès et export.
6. **Promouvoir en `main`** seulement la release validée (un seul lot cohérent de changements). Noter le SHA, créer un tag `vX.Y.Z-beta.N` et préserver l'ancien SHA avant publication.
7. **Après publication** : tests de fumée sur le domaine réel, surveillance des retours, rollback de code documenté. Attention : revenir au code précédent ne répare pas une migration DB destructive ; privilégier des migrations compatibles et sauvegardes vérifiées.

## Conditions impératives

- Ne pas détruire, copier ou modifier les voyages ni les codes bêta existants dans des tests de développement.
- Ne pas publier le contenu des liens d'invitation, clés secrètes ou sauvegardes privées dans GitHub.
- Ne pas automatiser le merge `develop → main`.
- Toute nouvelle version doit indiquer ce qui change pour les bêta-testeurs, la méthode de vérification et la stratégie de retour arrière.
- Un test manuel réussi dans un navigateur ne valide pas la compatibilité PWA iOS/Android.
- L'atelier GitHub Pages sert à voir et commenter des maquettes. Ce n'est pas un espace pour y stocker des secrets : son code client statique est public, même si son interface vérifie le profil administrateur.

## Étapes restantes pour staging complet

- Provisionner un hébergement distinct (par exemple le futur `stage.myapuliatrip.com`, **non configuré à ce jour**).
- Créer et paramétrer **un second projet Supabase**, avec données factices, RPC, contrôle d'accès, migrations et quotas distincts.
- Factoriser les constantes d'URL/API dans une configuration dépendant de l'environnement ; contrôler les appels réseau pour empêcher tout accès croisé à la base Beta 1.
- Configurer le pipeline GitHub Actions : CI sur PR, publication manuelle/approbation pour staging, validation explicite pour production.
- Ajouter au tableau admin un lien vers la staging lorsque l'URL répond et que l'environnement est sécurisé.

## Communication bêta

Les consignes de recrutement, vagues d'invitations, missions et questionnaires appartiennent à une conversation **distincte** du projet ChatGPT : « Aracne · Déploiement bêta et testeurs ». Ce dossier décrit uniquement le code et les procédures de release.
