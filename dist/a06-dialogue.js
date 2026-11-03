/* A06.6 — In-memory, read-only tourism dialogue.
 * Uses A06's already isolated adapter. No cloud calls, user data, bookings,
 * trip changes or storage. Il Volo 1.1.9 stays frozen for detailed Salento facts.
 */
(() => {
 'use strict';
 const adapter=window.A06TourismAssistant,knowledge=window.A06PugliaKnowledge;
 if(!adapter||!knowledge)return;
 const langs=['fr','it','en','es'];
 const norm=value=>String(value||'').normalize('NFD').toLowerCase()
   .replace(/[\u0300-\u036f]/g,'').replace(/[’‘']/g,' ')
   .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
 const copy={
  fr:{east:"La côte adriatique traverse plusieurs régions des Pouilles. Quelle partie t'intéresse : le Gargano (nord), Bari et ses environs (centre), Brindisi, ou Otranto et le Salento (sud) ?",general:"Quelle région des Pouilles souhaites-tu explorer : Gargano, Bari, Vallée d'Itria, Murgia, Trani ou Salento ?",rephrase:"Je n'ai pas identifié assez précisément ta demande. Peux-tu citer une ville, une zone ou un thème (plages, patrimoine, nature) ?",continue:"Tu souhaites explorer quel endroit des Pouilles ?",place:"à",see:"Que voir",beaches:"Quelles plages voir",nature:"Quels lieux de nature visiter",food:"Que découvrir côté gastronomie",history:"Quel patrimoine découvrir",other:"Que découvrir",days:"jours"},
  it:{east:"La costa adriatica attraversa più zone della Puglia. Quale parte vuoi esplorare: Gargano (nord), Bari (centro), Brindisi o Otranto e Salento (sud)?",general:"Quale zona della Puglia ti interessa: Gargano, Bari, Valle d'Itria, Murgia, Trani o Salento?",rephrase:"Non ho capito abbastanza bene. Puoi indicare un paese, una zona o un tema (spiagge, storia, natura)?",continue:"Quale luogo della Puglia vorresti esplorare?",place:"a",see:"Cosa vedere",beaches:"Quali spiagge visitare",nature:"Quali luoghi naturali visitare",food:"Cosa scoprire sulla gastronomia",history:"Quale patrimonio scoprire",other:"Cosa scoprire",days:"giorni"},
  en:{east:"Puglia's Adriatic coast covers several areas. Which part do you mean: Gargano (north), Bari (central coast), Brindisi, or Otranto and Salento (south)?",general:"Which part of Puglia interests you: Gargano, Bari, Itria Valley, Murgia, Trani or Salento?",rephrase:"I couldn't identify your request clearly enough. Could you name a town, region or theme (beaches, heritage, nature)?",continue:"Which place in Puglia would you like to explore?",place:"in",see:"What to see",beaches:"Which beaches to visit",nature:"Which natural places to visit",food:"What to explore about local food",history:"Which heritage sites to see",other:"What to explore",days:"days"},
  es:{east:"La costa adriática atraviesa varias zonas de Apulia. ¿Qué parte te interesa: Gargano (norte), Bari (centro), Brindisi u Otranto y Salento (sur)?",general:"¿Qué zona de Apulia quieres explorar: Gargano, Bari, Valle de Itria, Murgia, Trani o Salento?",rephrase:"No he entendido suficientemente tu petición. ¿Puedes indicar una ciudad, zona o tema (playas, patrimonio, naturaleza)?",continue:"¿Qué lugar de Apulia quieres explorar?",place:"en",see:"Qué ver",beaches:"Qué playas visitar",nature:"Qué lugares naturales visitar",food:"Qué descubrir sobre gastronomía",history:"Qué patrimonio visitar",other:"Qué descubrir",days:"días"}
 };
 let state={language:null,zone:null,anchorId:null,theme:null,days:null,pending:null,turns:[]};
 let queue=Promise.resolve();
 const namedZones=Object.freeze({
  gargano:/\b(?:gargano|daunia|foggia|vieste|peschici|tremiti)\b/,
  imperiale:/\b(?:trani|barletta|andria|castel del monte|puglia imperiale)\b/,
  bari:/\b(?:bari|polignano|monopoli|giovinazzo)\b/,
  itria:/\b(?:itria|alberobello|locorotondo|ostuni|martina franca|cisternino)\b/,
  murgia:/\b(?:murgia|taranto|altamura|gravina|laterza)\b/,
  salento:/\b(?:salento|otranto|lecce|gallipoli|brindisi|leuca|porto cesareo)\b/
 });
 const eastCoast=/(?:cote est|cote orientale|cote adriatique|costa est|costa orientale|costa adriatica|east coast|eastern coast|adriatic coast|costa del este|costa oriental)/;
 const routeWords=/(?:parcours|itineraire|circuit|percorso|itinerario|tragitto|itinerary|route|road trip|recorrido|ruta)/;
 const vague=/^(?:et|aussi|encore|et apres|et ensuite|autre chose|quoi d autre|cosa altro|what else|anything else|y despues|y luego)[\s?!.]*$/;
 const followup=/(?:^et\b|^aussi\b|^sinon\b|^plutot\b|^et pour\b|^what about\b|^and\b|^also\b|^instead\b|^more\b|^e invece\b|^e per\b|^anche\b|^y\b|^y para\b|^tambien\b|^mas\b|^plus au nord\b|^plus au sud\b)/;
 const themes=[
  ['beaches',/(?:plag|spiagg|beach|playa|baign|bagn|swim|mare\b|mer\b)/],
  ['nature',/(?:natur|foret|forest|bosco|woodland|hiking|randonn|sender|sentier|parc\b|park\b|parque\b)/],
  ['food',/(?:gastronom|cuisin|mang|mangiare|food|eat|comer|vino|wine|restaurant)/],
  ['history',/(?:histoi|stori|history|heritage|patrim|monum|archite|cultur|musee|museo|museum|castell)/]
 ];
 function themeOf(q){return themes.find(([,p])=>p.test(q))?.[0]||null}
 function daysOf(q){const x=q.match(/\b(\d{1,2})\s*(?:jours?|giorni?|days?|dias?)\b/);return x&&+x[1]<=14&&+x[1]>=1?+x[1]:null}
 function zoneOf(q){
  const detected=knowledge.findFocus(q);
  if(detected?.zone)return detected;
  const matches=Object.entries(namedZones).filter(([,p])=>p.test(q));
  return matches.length===1?{zone:matches[0][0],anchor:null}:{zone:null,anchor:null};
 }
 function simpleChoice(question){
  const q=norm(question);
  const specific=zoneOf(q);
  if(specific.zone)return specific;
  if(/\b(?:nord|north|norte|settentrionale)\b/.test(q))return{zone:'gargano',anchor:null};
  if(/\b(?:centre|centro|central|middle)\b/.test(q))return{zone:'bari',anchor:null};
  if(/\b(?:sud|south|sur|meridionale)\b/.test(q))return{zone:'salento',anchor:null};
  return {zone:null,anchor:null};
 }
 const labels={
   gargano:{fr:'Gargano',it:'Gargano',en:'Gargano',es:'Gargano'},
   imperiale:{fr:'Trani',it:'Trani',en:'Trani',es:'Trani'},
   bari:{fr:'Bari',it:'Bari',en:'Bari',es:'Bari'},
   itria:{fr:"Vallée d'Itria",it:"Valle d'Itria",en:'Itria Valley',es:'Valle de Itria'},
   murgia:{fr:'Murgia',it:'Murgia',en:'Murgia',es:'Murgia'},
   salento:{fr:'Salento',it:'Salento',en:'Salento',es:'Salento'}
 };
 function clarification(language,kind){
  const t=copy[language],questions={east:t.east,region:t.general,repeat:t.rephrase};
  state.pending={kind,at:state.turns.length};
  const response={ok:true,language,text:questions[kind]||t.rephrase,clarification:kind,
   sources:[],places:[],plannerPlaces:[],knowledgeSource:'dialogue-clarification'};
  state.turns.push({kind:'clarification',zone:state.zone});
  state.turns=state.turns.slice(-4);
  return response;
 }
 function compose(q,language,zone,theme,days,anchorId){
  const t=copy[language];
  const label=anchorId?knowledge.getPlace(anchorId)?.name:(labels[zone]?.[language]||labels[zone]?.fr);
  if(!label)return q;
  const lead=theme==='beaches'?t.beaches:theme==='nature'?t.nature:theme==='food'?t.food:theme==='history'?t.history:t.see;
  return lead+' '+t.place+' '+label+(days?' '+days+' '+t.days:'')+' ?';
 }
 function reset(){state={language:null,zone:null,anchorId:null,theme:null,days:null,pending:null,turns:[]}}
 async function run(rawQuestion,lang='fr'){
  const language=langs.includes(lang)?lang:'fr',question=String(rawQuestion||'').trim().slice(0,600),q=norm(question),t=copy[language];
  if(state.language && state.language!==language)reset();
  state.language=language;
  if(!q)return clarification(language,'repeat');
  const explicit=zoneOf(q),theme=themeOf(q),days=daysOf(q),pending=state.pending;
  const hasEast=eastCoast.test(q);
  if(hasEast&&!explicit.zone)return clarification(language,'east');
  if(pending&&pending.kind==='east'){
    const choice=simpleChoice(q);
    if(!choice.zone){
      if(vague.test(q)||q.length<4)return clarification(language,'east');
      if(q.includes('cote')||q.includes('costa')||q.includes('coast'))return clarification(language,'east');
      if(!explicit.zone)return clarification(language,'east');
    }
    if(choice.zone){state.pending=null;state.zone=choice.zone;state.anchorId=choice.anchor?.id||null}
  }else if(pending&&pending.kind==='region'){
    if(!explicit.zone){
      // Don't interpret a vague reply as permission to select a random region.
      return clarification(language,'region');
    }
    state.pending=null;
  }else if(pending){state.pending=null}
  let focus=zoneOf(q);
  if(!focus.zone && state.zone && (pending?.kind==='east'||followup.test(q)||vague.test(q)||q.length<13)){
    focus={zone:state.zone,anchor:state.anchorId?knowledge.getPlace(state.anchorId):null};
  }
  // A route is never committed in dialogue; keep the A06.3 explicit preview button.
  // Do not fabricate a route without location: ask for the missing region.
  if(routeWords.test(q)&&!focus.zone&&!state.zone)return clarification(language,'region');
  if(!focus.zone){
    if(/\b(?:puglia|pouilles|apulia|apulie|puglie)\b/.test(q)&&
      (/\b(?:visiter|voir|explorer|visit|see|explore|ver|vedere|visitare)\b/.test(q)||q.length<=30))
      return clarification(language,'region');
    if(followup.test(q)||vague.test(q)||q.length<12)return clarification(language,'region');
  }
  let effectiveQuestion=question;
  const relative=pending?.kind==='east'||!explicit.zone&&(followup.test(q)||vague.test(q)||q.length<13);
  if(focus.zone && relative){
    effectiveQuestion=compose(question,language,focus.zone,theme||state.theme,days||state.days,focus.anchor?.id||state.anchorId);
  }
  // The old engine still provides native Salento conversational mechanisms.
  // The adapter's existing forbidden-intent gate remains authoritative.
  const answer=await adapter.ask(effectiveQuestion,language);
  if(answer.ok && focus.zone && !answer.blocked){
    state.zone=focus.zone;
    state.anchorId=focus.anchor?.id||null;
    state.theme=theme||state.theme;
    state.days=days||state.days;
    state.pending=null;
  } else if(!answer.ok&&!answer.blocked && !focus.zone){
    return clarification(language,'repeat');
  }
  state.turns.push({kind:'answer',zone:state.zone,theme:state.theme});
  state.turns=state.turns.slice(-4);
  return {...answer,resolvedQuestion:effectiveQuestion,conversation:true};
 }
 // Calls from UI serialize to avoid interleaving the small in-memory dialogue.
 function ask(question,language){
  const next=queue.then(()=>run(question,language));
  queue=next.catch(()=>{});
  return next;
 }
 window.A06Conversation=Object.freeze({version:'0.6.0',ask,reset,
   context:()=>Object.freeze({zone:state.zone,anchorId:state.anchorId,
    theme:state.theme,days:state.days,pending:state.pending?.kind||null,
    turns:state.turns.length,language:state.language})
 });
})();