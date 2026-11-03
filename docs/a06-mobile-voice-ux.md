# A06.7 — Corrections iPhone Safari / navigateur Facebook : affichage et voix

**Retour utilisateur : trois captures iPhone 2026-11-02** montrant un assistant partiellement tronqué et agrandi, des réponses cachées derrière les actions et une lecture vocale qui reste activée lors d'une nouvelle dictée. Correctif contenu dans la branche Lab A06, non publié sur la production touristique.

## Diagnostic

- Panneau ancien : fenêtre fixe de 450 px (limitée à la largeur du viewport) avec hauteur réduite et positionnement au-dessus d'un gros bouton flottant. Le dialogue avait trop peu de place, en particulier dans une vue Web intégrée depuis Facebook.
- Le texte de la réponse était défilé automatiquement jusqu'à son extrémité, ce qui masquait la question et le début de la réponse.
- Champ à 14 px : risque de **zoom automatique iOS** lors du focus et de débordement apparent ; formulaire horizontal peu adapté aux petits écrans.
- Ancienne lecture vocale : dépendance à `speechSynthesis.speaking` et à un unique objet vocal long. Ce dernier peut rester bloqué sur WebKit ; la dictée et la lecture n'étaient pas mutuellement exclusives.

## Correctifs

1. **Mobile plein écran** (≤740 px) : panneau bord à bord, zone de conversation défilable indépendante, en-tête compact, action de retour visible, champ de saisie et bouton d'envoi dans une grille 1fr + auto ; plus de défilement horizontal du contenu.
2. **Question et réponse lisibles ensemble** : après l'envoi, le fil se positionne au début du dernier échange, jamais à la fin forcée d'une réponse longue. Les exemples se replient une fois le dialogue commencé.
3. **Zoom iOS** : textarea à **16 px** sur mobile, suppression du focus automatique au premier affichage et fermeture du clavier après envoi. Les autres largeurs desktop restent adaptées.
4. **Parole** : lecture découpée en segments courts (~170 caractères) et état `reading` interne ; la lecture s'arrête automatiquement dès le clic « Dicter », le focus sur le champ de texte, sa modification, l'envoi d'une nouvelle question, la réinitialisation, la fermeture de l'assistant ou le masquage de l'onglet. L'état du bouton redevient **Écouter**.
5. **Informations secondaires** : avertissement sur les éventuels services vocaux externes conservé dans un bloc dépliable « Confidentialité vocale ». Pas de lecture ni d'activation micro automatique.
6. **Quatre langues** : FR/IT/EN/ES, avec libellés adaptés et aucune autorisation d'écriture supplémentaire.

## Limites

Les réponses sont du texte structuré et ne disposent pas d'un service TTS serveur. `speechSynthesis` et Web Speech Recognition sont fournis par le navigateur/iOS ; selon le navigateur intégré Facebook, certaines fonctions peuvent être absentes ou refuser de démarrer. Les tests simulés ne prouvent pas le comportement audio de l'appareil réel. Pour isoler le comportement, comparer **Safari ouvert directement** avec la WebView Facebook. Si la lecture TTS WebKit reste indisponible, une solution de repli devra être étudiée séparément sans coût supplémentaire implicite.

## Validation

- `tests/a06-mobile-voice.dom.cjs` simule un écran étroit et une voix WebKit dans chaque langue, vérifie la présence des garde-fous CSS, la lisibilité des échanges, les segments courts et les interruptions par dictée, saisie, changement de question et reset.
- `tests/a06-dialogue.dom.cjs` conserve les tests de conversation, les clarifications et le micro.
- `tests/a06-lab.dom.cjs` et `npm test` vérifient l'absence d'impact sur les rôles fictifs et les voyages.
- Le Lab reste indépendant et sans authentification Supabase. Aucun site public modifié.

**Éviter de désactiver les mises à l'échelle du navigateur** (`user-scalable=no`) : cela nuirait à l'accessibilité. Corriger la taille du champ et le layout à la source.
