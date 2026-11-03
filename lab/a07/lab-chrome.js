/* A07 — test-only ribbon; local data reset never touches the public Planner. */
(() => {
 'use strict';
 const lang=document.documentElement.lang;
 const words={
  fr:{title:'ARACNE LAB A07',detail:'Copie locale du Trip Planner · données fictives · aucun partage',reset:'Réinitialiser la démo',ask:'Effacer les données de test de CE laboratoire ?'},
  it:{title:'ARACNE LAB A07',detail:'Copia locale del Planner · dati fittizi · nessuna condivisione',reset:'Ripristina demo',ask:'Cancellare i dati fittizi di QUESTO laboratorio?'},
  en:{title:'ARACNE LAB A07',detail:'Local Planner copy · fictional data · no sharing',reset:'Reset demo',ask:'Clear the test data for THIS laboratory?'},
  es:{title:'ARACNE LAB A07',detail:'Copia local del Planner · datos ficticios · sin compartir',reset:'Reiniciar demo',ask:'¿Eliminar los datos de prueba de ESTE laboratorio?'}
 };
 const t=words[lang]||words.fr;
 const ribbon=document.createElement('div');ribbon.id='a07Ribbon';
 const heading=document.createElement('strong');heading.textContent=t.title;
 const desc=document.createElement('span');desc.textContent=t.detail;
 const reset=document.createElement('button');reset.type='button';reset.textContent=t.reset;
 reset.onclick=()=>{if(window.confirm(t.ask)){localStorage.clear();sessionStorage.clear();location.reload()}};
 ribbon.append(heading,desc,reset);
 document.body.prepend(ribbon);
 const beta=document.querySelector('.betaBanner');
 if(beta){beta.querySelector('strong').textContent='LAB A07';beta.querySelector('span').textContent=t.detail;}
 // Prevent accidental capability-link use, including when an old link is pasted.
 if(location.hash&&/\b(trip|key|beta)=/.test(location.hash)){history.replaceState(null,'',location.pathname+location.search)}
})();