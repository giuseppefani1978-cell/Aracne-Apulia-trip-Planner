/* A08: A06 assistant inside isolated Planner, map navigation via A08MapBridge. */
(()=>{'use strict';
const api=window.A06TourismAssistant;
if(!api || document.getElementById('a06-open'))return;
const language=document.documentElement.lang;
const T={
 fr:{button:'Aracne Intelligence',title:'Découvrir les Pouilles avec Aracne',hint:'Posez une question touristique sur les six régions des Pouilles : lieux, nature, gastronomie, patrimoine.',placeholder:'Que voir à Otranto ?',send:'Demander',close:'Fermer',note:'Lecture seule · Ne change pas votre voyage · Sources à vérifier avant visite',examples:['Que voir à Bari ?','Nature dans le Gargano ?','Que visiter en Vallée d’Itria pendant 3 jours ?'],sources:'Sources',error:'Impossible de répondre pour le moment.'},
 it:{button:'Aracne Intelligence',title:'Scopri la Puglia con Aracne',hint:'Fai domande sulle sei zone della Puglia: luoghi, natura, cibo e patrimonio.',placeholder:'Cosa vedere a Otranto?',send:'Chiedi',close:'Chiudi',note:'Solo lettura · Non modifica il viaggio · Verifica le fonti prima della visita',examples:['Cosa vedere a Bari?','Natura nel Gargano?','Valle d’Itria in 3 giorni?'],sources:'Fonti',error:'Non posso rispondere per ora.'},
 en:{button:'Aracne Intelligence',title:'Discover Puglia with Aracne',hint:'Ask about places, nature, food and heritage throughout Puglia.',placeholder:'What to see in Otranto?',send:'Ask',close:'Close',note:'Read-only · Does not change your trip · Verify sources before visiting',examples:['What to see in Bari?','Nature in Gargano?','Itria Valley in 3 days?'],sources:'Sources',error:'Unable to answer right now.'},
 es:{button:'Aracne Intelligence',title:'Descubre Apulia con Aracne',hint:'Pregunta por lugares, naturaleza, gastronomía y patrimonio de toda Apulia.',placeholder:'¿Qué ver en Otranto?',send:'Preguntar',close:'Cerrar',note:'Solo lectura · No modifica el viaje · Verifica las fuentes antes de visitarlo',examples:['¿Qué ver en Bari?','Naturaleza en Gargano?','¿Valle de Itria en 3 días?'],sources:'Fuentes',error:'No puedo responder ahora.'}
};
const t=T[language]||T.fr;
const MT={
 fr:{title:'Étapes liées au Planner',cta:'Voir sur la carte',unmatched:'Lieu pas encore relié au catalogue du Planner',foot:'La carte s’ouvre sans modifier votre voyage. Pour ajouter une étape, utilisez ensuite la confirmation habituelle du Planner.'},
 it:{title:'Tappe collegate al Planner',cta:'Vedi sulla mappa',unmatched:'Luogo non ancora collegato al catalogo Planner',foot:'La mappa si apre senza modificare il viaggio. Per aggiungere una tappa, usa la conferma abituale del Planner.'},
 en:{title:'Places linked to Planner',cta:'Find on map',unmatched:'Not yet linked to the Planner catalogue',foot:'Opening the map does not change your trip. Add a stop later using the normal Planner confirmation.'},
 es:{title:'Lugares vinculados al Planner',cta:'Ver en el mapa',unmatched:'Lugar todavía no vinculado al catálogo Planner',foot:'Abrir el mapa no modifica el viaje. Después utiliza la confirmación habitual del Planner para añadir una etapa.'}
};
const mt=MT[language]||MT.fr;
const matcher=window.A06PlaceMatcher;

const proposer=window.A06RouteProposals;
const RT={
 fr:{button:'Proposer un parcours',title:'Proposition d’itinéraire',step:'Préparer l’ajout',read:'Lecture seule',stale:'Le voyage, les droits ou la synchronisation ont changé. Relancez la proposition.',none:'Ajoutez un lieu dans votre question pour proposer des étapes vérifiées.',pending:'Les étapes ne sont pas encore ajoutées. Confirmez-les une par une dans le Planner.'},
 it:{button:'Suggerisci un percorso',title:'Proposta di itinerario',step:'Prepara l’aggiunta',read:'Sola lettura',stale:'Il viaggio, i permessi o la sincronizzazione sono cambiati. Riprova.',none:'Specifica un luogo nella domanda per proporre tappe verificate.',pending:'Le tappe non sono state aggiunte. Conferma ogni tappa nel Planner.'},
 en:{button:'Suggest a route',title:'Itinerary suggestion',step:'Prepare to add',read:'View only',stale:'The trip, permissions or synchronization changed. Generate the proposal again.',none:'Include a place in your question to suggest verified stops.',pending:'Stops have not been added. Confirm each one separately in Planner.'},
 es:{button:'Proponer un recorrido',title:'Propuesta de itinerario',step:'Preparar la adición',read:'Solo lectura',stale:'El viaje, los permisos o la sincronización cambiaron. Vuelve a generar la propuesta.',none:'Especifica un lugar para proponer etapas verificadas.',pending:'Las etapas aún no se han añadido. Confirma cada una en Planner.'}
};
const rt=RT[language]||RT.fr;
const routeIntent=/(?:parcours|itin[ée]raire|circuit|percorso|itinerario|tragitto|itinerary|route|road\s*trip|recorrido|ruta)/i;


const style=document.createElement('style');
style.textContent=`
#a06-open{position:fixed;bottom:calc(104px + env(safe-area-inset-bottom));right:16px;z-index:890;border:0;border-radius:16px;background:#6043a4;color:#fff;box-shadow:0 10px 30px #38246042;padding:13px 17px;font-size:14px;font-weight:750;max-width:calc(100vw - 32px)}
#a06-panel[hidden]{display:none!important}
#a06-panel{position:fixed;right:16px;bottom:calc(166px + env(safe-area-inset-bottom));z-index:895;width:min(450px,calc(100vw - 32px));max-height:min(630px,calc(100dvh - 200px));background:#fff;border:1px solid #e8e3f0;border-radius:22px;box-shadow:0 20px 68px #251a4942;display:flex;flex-direction:column;overflow:hidden;color:#29213b}
#a06-panel .a06-head{padding:16px 17px;background:linear-gradient(115deg,#ede8fa,#f9f7ff);display:flex;align-items:flex-start;gap:12px}
#a06-panel .a06-head strong{display:block;font-size:17px;line-height:1.3}
#a06-panel .a06-head p{font-size:12px;margin:6px 0 0;color:#716881;line-height:1.45}
#a06-panel .a06-x{margin-left:auto;border:0;background:#fff;border-radius:10px;width:36px;height:36px;flex-shrink:0;font-size:21px}
#a06-panel .a06-samples{padding:12px;display:flex;gap:7px;overflow-x:auto}
#a06-panel .a06-example{flex-shrink:0;max-width:260px;border:1px solid #d8d1e9;border-radius:99px;background:#fff;color:#55447d;padding:8px 11px;font-size:12px}
#a06-panel .a06-out{padding:15px 16px;overflow:auto;min-height:45px;flex:1;white-space:pre-line;line-height:1.55;font-size:14px;overflow-wrap:anywhere}
#a06-panel .a06-out:empty{display:none}
#a06-panel .a06-turn{padding:9px 0 13px;border-bottom:1px solid #f0ecf5;margin-bottom:8px}
#a06-panel .a06-question{background:#eee8f9;color:#4f347c;padding:9px 12px;border-radius:15px 15px 4px 15px;max-width:93%;margin-left:auto;width:fit-content;font-weight:650;white-space:pre-wrap}
#a06-panel .a06-reply{padding:11px 1px 2px;white-space:pre-line;line-height:1.55}
#a06-panel .a06-input{min-height:58px;max-height:132px;resize:vertical;line-height:1.45}
#a06-panel .a06-voice{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:8px 12px 2px}
#a06-panel .a06-voice button{border:1px solid #d8cce9;background:#f5f1fb;color:#583d8e;border-radius:11px;font-size:12px;font-weight:700;padding:8px 10px}
#a06-panel .a06-voice button:disabled{opacity:.5}
#a06-panel .a06-voice small{font-size:11px;color:#776a88;flex:1 1 130px}
#a06-panel .a06-voice [data-listening="true"]{background:#fcebef;color:#a12c45;border-color:#f3b7c8}

#a06-panel .a06-attrib{margin-top:12px;padding-top:10px;border-top:1px solid #eee8f3;white-space:normal}
#a06-panel .a06-attrib strong{display:block;font-size:12px;margin-bottom:4px}
#a06-panel .a06-attrib a{display:block;font-size:12px;color:#654bb3;line-height:1.7;overflow-wrap:anywhere}
#a06-panel .a06-form{display:flex;gap:7px;padding:12px;border-top:1px solid #eeeaf5}
#a06-panel .a06-input{flex:1;min-width:0;border:1px solid #ddd8e8;border-radius:12px;font:inherit;padding:11px 10px;font-size:14px}
#a06-panel .a06-send{background:#6043a4;color:#fff;border:0;padding:10px 15px;border-radius:12px;font-size:13px;font-weight:700}
#a06-panel .a06-send:disabled{opacity:.55}
#a06-panel .a06-note{margin:0;padding:0 14px 12px;font-size:10px;color:#817b8f;line-height:1.35}
.a06-matches{border-top:1px solid #e5dff0;padding:11px 0 4px;white-space:normal}
.a06-matches h4{margin:0 0 8px;font-size:13px;color:#5b417f}
.a06-place{display:flex;align-items:center;gap:9px;padding:8px 0;border-top:1px solid #f0edf4}
.a06-place strong{display:block;font-size:13px;color:#30293d}
.a06-place small{display:block;font-size:11px;color:#77707e}
.a06-place button{margin-left:auto;flex-shrink:0;background:#f2ecfa;color:#543887;border:1px solid #d9c9e9;border-radius:10px;padding:9px;font-size:11px}
.a06-matches .a06-foot{font-size:10px;color:#736980;margin:8px 0 0}
.a06-route-action{margin:5px 12px 10px;border:1px solid #b8a5de;background:#f5f0fd;border-radius:12px;color:#5a397f;padding:11px 12px;font-size:13px;font-weight:750;cursor:pointer}
.a06-route-action:disabled,.a06-add-stop:disabled{opacity:.55;cursor:not-allowed}
.a06-proposal{white-space:normal;border-top:1px solid #e6ddf3;margin-top:12px;padding-top:12px}
.a06-proposal h4{font-size:15px;margin:0 0 10px;color:#493267}
.a06-proposal ol{padding-left:22px;margin:6px 0 12px}
.a06-proposal li{margin:9px 0;border-bottom:1px solid #f1edf8;padding-bottom:10px}
.a06-proposal li strong{font-size:13px;display:block;margin-bottom:5px}
.a06-add-stop{border:0;background:#5e3c99;color:white;border-radius:10px;font-size:12px;padding:9px 12px}
.a06-proposal p{font-size:12px;color:#6c6579;line-height:1.5;margin:9px 0 2px}

/* Shared layout safety: prevent fixed popup from widening the mobile page. */
#a06-panel,#a06-panel *{box-sizing:border-box}
#a06-panel .a06-head>div{flex:1;min-width:0}
#a06-panel .a06-out{min-height:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;flex:1 1 auto;scroll-behavior:smooth}
#a06-panel .a06-turn{min-width:0;overflow-wrap:anywhere}
#a06-panel .a06-reply{font-size:15px;line-height:1.58}
#a06-panel .a06-compose{flex:0 0 auto;min-width:0;border-top:1px solid #ebe5f3;background:#fff}
#a06-panel .a06-voice-details{flex:0 0 100%;font-size:11px;color:#776a88;max-width:100%}
#a06-panel .a06-voice-details summary{cursor:pointer;display:inline-block;text-decoration:underline;text-underline-offset:2px}
#a06-panel .a06-voice-details small{display:block;line-height:1.5;padding:4px 0 0}
#a06-panel .a06-voice .a06-voice-status{flex:1 1 130px;min-width:0}
#a06-panel .a06-voice-stop:disabled{display:none}
#a06-panel .a06-voice [data-reading="true"]{background:#e9def9;border-color:#9171c9}
#a06-panel .a06-new{border:1px solid #d8cbea;background:#fff;color:#573989;border-radius:10px;padding:9px 10px;font-size:12px;white-space:nowrap;flex-shrink:0}
#a06-panel.a06-has-turns .a06-samples{display:none}
#a06-panel .a06-send{min-width:85px;white-space:nowrap}
#a06-panel textarea.a06-input{font-size:16px!important;max-width:100%;width:100%;min-height:56px;resize:vertical}
html.a06-chat-open,body.a06-chat-open{overflow:hidden}
html.a06-chat-open #a06-open{visibility:hidden}
@media(max-width:740px){
 #a06-open{bottom:calc(15px + env(safe-area-inset-bottom));right:12px;font-size:13px;padding:12px 13px;max-width:calc(100vw - 24px)}
 #a06-panel{
  position:fixed!important;inset:0!important;
  top:var(--a06-view-top,0px)!important;left:0!important;right:0!important;bottom:auto!important;
  width:100%!important;max-width:none!important;
  height:var(--a06-view-height,100dvh)!important;max-height:var(--a06-view-height,100dvh)!important;
  min-height:0;overflow:hidden;border:0;border-radius:0;box-shadow:none;
 }
 #a06-panel .a06-head{padding:calc(8px + env(safe-area-inset-top)) 12px 9px;gap:8px;flex:0 0 auto}
 #a06-panel .a06-head strong{font-size:16px;line-height:1.27}
 #a06-panel .a06-head p{display:none}
 #a06-panel .a06-x{height:38px;width:38px;flex:0 0 38px}
 #a06-panel .a06-new{font-size:11px;padding:8px 9px}
 #a06-panel .a06-samples{padding:7px 11px;max-height:48px;flex:0 0 auto;overflow-x:auto;overflow-y:hidden}
 #a06-panel .a06-example{font-size:12px;max-width:218px;white-space:nowrap}
 #a06-panel .a06-out{padding:10px 14px 12px;font-size:15px;min-height:0;flex:1 1 0;overflow-y:auto}
 #a06-panel .a06-out:empty{display:block}
 #a06-panel .a06-turn{padding:6px 0 10px}
 #a06-panel .a06-question{max-width:92%;font-size:15px}
 #a06-panel .a06-reply{font-size:15px;line-height:1.55;padding:12px 1px 3px}
 #a06-panel .a06-compose{padding-bottom:calc(5px + env(safe-area-inset-bottom));overflow:visible}
 #a06-panel .a06-voice{padding:8px 11px 2px;gap:6px}
 #a06-panel .a06-voice button{padding:9px 10px;font-size:12px;min-height:38px;flex-shrink:0}
 #a06-panel .a06-voice .a06-voice-status{font-size:11px;flex:1 1 80px}
 #a06-panel .a06-voice-details{font-size:10px}
 #a06-panel .a06-form{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:stretch;padding:7px 11px;gap:8px}
 #a06-panel textarea.a06-input{font-size:16px!important;line-height:1.35;height:60px;min-height:60px;max-height:118px;padding:11px}
 #a06-panel .a06-send{min-height:60px;font-size:14px;padding:8px 12px;min-width:78px}
 #a06-panel .a06-route-action{padding:8px 10px;margin:5px 11px 3px;font-size:12px}
 #a06-panel .a06-note{display:none}
 #a06-panel .a06-voice-details[open]{font-size:11px}
}
@media(max-width:370px){
 #a06-panel .a06-voice .a06-voice-status{flex-basis:100%}
 #a06-panel .a06-head strong{font-size:14px}
 #a06-panel .a06-new{font-size:10px}
 #a06-panel .a06-send{min-width:74px}
}
@media(prefers-reduced-motion:reduce){#a06-panel .a06-out{scroll-behavior:auto}}

@media(prefers-reduced-motion:reduce){#a06-panel *{scroll-behavior:auto}}
`;
document.head.append(style);
const open=document.createElement('button');
open.id='a06-open';open.type='button';open.textContent='✦ '+t.button;
open.setAttribute('aria-controls','a06-panel');open.setAttribute('aria-expanded','false');
const panel=document.createElement('section');
panel.id='a06-panel';panel.hidden=true;panel.setAttribute('aria-label',t.button);
panel.innerHTML='<div class="a06-head"><div><strong></strong><p></p></div><button class="a06-x" type="button" aria-label=""></button></div><div class="a06-samples"></div><div class="a06-out" role="status" aria-live="polite"></div><div class="a06-voice" role="group" aria-label="Dictée et lecture"></div><form class="a06-form"><textarea class="a06-input" maxlength="600" rows="2" required></textarea><button class="a06-send" type="submit"></button></form><p class="a06-note"></p>';
panel.querySelector('.a06-head strong').textContent=t.title;
panel.querySelector('.a06-head p').textContent=t.hint;
panel.querySelector('.a06-x').setAttribute('aria-label',t.close);
panel.querySelector('.a06-input').placeholder=t.placeholder;
panel.querySelector('.a06-input').setAttribute('aria-label',t.placeholder);
panel.querySelector('.a06-send').textContent=t.send;

panel.querySelector('.a06-note').textContent=t.note;
const samples=panel.querySelector('.a06-samples'),input=panel.querySelector('.a06-input'),output=panel.querySelector('.a06-out'),submit=panel.querySelector('.a06-send');
input.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){
    event.preventDefault();
    if(typeof panel.querySelector('form').requestSubmit==='function')panel.querySelector('form').requestSubmit();
    else panel.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  }
});
let activeReply=output;
function beginTurn(question){
 const turn=document.createElement('div');turn.className='a06-turn';
 const bubble=document.createElement('div');bubble.className='a06-question';bubble.textContent=question;
 const reply=document.createElement('div');reply.className='a06-reply';turn.append(bubble,reply);
 output.append(turn);activeReply=reply;panel.classList.add('a06-has-turns');
 // Keep the new question visible above its answer, even if the answer is long.
 output.scrollTop=Math.max(0,turn.offsetTop-output.offsetTop-8);
}

