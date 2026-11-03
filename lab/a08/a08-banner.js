/* A08 local-only marker, after A07 chrome: no session backend */
(()=>{'use strict';const ribbon=document.getElementById('a07Ribbon');
if(ribbon){const title=ribbon.querySelector('strong');if(title)title.textContent='ARACNE LAB A08';
const details=ribbon.querySelector('span');if(details)details.textContent=({fr:'Planner + Intelligence + carte · données fictives',it:'Planner + Intelligenza + mappa · dati fittizi',en:'Planner + Intelligence + map · synthetic data',es:'Planner + Inteligencia + mapa · datos ficticios'}[document.documentElement.lang]||'Planner + Aracne Intelligence');}
const beta=document.querySelector('.betaBanner');if(beta){const strong=beta.querySelector('strong');if(strong)strong.textContent='LAB A08';}
window.AracneA08Lab=Object.freeze({version:'A08.0',frontend:'trip-planner',mapBridge:'Leaflet existing',backend:'none',onlySynthetic:true});
})();