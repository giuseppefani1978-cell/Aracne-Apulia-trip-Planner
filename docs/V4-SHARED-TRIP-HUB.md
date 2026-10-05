# Aracne V4 — voyage commun, multi-voyages et alertes

Branche : `feature/shared-trip-hub-v4`  
Base : `feature/journal-carnet-navigation-v3`

## Problème corrigé
La V3 stockait un document JSON complet avec un compteur de révision. Deux modifications concurrentes pouvaient provoquer un conflit et laisser un téléphone sur sa copie locale.

La V4 conserve le document commun mais ajoute une fusion à trois voies :
1. version de base commune ;
2. changements locaux ;
3. dernière version serveur.

Les ajouts, suppressions et modifications d’étapes, notes, dépenses et événements sont fusionnés par identifiant avant une nouvelle écriture.

## Voyage central
Chaque voyage possède :
- un UUID serveur ;
- un nom central ;
- une révision ;
- un organisateur ;
- des liens capability lecture / modification ;
- un document partagé ;
- un journal d’événements serveur ;
- des sauvegardes versionnées.

Le nom ne peut être renommé que par l’organisateur.

## Mes voyages
Un espace organisateur permet de retrouver plusieurs voyages. Sur un appareil, les voyages rejoints avec un lien sont également mémorisés localement pour permettre de passer de l’un à l’autre.

Les notes personnelles restent séparées par voyage et ne sont jamais envoyées au serveur.

## Alertes
Le client interroge le voyage partagé et récupère les événements nouveaux depuis le dernier événement lu.
- toast dans l’application ;
- badge sur Journal ;
- accès direct au Journal ;
- partage manuel du résumé vers WhatsApp.

Aucun message WhatsApp n’est envoyé automatiquement.

## Sauvegardes
L’organisateur peut créer plusieurs snapshots serveur et restaurer une ancienne version pour tout le groupe.

## Compatibilité
- La V3 déployée continue d’utiliser l’ancien RPC `aracne_trip`.
- La V4 utilise `aracne_trip_v2`.
- La migration Supabase est additive : les voyages existants ne sont pas supprimés.
- L’ancien voyage actif peut être rattaché automatiquement au nouvel espace organisateur lorsqu’il est ouvert avec le lien owner.

## Test minimal V4
1. Ouvrir le même voyage sur deux téléphones avec un lien modification.
2. Donner des noms différents aux deux participants.
3. Ajouter une étape sur A puis, avant rafraîchissement, une autre sur B.
4. Vérifier que les deux étapes apparaissent ensuite sur A et B.
5. Vérifier le badge / toast de mise à jour.
6. Ouvrir Journal sur les deux appareils.
7. Créer une sauvegarde côté organisateur.
8. Créer un second voyage via Mes voyages puis revenir au premier.
9. Vérifier qu’un participant ne peut pas renommer le voyage ni restaurer une sauvegarde.
