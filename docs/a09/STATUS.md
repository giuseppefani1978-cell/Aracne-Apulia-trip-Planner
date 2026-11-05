# A09 consolidation — 5 November 2026

## Delivered
Based on A08.6 b0cde89. Restores the separate A01–A05 synthetic database and network-isolation harness without overwriting Intelligence or Planner application code. Restores fail-closed guards on historical live tests, ignored local builds/config/backups, and CI on ubuntu-24.04 with all local SQL and Chromium suites. Browser tests accept an optional ARACNE_CHROMIUM_PATH executable.

## Validation
| Check | Result |
|---|---|
| npm test | PASS, historical DOM and A06–A08 four-language suites |
| npm run test:lab | PASS, isolation, SQL roles, private notes, revisions, compatibility guard, invitations, recovery, stale trip read |
| npm run build | Completes, but regenerates 8 tracked dist files differently; generated changes discarded pending reconciliation |
| npm audit --omit=dev | Zero reported vulnerabilities; development dependencies not covered |
| Browser/UI | BLOCKED locally: Chromium socket creation denied by execution environment; CI still required |
| Physical iPhone/Android and microphone | Not performed |
| Cloud collaboration / PostgREST | Not performed |

The SQL baseline and guard are restored unchanged from the prior isolated branch. Passing synthetic tests is not a fresh complete review of the live functions or proof of deployed protection. No SQL applied to any hosted database.

## Merge strategy
This draft targets develop and includes the cumulative A08.6 changes plus the isolated harness. See branch-inventory.md. Do not merge the historical stack independently and then this cumulative draft without reconciling overlap. Portal branch remains separate. No automatic merge or deployment.

## Next work and release gates
1. Reconcile build-locales.py output with checked-in dist; verify regenerated application before accepting changes.
2. Obtain successful browser CI and exercise the A08.6 preview end-to-end, including keyboard/map/back navigation.
3. Extend access-control and concurrent-write tests; complete privileged-function review and prepare reviewed rollback for the legacy guard.
4. Physical-device checklist: open synthetic trip; ask Bari question; follow up beaches; request Lecce/Gallipoli; show route; return to programme; confirm matched place; change trip; dictate/cancel/retry; reload. Repeat FR/IT/EN/ES and verify no unintended additions or stale trip data.
5. Design isolated cloud acceptance with synthetic fixtures, PostgREST and two browsers; provisioning remains deferred.

A09 is in progress, not accepted. No public deployment, production merge, paid infrastructure, or live data access occurred in this step. A10 depends on closing these gates.
