> Historical V2 design. V2.2 now connects Supabase; see [SHARED-TRIPS.md](SHARED-TRIPS.md) for current behavior.

# V2 — collaboration: service not yet connected

This branch keeps the existing device-local saves. It does **not** synchronize phones.
WhatsApp shares a text snapshot. Private notes and expenses are excluded from that snapshot.

## Proposed account-free model

- One server-side trip record, identified by a random ID. The trip title is not a password.
- Distinct owner, contributor and read-only capabilities, with cryptographically random
  tokens (at least 128 bits). Store token hashes server-side, never tokens in public Git.
- A URL fragment can carry a capability without sending it in ordinary HTTP URL logs.
  This does not by itself encrypt data. The app sends credentials over HTTPS to the API.
- Anyone holding an invitation can exercise its rights. Warn before sharing, allow
  owner revocation/rotation, set retention and deletion policies. No public trip index.
- Private notes remain device-local; group notes and agreed trip data are synchronized.
- Check permissions server-side on every request; use strict input limits, rate limits,
  restricted CORS, no tokens in analytics, and no third-party code access to shared secrets.
- Handle simultaneous changes with entity-level operations, revisions and conflict responses;
  never overwrite a newer trip with a stale full local snapshot. Offline edits remain
  explicitly pending until acknowledged. Preserve old local drafts before joining a group.
- Test five isolated browser sessions: create, join, concurrent edits, refresh, offline
  reconnect, read-only denial, revoke and deletion. Do not claim production collaboration
  before those tests run against the deployed service.

## Decision required

Choose/authorize a backend and its hosting account (for example a small Cloudflare Worker
with transactional storage, or a Supabase-backed API). GitHub Pages remains the static front
end, but cannot itself accept shared trip writes. Provisioning, quotas, retention, privacy
terms and ownership need agreement. No paid service or account has been created here.

## Timing and catalog limits in this iteration

- 37 original places + 16 curated additions = 53; not a regional exhaustive directory.
- 5 named spas/thermal establishments and 4 named boat offers, with source links.
- All catalog pins are approximate. Ask providers for exact boarding/access points.
- Suggested on-site durations are editorial allowances, not guaranteed service durations.
- Driving travel allowances use great-circle km × 1.35 / 45 km/h + 10 minutes,
  rounded up to 5 minutes. They are **not** routing results; no live traffic or ferry data.
- No invented transit or Tremiti transfer times. Missing legs make totals incomplete.
- User-entered transfers are bound to predecessor ID and transport mode, so changing
  the order or mode does not reuse the wrong transfer time.
- Totals exclude hotel-to-first and last-to-hotel unless added as explicit steps.
