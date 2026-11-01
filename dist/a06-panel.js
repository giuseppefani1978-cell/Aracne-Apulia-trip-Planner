/* A06: panneau consultatif, sans accès au contenu des voyages. */
(()=>{'use strict';
const api=window.A06TourismAssistant;
if(!api || document.getElementById('a06-open'))return;
const language=document.documentElement.lang;
const T={
 fr:{button:'Aracne Intelligence',title:'Découvrir les Pouilles avec Aracne',hint:'Posez une question sur les lieux, les traditions et les découvertes du Salento.',placeholder:'Que voir à Otranto ?',send:'Demander',close:'Fermer',note:'Lecture seule · Ne change pas votre voyage · Sources à vérifier avant visite',examples:['Que voir à Otranto ?','Parle-moi de Lecce','Que découvrir autour de Porto Badisco ?'],sources:'Sources',error:'Impossible de répondre pour le moment.'},
 it:{button:'Aracne Intelligence',title:'Scopri la Puglia con Aracne',hint:'Fai una domanda sui luoghi, le tradizioni e il Salento.',placeholder:'Cosa vedere a Otranto?',send:'Chiedi',close:'Chiudi',note:'Solo lettura · Non modifica il viaggio · Verifica le fonti prima della visita',examples:['Cosa vedere a Otranto?','Parlami di Lecce','Cosa scoprire vicino a Porto Badisco?'],sources:'Fonti',error:'Non posso rispondere per ora.'},
 en:{button:'Aracne Intelligence',title:'Discover Puglia with Aracne',hint:'Ask about places, traditions and discoveries in Salento.',placeholder:'What to see in Otranto?',send:'Ask',close:'Close',note:'Read-only · Does not change your trip · Verify sources before visiting',examples:['What to see in Otranto?','Tell me about Lecce','What is near Porto Badisco?'],sources:'Sources',error:'Unable to answer right now.'},
 es:{button:'Aracne Intelligence',title:'Descubre Apulia con Aracne',hint:'Pregunta por lugares, tradiciones y visitas en Salento.',placeholder:'¿Qué ver en Otranto?',send:'Preguntar',close:'Cerrar',note:'Solo lectura · No modifica el viaje · Verifica las fuentes antes de visitarlo',examples:['¿Qué ver en Otranto?','Háblame de Lecce','¿Qué visitar cerca de Porto Badisco?'],sources:'Fuentes',error:'No puedo responder ahora.'}
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
@media(max-width:740px){#a06-open{bottom:calc(90px + env(safe-area-inset-bottom));font-size:12px;padding:12px 14px}#a06-panel{bottom:calc(145px + env(safe-area-inset-bottom));max-height:calc(100dvh - 185px)}}
@media(prefers-reduced-motion:reduce){#a06-panel *{scroll-behavior:auto}}
`;
document.head.append(style);
const open=document.createElement('button');
open.id='a06-open';open.type='button';open.textContent='✦ '+t.button;
open.setAttribute('aria-controls','a06-panel');open.setAttribute('aria-expanded','false');
const panel=document.createElement('section');
panel.id='a06-panel';panel.hidden=true;panel.setAttribute('aria-label',t.button);
panel.innerHTML='<div class="a06-head"><div><strong></strong><p></p></div><button class="a06-x" type="button" aria-label=""></button></div><div class="a06-samples"></div><div class="a06-out" role="status" aria-live="polite"></div><form class="a06-form"><input class="a06-input" type="text" maxlength="600" required autocomplete="off"><button class="a06-send" type="submit"></button></form><p class="a06-note"></p>';
panel.querySelector('.a06-head strong').textContent=t.title;
panel.querySelector('.a06-head p').textContent=t.hint;
panel.querySelector('.a06-x').setAttribute('aria-label',t.close);
panel.querySelector('.a06-input').placeholder=t.placeholder;
panel.querySelector('.a06-input').setAttribute('aria-label',t.placeholder);
panel.querySelector('.a06-send').textContent=t.send;
panel.querySelector('.a06-note').textContent=t.note;
const samples=panel.querySelector('.a06-samples'),input=panel.querySelector('.a06-input'),output=panel.querySelector('.a06-out'),submit=panel.querySelector('.a06-send');
for(const example of t.examples){const b=document.createElement('button');b.type='button';b.className='a06-example';b.textContent=example;b.addEventListener('click',()=>{input.value=example;panel.querySelector('form').requestSubmit()});samples.append(b)}
function toggle(show){panel.hidden=!show;open.setAttribute('aria-expanded',String(show));if(show)input.focus();else open.focus()}
open.addEventListener('click',()=>toggle(panel.hidden));
panel.querySelector('.a06-x').addEventListener('click',()=>toggle(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)toggle(false)});
panel.querySelector('form').addEventListener('submit',async event=>{
 event.preventDefault();const question=input.value.trim();if(!question||submit.disabled)return;
 submit.disabled=true;output.replaceChildren();output.textContent='…';
 try{
  const response=await api.ask(question,language);
  output.textContent=response.text;
  if(response.sources?.length){
   const citations=document.createElement('div');citations.className='a06-attrib';
   const heading=document.createElement('strong');heading.textContent=t.sources;citations.append(heading);
   for(const s of response.sources){const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=s.title;citations.append(a)}
   output.append(citations);
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
            // Re-evaluate the trusted catalog immediately before navigating.
            const fresh=matcher.match(match.ilId);
            if(!fresh || fresh.status!=='matched'||fresh.plannerId!==match.plannerId)return;
            const item=window.A06PlannerCatalog?.list?.().find(p=>p.id===fresh.plannerId);
            const nav=document.querySelector('nav button[data-view="map"]');
            const search=document.getElementById('search'),filter=document.getElementById('zoneFilter');
            if(!item||!nav||!search)return;
            toggle(false);
            nav.click();
            if(filter){filter.value='all';filter.dispatchEvent(new Event('change',{bubbles:true}))}
            search.value=item.name;
            search.dispatchEvent(new Event('input',{bubbles:true}));
            search.focus();
          });
          line.append(button);
        }
        list.append(line);
      }
      const foot=document.createElement('p');foot.className='a06-foot';foot.textContent=mt.foot;list.append(foot);
      output.append(list);
    }
  }
 }catch(error){console.warn('[A06] query failed',error);output.textContent=t.error}
 finally{submit.disabled=false}
});
document.body.append(open,panel);
})();
