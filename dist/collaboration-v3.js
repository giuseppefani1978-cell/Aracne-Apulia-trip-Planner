'use strict';
(()=>{
  const locales=['fr','it','en','es'];
  const lang=Math.max(0,locales.indexOf(document.documentElement.lang));
  const copy={
    program:['Programme','Programma','Plan','Programa'],
    journal:['Journal','Diario','Journal','Diario'],
    carnet:['Carnet','Taccuino','Trip book','Cuaderno'],
    map:['Carte','Mappa','Map','Mapa'],
    expenses:['Dépenses','Spese','Expenses','Gastos'],
    tripFrame:['Cadre du voyage','Contesto del viaggio','Trip framework','Marco del viaje'],
    settings:['Voyage','Viaggio','Trip','Viaje'],
    close:['Fermer','Chiudi','Close','Cerrar'],
    locked:['Cadre verrouillé','Contesto bloccato','Framework locked','Marco bloqueado'],
    lockedHint:['Le type de voyage et les choix de départ sont figés. Pour les changer, le créateur doit recommencer le voyage.','Il tipo di viaggio e le scelte iniziali sono bloccati. Per cambiarli, il creatore deve ricominciare il viaggio.','Trip type and initial choices are locked. To change them, the creator must restart the trip.','El tipo de viaje y las opciones iniciales están bloqueados. Para cambiarlos, el creador debe reiniciar el viaje.'],
    openFrame:['Voir le cadre initial','Vedi il contesto iniziale','View initial framework','Ver marco inicial'],
    reset:['Recommencer le voyage','Ricomincia il viaggio','Restart trip','Reiniciar viaje'],
    resetHint:['Efface le programme, les validations, les notes et les dépenses pour repartir de zéro. Le lien partagé reste le même.','Cancella programma, convalide, note e spese per ricominciare da zero. Il link condiviso resta lo stesso.','Clears the plan, validations, notes and expenses so you can start again. The shared link stays the same.','Borra el programa, las validaciones, las notas y los gastos para empezar de cero. El enlace compartido sigue siendo el mismo.'],
    resetAsk:['Réinitialiser ce voyage pour tout le groupe ?','Reimpostare questo viaggio per tutto il gruppo?','Reset this trip for the whole group?','¿Reiniciar este viaje para todo el grupo?'],
    resetConfirm:['Cette action repart de zéro. Confirmer ?','Questa azione ricomincia da zero. Confermare?','This starts the trip over from zero. Confirm?','Esta acción reinicia el viaje desde cero. ¿Confirmar?'],
    ownerOnly:['Action réservée à l’organisateur.','Azione riservata all’organizzatore.','Organiser only.','Acción reservada al organizador.'],
    who:['Votre nom dans le journal','Il tuo nome nel diario','Your name in the journal','Tu nombre en el diario'],
    organiser:['Organisateur','Organizzatore','Organiser','Organizador'],
    participant:['Participant','Partecipante','Participant','Participante'],
    readOnly:['Lecture seule','Sola lettura','View only','Solo lectura'],
    saveName:['Enregistrer','Salva','Save','Guardar'],
    activity:['Activité du groupe','Attività del gruppo','Group activity','Actividad del grupo'],
    emptyJournal:['Le journal se construira automatiquement à mesure que le groupe modifie le programme.','Il diario si costruirà automaticamente mentre il gruppo modifica il programma.','The journal will build itself automatically as the group edits the plan.','El diario se creará automáticamente a medida que el grupo modifique el programa.'],
    version:['Version du voyage','Versione del viaggio','Trip version','Versión del viaje'],
    since:['depuis votre dernière visite','dalla tua ultima visita','since your last visit','desde tu última visita'],
    proposed:['Proposé','Proposto','Proposed','Propuesto'],
    validated:['Validé','Convalidato','Validated','Validado'],
    modified:['Modifié','Modificato','Modified','Modificado'],
    validate:['Valider','Convalida','Validate','Validar'],
    revalidate:['Revalider','Riconvalida','Revalidate','Revalidar'],
    addedBy:['Ajouté par','Aggiunto da','Added by','Añadido por'],
    modifiedBy:['Modifié par','Modificato da','Modified by','Modificado por'],
    validatedBy:['Validé par','Convalidato da','Validated by','Validado por'],
    progress:['étapes validées','tappe convalidate','steps validated','etapas validadas'],
    finalize:['Finaliser le programme','Finalizza il programma','Finalize the plan','Finalizar el programa'],
    updateBook:['Mettre à jour le carnet','Aggiorna il taccuino','Update trip book','Actualizar cuaderno'],
    allRequired:['Validez toutes les étapes pour finaliser le carnet.','Convalidate tutte le tappe per finalizzare il taccuino.','Validate every step to finalize the trip book.','Valida todas las etapas para finalizar el cuaderno.'],
    carnetReady:['Carnet de voyage','Taccuino di viaggio','Trip book','Cuaderno de viaje'],
    carnetEmpty:['Validez des étapes dans Programme pour construire le carnet.','Convalidate le tappe nel Programma per costruire il taccuino.','Validate steps in Plan to build the trip book.','Valida etapas en Programa para construir el cuaderno.'],
    route:['Parcours validé','Percorso convalidato','Validated route','Ruta validada'],
    notes:['Notes du groupe','Note del gruppo','Group notes','Notas del grupo'],
    current:['Version actuelle','Versione attuale','Current version','Versión actual'],
    notFinal:['Programme encore en construction','Programma ancora in costruzione','Plan still in progress','Programa todavía en construcción'],
    newChanges:['modifications depuis la dernière version du carnet','modifiche dall’ultima versione del taccuino','changes since the last trip-book version','cambios desde la última versión del cuaderno'],
    frameSummary:['Contexte initial','Contesto iniziale','Initial framework','Contexto inicial'],
    startPlanning:['Configurer le voyage','Configura il viaggio','Set up trip','Configurar viaje'],
    share:['Partage','Condivisione','Sharing','Compartir'],
    eventGenerated:['a créé la première proposition de programme','ha creato la prima proposta di programma','created the first plan proposal','creó la primera propuesta de programa'],
    eventAdded:['a ajouté','ha aggiunto','added','añadió'],
    eventRemoved:['a supprimé','ha eliminato','removed','eliminó'],
    eventEdited:['a modifié','ha modificato','edited','modificó'],
    eventReordered:['a réorganisé le programme','ha riordinato il programma','reordered the plan','reordenó el programa'],
    eventValidated:['a validé','ha convalidato','validated','validó'],
    eventNote:['a ajouté une note au groupe','ha aggiunto una nota al gruppo','added a group note','añadió una nota al grupo'],
    eventFinalized:['a finalisé le carnet','ha finalizzato il taccuino','finalized the trip book','finalizó el cuaderno'],
    eventReset:['a recommencé le voyage à zéro','ha ricominciato il viaggio da zero','restarted the trip from zero','reinició el viaje desde cero'],
    eventExpense:['a ajouté une dépense','ha aggiunto una spesa','added an expense','añadió un gasto'],
    me:['Moi','Io','Me','Yo']
  };
  const t=k=>copy[k]?.[lang]||copy[k]?.[0]||k;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const now=()=>new Date().toISOString();
  const sessionInfo=()=>window.aracneShared?.getSession?.()||null;
  const role=()=>sessionInfo()?.role||'owner';
  const actorKey=()=>`aracne-collab-name-${sessionInfo()?.id||'local'}`;
  const actor=()=>{
    try{const n=localStorage.getItem(actorKey());if(n?.trim())return n.trim().slice(0,60)}catch{}
    return role()==='owner'?t('organiser'):role()==='read'?t('readOnly'):t('participant');
  };
  const isCreator=()=>!sessionInfo()||role()==='owner';
  const businessSnapshot=s=>{
    const x=clone(s);
    delete x.journal;
    return x;
  };
  const planFingerprint=()=>JSON.stringify({start:state.start,days:state.days,plan:(state.plan||[]).map(day=>day.map(p=>({uid:p.uid,name:p.name,desc:p.desc,time:p.time,lat:p.lat,lon:p.lon,duration:p.duration,travelMinutes:p.travelMinutes,status:p.status||'proposed'})))});
  const allSteps=()=>Array.isArray(state.plan)?state.plan.flat():[];
  const locked=()=>Boolean(state.frameworkLocked||state.zone||(state.plan||[]).some(d=>d?.length));
  const statusOf=p=>p.status==='validated'?'validated':p.status==='modified'?'modified':'proposed';
  const statusLabel=s=>t(s==='validated'?'validated':s==='modified'?'modified':'proposed');
  const esc2=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function ensureMeta(){
    if(!Array.isArray(state.journal))state.journal=[];
    if(!Number.isInteger(state.carnetVersion))state.carnetVersion=0;
    if(typeof state.frameworkLocked!=='boolean')state.frameworkLocked=locked();
    if(state.journal.length>500)state.journal=state.journal.slice(-500);
  }
  function pushEvent(action,detail='',who=actor()){
    ensureMeta();
    state.journal.push({actorId:localStorage.getItem('aracne-v5-device')||null,id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),at:now(),actor:who,action,detail:String(detail||'').slice(0,220)});
    if(state.journal.length>500)state.journal=state.journal.slice(-500);
  }
  function stepMap(s){
    const m=new Map();
    (s.plan||[]).forEach((d,di)=>(d||[]).forEach((p,pi)=>m.set(p.uid,{p,di,pi})));
    return m;
  }
  function coreStep(p){return JSON.stringify({name:p.name,desc:p.desc,time:p.time,lat:p.lat,lon:p.lon,duration:p.duration,travelMinutes:p.travelMinutes})}
  function prepareStepMetadata(before,current){
    const a=stepMap(before),b=stepMap(current),who=actor(),stamp=now();
    for(const [id,item] of b){
      const old=a.get(id);
      if(!old){
        item.p.status=item.p.status||'proposed';item.p.createdBy=item.p.createdBy||who;item.p.createdAt=item.p.createdAt||stamp;
      }else if(coreStep(old.p)!==coreStep(item.p)||old.di!==item.di||old.pi!==item.pi||before.start!==current.start){
        if(old.p.status==='validated')item.p.status='modified'; else item.p.status=item.p.status||old.p.status||'proposed';
        item.p.updatedBy=who;item.p.updatedAt=stamp;
      }
    }
  }
  function describe(before,current){
    const events=[];const a=stepMap(before),b=stepMap(current);
    const added=[...b].filter(([id])=>!a.has(id)).map(([,v])=>v.p);
    const removed=[...a].filter(([id])=>!b.has(id)).map(([,v])=>v.p);
    const edited=[...b].filter(([id,v])=>a.has(id)&&coreStep(a.get(id).p)!==coreStep(v.p)).map(([,v])=>v.p);
    const newlyValidated=[...b].filter(([id,v])=>a.has(id)&&a.get(id).p.status!=='validated'&&v.p.status==='validated').map(([,v])=>v.p);
    if(!(before.plan||[]).flat().length && (current.plan||[]).flat().length>1)events.push([t('eventGenerated'),`${(current.plan||[]).flat().length} étapes`]);
    else added.slice(0,3).forEach(p=>events.push([t('eventAdded'),p.name]));
    removed.slice(0,3).forEach(p=>events.push([t('eventRemoved'),p.name]));
    edited.filter(p=>!newlyValidated.includes(p)).slice(0,3).forEach(p=>events.push([t('eventEdited'),p.name]));
    newlyValidated.slice(0,4).forEach(p=>events.push([t('eventValidated'),p.name]));
    const sameIds=a.size===b.size&&[...a.keys()].every(id=>b.has(id));
    if(sameIds){
      const apos=[...a].map(([id,v])=>`${id}:${v.di}:${v.pi}`).join('|');
      const bpos=[...b].map(([id,v])=>`${id}:${v.di}:${v.pi}`).join('|');
      if(apos!==bpos&&!edited.length)events.push([t('eventReordered'),'']);
    }
    const beforeNotes=(before.notes||[]).filter(n=>n.privacy==='group');
    const afterNotes=(current.notes||[]).filter(n=>n.privacy==='group');
    if(afterNotes.length>beforeNotes.length){const n=afterNotes.find(x=>!beforeNotes.some(y=>y.id===x.id));events.push([t('eventNote'),n?.text?.slice(0,80)||'']);}
    if((current.expenses||[]).length>(before.expenses||[]).length){const e=current.expenses.find(x=>!(before.expenses||[]).some(y=>y.id===x.id));events.push([t('eventExpense'),e?.title||'']);}
    if((current.carnetVersion||0)>(before.carnetVersion||0))events.push([t('eventFinalized'),`v${current.carnetVersion}`]);
    return events;
  }

  ensureMeta();
  let last=businessSnapshot(state),suppress=false;
  const previousSave=save;
  save=function(){
    ensureMeta();
    if(!suppress){
      prepareStepMetadata(last,state);
      const current=businessSnapshot(state);
      describe(last,current).forEach(([action,detail])=>pushEvent(action,detail));
    }
    previousSave();
    last=businessSnapshot(state);
    refreshChrome();
    if(view==='journal')renderJournal();
  };
  window.addEventListener('aracne:shared-applied',()=>{ensureMeta();last=businessSnapshot(state);refreshChrome();if(view==='journal')renderJournal();if(view==='notes')renderCarnet()});

  const nav=document.querySelector('nav');
  const navPrepare=nav?.querySelector('[data-view="prepare"]'),navMap=nav?.querySelector('[data-view="map"]'),navPlan=nav?.querySelector('[data-view="plan"]'),navBudget=nav?.querySelector('[data-view="budget"]'),navNotes=nav?.querySelector('[data-view="notes"]');
  [navPrepare,navMap,navBudget].forEach(b=>b?.classList.add('collabLegacyNav'));
  if(navPlan)navPlan.innerHTML=`<b aria-hidden="true">☰</b><span>${t('program')}</span>`;
  if(navNotes)navNotes.innerHTML=`<b aria-hidden="true">✦</b><span>${t('carnet')}</span>`;
  const journalButton=document.createElement('button');journalButton.type='button';journalButton.dataset.view='journal';journalButton.innerHTML=`<b aria-hidden="true">↺</b><span>${t('journal')}</span>`;nav?.insertBefore(journalButton,navNotes||null);

  const journal=document.createElement('section');journal.id='journal';journal.className='view';journal.innerHTML='<div id="journalContent"></div>';document.querySelector('main')?.insertBefore(journal,document.querySelector('#notes'));

  let previousMainView='plan',bookMap=null;
  const previousShow=show;
  show=function(v){
    if(v==='map'){
      previousMainView=view&&view!=='map'?view:previousMainView;
      document.body.classList.add('collabMapOpen');
    }else document.body.classList.remove('collabMapOpen');
    previousShow(v);
    if(v==='journal')renderJournal();
    if(v==='notes')setTimeout(renderCarnet,0);
    if(v==='plan')setTimeout(decoratePlan,0);
    refreshChrome();
  };
  journalButton.onclick=()=>show('journal');

  const mapSection=document.querySelector('#map');
  if(mapSection&&!document.querySelector('#closeMapOverlay')){
    const close=document.createElement('button');close.type='button';close.id='closeMapOverlay';close.className='round collabMapClose';close.setAttribute('aria-label',t('close'));close.textContent='×';mapSection.prepend(close);close.onclick=()=>show(previousMainView||'plan');
  }

  const topTools=document.createElement('div');topTools.className='collabTopTools';topTools.innerHTML=`<button type="button" class="secondary collabTopBtn" id="topMap">⌖ <span>${t('map')}</span></button><button type="button" class="secondary collabTopBtn" id="actorButton">${t('me')} · <span></span></button><button type="button" class="round" id="tripMenu" aria-label="${t('settings')}">⋯</button>`;
  const header=document.querySelector('header');header?.insertBefore(topTools,document.querySelector('#shareTop'));
  document.querySelector('#topMap')?.addEventListener('click',()=>show('map'));
  document.querySelector('#actorButton')?.addEventListener('click',openIdentity);
  document.querySelector('#tripMenu')?.addEventListener('click',openTripMenu);

  document.querySelector('#v21StartGuide')?.remove();

  function openIdentity(){
    dialog(t('who'),`<form id="identityForm"><label>${esc2(t('who'))}<input id="identityName" maxlength="60" required value="${esc2(actor())}"></label><button class="primary" type="submit">${esc2(t('saveName'))}</button></form>`);
    document.querySelector('#identityForm').onsubmit=e=>{e.preventDefault();const n=document.querySelector('#identityName').value.trim();if(!n)return;try{localStorage.setItem(actorKey(),n)}catch{}document.querySelector('#modal').close();refreshChrome();renderJournal()};
  }
  function frameText(){
    const themeLabel=(themes.find(x=>x[0]===state.theme)||[])[2]||state.theme;
    const interestLabels=(state.interests||[]).map(k=>kinds[k]||k).join(' · ');
    return `<div class="collabFrameCard"><span class="eyebrow">${esc2(t('frameSummary'))}</span><h3>${esc2(state.name||'')}</h3><p><b>${esc2(themeLabel)}</b> · ${Number(state.people)||0} personnes · ${Number(state.days)||0} jours</p><p>${esc2(state.start||'—')} · ${esc2(state.arrival||'—')} · ${esc2(interestLabels||'—')}</p><p class="small">${locked()?'🔒 '+esc2(t('lockedHint')):esc2(t('startPlanning'))}</p></div>`;
  }
  function openTripMenu(){
    const canReset=isCreator();
    dialog(t('settings'),`${frameText()}<div class="collabMenuList"><button class="secondary" id="menuFrame">${esc2(t('openFrame'))}</button><button class="secondary" id="menuExpenses">${esc2(t('expenses'))}</button><button class="secondary" id="menuShare">${esc2(t('share'))}</button>${canReset?`<div class="dangerZone"><b>${esc2(t('reset'))}</b><p>${esc2(t('resetHint'))}</p><button class="secondary danger" id="menuReset">↻ ${esc2(t('reset'))}</button></div>`:`<p class="small">🔒 ${esc2(t('ownerOnly'))}</p>`}</div>`);
    document.querySelector('#menuFrame').onclick=()=>{document.querySelector('#modal').close();show('prepare');applyFrameworkLock()};
    document.querySelector('#menuExpenses').onclick=()=>{document.querySelector('#modal').close();show('budget')};
    document.querySelector('#menuShare').onclick=()=>{document.querySelector('#modal').close();window.aracneShared?.open?.()||document.querySelector('#shareTop')?.click()};
    const reset=document.querySelector('#menuReset');if(reset)reset.onclick=resetTrip;
  }
  function resetTrip(){
    if(window.aracneV5){window.aracneV5.clearPlan();return;}
    if(!isCreator()){toast(t('ownerOnly'));return}
    if(!confirm(t('resetAsk'))||!confirm(t('resetConfirm')))return;
    const who=actor();
    suppress=true;
    try{
      state=defaults();ensureMeta();state.frameworkLocked=false;state.carnetVersion=0;state.finalizedAt=null;state.finalizedBy=null;state.finalizedFingerprint='';state.journal=[];pushEvent(t('eventReset'),'',who);previousSave();last=businessSnapshot(state);fillForm();
    }finally{suppress=false}
    document.querySelector('#modal').close();show('prepare');applyFrameworkLock();toast(t('reset'));
  }

  function applyFrameworkLock(){
    const form=document.querySelector('#tripForm'),themesBox=document.querySelector('#themes'),recommend=document.querySelector('#recommendations');
    const shouldLock=!isCreator();
    document.querySelector('#prepare')?.classList.toggle('frameworkLocked',shouldLock);
    if(form){form.querySelectorAll('input,select,button').forEach(el=>{if(el.type!=='button'||!el.closest('#themes,#interests'))el.disabled=shouldLock});}
    themesBox?.querySelectorAll('button').forEach(b=>b.disabled=shouldLock);
    document.querySelector('#interests')?.querySelectorAll('button').forEach(b=>b.disabled=shouldLock);
    let notice=document.querySelector('#frameworkLockNotice');
    if(shouldLock&&!notice){notice=document.createElement('p');notice.id='frameworkLockNotice';notice.className='notice';notice.textContent='🔒 '+t('lockedHint');form?.before(notice)}
    if(!shouldLock)notice?.remove();
    if(shouldLock&&recommend)recommend.hidden=true;
  }

  const previousGenerate=generate;
  generate=function(zone){previousGenerate(zone);state.frameworkLocked=true;save();applyFrameworkLock();setTimeout(decoratePlan,0)};

  const previousRenderPlan=renderPlan;
  renderPlan=function(){previousRenderPlan();decoratePlan()};
  function decoratePlan(){
    if(!document.querySelector('#plan'))return;
    const arr=state.plan?.[day]||[];
    document.querySelectorAll('#itinerary .step').forEach((el,i)=>{
      const p=arr[i];if(!p)return;
      const status=statusOf(p),owner=p.validatedBy||p.updatedBy||p.createdBy||t('organiser');
      const existing=el.querySelector('.collabStepMeta');existing?.remove();
      const meta=document.createElement('div');meta.className='collabStepMeta';
      meta.innerHTML=`<div><span class="stepCode">J${day+1} · ${String(i+1).padStart(2,'0')}</span><span class="status status-${status}">${esc2(statusLabel(status))}</span></div><small>${esc2(status==='validated'?t('validatedBy'):status==='modified'?t('modifiedBy'):t('addedBy'))} ${esc2(owner)}</small><button type="button" class="mini validateStep" data-validate-step="${esc2(p.uid)}">${esc2(status==='validated'?t('validated'):status==='modified'?t('revalidate'):t('validate'))}</button>`;
      el.querySelector('.stepContent')?.prepend(meta);
    });
    document.querySelectorAll('[data-validate-step]').forEach(b=>{b.disabled=!isCreator();b.onclick=()=>validateStep(b.dataset.validateStep)});
    const total=allSteps().length,validated=allSteps().filter(p=>statusOf(p)==='validated').length;
    let panel=document.querySelector('#collabPlanStatus');if(!panel){panel=document.createElement('div');panel.id='collabPlanStatus';document.querySelector('#planSummary')?.after(panel)}
    const changed=Boolean(state.carnetVersion&&state.finalizedFingerprint&&state.finalizedFingerprint!==planFingerprint());
    const label=state.carnetVersion?(changed?t('updateBook'):t('current')):t('finalize');
    panel.innerHTML=`<div class="collabProgress"><div><strong>${validated}/${total}</strong><span>${esc2(t('progress'))}</span></div><div class="progressTrack"><i style="width:${total?Math.round(validated/total*100):0}%"></i></div></div>${total&&validated===total?`<button type="button" class="primary" id="finalizePlan">${esc2(label)}</button>`:`<p class="small">${esc2(t('allRequired'))}</p>`}`;
    const f=document.querySelector('#finalizePlan');if(f){f.disabled=!isCreator();f.onclick=finalizePlan;}
  }
  function validateStep(id){
    if(!isCreator()){toast(t('ownerOnly'));return}
    const p=allSteps().find(x=>x.uid===id);if(!p)return;
    p.status='validated';p.validatedBy=actor();p.validatedAt=now();p.updatedBy=actor();p.updatedAt=now();save();renderPlan();
  }
  function finalizePlan(){
    if(!isCreator()){toast(t('ownerOnly'));return}
    if(window.aracneShared?._pending()){toast(t('allRequired'));return}
    if(state.finalizedFingerprint===planFingerprint()&&state.publishedBook)return;
    const total=allSteps().length;if(!total||allSteps().some(p=>statusOf(p)!=='validated'))return;
    state.carnetVersion=(state.carnetVersion||0)+1;state.finalizedAt=now();state.finalizedBy=actor();state.finalizedFingerprint=planFingerprint();state.publishedBook={plan:clone(state.plan),start:state.start,days:state.days,name:state.name,version:state.carnetVersion,at:state.finalizedAt,by:state.finalizedBy};save();renderPlan();toast(`${t('carnetReady')} · v${state.carnetVersion}`);
  }

  function renderJournal(){
    ensureMeta();
    const node=document.querySelector('#journalContent');if(!node)return;
    let previousSeen=0;try{previousSeen=Number(localStorage.getItem(`aracne-journal-seen-${sessionInfo()?.id||'local'}`)||0)}catch{}
    const events=[...state.journal].sort((a,b)=>String(b.at).localeCompare(String(a.at)));
    const unseen=events.filter(e=>Date.parse(e.at)>previousSeen).length;
    const total=allSteps().length,valid=allSteps().filter(p=>statusOf(p)==='validated').length,proposed=allSteps().filter(p=>statusOf(p)==='proposed').length,modified=allSteps().filter(p=>statusOf(p)==='modified').length;
    const rev=sessionInfo()?.revision??state.carnetVersion??0;
    node.innerHTML=`<div class="sectionHead"><div><span class="eyebrow">${esc2(t('activity'))}</span><h2>${esc2(t('journal'))}</h2></div><span class="pill">#${esc2(rev)}</span></div><div class="journalSummary"><div><strong>${valid}/${total}</strong><span>${esc2(t('progress'))}</span></div><div><strong>${proposed}</strong><span>${esc2(t('proposed'))}</span></div><div><strong>${modified}</strong><span>${esc2(t('modified'))}</span></div></div>${unseen?`<p class="notice"><b>${unseen}</b> ${esc2(t('since'))}</p>`:''}<div class="identityCard"><span>${esc2(t('who'))}</span><button class="textBtn" id="journalIdentity">${esc2(actor())} ✎</button></div><div class="timeline">${events.length?events.map(eventHtml).join(''):`<div class="empty">${esc2(t('emptyJournal'))}</div>`}</div>`;
    document.querySelector('#journalIdentity').onclick=openIdentity;
    try{localStorage.setItem(`aracne-journal-seen-${sessionInfo()?.id||'local'}`,String(Date.now()))}catch{}
  }
  function eventHtml(e){
    const d=new Date(e.at);const label=Number.isNaN(d.getTime())?'':d.toLocaleString(document.documentElement.lang,{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    return `<article class="timelineItem"><span class="timelineDot"></span><div><div class="timelineHead"><b>${esc2(e.actor||t('participant'))}</b><time>${esc2(label)}</time></div><p>${esc2(e.action||'')}${e.detail?` <strong>${esc2(e.detail)}</strong>`:''}</p></div></article>`;
  }

  const previousRenderNotes=renderNotes;
  renderNotes=function(){previousRenderNotes();renderCarnet()};
  function renderCarnet(){
    const section=document.querySelector('#notes');if(!section)return;
    section.querySelector('.sectionHead h2').textContent=t('carnetReady');
    let host=document.querySelector('#carnetOverview');if(!host){host=document.createElement('div');host.id='carnetOverview';section.querySelector('.sectionHead')?.after(host)}
    if(bookMap){try{bookMap.remove()}catch{}bookMap=null}
    const days=(state.publishedBook?.plan||[]).map((d,di)=>({di,steps:(d||[]).filter(p=>statusOf(p)==='validated')})).filter(x=>x.steps.length);
    const validated=days.flatMap(x=>x.steps);
    const changed=Boolean(state.carnetVersion&&state.finalizedFingerprint&&state.finalizedFingerprint!==planFingerprint());
    host.innerHTML=`<div class="carnetHero"><div><span class="eyebrow">${esc2(state.carnetVersion?`${t('current')} · v${state.carnetVersion}`:t('notFinal'))}</span><h3>${esc2(state.name||t('carnetReady'))}</h3><p>${esc2(state.finalizedAt?new Date(state.finalizedAt).toLocaleString(document.documentElement.lang,{dateStyle:'medium',timeStyle:'short'}):t('carnetEmpty'))}</p>${changed?`<p class="notice">${esc2(t('newChanges'))}</p>`:''}</div></div>${validated.length?`<div class="carnetMapTitle"><b>${esc2(t('route'))}</b><span>${validated.length} étapes</span></div><div id="carnetMap"></div>${days.map(dayBookHtml).join('')}`:`<div class="empty">${esc2(t('carnetEmpty'))}</div>`}`;
    if(validated.length&&window.L){
      setTimeout(()=>{
        const el=document.querySelector('#carnetMap');if(!el||!el.offsetParent)return;
        bookMap=L.map(el,{zoomControl:false,attributionControl:true});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(bookMap);
        const pts=validated.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)).map(p=>[p.lat,p.lon]);
        validated.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)).forEach((p,i)=>L.marker([p.lat,p.lon]).addTo(bookMap).bindTooltip(`${i+1}. ${p.name}`));
        if(pts.length>1)L.polyline(pts,{weight:4,opacity:.75}).addTo(bookMap);
        if(pts.length)bookMap.fitBounds(pts,{padding:[24,24],maxZoom:11});else bookMap.setView([40.65,17.7],7);
      },60);
    }
    const form=document.querySelector('#noteForm');if(form){const h=form.previousElementSibling;if(h&&h.tagName==='P')h.textContent=t('notes')}
  }
  function dayBookHtml(d){
    const groupNotes=(state.notes||[]).filter(n=>n.privacy==='group'&&(n.day===d.di||n.day===-1));
    return `<section class="carnetDay"><div class="carnetDayHead"><span>${esc2(state.publishedBook?.start?new Date(state.publishedBook.start+'T12:00:00').toLocaleDateString(document.documentElement.lang)+' · J'+(d.di+1):'J'+(d.di+1))}</span><b>${d.steps.length} étapes</b></div>${d.steps.map((p,i)=>`<article class="carnetStep"><span>${String(i+1).padStart(2,'0')}</span><div><time>${esc2(p.time||'—')}</time><h4>${esc2(p.name)}</h4><p>${esc2(p.desc||'')}</p>${p.validatedBy?`<small>✓ ${esc2(t('validatedBy'))} ${esc2(p.validatedBy)}</small>`:''}</div></article>`).join('')}${groupNotes.length?`<div class="carnetNotes"><b>${esc2(t('notes'))}</b>${groupNotes.map(n=>`<p>${esc2(n.text)}</p>`).join('')}</div>`:''}</section>`;
  }

  function refreshChrome(){
    const btn=document.querySelector('#actorButton span');if(btn)btn.textContent=actor();
    applyFrameworkLock();
    if(nav){nav.classList.add('collabNav');nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.view===view))}
  }

  applyFrameworkLock();refreshChrome();
  setTimeout(()=>{
    ensureMeta();last=businessSnapshot(state);refreshChrome();
    if(locked()&&view==='prepare')show('plan');else if(view==='plan')decoratePlan();
  },180);
})();