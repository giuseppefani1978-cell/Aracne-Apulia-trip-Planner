# A06.6 — Retour à une vraie expérience conversationnelle (dictée + clarification)

**Statut : pilote sur branche séparée.** La fusion n'est pas publiée dans le Planner ni Il Volo, et aucun compte/voyage Supabase n'est exposé au Lab.

## Cause de la régression

La copie A06 du moteur Il Volo v1.1.9 a conservé son code, notamment les états `sessionState`, `CONVERSATION_MAX_TURNS=4` et `pendingClarification`. Mais le panneau `dist/a06-panel.js` ne reprenait **pas** les contrôles du `index.html` Il Volo (Web Speech Recognition, dictée dans un textarea modifiable, Stop, lecture audio) ; il affichait une seule réponse en effaçant la précédente. De plus, l'adaptateur A06.4 envoyait directement les questions reconnues vers `A06PugliaKnowledge.answer`, sans utiliser les clarifications et le contexte du moteur d'origine pour ces questions régionales.

Ce changement a été provoqué par l'intégration A06, pas par un recul du moteur Il Volo. Le fichier `dist/a06-intelligence.js` reste strictement dérivé d'Il Volo 1.1.9.

## Modifications

1. `dist/a06-dialogue.js` : couche **strictement locale**, sans accès au Planner, aux voyages, à l'API cloud ni au stockage. Conservation des **4 dernières interactions**, dernier lieu/territoire, thème et durée. Les questions courtes du type « Et les plages ? » réutilisent le contexte de la zone déjà mentionnée. Une nouvelle zone explicite remplace l'ancienne.
2. Les demandes volontairement vagues sur la **côte Est / mer Adriatique** déclenchent une vraie clarification : **Gargano, Bari, Brindisi ou Otranto/Salento**. Les demandes portant sur « toutes les Pouilles » sans destination demandent également une zone précise avant de proposer une réponse régionale. En cas de réponse non claire, le dialogue demande de reformuler. Le moteur ne choisit pas un emplacement arbitraire.
3. `dist/a06-panel.js` : conservation visible des échanges utilisateur / Aracne dans un fil de discussion ; bouton **Nouvelle conversation** ; champ textarea pouvant être corrigé avant l'envoi. Les sources et boutons de carte associés aux réponses continuent de fonctionner.
4. `dist/a06-voice.js` : boutons **Dicter**, **Stop** et **Lire**. Détection de `SpeechRecognition` / `webkitSpeechRecognition`, langue configurée selon FR/IT/EN/ES, reconnaissance provisoire et résultat final en texte éditable, **aucun envoi automatique**. La réponse peut être lue à haute voix uniquement à la demande via `speechSynthesis`.
5. **Fallback Safari/iPhone** : si la reconnaissance vocale web n'est pas disponible dans le navigateur (variable selon iOS et navigateur), l'interface le signale et la dictée du **clavier système** reste possible ; aucun faux micro simulé. Le navigateur ou système peut traiter la reconnaissance vocale sur des serveurs externes : cela ne garantit pas une reconnaissance hors ligne.
6. Les demandes d'ajout d'étapes restent sous le contrat A06.3 : **préparer puis confirmer**, contrôle des rôles, aucune écriture par la couche d'intelligence. Les actions héritées du jeu sont toujours filtrées par l'adaptateur.

## Tests

- `tests/a06-dialogue.dom.cjs` charge le moteur et les bases réelles A06 en JSDOM dans les **4 langues** avec une API WebKit dictée simulée. Vérifie : clarification « côte Est », réponse « vers Bari », relance « Et les plages ? », changement de région vers Itria, mémoire bornée, question vague « Pouilles », retour sans choix, détection d'une région, dictée dans textarea, modification avant envoi, absence d'envoi automatique, conservation visuelle du dialogue et reset.
- `tests/a06-lab.dom.cjs` vérifie l'isolation du Lab sans accès aux comptes Supabase et les ajouts fictifs en deux clics.
- `npm test` exécute également l'intégralité des régressions des rôles, données, POI, sources et itinéraires.

## Limites restantes

- Ce n'est **pas un LLM généraliste** : la compréhension reste fondée sur un moteur et des connaissances structurées. Pour les formulations complexes non couvertes, mieux vaut demander une précision que supposer une réponse.
- Le maintien du dialogue est **uniquement en mémoire de l'onglet** ; pas de sauvegarde ni d'historique privé persistant.
- Le moteur Il Volo complet possède des intentions liées au jeu qui ne sont pas exécutables dans la couche touristique ; la sécurité repose sur le filtrage A06 et la confirmation côté Planner.
- **La disponibilité du micro sur Safari iPhone réel doit être confirmée sur appareil**. Les tests Web Speech simulés ne garantissent pas l'API sur tous les navigateurs.
- Le Lab publié est une maquette statique utilisant un programme fictif ; le staging avec Supabase isolé n'est pas encore provisionné.

Aucun changement de production, aucun abonnement additionnel requis pour ces fonctions locales de base.
