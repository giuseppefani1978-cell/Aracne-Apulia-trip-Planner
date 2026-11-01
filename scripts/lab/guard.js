/* Loaded before any Planner script. Lab storage never imports beta sessions. */
(()=>{'use strict';const c=window.ARACNE_LAB;
 const valid=c&&c.environment==='lab'&&c.syntheticOnly===true&&location.origin===c.origin;
 const nativeFetch=window.fetch?.bind(window);
 const allowed=new Set(valid?[c.supabaseUrl,'https://api.open-meteo.com']:[]);
 function check(input){const u=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);if(!allowed.has(u.origin))throw Error('ARACNE_LAB_NETWORK_BLOCKED');}
 window.fetch=(input,options)=>{check(input);return nativeFetch(input,{...options,redirect:'error',credentials:'omit'})};
 // The current Planner uses fetch only. Disable alternate outbound transports.
 window.XMLHttpRequest=function(){throw Error('ARACNE_LAB_XHR_DISABLED')};
 window.WebSocket=function(){throw Error('ARACNE_LAB_WEBSOCKET_DISABLED')};
 window.EventSource=function(){throw Error('ARACNE_LAB_EVENTSOURCE_DISABLED')};
 if(navigator.sendBeacon)navigator.sendBeacon=()=>false;
 if(navigator.serviceWorker)navigator.serviceWorker.register=()=>Promise.reject(Error('LAB_SERVICE_WORKER_DISABLED'));
 for(const name of ['localStorage','sessionStorage']){
  const storage=window[name],prefix='aracne-lab:v1:';
  const keys=()=>Object.keys(storage).filter(k=>k.startsWith(prefix));
  Object.defineProperty(window,name,{configurable:false,value:Object.freeze({
   getItem:k=>valid?storage.getItem(prefix+k):null,
   setItem:(k,v)=>{if(!valid)throw Error('LAB_ORIGIN_BLOCKED');storage.setItem(prefix+k,String(v))},
   removeItem:k=>{if(valid)storage.removeItem(prefix+k)},
   clear:()=>{if(valid)keys().forEach(k=>storage.removeItem(k))},
   key:i=>keys()[i]?.slice(prefix.length)||null,get length(){return keys().length}
  })});
 }
 if(!valid)throw Error('LAB_ORIGIN_BLOCKED');
})();
