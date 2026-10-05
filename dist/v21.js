'use strict';
(() => {
 const locales=['fr','it','en','es'], language=document.documentElement.lang, c=Math.max(0,locales.indexOf(language));
 const copy={
 help:['Aide & découverte','Aiuto e scoperta','Help & discovery','Ayuda y descubrimiento'],
 intro:['Revoir la courte introduction','Rivedi la breve introduzione','Replay the short introduction','Repetir la breve introducción'],
 guide:['Me guider dans les 5 onglets','Guidami nelle 5 sezioni','Guide me through the 5 tabs','Guiarme por las 5 pestañas'],
 language:['Langue','Lingua','Language','Idioma'],
 close:['Fermer le guide','Chiudi la guida','Close the guide','Cerrar la guía'],
 fold:['Replier','Riduci','Minimise','Minimizar'], expand:['Déplier le guide','Espandi la guida','Expand the guide','Ampliar la guía'],
 next:['Suivant','Avanti','Next','Siguiente'],back:['Précédent','Indietro','Previous','Anterior'],done:['Terminer','Termina','Finish','Terminar'],
 play:['Lecture automatique','Riproduzione automatica','Auto-play','Reproducción automática'],pause:['Pause','Pausa','Pause','Pausa'],
 note:['Démonstration : votre voyage ne sera pas modifié.','Dimostrazione: il vostro viaggio non verrà modificato.','Demonstration: your trip will not be changed.','Demostración: vuestro viaje no se modificará.'],
 prepare:['Le voyage : commencez ici','Il viaggio: iniziate qui','The trip: start here','El viaje: empieza aquí'],
 map:['La carte : trouvez vos activités','La mappa: trovate le attività','The map: find activities','El mapa: encuentra actividades'],
 plan:['Le programme : organisez vos journées','Il programma: organizzate le giornate','The plan: arrange your days','El programa: organiza los días'],
 budget:['Les dépenses : qui a payé quoi ?','Le spese: chi ha pagato cosa?','Expenses: who paid for what?','Los gastos: ¿quién pagó qué?'],
 notes:['Le carnet : gardez vos idées','Il diario: conservate le idee','The notebook: keep your ideas','El diario: guarda tus ideas'],
 prepareText:['Choisissez le groupe, la date et les envies, puis lancez les suggestions. Sélectionnez ensuite votre zone.','Scegliete gruppo, data e desideri, poi avviate i suggerimenti. Selezionate quindi la zona.','Choose your group, date and interests, then request suggestions and pick an area.','Elegid grupo, fecha y gustos; pedid sugerencias y seleccionad una zona.'],
 mapText:['Touchez un filtre, par exemple Spa, puis une fiche. « Au programme » ajoute le lieu au jour choisi.','Toccate un filtro, ad esempio Spa, poi una scheda. « Al programma » aggiunge il luogo al giorno scelto.','Tap a filter, such as Spa, then a place. “Add to plan” adds it to your chosen day.','Tocad un filtro, como Spa, y una ficha. « Al programa » añade el lugar al día elegido.'],
 planText:['Choisissez un jour, ajustez les durées et déplacez les étapes avec les flèches. Le total se recalcule.','Scegliete un giorno, modificate le durate e spostate le tappe con le frecce. Il totale si aggiorna.','Pick a day, adjust durations and use arrows to reorder stops. Totals update automatically.','Elegid un día, ajustad duraciones y ordenad paradas con las flechas. El total se actualiza.'],
 budgetText:['Indiquez qui a payé et pour qui. L’app calcule les remboursements ; elle ne réalise aucun paiement.','Indicate chi ha pagato e per chi. L’app calcola i rimborsi; non effettua pagamenti.','Enter who paid and who shared the cost. The app calculates repayments; it does not make payments.','Indicad quién pagó y para quién. La app calcula reembolsos; no realiza pagos.'],
 notesText:['Ajoutez une note personnelle ou destinée au groupe. Créez aussi une image de story. Les notes du groupe sont synchronisées si le voyage partagé est activé.','Aggiungete una nota personale o per il gruppo. Create anche una story. Le note di gruppo si sincronizzano quando il viaggio condiviso è attivo.','Add a private or group note, or create a story image. Group notes sync when shared trips are enabled.','Añadid una nota privada o de grupo y cread una story. Las notas del grupo se sincronizan al activar el viaje compartido.'],
 actions0:['Groupe → Dates → Envies','Gruppo → Date → Desideri','Group → Dates → Interests','Grupo → Fechas → Gustos'],
 actions1:['Filtrer → Choisir → Ajouter','Filtra → Scegli → Aggiungi','Filter → Choose → Add','Filtrar → Elegir → Añadir'],
 actions2:['Jour → Durées → Ordre','Giorno → Durate → Ordine','Day → Durations → Order','Día → Duraciones → Orden'],
 actions3:['Montant → Payeur → Participants','Importo → Pagante → Partecipanti','Amount → Payer → Participants','Importe → Pagador → Participantes'],
 actions4:['Écrire → Enregistrer → Partager','Scrivi → Salva → Condividi','Write → Save → Share','Escribir → Guardar → Compartir']
 };
 const t=k=>copy[k][c];
 $('#start').closest('.grid2').classList.add('v21DateRow');
 $('.v2Topbar>span').textContent=$('.v2Topbar>span').textContent.replace(/^V2 /,'V2.1 ');
 // Preserve current intro frame when changing language. Reuse the existing draft
 // preservation logic instead of resetting or saving the user's unfinished form.
 function introLanguage(){
  if(!$('.v2Tour')||$('#introLanguage'))return;
  const label=document.createElement('label');label.className='v21IntroLanguage';label.textContent=t('language');
  const select=$('#language').cloneNode(true);select.id='introLanguage';select.value=language;select.setAttribute('aria-label',t('language'));label.append(select);$('.v2Tour').prepend(label);
  select.onchange=()=>{try{sessionStorage.setItem('aracne-v21-intro-step',String(window.aracneIntro.getSlide()))}catch{}$('#language').value=select.value;$('#language').onchange()};
 }
 window.addEventListener('aracne:intro-frame',introLanguage);introLanguage();
 try{const step=sessionStorage.getItem('aracne-v21-intro-step');if(step!==null){sessionStorage.removeItem('aracne-v21-intro-step');window.aracneIntro.open(Number(step))}}catch{}
 const help=document.createElement('details');help.id='v21Help';help.innerHTML=`<summary>${t('help')}</summary><div class="v21HelpActions"><button class="secondary" id="v21StartGuide">${t('guide')}</button></div>`;
 const introButton=$('#v2Guide');introButton.textContent=t('intro');help.querySelector('.v21HelpActions').prepend(introButton);$('.v2Topbar').append(help);
 const tabs=['prepare','map','plan','budget','notes'];let step=0,timer=null,active=false,playing=false,minimised=false,previousView='prepare',previousScroll=0,previousFocus=null,draft=[];
 const panel=document.createElement('section');panel.id='v21Walkthrough';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label',t('guide'));document.body.append(panel);
 function stop(){clearTimeout(timer);timer=null}
 function clearHighlight(){$$('.v21Highlighted').forEach(e=>e.classList.remove('v21Highlighted'))}
 function restoreDraft(){for(const item of draft){const el=$(item.selector);if(el){el.value=item.value;el.checked=item.checked}}}
 function end(restore=true){stop();active=false;panel.hidden=true;clearHighlight();if(restore){show(previousView);restoreDraft();window.scrollTo({top:previousScroll,behavior:'instant'});previousFocus?.focus({preventScroll:true})}else restoreDraft()}
 function draw(navigate=true){
  stop();if(!active)return;const key=tabs[step];clearHighlight();
  if(navigate)show(key);
  $(`nav [data-view="${key}"]`).classList.add('v21Highlighted');
  panel.hidden=false;panel.classList.toggle('minimised',minimised);
  panel.innerHTML=`<div class="v21GuideHead"><span>${step+1} / 5 · ${esc($(`nav [data-view="${key}"] span`).textContent)}</span><div><button class="textBtn" id="guideFold" aria-expanded="${!minimised}">${t(minimised?'expand':'fold')}</button><button class="round" id="guideClose" aria-label="${t('close')}">×</button></div></div>${minimised?'':`<h3>${t(key)}</h3><div class="v21DemoSteps" aria-hidden="true">${t('actions'+step)}</div><p>${t(key+'Text')}</p><div class="actions"><button class="secondary" id="guideBack" ${step===0?'disabled':''}>${t('back')}</button><button class="primary" id="guideNext">${t(step===4?'done':'next')}</button><button class="textBtn" id="guidePlay">${t(playing?'pause':'play')}</button></div><small>${t('note')}</small>`}`;
  $('#guideClose').onclick=()=>end();$('#guideFold').onclick=()=>{minimised=!minimised;playing=false;draw(false)};
  if(!minimised){$('#guideBack').onclick=()=>{playing=false;step--;draw()};$('#guideNext').onclick=()=>{playing=false;if(step===4)end();else{step++;draw()}};$('#guidePlay').onclick=()=>{playing=!playing;draw(false)}}
  if(playing&&!minimised&&step<4)timer=setTimeout(()=>{step++;if(step===4)playing=false;draw()},7000);
 }
 $('#v21StartGuide').onclick=()=>{if(active){minimised=false;draw(false);return}previousView=view;previousScroll=scrollY;previousFocus=document.activeElement;draft=$$('main input,main select,main textarea').filter(e=>e.type!=='file'&&(e.id||e.closest('#beneficiaries'))).map(e=>({selector:e.id?'#'+e.id:'#beneficiaries input[value="'+e.value+'"]',value:e.value,checked:e.checked}));step=0;active=true;minimised=false;playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;help.open=false;draw();$('#guideNext').focus({preventScroll:true})};
 // Do not continue auto-navigation while the user interacts with real controls.
 document.addEventListener('pointerdown',e=>{if(active&&!panel.contains(e.target)&&!help.contains(e.target)){playing=false;stop()}},true);
 document.addEventListener('focusin',e=>{if(active&&!panel.contains(e.target)&&!help.contains(e.target)){playing=false;stop()}},true);
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape'&&!$('#modal').open){e.preventDefault();end()}});
 $$('nav button').forEach(b=>b.addEventListener('click',()=>{if(active){step=tabs.indexOf(b.dataset.view);playing=false;draw(false)}}));
 window.addEventListener('aracne:intro-frame',()=>{if(active)end(false)});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){playing=false;stop()}});
})();
