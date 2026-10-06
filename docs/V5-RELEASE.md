# V5 — candidate de validation

Base : feature/shared-trip-hub-v4, f2a79724ee855ed4dd3a2544d2be0de2db20a1ac.
La V4 publiée n'est pas remplacée par cette branche.

## Changements

- Gestion V5 des voyages solo et partagés, avec données et session sauvegardées par voyage.
- Sauvegarde initiale des données V4 avant import; récupération du répertoire local V4.
- Création nommée, duplication indépendante, retour à un voyage avec ses droits et invitations.
- Suppression explicite et nettoyage des références; vidage du programme distinct, notes et dépenses conservées.
- Conservation des modifications non synchronisées dans chaque copie locale.
- Fusion des ajouts indépendants; conflits de champs ou suppression/modification bloqués au lieu d'écraser une version.
- Export et copie de sécurité avant chargement de la version du groupe en conflit.
- Protection contre les réponses tardives après changement de session.
- Notes privées conservées lors des restaurations; annulation d'une sauvegarde sans effet.
- Validation/publication réservées à l'organisateur. Instantané du carnet publié conservé après modification du brouillon.
- Cadre du voyage modifiable par l'organisateur sans devoir effacer le programme.
- Aide et introduction V5 en FR/IT/EN/ES; introduction mémorisée.
- Pages générées depuis la source, inclusion des modules V3/V5 conservée par le générateur.

## Installation serveur avant publication

Le client V5 utilise `aracne_trip_v5`. Exécuter `supabase/v5-upgrade.sql` avant de servir cette branche.
Ce fichier n'a PAS été installé durablement pendant le développement.
Il crée un RPC capability V5 et protège les voyages migrés contre les mutations depuis un client V4.
Un voyage est marqué schemaVersion=5 lors de sa création ou première écriture V5.
Les lecteurs V4 restent possibles; les contributeurs doivent ouvrir la V5 pour modifier un voyage migré.
La fonction V2 existante est conservée pour les autres voyages.
Les identifiants serveur et liens capability existants restent valables sur le client V5.
Le contrôle est côté serveur, pas seulement un bouton masqué.

Avant installation, sauvegarder la définition actuelle de aracne_trip_v2. Avant retour en arrière,
ne pas réactiver aveuglément les écritures V4 sur les documents V5: elles peuvent ignorer les nouvelles règles.

## Vérifications effectuées

- `python build-locales.py` : génération des quatre langues.
- `npm test` : suites V5 DOM (quatre langues) et deux clients simulés.
- Solo: création A/B, retour, notes privées, vidage, suppression, annulation de sauvegarde.
- Publication: snapshot du carnet inchangé lorsque le brouillon est modifié.
- Synchronisation simulée: deux ajouts concurrents conservés, conflit même champ explicite,
  notes privées conservées au rechargement groupe, clés d'invitation conservées.
- Serveur réel: définition V5 et tests dans UNE transaction terminée par ROLLBACK.
  Création, lecture, refus d'écriture lecteur, refus de publication participant,
  refus du contournement via V2, contribution participant et publication organisateur.
  Aucun voyage de test ni changement de fonction n'a été conservé.

Reproduire le test serveur: BEGIN; contenu de supabase/v5-upgrade.sql; contenu de tests/v5.server.sql.
Le dernier fichier inclut ROLLBACK.

## Conditions avant mise en production

- Installer le RPC puis vérifier le parcours réel à deux téléphones avec données de test.
- Vérifier Safari iPhone et Android, y compris partage natif et changement de langue.
  Chromium n'a pas pu être installé (archive téléchargée invalide), aucune QA visuelle prétendue.
- Vérifier une migration de données V4 réelles avec copie de sécurité, notamment les anciens carnets.
- Les anciens carnets V4 ne contiennent pas d'instantané historique fiable: republier depuis le programme validé pour créer le premier carnet V5.
- Une restauration serveur conserve les notes privées actuelles; une exportation JSON personnelle contient ces notes et doit rester privée.
- La résolution actuelle des conflits offre export/sauvegarde puis chargement du groupe.
  Une interface de sélection champ par champ n'est pas incluse.
- Le répertoire V5 importe les voyages connus sur cet appareil; la récupération d'un répertoire
  organisateur sur un nouvel appareil et l'identité multi-appareils demandent encore un parcours dédié.
- Le stockage local dépend du navigateur et de son quota. Exporter les sauvegardes importantes.

Ne pas fusionner ou publier automatiquement cette candidate avant la recette ci-dessus.
