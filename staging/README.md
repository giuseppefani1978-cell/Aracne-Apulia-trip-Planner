# Aracne Lab — opération A01–A05, 1 novembre 2026

État : préparation locale testée, **pas un staging Supabase hébergé validé**.
Branche `work/aracne-lab-a01-a05-2026-11-01`, base develop = main
`7d0930460d871b1e663743c69fe4154d2b95c5ef`. PR vers develop uniquement.
Aucune fusion d'interface, modification de main ou des données réelles.

## Utilisation locale

```
npm ci --ignore-scripts
npm test
npm run test:lab
npm run build:lab -- staging/local.example.json
python3 -m http.server 4173 --bind 127.0.0.1 --directory .lab-build
```

Ouvrir http://127.0.0.1:4173/dist/index.html. Cette configuration contient une
fausse clé et aucun serveur HTTP Supabase local n'est démarré : les fonctionnalités
cloud ne sont PAS opérationnelles dans cette prévisualisation. Les tests SQL
exécutent les fonctions dans PostgreSQL embarqué PGlite, sans réseau.

Le build copie dist sans modifier les sources publiées, remplace les endpoints,
refuse les backends existants, ajoute CSP, garde réseau, namespace de stockage,
manifest PWA propre, bannière Lab et manifeste SHA256. L'ancien /lab/ n'est pas
copié. Pas de service worker, pas de copie des sessions bêta. Ne pas importer de
sauvegarde réelle. Servir exclusivement .lab-build, jamais la racine du dépôt.

Pour un futur build hébergé : configuration .lab-config.json ignorée par Git,
origin exactement https://lab.myapuliatrip.com, projectRef du NOUVEAU projet,
supabaseUrl correspondante et sa propre clé publishable. Ce build ne prouve pas
que le projet est synthétique : valider son identité et son contenu avant usage.
Aucune publication automatique ajoutée.

## A01 : versions constatées

- Planner : workflow Pages réussi 38067393955, main 7d0930460d871b1e663743c69fe4154d2b95c5ef.
  https://myapuliatrip.com/dist/index.html répond 200 ; quatre fichiers critiques
  et l'ancien atelier /lab/ sont identiques octet par octet au dépôt (public-fingerprints.json).
  C'est la bêta utilisée par les testeurs, pas le nouveau staging.
- Il Volo : Pages réussi 41227074964, main 47be31086bcbbf19391e8fdef9ce2416885a6ac4.
  https://giuseppefani1978-cell.github.io/ilVolodAracne-/ répond 200.
  Concordance binaire complète de son artefact non attestée.
- Hirundu : main 0a9ec2c2fab9c352bf6e4d95c043558ef2e6eb31.
  L'ancienne URL GitHub Pages répond 200, SHA publié non attesté.
  play.myapuliatrip.com résout via Vercel vers dpl_DSK5Bco68nofn1eUy4LfmktcLtj9,
  commit c08f25012de5eb762e27002f9ad7b3f904882d56, branche
  fix/play-beta-whatsapp-invite-2026-11-01, READY / target production.
  Cette étiquette Vercel désigne la publication de Hirundu Beta.
  Preview distincte : db47fc60e4265ee8095f6eba15a88c87f5014739,
  stabilisation/hirundu-beta-rc1-2026-11-01, dpl_Up11xLcUns2x3m96e372bpbH18dC.
- lab.myapuliatrip.com : réponse HTTP 503 lors du contrôle ; aucun Lab créé ici.

## A02 : contrat examiné en lecture seule

Consultation exclusive des catalogues SQL, définitions de fonctions, grants et
advisories. Aucune ligne de voyage, code, session ou donnée personnelle exportée.
Dix tables privées : workspaces, trips, trip_events, trip_versions, beta_settings,
beta_batches, beta_sessions, beta_feedback, beta_invites, beta_invitation_slots.
RLS activée, aucun grant direct anon/authenticated sur les tables.
API : aracne_beta, aracne_trip, aracne_trip_v2, aracne_trip_v5, aracne_workspace.
Autorisation par capacités owner/edit/read et session bêta navigateur, pas comptes
Supabase Auth. Documents JSON version 1/schemaVersion 5, révisions optimistes,
notes privées filtrées, quotas et invitations avec slots/expiration.
Les RPC privilégiées contrôlent les droits ; les advisories signalent leur accès
anon/authenticated. L'absence de politiques des tables privées n'est pas, seule,
une preuve de fuite. Ne pas convertir aveuglément ces RPC en SECURITY INVOKER.

