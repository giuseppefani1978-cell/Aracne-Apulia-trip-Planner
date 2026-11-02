const {client}=require('../v5.dom.cjs');const assert=require('node:assert/strict');
(async()=>{const c=client('fr');try{
const w=c.w;w.prompt=()=> 'Shared A';w.aracneV5.create();const doc=w.aracneShared._shared();
w.aracneShared._setRaw({id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',token:'a'.repeat(64),role:'owner',revision:1,base:doc});
let release;w.fetch=()=>new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({role:'owner',revision:2,document:{...doc,name:'Late remote A'},last_event:0})})});
w.document.querySelector('#modal').close();
const pending=w.aracneShared._tick();for(let i=0;i<20&&!release;i++)await new Promise(r=>setImmediate(r));assert.ok(release,'read started');
w.prompt=()=> 'Solo B';w.aracneV5.create();const active=w.localStorage.getItem('aracne-v5-active');
release();await pending;
assert.equal(c.run('state.name'),'Solo B');assert.equal(w.localStorage.getItem('aracne-v5-active'),active);assert.equal(w.aracneShared._getRaw(),null);
console.log('PASS delayed read from shared A cannot overwrite newly active solo B');
}finally{c.close()}})().catch(e=>{console.error(e);process.exitCode=1});
