# Aracne · Écosystème de trois applications (projet, non activé)

Statut : **contrat d’architecture préparatoire uniquement**, octobre 2026.

## Périmètre

| Identifiant stable | Dépôt | Responsabilité |
|---|---|---|
| `hirundu` | `giuseppefani1978-cell/Hirundu1.1-` | Jeu, niveaux, cartes et inventaire |
| `aracne_discovery` | `giuseppefani1978-cell/ilVolodAracne-` | Découverte, fiches POI, itinéraires |
| `my_apulia_trip` | `giuseppefani1978-cell/Aracne-Apulia-trip-Planner` | Voyages partagés, organisateurs, carnet |

Le fichier `ecosystem/contract.v1.json` est la **référence préparatoire**. Aucun inter-appel ni migration SQL n'est actuellement activé.

## Convention future pour les lieux

1. Donner à chaque lieu un identifiant stable `place_id` indépendant du nom, des traductions et des coordonnées. Distinguer cet ID des identifiants spécifiques au moteur du jeu ou à la carte.
2. Un registre de correspondances `app_id + local_place_id => place_id` permettra de mapper les catalogues existants sans réécrire leurs identifiants.
3. Chaque application conserve la responsabilité de ses propres données métier. Une seule source de vérité pour les informations touristiques communes sera définie plus tard (à documenter selon licence et provenance).
4. Prévoir un contrat d'échange de version `v1`, avec `place_id`, `locale` et intention `view_place` / `suggest_place_for_trip`. Ne jamais transmettre d'identifiants privés de voyage, ni des secrets de partage pour une simple navigation entre applications.
5. Tout ajout d'un lieu à un voyage nécessite une action de l'utilisateur authentifiée dans **My Apulia Trip** (ou avec un lien de capacité de voyage valide). Un `place_id` ne donne jamais le droit d'écrire dans un voyage.

## Backend cible (à construire ultérieurement, sans toucher à Supabase Beta 1 aujourd'hui)

- `ecosystem.place_directory` : catalogue et lieux canoniques.
- `ecosystem.place_mappings` : correspondance IDs de Hirundu / Aracne / My Apulia Trip.
- `ecosystem.app_integrations` : routes autorisées, version de protocole, flags d'activation.
- Éventuels événements d'intégration minimaux (sans données personnelles ni tokens), seulement après audit de sécurité et de confidentialité.

Définir d'abord les politiques d'accès côté serveur. L'ensemble de ces éléments reste **désactivé** dans la configuration versionnée. Il ne faut pas créer les tables de production avant d'avoir testé le protocole sur un backend de staging.

## Séparation des identités

Il n'y a pas d'identifiant utilisateur global pour le moment. Les codes bêta d'Aracne, les droits sur un voyage partagé et les cartes Hirundu ont des modèles de sécurité distincts. Ne jamais mutualiser leurs tokens par défaut.

## Première histoire utilisateur future

1. Un joueur découvre un POI dans **HIRUNDU**.
2. Il choisit « Découvrir le lieu dans Aracne » (navigation explicite avec `place_id`).
3. La fiche s'ouvre dans **Aracne Discovery**.
4. « Ajouter à mon voyage » lance **My Apulia Trip**, avec confirmation et vérification des droits.
5. Si aucun voyage autorisé n'est disponible, proposer la création ou la sélection d'un voyage sans partager d'accès implicite.

L'implémentation inter-apps, le SSO, le CRM partenaires et toute monétisation sont hors périmètre de Beta 1.
