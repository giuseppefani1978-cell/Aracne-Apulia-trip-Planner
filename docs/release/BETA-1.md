# Il Volo di Aracne — préparation bêta 1

Point vérifié le 15 novembre 2026. Objectif : une bêta utilisable avant Noël 2026 ; ce document ne constitue ni une validation de recette ni une promesse de livraison automatique.

## Référence et état réel

- Branche de livraison : `work/beta-1-release-2026-11-15`, basée sur la branche distante A09.3 `fix/a09-3-microphone-release-2026-11-09` (d661d03).
- PR #30 : ouverte, brouillon, non fusionnée ; tête A09.2 `106109524d287d184447d8208b14c07bc9ceb725`. Elle n'inclut pas encore le correctif A09.3.
- Dernier déploiement Lab listé READY : https://aracne-lab-a086-preview-kxrb8tvuf.vercel.app/lab/a08/index.html (A09.3). Ce déploiement utilise des voyages fictifs, pas une collaboration cloud validée.
- Le prototype intègre Intelligence, propositions de lieux/itinéraires, carte, programme et carnet. Les validations historiques sont détaillées dans `docs/a09/STATUS.md`.
- Le micro échoue encore à la deuxième utilisation sur l'iPhone de l'utilisateur. Les tests simulés ne prouvent pas le fonctionnement natif de Safari.
- Hirundu reste un produit séparé. Le portail n'est pas un prérequis de la première bêta touristique.

## Supabase

La lecture des métadonnées le 15 novembre retourne deux projets : « Hirundu Beta » INACTIVE ; « giuseppefani1978-cell's Project » ACTIVE_HEALTHY. Les endpoints du Planner dans `dist/shared-trips.js`, `dist/shared-hub-v4.js` et `dist/beta-access.js` correspondent au second projet.

Cette vérification ne prouve ni la santé de chaque fonction métier ni la sécurité des permissions. Aucun SQL hébergé, aucune restauration, aucune migration ni dépense effectués pour ce point. Aucun projet cloud Aracne Lab distinct n'apparaît dans cet inventaire. Ne pas utiliser la base du Planner comme terrain d'essai.

Le mail de pause n'a pas été lu ; sa date limite spécifique reste à vérifier. La documentation officielle actuelle indique une fenêtre de restauration d'un an, alors que le mail rapporté mentionne 90 jours. Garder la date du mail comme échéance prudente tant qu'elle n'est pas clarifiée : https://supabase.com/docs/guides/platform/free-project-pausing

## Périmètre de la bêta 1

Un lien HTTPS stable, une version identifiable, quatre langues et un parcours complet : créer/rouvrir un voyage, poser une question au clavier, examiner les suggestions, confirmer l'ajout, consulter carte/programme/carnet, recharger et retrouver son voyage. Pour une bêta collaborative, inviter un second utilisateur et vérifier réellement ses droits.

La saisie clavier est le parcours obligatoire. La dictée du clavier du téléphone est un recours manuel ; la dictée Web Speech reste expérimentale jusqu'à recette réelle. Ne pas annoncer le micro réparé sur la seule base de mocks.

## Ordre de travail et critères de sortie

1. Consolider cette branche et réconcilier les anciennes PR cumulatives ; ne pas les fusionner en bloc. Exécuter tests DOM/quatre langues, SQL isolé, navigateur et contrôle de dérive du build.
2. Préparer une candidate avec version affichée et une adresse de test de référence ; vérifier les ressources effectivement servies. Ne pas confondre candidate locale, commit sauvegardé et version déployée.
3. Recette mobile réelle iPhone/Android : clavier, changement de langue, navigation aller-retour, confirmation des propositions, changement de voyage, persistance après rechargement. Journaliser les défauts et les résultats.
4. Définir et valider un environnement cloud isolé avec données fictives, avant toute écriture distante. Tester deux utilisateurs, lecture/écriture, organisateur non modifiable, révocation/expiration d'invitation, reconnexion et modifications concurrentes ; examiner les fonctions privilégiées et le retour arrière.
5. Ouvrir la bêta à un petit groupe seulement après ces critères. Fournir un lien unique, les limites connues, une procédure de retour et une sauvegarde/restauration vérifiée.

Jalons cibles : consolidation et candidate pendant la seconde moitié de novembre ; recette mobile et cloud au début de décembre ; bêta restreinte avant Noël si les critères passent. Si un critère échoue, publier son état explicitement au lieu de renommer la version comme terminée.

## Premier changement de cette reprise

Rendre l'annulation de la reconnaissance idempotente quand l'envoi déclenche à la fois l'écouteur en capture et celui du panneau. Une annulation déjà demandée n'est pas répétée par ces deux handlers ; le watchdog de récupération reste indépendant. Un arrêt gracieux peut toujours être converti en annulation lors d'un envoi. Ce changement retire un défaut concret, sans établir la cause du blocage Safari.

Validation de cette reprise : le test du double appel échoue avant correction (deux annulations au lieu d'une), puis passe après correction. `npm test` et `npm run test:lab` passent ; `npm run build` ne modifie aucun fichier `dist`. Le test navigateur local est bloqué au lancement de Chromium par `socket() failed: Operation not permitted` ; il ne constitue donc pas un résultat de recette. La suite UI n'a pas été exécutée après cet échec. Recette iPhone/Android et cloud toujours ouvertes. Ce changement n'est pas déployé dans la preview A09.3.
