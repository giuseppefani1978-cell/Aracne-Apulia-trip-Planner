/* A06.2 — matching prudent des 50 lieux Il Volo et du catalogue Planner.
 * Aucun accès à state, voyages, invitations, Supabase ou aux mutations.
 */
(() => {
  'use strict';
  const source = window.A06IlVoloPlaces;
  const planner = window.A06PlannerCatalog;
  if (!Array.isArray(source) || typeof planner?.list !== 'function') return;

  const normalize = value => String(value ?? '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’‘']/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const coords = p => p && finite(p.lat) &&
    finite(p.lon === undefined ? p.lng : p.lon) &&
    Math.abs(p.lat) <= 90 &&
    Math.abs(p.lon === undefined ? p.lng : p.lon) <= 180;
  const haversine = (a,b) => {
    if (!coords(a) || !coords(b)) return null;
    const toRad = value => value * Math.PI / 180;
    const lat = toRad(b.lat - a.lat);
    const lon = toRad(b.lon - a.lng);
    const x = Math.sin(lat/2)**2 + Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) * Math.sin(lon/2)**2;
    return 6371 * 2 * Math.atan2(Math.sqrt(Math.max(0,x)), Math.sqrt(Math.max(0,1-x)));
  };
  const coreName = value => normalize(String(value ?? '').split(/,| · /)[0]);
  const safePlanner = () => {
    const items = planner.list();
    if (!Array.isArray(items)) return [];
    return items.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string');
  };
  const byId = new Map(source.map(p => [p.id,p]));
  function match(ilId) {
    const il = byId.get(ilId);
    if (!il) return null;
    const base = { ilId: il.id, ilName: il.name, status: 'unmatched', plannerId: null, plannerName: null, distanceKm: null, reason: 'no-exact-correspondence' };
    if (!coords(il)) return { ...base, reason: 'missing-source-coordinates' };
    const candidates = safePlanner()
      .filter(coords)
      .map(p => {
        const distanceKm = haversine(il,p);
        const exact = normalize(il.name) === normalize(p.name);
        const alias = !exact && coreName(il.name) === coreName(p.name);
        const category = exact ? 'exact' : alias ? 'alias' : null;
        // Identity relies on the name plus a compatible coordinate, never a
        // raw nearest-neighbour match (a hotel near a church is not the church).
        if (!category || distanceKm === null) return null;
        if (category === 'exact' && distanceKm > 5) return null;
        if (category === 'alias' && distanceKm > 4) return null;
        return {id:p.id,name:p.name,category,distanceKm};
      })
      .filter(Boolean)
      .sort((a,b) => (a.category === b.category ? a.distanceKm-b.distanceKm : a.category === 'exact' ? -1 : 1));
    if (!candidates.length) return base;
    if (candidates.length > 1 && candidates[0].category === candidates[1].category)
      return {...base,status:'ambiguous',reason:'multiple-matching-places'};
    const choice=candidates[0];
    return {...base,status:'matched',plannerId:choice.id,plannerName:choice.name,
      matchType:choice.category,distanceKm:Math.round(choice.distanceKm*100)/100,
      reason:choice.category==='exact'?'name-and-location':'conservative-alias-and-location'};
  }
  function matchMany(ids) {
    if (!Array.isArray(ids)) return [];
    const seen = new Set();
    return ids.filter(id => typeof id === 'string' && !seen.has(id) && seen.add(id))
      .slice(0, 30).map(match).filter(Boolean);
  }
  function summary() {
    const matches = matchMany(source.map(p=>p.id));
    return Object.freeze({
      sourceCount:source.length, plannerCount:safePlanner().length,
      mapped:matches.filter(x=>x.status==='matched').length,
      exact:matches.filter(x=>x.matchType==='exact').length,
      alias:matches.filter(x=>x.matchType==='alias').length,
      unmatched:matches.filter(x=>x.status==='unmatched').length,
      ambiguous:matches.filter(x=>x.status==='ambiguous').length
    });
  }
  window.A06PlaceMatcher = Object.freeze({version:'0.2.0', match, matchMany, summary});
})();