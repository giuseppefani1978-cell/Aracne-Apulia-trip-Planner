# Aracne V3 — Programme · Journal · Carnet

Branche de travail : `feature/journal-carnet-navigation-v3`  
Base : `pages-rebuild`

## Navigation
- Navigation principale réduite à **Programme · Journal · Carnet**.
- **Carte** retirée des onglets et disponible en permanence depuis le bouton du haut.
- La carte s'ouvre en surcouche et reste utilisable pour ajouter un POI au programme.
- **Dépenses**, partage et cadre du voyage restent accessibles depuis le menu du voyage.

## Cadre du voyage
Une fois une zone / un programme créé, le cadre initial est verrouillé :
- type de voyage ;
- dates / durée ;
- participants initiaux ;
- arrivée ;
- budget cible ;
- rythme, transport et centres d'intérêt.

Le cadre reste consultable. Pour repartir sur un autre cadre, le créateur utilise **Recommencer le voyage**.

## Permissions
- Le rôle provient des capability links déjà utilisés par le voyage partagé.
- `owner` : peut réinitialiser le voyage.
- `edit` : peut modifier le contenu collaboratif mais pas réinitialiser.
- `read` : lecture seule.
- La réinitialisation conserve la session / les liens partagés et remplace le contenu du voyage.

## Journal collaboratif
Le journal est inclus dans le document partagé existant. Aucune nouvelle table Supabase n'est nécessaire.

Il trace notamment :
- création de la première proposition ;
- ajout / suppression / modification d'étapes ;
- changement d'ordre ;
- validation d'étapes ;
- notes groupe ;
- dépenses ;
- finalisation du carnet ;
- reset.

Chaque appareil peut enregistrer le nom de son participant localement. Ce nom est utilisé pour signer les futures actions du journal.

## Programme
Chaque étape affiche :
- référence stable à l'écran : Jx · nn ;
- statut **Proposé / Modifié / Validé** ;
- auteur de la dernière action pertinente ;
- action de validation.

Une étape validée puis modifiée repasse automatiquement en **Modifié** et doit être revalidée.

## Carnet
Le carnet affiche les étapes validées sous forme de journées et construit une carte Leaflet du parcours validé.
Quand toutes les étapes sont validées, le groupe peut finaliser une version du carnet. Toute modification ultérieure est signalée comme changement depuis la dernière version.

## Contrôles effectués
- branche créée depuis `pages-rebuild` ;
- aucun commit sur `pages-rebuild` ;
- chargement V3 ajouté aux pages FR / IT / EN / ES ;
- syntaxe du fichier V3 vérifiée avec `node --check`;
- synchronisation réutilise le RPC / revision-check existant.
