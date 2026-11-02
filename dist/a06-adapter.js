/* A06 · Adaptateur en lecture seule. Aucun accès aux données de voyage.
 * Source moteur: Il Volo di Aracne 1.1.9 (copie figée).
 * Les 50 POIs Il Volo conservent leurs identifiants propres et ne sont
 * JAMAIS injectés directement dans le catalogue ou les sauvegardes Planner.
 */
(() => {
  'use strict';
  const supported = new Set(['fr', 'it', 'en', 'es']);
  const engine = window.AracneIntelligence;
  const knowledge = window.AracneKnowledgeBase;
  const places = window.A06IlVoloPlaces;
  if (!engine || !knowledge || !Array.isArray(places)) return;

  const clean = text => String(text || '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  let currentLanguage = supported.has(document.documentElement.lang)
    ? document.documentElement.lang : 'fr';

  const bridge = Object.freeze({
    getLanguage: () => currentLanguage,
    getVoiceLanguage: () => currentLanguage,
    getCurrentSection: () => 'mapSheet',
    getPlaces: () => places,
    getBusinesses: () => [],
    getKnowledge: id => knowledge.get(id),
    getKnowledgeSources: id => knowledge.sourcesFor(id),
    getTerritoryKnowledge: id => knowledge.getTerritory(id),
    getTerritorySources: id => knowledge.territorySourcesFor(id),
    getTerritoryPoiIds: id => knowledge.poisForTerritory(id),
    findTerritories: (text, lang) => knowledge.findTerritories(text, lang),
    findPlaces: text => {
      const q = clean(text);
      return places.filter(place => {
        const n = clean(place.name);
        return n.length >= 4 && q.includes(n);
      });
    },
    findExactPlaces: text => {
      const q = clean(text);
      return places.filter(place => {
        const n = clean(place.name);
        return n.length >= 5 && q.includes(n);
      });
    }
    // Deliberately NO addPlace, openPlace, createRouteFromText,
    // runTool, nearMe, journal, navigation, saveAnswer or access to Planner state.
  });

  engine.connect(bridge);

  const blocked = Object.freeze({
    fr: 'Cette première version donne des informations touristiques, mais ne modifie pas encore votre voyage. Vous pourrez bientôt valider explicitement chaque suggestion avant de l’ajouter au programme.',
    it: 'Questa prima versione fornisce informazioni turistiche, ma non modifica ancora il viaggio. Presto potrai confermare ogni suggerimento prima di aggiungerlo al programma.',
    en: 'This first version provides tourist information but does not change your trip yet. You will be able to confirm each suggestion before adding it to your itinerary.',
    es: 'Esta primera versión ofrece información turística, pero todavía no modifica el viaje. Pronto podrás confirmar cada sugerencia antes de añadirla al programa.'
  });
  const unknown = Object.freeze({
    fr: 'Posez une question sur Bari, le Gargano, la Vallée d’Itria, la Murgia, Trani ou le Salento. Cette base territoriale ne consulte pas Internet en direct.',
    it: 'Fai una domanda su Bari, Gargano, Valle d’Itria, Murgia, Trani o Salento. Questa base territoriale non consulta Internet in diretta.',
    en: 'Ask about Bari, Gargano, Itria Valley, Murgia, Trani or Salento. This local knowledge base does not search the live Internet.',
    es: 'Pregunta por Bari, Gargano, Valle de Itria, Murgia, Trani o Salento. Esta base territorial no realiza búsquedas en Internet en tiempo real.'
  });
  const forbiddenIntents = new Set([
    'route', 'add', 'open', 'near_me', 'scope', 'journal', 'journal_save',
    'navigate', 'route_clear', 'route_remove', 'route_mode'
  ]);
  function language(lang) {
    return supported.has(lang) ? lang : currentLanguage;
  }
  function setLanguage(lang) {
    currentLanguage = language(lang);
    engine.resetContext();
  }
  async function ask(rawQuestion, lang) {
    const question = String(rawQuestion || '').trim().slice(0, 600);
    const resolvedLang = language(lang || document.documentElement.lang);
    if (resolvedLang !== currentLanguage) setLanguage(resolvedLang);
    if (!question) return {ok:false, language:resolvedLang, text:unknown[resolvedLang], sources:[]};
    const analysis = engine.analyze(question);
    // The original engine was built inside Hirundu and contains mutations.
    // Reject *before execution* whenever any action/tool is requested.
    const unsafe = (analysis.intents || []).some(intent => forbiddenIntents.has(intent)) ||
      (analysis.toolRequests || []).length > 0 ||
      Boolean(analysis.capabilityQuery);
    if (unsafe) {
      return {ok:false, blocked:true, language:resolvedLang, text:blocked[resolvedLang], sources:[]};
    }
    // The structured, region-wide index extends Il Volo without rewriting its
    // original 1.1.9 engine or breaking the historical Salento knowledge.
    const regional = window.A06PugliaKnowledge?.answer?.(question,resolvedLang);
    const cleanText = value=>String(value||'').replace(/\\bHIRUNDU\\b/gi,'Aracne Intelligence');
    const q=clean(question);
    const specificLegacy=places.some(p=>{
      const name=clean(p.name);
      return name.length>=6 && (' '+q+' ').includes(' '+name+' ');
    });
    if(regional && !specificLegacy){
      return {ok:true,language:resolvedLang,
        text:regional.text,places:[],plannerPlaces:regional.plannerPlaces||[],
        sources:(regional.sources||[]).map(({title,url,quality})=>({title,url,quality})),
        region:regional.zone,knowledgeSource:'puglia-structured-0.4',days:regional.days};
    }
    const response = await engine.execute(question);
    // Do not expose internal actions: informational text is the only output.
    const ids = new Set((response.places || analysis.places || []).map(place => place.id));
    const sources = [];
    for (const id of ids) {
      for (const item of knowledge.sourcesFor(id).slice(0, 3)) {
        if (!item || !/^https:\/\//i.test(item.url || '')) continue;
        if (sources.some(existing => existing.url === item.url)) continue;
        sources.push({title:String(item.title || item.publisher || 'Source'), url:item.url});
      }
      if (sources.length >= 4) break;
    }
    return {
      ok: response.ok !== false,
      language:resolvedLang,
      text: cleanText(response.text || unknown[resolvedLang]).slice(0, 6000),
      sources:sources.slice(0, 4),
      places:[...ids].slice(0, 12)
    };
  }
  window.A06TourismAssistant = Object.freeze({
    version:'0.1.0-readonly',
    engineVersion:engine.version,
    ask, setLanguage,
    stats:() => Object.freeze({...knowledge.stats(), plannerWrites:0, places:places.length,...(window.A06PugliaKnowledge?.stats?.()||{})})
  });
})();
