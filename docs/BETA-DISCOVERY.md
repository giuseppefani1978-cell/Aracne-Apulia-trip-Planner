# Aracne — beta discovery and personal WhatsApp invitations

The public discovery page is `/decouvrir/` (root `decouvrir/index.html`). It is independent of the app, which remains at `/dist/index.html`. The GitHub Pages root `index.html` redirect and all invitation deep links remain unchanged.

- Admin → organiser invitation: direct code-carrying URL, no presentation page.
- Organiser → guest invitation: direct URL with `trip`, `key` and `beta` parameters in the fragment. First-time invitees enter only a name/pseudonym; the access code is hidden and prefilled.
- The WhatsApp message is composed by `dist/beta-invitations.js` in FR/IT/EN/ES with the active trip name. Read-only invitations do not suggest editing.
- Native sharing uses the same message; Copy Link continues to copy the raw personal URL only. No automatic messaging or broadcast is performed.
- Public page can be shared separately. It does not ask for codes or automatically route invited users through itself.
- Existing visitor with a beta session can click "already activated" and enter the app. For a first-time visit the personal WhatsApp invite link must be used.

After editing `build-locales.py` or the source app, run `python3 build-locales.py` to regenerate locale entrypoints; the invitation asset version reference is retained. Tests: `node tests/beta-invitations.dom.cjs` and `node tests/discovery.dom.cjs`. Avoid modifying baseline V5.1 design.