const routeButton=document.createElement('button');
routeButton.type='button';routeButton.className='a06-route-action';
routeButton.textContent='✦ '+rt.button;
const composer=document.createElement('div');composer.className='a06-compose';
panel.querySelector('.a06-out').after(composer);
composer.append(panel.querySelector('.a06-voice'),routeButton,panel.querySelector('.a06-form'),panel.querySelector('.a06-note'));
function renderProposal(question){
  activeReply.replaceChildren();
  if(!proposer){activeReply.textContent=rt.none;return}
  const proposal=proposer.propose(question,language);
  if(!proposal.ok){activeReply.textContent=proposal.text||rt.none;return}
  // Snapshot is opaque (no trip data) and invalidates on role, revision or plan change.
  const context=window.A06PlannerCatalog?.proposalContext?.();
  const section=document.createElement('section');section.className='a06-proposal';
  const heading=document.createElement('h4');heading.textContent=rt.title+' · '+proposal.anchor;
  const list=document.createElement('ol');
  for(const stop of proposal.stops){
    const li=document.createElement('li');
    const name=document.createElement('strong');name.textContent=stop.name;
    const button=document.createElement('button');button.type='button';button.className='a06-add-stop';
    button.textContent=context?.role==='read'?rt.read:rt.step;
    button.disabled=!context?.canEdit;
    button.addEventListener('click',()=>{
      const open=window.A06PlannerCatalog?.openNativeAdd?.(stop.plannerId,context.fingerprint);
      if(open?.ok){toggle(false)}
      else{activeReply.replaceChildren();activeReply.textContent=rt.stale}
    });
    li.append(name,button);list.append(li);
  }
  const warning=document.createElement('p');
  warning.textContent=proposal.disclaimer+' '+rt.pending;
  const mapPreview=document.createElement('button');mapPreview.type='button';
  mapPreview.className='a06-map-preview';
  mapPreview.textContent=({fr:'🗺 Afficher le parcours sur la carte',it:'🗺 Mostra percorso sulla mappa',en:'🗺 Show route on map',es:'🗺 Mostrar recorrido en el mapa'}[language]||'Show route');
  mapPreview.addEventListener('click',()=>{
    const ids=proposal.stops.map(p=>p.plannerId);
    if(window.A08MapBridge?.showRoute(ids)?.ok)toggle(false);
  });
  section.append(heading,mapPreview,list,warning);
  activeReply.append(section);
}
routeButton.addEventListener('click',()=>{
  const question=input.value.trim();
  if(!question){input.focus();return}
  beginTurn(question);renderProposal(question);
});

