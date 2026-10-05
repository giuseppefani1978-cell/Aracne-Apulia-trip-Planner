# Shared trips — V2.2 pilot

## User flow

Open “Préparer à plusieurs”, read what is included and enable sharing. Copy an
editing or viewing link to invite others. Only the organiser keeps the administrator
link; it permits invitation rotation and online deletion. No participant account.
The ordinary WhatsApp text export remains a snapshot, separate from collaboration.

Participants, expenses, itinerary and explicit group notes synchronize. Private
notes and photos do not leave the device through this feature. Existing local trips
are backed up before joining. Backup download includes personal notes, so keep it
private. A backup does not include administrator credentials.

## Architecture

GitHub Pages remains the frontend. `dist/shared-trips.js` calls one Supabase RPC
using a public publishable key (not a service-role key). Tables live in the private
`aracne_private` schema, with RLS and no browser-role table/schema permissions.
The narrowly scoped SECURITY DEFINER RPC verifies 256-bit capability tokens on
EVERY operation. Token hashes only are stored server-side. No trip-list endpoint.
The anonymous role is intentionally granted RPC execution for account-free use.
Supabase advisor warnings about that function and the policy-free private table
are expected for this capability model; access tests verify the boundary.
See https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
and https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

Links use URL fragments, are removed after joining and are sent in HTTPS request
bodies. Browser storage holds each device's credential. These are bearer links,
not end-to-end encryption. Anyone holding one has its rights. Revocation prevents
future access but cannot erase a copy already downloaded. Keep the administrator
link somewhere private to recover control after clearing browser storage.

Each document has a revision. Writes lock the row and compare the expected revision;
stale writes are rejected. There is no automatic merge. The UI preserves the local
draft on conflict and offers to back it up before loading the current group copy.
Offline changes remain local and retry on reconnection. Polling every five seconds
while visible pauses incoming updates during input or an open modal.

Pilot limits: 512 KiB per document; 1,000 stored trips; 30 creations/hour globally.
These are bounds on anonymous creation, not a comprehensive anti-abuse system.
The owner can delete an online trip. There is no automatic expiry yet. Free-plan
capacity and inactivity suspension should be considered before broad public launch.

## Verification

`JSDOM_PATH=/tmp/aracne-shared-tests/node_modules/jsdom node tests/shared.live.cjs`
runs UI code in five isolated DOM/storage sessions against the live Supabase API,
using temporary synthetic trip data and deleting its trip afterward. Covers four
languages, personal-note exclusion, viewer write denial, concurrent revision
conflicts, backup/load, offline retry, reload, rotation and invalid credentials.
`tests/v2.dom.cjs` verifies earlier features in all four languages.

A transaction-rolled-back SQL test also checked owner-only delete/rotate, denied
wrong tokens, revision mismatch and server-side filtering of private notes.
These tests do not replace an iPhone Safari check on two real phones.
