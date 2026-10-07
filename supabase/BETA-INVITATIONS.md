# Personal beta invitations

The administrator creates one organizer access plus a configurable invitation and reserve quota (UI defaults: 4 + 2). Existing codes retain access with a zero quota until an administrator selects “Régler les invitations”. Guest codes have a permanent parent organizer and no delegation quota, independent of the trips they create.

Organizers use Invite → prepare a personal link → WhatsApp. The link carries the trip capability and beta code in its fragment. The access gate asks for a nickname, activates one browser, consumes only the beta fragment parameter and reloads to join the trip. Existing testers join without consuming the new invitation.

Slots are available, prepared, activated, expired or revoked. Unused invitations expire after 14 days and can be cancelled/replaced. Activated slots cannot be recycled. Prepared links are recoverable by their organizer without storing raw codes. Codes are hashed; HMAC derives recoverable slot codes from the organizer's existing browser token and slot generation. Tokens remain browser-bound, as in the previous beta. A nickname is not a verified identity.

Applied server scripts, in order:
1. `beta-invitation-quotas.sql` adds private quota structures and an invoker-only helper with no public execute grant.
2. `beta-api-with-invitations.sql` preserves existing beta API actions and adds invitation dispatch plus guest activation checks.

Verification: `tests/beta-invitations.server.sql` runs random isolated fixtures in a transaction and rolls back; `tests/beta-invitations.dom.cjs` checks the UI and gate. No tester codes or sessions are included in this repository.

Security advisor informational messages for RLS without policies are intentional on private tables accessed only through the capability-checked API. Existing public trip/workspace SECURITY DEFINER warnings predate these changes and are outside this change. No new public definer endpoint is introduced. Reference: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
