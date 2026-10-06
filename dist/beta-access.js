/* Aracne Beta 1 · private access gate. */
(function(){
'use strict';
var SUPABASE='https://cpnjdyhsepytphwlenbg.supabase.co';
var KEY='sb_publishable_heDZcO0ymf5N0SbnaYBT4w_v-ItZm8S';
var TOKEN_KEY='aracne-beta-token-v1';
var MODE_KEY='aracne-beta-mode-v1';
var PROFILE_KEY='aracne-beta-profile-v1';

function hex(bytes){bytes=bytes||32;var a=new Uint8Array(bytes);crypto.getRandomValues(a);return Array.from(a).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
function uuid(){if(crypto.randomUUID)return crypto.randomUUID();var s=hex(16);return s.slice(0,8)+'-'+s.slice(8,12)+'-4'+s.slice(13,16)+'-8'+s.slice(17,20)+'-'+s.slice(20,32)}
function token(){var t='';try{t=localStorage.getItem(TOKEN_KEY)||''}catch(e){}if(!/^[a-f0-9]{64}$/.test(t)){t=hex(32);try{localStorage.setItem(TOKEN_KEY,t)}catch(e){}}return t}
async function post(path,body){
 var r=await fetch(SUPABASE+path,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json','x-aracne-beta':token()},body:JSON.stringify(body)});
 var j=await r.json().catch(function(){return {error:'offline'}});if(!r.ok)throw Error('http_'+r.status);return j;
}
async function betaRpc(action,data){return post('/rest/v1/rpc/aracne_beta',{p_action:action,p_data:data||{}})}
async function detectMode(){
 var r=await post('/rest/v1/rpc/aracne_workspace',{p_action:'list',p_id:uuid(),p_token:token()});
 var enabled=r&&r.error==='beta_required';try{localStorage.setItem(MODE_KEY,enabled?'on':'off')}catch(e){}return enabled;
}
async function session(){var r=await betaRpc('session');if(r&&r.ok){try{localStorage.setItem(PROFILE_KEY,JSON.stringify({nickname:r.nickname||'',admin:!!r.admin}))}catch(e){}}return r}
function addStyle(){
 if(document.querySelector('#aracneBetaAccessStyle'))return;
 var s=document.createElement('style');s.id='aracneBetaAccessStyle';
 s.textContent='.betaAccessBackdrop{position:fixed;inset:0;z-index:2147483000;background:linear-gradient(145deg,#fffaf3,#f5eef8 54%,#eef7f5);display:grid;place-items:center;padding:18px;font-family:Outfit,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#251c2a}.betaAccessCard{width:min(520px,100%);background:#fff;border:1px solid rgba(82,53,92,.14);border-radius:28px;padding:28px;box-shadow:0 24px 70px rgba(62,39,70,.16)}.betaAccessBrand{display:flex;align-items:center;gap:12px;margin-bottom:22px}.betaAccessMark{width:42px;height:42px;border-radius:14px;background:#8A2387;color:#fff;display:grid;place-items:center;font-weight:800;font-size:22px}.betaAccessBrand small{display:block;color:#776d7b;font-size:11px}.betaAccessCard h1{font-size:clamp(27px,7vw,40px);line-height:1.05;margin:0 0 10px}.betaAccessCard p{color:#6c626f;line-height:1.5}.betaAccessFields{display:grid;gap:12px;margin-top:20px}.betaAccessFields label{font-size:12px;font-weight:700}.betaAccessFields input{width:100%;box-sizing:border-box;margin-top:6px;border:1px solid #d8cedb;border-radius:14px;padding:14px 15px;font:inherit}.betaAccessFields button{border:0;border-radius:14px;padding:14px 18px;background:#8A2387;color:#fff;font:inherit;font-weight:800}.betaAccessStatus{min-height:22px;margin-top:12px;font-size:13px}.betaAccessNote{font-size:12px!important}@media(max-width:520px){.betaAccessCard{padding:22px;border-radius:22px}}';
 document.head.appendChild(s);
}
function rawCode(v){return String(v||'').toUpperCase().replace(/[^A-F0-9]/g,'').slice(0,24)}
function fmt(v){return rawCode(v).replace(/(.{6})(?=.)/g,'$1-')}
function showGate(){
 addStyle();var root=document.querySelector('#aracneBetaAccess');if(root)return root;
 root=document.createElement('div');root.id='aracneBetaAccess';root.className='betaAccessBackdrop';
 root.innerHTML='<section class="betaAccessCard" role="dialog" aria-modal="true"><div class="betaAccessBrand"><span class="betaAccessMark">A</span><span><b>ARACNE</b><small>BETA 1 · ACCÈS PRIVÉ</small></span></div><h1>Bienvenue dans la bêta.</h1><p>Entrez le code reçu par WhatsApp. Un code active un seul navigateur et n’exige ni compte ni adresse e-mail.</p><div class="betaAccessFields"><label>Votre prénom ou pseudo<input id="betaAccessNickname" maxlength="60" placeholder="Anaïs"></label><label>Code d’accès<input id="betaAccessCode" autocomplete="one-time-code" placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX"></label><button id="betaAccessSubmit" type="button">Entrer dans Aracne</button></div><p class="betaAccessStatus" id="betaAccessStatus" role="status"></p><p class="betaAccessNote">Vos voyages partagés conservent leurs propres droits lecture / modification.</p></section>';
 document.body.appendChild(root);
 root.querySelector('#betaAccessCode').oninput=function(e){e.target.value=fmt(e.target.value)};
 root.querySelector('#betaAccessSubmit').onclick=activate;
 return root;
}
async function activate(){
 var root=showGate(),nickname=root.querySelector('#betaAccessNickname').value.trim(),code=rawCode(root.querySelector('#betaAccessCode').value),st=root.querySelector('#betaAccessStatus'),b=root.querySelector('#betaAccessSubmit');
 if(!nickname){st.textContent='Indiquez votre prénom ou pseudo.';return}if(code.length!==24){st.textContent='Le code doit contenir 24 caractères.';return}
 b.disabled=true;st.textContent='Vérification du code…';
 try{var r=await betaRpc('activate',{code:code,nickname:nickname});if(r&&r.ok){try{localStorage.setItem(MODE_KEY,'on');localStorage.setItem(PROFILE_KEY,JSON.stringify({nickname:r.nickname||nickname,admin:!!r.admin}))}catch(e){}st.textContent='Accès activé. Ouverture d’Aracne…';setTimeout(function(){location.reload()},150);return}
 var m={invalid_code:'Code invalide ou révoqué.',used_code:'Ce code a déjà été utilisé sur un autre navigateur.',session_exists:'Ce navigateur possède déjà un accès bêta.'};st.textContent=m[r&&r.error]||'Impossible d’activer ce code.'}catch(e){st.textContent='Connexion impossible.'}finally{b.disabled=false}
}
async function boot(){
 var known=false;try{known=localStorage.getItem(MODE_KEY)==='on'}catch(e){}
 try{var enabled=await detectMode();if(!enabled){window.aracneBetaAccess={enabled:false,token:token,betaRpc:betaRpc};return}known=true}catch(e){if(!known){return}}
 try{var s=await session();if(s&&s.ok){window.aracneBetaAccess={enabled:true,active:true,admin:!!s.admin,nickname:s.nickname||'',token:token,betaRpc:betaRpc};return}}catch(e){}
 showGate();window.aracneBetaAccess={enabled:true,active:false,token:token,betaRpc:betaRpc};
}
window.aracneBetaAccess={enabled:null,token:token,betaRpc:betaRpc};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();