for(const example of t.examples){const b=document.createElement('button');b.type='button';b.className='a06-example';b.textContent=example;b.addEventListener('click',()=>{input.value=example;panel.querySelector('form').requestSubmit()});samples.append(b)}
function toggle(show){
 panel.hidden=!show;open.setAttribute('aria-expanded',String(show));
 document.documentElement.classList.toggle('a06-chat-open',show);
 document.body.classList.toggle('a06-chat-open',show);
 if(!show){window.A06Voice?.stop?.();open.focus()}
 // On iPhone, don't open the keyboard immediately when opening the chat.
 else if(window.matchMedia?.('(min-width: 741px)')?.matches)input.focus();
}
open.addEventListener('click',()=>toggle(panel.hidden));
panel.querySelector('.a06-x').addEventListener('click',()=>toggle(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)toggle(false)});
const resetControl=document.createElement('button');resetControl.type='button';
resetControl.className='a06-new';
resetControl.textContent=({fr:'Nouvelle conversation',it:'Nuova conversazione',en:'New conversation',es:'Nueva conversación'}[language]||'Nouvelle conversation');
resetControl.addEventListener('click',()=>{
  window.A06Voice?.reset?.();window.A06Conversation?.reset?.();
  window.A06TourismAssistant?.setLanguage?.(language);
  output.replaceChildren();activeReply=output;panel.classList.remove('a06-has-turns');input.value='';input.focus();
});
panel.querySelector('.a06-x').before(resetControl);
panel.querySelector('form').addEventListener('submit',async event=>{
 event.preventDefault();const question=input.value.trim();if(!question||submit.disabled)return;
 window.A06Voice?.stop?.();
 if(window.matchMedia?.('(max-width: 740px)')?.matches)input.blur();
 submit.disabled=true;beginTurn(question);activeReply.textContent='…';
 try{
  if(routeIntent.test(question)){renderProposal(question);return}
  const response=await (window.A06Conversation?.ask?.(question,language)||api.ask(question,language));
  window.A06Voice?.setLastAnswer?.(response.text);
  activeReply.textContent=response.text;
  if(response.sources?.length){
   const citations=document.createElement('div');citations.className='a06-attrib';
   const heading=document.createElement('strong');heading.textContent=t.sources;citations.append(heading);
   for(const s of response.sources){const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';const sourceLabel={
      'poi-static-checked':{fr:'fait vérifié (hors horaires/prix)',it:'fatto verificato (non orari/prezzi)',en:'static fact checked (not hours/prices)',es:'dato verificado (no horarios/precios)'},
      'poi-draft-source-to-check':{fr:'fiche en cours de vérification',it:'scheda in verifica',en:'place description pending source review',es:'ficha pendiente de revisión'},
      'poi-context-reference':{fr:'source contextuelle, lieu à confirmer',it:'fonte di contesto, luogo da verificare',en:'context source; place details to verify',es:'fuente contextual; comprobar detalles del lugar'},
      'operator-site-reference-not-bookable':{fr:'site du prestataire, disponibilité non vérifiée',it:'sito operatore, disponibilità non verificata',en:'operator website; availability not checked',es:'web del operador; disponibilidad no comprobada'},
      'unreverified-catalogue':{fr:'source catalogue non revérifiée',it:'fonte catalogo da verificare',en:'catalogue source not rechecked',es:'fuente del catálogo sin reverificar'},
      'official-region-context':{fr:'contexte régional uniquement',it:'solo contesto regionale',en:'regional context only',es:'solo contexto regional'}
    };
    a.textContent=s.title+(sourceLabel[s.quality]?' · '+(sourceLabel[s.quality][language]||sourceLabel[s.quality].fr):'');citations.append(a)}
   activeReply.append(citations);
  }

  // Region-wide answers refer directly to the Planner's stable POI ids.
  // The only action is a voluntary map search: never mutate trip or session.
  if(response.plannerPlaces?.length){
    const regionList=document.createElement('div');regionList.className='a06-matches';
    const title=document.createElement('h4');title.textContent=mt.title;
    regionList.append(title);
    for(const id of [...new Set(response.plannerPlaces)].slice(0,8)){
      const item=window.A06PugliaKnowledge?.getPlace?.(id);
      const current=window.A06PlannerCatalog?.list?.().find(p=>p.id===id);
      if(!item || !current || item.name!==current.name)continue;
      const row=document.createElement('div');row.className='a06-place';
      const name=document.createElement('strong');name.textContent=item.name;
      const button=document.createElement('button');button.type='button';button.textContent=mt.cta;
      button.addEventListener('click',()=>{
        const live=window.A06PlannerCatalog?.list?.().find(p=>p.id===id);
        if(live?.name!==item.name)return;
        if(window.A08MapBridge?.showPlaces([id])?.ok)toggle(false);
      });
      row.append(name,button);regionList.append(row);
    }
    if(regionList.children.length>1){
      const showAll=document.createElement('button');showAll.type='button';showAll.className='a06-map-preview';
      showAll.textContent=({fr:'🗺 Voir tous ces lieux',it:'🗺 Vedi tutti i luoghi',en:'🗺 Show all places',es:'🗺 Ver todos los lugares'}[language]||'Show all');
      showAll.onclick=()=>{if(window.A08MapBridge?.showPlaces(response.plannerPlaces)?.ok)toggle(false)};
      regionList.append(showAll);activeReply.append(regionList);
    }
  }
  if(response.places?.length && matcher){
    const matches=matcher.matchMany(response.places);
    if(matches.length){
      const list=document.createElement('div');list.className='a06-matches';
      const title=document.createElement('h4');title.textContent=mt.title;list.append(title);
      for(const match of matches.slice(0,12)){
        const line=document.createElement('div');line.className='a06-place';
        const info=document.createElement('div');
        const name=document.createElement('strong');name.textContent=match.ilName;
        const status=document.createElement('small');
        status.textContent=match.status==='matched' ? match.plannerName : mt.unmatched;
        info.append(name,status);line.append(info);
        if(match.status==='matched'){
          const button=document.createElement('button');button.type='button';button.textContent=mt.cta;
          button.addEventListener('click',()=>{
            const fresh=matcher.match(match.ilId);
            if(!fresh||fresh.status!=='matched'||fresh.plannerId!==match.plannerId)return;
            if(window.A08MapBridge?.showPlaces([fresh.plannerId])?.ok)toggle(false);
          });
          line.append(button);
        }
        list.append(line);
      }
      const found=matches.filter(m=>m.status==='matched').map(m=>m.plannerId);
      if(found.length){const all=document.createElement('button');all.type='button';all.className='a06-map-preview';
        all.textContent=({fr:'🗺 Voir les lieux sur la carte',it:'🗺 Vedi i luoghi sulla mappa',en:'🗺 Show places on map',es:'🗺 Ver lugares en el mapa'}[language]||'Map');
        all.onclick=()=>{if(window.A08MapBridge?.showPlaces(found)?.ok)toggle(false)};list.append(all)}
      const foot=document.createElement('p');foot.className='a06-foot';foot.textContent=mt.foot;list.append(foot);
      activeReply.append(list);
    }
  }
 }catch(error){console.warn('[A06] query failed',error);activeReply.textContent=t.error}
 finally{submit.disabled=false;
  // Showing the end of a long answer hides the question on a phone.
  const turn=activeReply.closest('.a06-turn');
  if(turn)output.scrollTop=Math.max(0,turn.offsetTop-output.offsetTop-8);
 }
});
document.body.append(open,panel);
})();
