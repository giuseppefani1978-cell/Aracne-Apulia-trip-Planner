# A06.3 — Propositions d’itinéraires et validation par étape

**Statut : pilote en branche isolée, non publié.** Dépend d’A06.1 (PR #10) et A06.2 (PR #11). Ne pas fusionner vers main ni vers production avant recette.

## Ce qui fonctionne

- L’utilisateur peut demander « Propose-moi un parcours autour d’Otranto » ou cliquer sur **Proposer un parcours** dans le panneau Aracne Intelligence.
- Le module pur \`dist/a06-proposals.js\` retrouve les fiches **Il Volo / Planner reliées et vérifiées** par \`A06PlaceMatcher\`, extrait un lieu cité dans la question et suggère au maximum quatre étapes. Si deux lieux reconnus sont explicitement cités, leur ordre suit la question ; pour un seul lieu, le tri utilise des distances à vol d’oiseau plafonnées à 35 km, **sans prétendre représenter un itinéraire routier ou des temps de trajet**.
- Les lieux sans correspondance fiable, les coordonnées insuffisantes et les cas sans point d’ancrage ne génèrent pas de nouvel objet de voyage.
- L’utilisateur consulte une proposition et clique **Préparer l’ajout** sur une étape. Cela ouvre le formulaire d’ajout **existant du Planner**. Seul le second clic sur **Ajouter cette étape** réalise une modification. Aucune insertion automatique, aucun « ajouter toutes les étapes », aucune nouvelle API réseau.
- L’assistant Il Volo reste branché en **lecture seule** ; il ne possède aucune méthode d’écriture sur le Planner.

## Conditions de sécurité

- Le module \`A06PlannerCatalog\` expose un petit contrat applicatif : \`proposalContext()\` (droits et empreinte opaque de l’état courant), \`openNativeAdd(plannerId,fingerprint)\` (n’ouvre le dialogue qu’après vérification).
- Les rôles \`owner\` et \`edit\` peuvent ouvrir le dialogue si le voyage est nommé et, dans le cas partagé, si la session est synchronisée, sans conflit, sans écriture en cours et avec bêta active. Le rôle \`read\` ne peut pas confirmer un ajout ; il peut consulter les propositions.
- **Revalidation juste avant le second clic** : une capture sur le bouton natif interrompt l’ajout si le voyage, la sélection, les permissions, la révision ou l’empreinte du programme ont changé ; le plafond de 50 étapes par jour est contrôlé. En cas de conflit, il faut relancer la proposition.
- Les tokens Supabase et les identifiants de sessions ne sont jamais transmis à l’assistant ou au module de proposition. L’empreinte est un détecteur local de changement (non un jeton d’autorisation) ; la vérification des droits continue d’être assurée par les contrôles Planner et par les RPC côté serveur.
- La validation finale / publication du carnet reste réservée à l’organisateur via les contrôles V5 existants. Les propositions créent des étapes **non validées**, elles ne finalisent jamais un programme.

## Limites connues

1. **7 correspondances sûres** seulement entre 50 lieux Il Volo et 83 entrées Planner (4 exactes, 3 alias vérifiés). La profondeur des recommandations reste donc limitée, même si les réponses de connaissance Il Volo couvrent plus de lieux. Il faut enrichir le catalogue canonique par revue éditoriale, sans ajouter d’alias automatiquement.
2. Les distances utilisées sont géodésiques et servent seulement au filtrage/tri. Aucune durée, ouverture, disponibilité ou faisabilité routière n’est garantie.
3. Un itinéraire constitué de plusieurs étapes exige **une confirmation par étape** et ne produit pas encore de parcours multi-jours ; la répartition en jours est choisie dans le dialogue existant.
4. Le backend Supabase réel **n’est pas sollicité** pendant ce chantier ; les tests de rôles et conflits sont locaux et doivent être rejoués sur un Lab hébergé réellement distinct et des appareils physiques avant publication.

## Tests

\`\`\`sh
npm ci --ignore-scripts
npm test
node tests/a06-proposals.cjs
python3 build-locales.py
\`\`\`

\`tests/a06-proposals.cjs\` charge le véritable Planner V5 sous JSDOM sur les quatre langues, puis les modules A06, avec un voyage synthétique. Il vérifie la proposition sans écriture, les suggestions reliées, les deux confirmations distinctes, le refus lecteur, l’autorisation éditeur synchronisé, le refus en conflit, le changement d’état et la révocation entre la préparation et le clic final.

**Aucun utilisateur, voyage réel, invitation, permission cloud ou table Supabase n’a été modifié.**
