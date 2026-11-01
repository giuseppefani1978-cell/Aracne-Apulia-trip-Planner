# ARACNE — Portail « deux univers », V4

## Portée

Page d'accueil commune basée sur la maquette V3 validée le 1er novembre 2026. Les deux espaces sont de même importance : **Il Volo di Aracne** (voyages) et **Hirundu** (jeu). Le jeu n'est pas un onglet du Planner.

- Entrée tourisme « Planifier mon voyage » : https://myapuliatrip.com/dist/index.html — bêta Planner actuelle.
- Entrée jeu « Jouer à Hirundu » : https://play.myapuliatrip.com/ — Hirundu Play Beta, hébergement Vercel actuel.
- Lien « Comprendre l'écosystème » : schéma conceptuel local au portail.
- Aucun SDK Supabase, aucune écriture de données, aucun secret et aucun changement de session.

## Statut et règles de publication

**Préparation uniquement** : ce fichier est ajouté dans `portal/index.html` sur une branche de travail issue de `develop`, sans remplacer `index.html` à la racine. L'URL `myapuliatrip.com/` ouvre toujours la bêta Planner : ne pas la remplacer avant un plan de migration/rollback, et ne pas redéployer cette branche comme production.

L'Intelligence touristique et la fusion du Planner avec le moteur d'Il Volo historique restent des chantiers séparés. Les deux liens envoient pour l'instant vers les produits existants, **pas** vers des versions fusionnées.

## Vérifications

```bash
node tests/portal-links.cjs
node tests/portal.dom.cjs
```

Deux jobs CI sur la PR : `Aracne Portal Preview QA` vérifie la navigation DOM, les liens, l'absence de backend et fournit un artefact HTML téléchargeable ; `Aracne Portal — isolated preview & browser QA` contrôle également les gabarits bureau, Android émulé et iPhone WebKit émulé et fournit des captures. **Un émulateur ne remplace pas Safari sur un iPhone réel**.

Ces fichiers ne sont **pas une prévisualisation publiquement hébergée**. L'artefact GitHub Actions s'ouvre après téléchargement : aucun accès réel aux voyages, à Supabase ou aux sessions bêta.

Vérifier manuellement sur iPhone Safari et Android Chrome les deux liens sortants, le retour navigateur, et les invitations / sessions des apps de destination. Contrôler également la vue mobile/desktop avant de déployer un portail public autonome.

## Prochaine étape (nécessite revue avant publication)

Définir le domaine définitif du portail (sans déplacer d'abord `myapuliatrip.com`), sa méthode d'hébergement indépendante, et la procédure de retour arrière. Préserver les domaines et données des bêtas existantes.

## Plan de mise en ligne séparée (non exécuté)

1. Garder `myapuliatrip.com` pour la bêta Planner tant qu'une nouvelle entrée n'a pas été approuvée ; garder `play.myapuliatrip.com` pour Hirundu.
2. Prévoir un hébergement statique distinct et un sous-domaine de prévisualisation à confirmer. Publier uniquement `portal/index.html`, sans copier les scripts du Planner, les données ou les clés Supabase.
3. Tester l'URL candidate sur vrais Safari iPhone et Chrome Android : affichage des deux cartes, choix des liens, navigation retour, sessions déjà actives, invitation Planner et chemin Admin Hirundu.
4. Faire valider le nouveau portail et sa destination avant toute bascule de domaine ou modification de DNS. Rollback : revenir au dernier artefact statique du portail uniquement, sans toucher aux deux applications.
5. Aucun compte ou abonnement supplémentaire et aucune nouvelle base cloud n'ont été créés par cette préparation.
