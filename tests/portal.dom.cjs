'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const markup = fs.readFileSync(path.join(__dirname, '..', 'portal', 'index.html'), 'utf8');
const consoleMessages = [];
const vc = new VirtualConsole();
vc.on('jsdomError', err => consoleMessages.push(err.message));
const dom = new JSDOM(markup, {
  url: 'https://preview.aracne.invalid/portal/index.html',
  runScripts: 'dangerously',
  virtualConsole: vc,
  beforeParse(window) {
    window.scrollTo = () => {};
    window.fetch = () => { throw Error('No network calls allowed in portal'); };
    window.XMLHttpRequest = class { open() { throw Error('No XMLHttpRequest allowed'); } };
  }
});
const { document, location } = dom.window;
const current = () => [...document.querySelectorAll('.view.active')].map(el => el.id);
const activate = target => document.querySelector(target).click();
assert.deepEqual(current(), ['home'], 'Portal opens on common landing');
assert.equal(document.querySelectorAll('article.portal').length, 2, 'Two independent experiences');
assert.equal(document.querySelector('[data-live="planner"]').getAttribute('href'), 'https://myapuliatrip.com/dist/index.html');
assert.equal(document.querySelector('[data-live="hirundu"]').getAttribute('href'), 'https://play.myapuliatrip.com/');
activate('[data-route="architecture"]');
assert.deepEqual(current(), ['architecture']);
assert.equal(location.hash, '#/architecture');
activate('[data-route="home"]');
assert.deepEqual(current(), ['home']);
activate('button[data-route="voyage"]');
assert.deepEqual(current(), ['voyage']);
activate('[data-tab="carnet"]');
assert.equal(document.getElementById('p-carnet').classList.contains('show'), true);
activate('[data-tab="intelligence"]');
assert.equal(document.getElementById('p-intelligence').classList.contains('show'), true);
activate('[data-route="home"]');
activate('button[data-route="hirundu"]');
assert.deepEqual(current(), ['hirundu']);
activate('#simulate-game');
assert.notEqual(document.getElementById('game-notice').style.display, 'none');
assert.equal(consoleMessages.length, 0, consoleMessages.join('\n'));
assert.equal(document.querySelectorAll('script[src], iframe, form').length, 0, 'Isolated and read-only landing');
console.log('PASS portal DOM: routes, two universes, tabs, game demo, no external scripts or errors');
dom.window.close();
