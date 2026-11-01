// Portail public Aracne : vérifications statiques sans dépendance.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'portal', 'index.html'), 'utf8');

assert.match(html, /<article class="portal planner">/);
assert.match(html, /<article class="portal game">/);
assert.match(html, /<a class="action" href="https:\/\/myapuliatrip\.com\/dist\/index\.html" data-live="planner"/);
assert.match(html, /<a class="action" href="https:\/\/play\.myapuliatrip\.com\/" data-live="hirundu"/);
assert.equal((html.match(/data-live="/g) || []).length, 2);
assert.doesNotMatch(html, /<script[^>]+src=/i, 'Le portail ne doit charger aucun code distant.');
assert.doesNotMatch(html, /supabase\.co|service_role|secret_key/i, 'Pas de credentials ni de backend dans le portail.');
console.log('PASS portal links: 2 destinations, aucun backend ni script distant');