schema-baseline.sql reproduit tables, contraintes et fonctions inspectées, sans
aucune ligne réelle. C'est une fixture de test, PAS une migration déployable complète :
index secondaires, extensions (notamment pgcrypto), configuration PostgREST,
paramètres plateforme et historique migrations restent à compléter et vérifier.
L'ancien endpoint v1 doit faire l'objet d'un test de compatibilité supplémentaire
avant toute validation cloud. A02 ne constitue pas une certification de sécurité.

## A04 : tests et limites

PASS : suite DOM existante FR/IT/EN/ES, deux clients simulés, conflits,
préservation notes privées et invitations, multi-voyages. PASS : nouveau build,
refus de configuration prod, garde fetch, stockage séparé. PASS PostgreSQL local :
activation, refus lecteur, restrictions éditeur, révision périmée, client v2 refusé,
snapshot/restauration, rotation, mauvais voyage, révocation et backup/reopen.
Tests live historiques bloqués explicitement pour éviter leur backend codé en dur.

Restent obligatoires sur Supabase distinct : HTTP/PostgREST et headers réels,
génération/expiration/quota des invitations, deux navigateurs simultanés,
charge concurrente, réseau interrompu, CSP en navigateur, PWA iOS/Android,
quatre langues sur appareils. Aucun résultat mobile ou test cloud revendiqué.

## A05 : récupération et rollback

Exercice exécuté par tests/lab/database.cjs : données fictives, snapshot RPC,
modification, restauration RPC, vérification ; dumpDataDir, fermeture, nouvelle
instance restaurée, comparaison exacte IDs/documents/révisions. Ce format est
spécifique à PGlite : il ne remplace PAS pg_dump/restore Supabase.

Avant hébergement : sauvegarder schéma + données synthétiques du Lab avec la CLI
Supabase officielle, restaurer dans une deuxième instance locale isolée, comparer
les tables, séquences, grants et fonctions puis rejouer les parcours. Aucun dump
production. Garder les sauvegardes hors dépôt et hors artefact web.

Rollback frontend : conserver deux artefacts Lab immuables avec release.json,
vérifier SHA256, revenir à l'artefact précédent sur le seul hébergement Lab.
Ne pas vider localStorage et ne pas restaurer une base ancienne pour un simple
rollback frontend. Cet exercice de publication n'est pas encore exécuté : aucun
hébergement Lab n'existe. En cas de corruption : suspendre les écritures Lab,
conserver l'état courant, restaurer à côté et réconcilier avant bascule.

## Blocages et étapes suivantes

Organisation Giuseppe Projects en plan Free, deux projets actifs déjà présents.
Tarif officiel consulté : Free limité à deux projets ; Pro à partir de 25 USD/mois,
premier projet inclus, suivants dès 10 USD/mois. Une organisation Pro avec trois
instances Micro représente environ 45 USD/mois hors taxes/dépassements ; ce n'est
pas un devis validé. Aucun abonnement ni projet créé. Choix organisation/coût et
accord utilisateur requis avant provisionnement.

1. Revue de cette PR vers develop, sans merge vers main.
2. Compléter baseline, invitations, ancienne API et tests navigateur.
3. Après accord de coût : nouveau Supabase, nouveaux identifiants et fixtures.
4. Hébergement distinct et domaine lab.myapuliatrip.com ; validation réseau réelle.
5. Recette deux appareils et exercice pg_dump/restauration/rollback hébergé.
6. A01–A05 acceptés avant A06 : aucune fusion complète des interfaces jusque-là.

Sources : https://supabase.com/pricing ;
https://supabase.com/docs/guides/self-hosting/restore-from-platform ;
rapport Audit_fusion_Aracne.md conservé dans le projet, non recopié ici.

## Décision de poursuite — 1 novembre 2026

L’utilisateur reporte tout abonnement et provisionnement : poursuivre localement
jusqu’à stabilisation. Aucun projet cloud à créer et aucun changement de plan.
Nouveau test SQL synthétique : expiration et révocation des invitations, liaison
au navigateur, activation idempotente, permissions invité et absence de grants
directs. Garde réseau testée aussi pour XHR, WebSocket, EventSource et URL objects.
Ces tests ne remplacent pas la génération de codes par pgcrypto, PostgREST ni
la recette sur téléphone ; ces validations restent ouvertes.
