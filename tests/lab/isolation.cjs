const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');const {build,validate}=require('../../scripts/lab/build.cjs');
const config=require('../../staging/local.example.json');
const out=build(path.join(__dirname,'../../staging/local.example.json'));
for(const bad of [ {...config,environment:'production'},{...config,syntheticOnly:false},{...config,supabaseUrl:'https://cpnjdyhsepytphwlenbg.supabase.co'},{...config,supabaseUrl:'https://qlihimhcfsryuhmlmhvn.supabase.co'},{...config,publishableKey:'sb_secret_bad'},{...config,origin:'https://myapuliatrip.com'}])assert.throws(()=>validate(bad));
for(const file of ['index.html','index.it.html','index.en.html','index.es.html','beta-admin.html']){
 const s=fs.readFileSync(path.join(out,'dist',file),'utf8');assert.ok(s.indexOf('lab-guard.js')<s.indexOf('</head>'));assert.ok(s.includes('Content-Security-Policy'));assert.ok(!s.includes('cpnjdyhsepytphwlenbg'));
}
(async()=>{for(const origin of [config.origin,'https://myapuliatrip.com']){
 const dom=new JSDOM('',{url:origin,runScripts:'outside-only'}),w=dom.window;let calls=0;
 w.ARACNE_LAB=config;w.fetch=async()=>{calls++;return {ok:true}};
 const original=w.localStorage;original.setItem('aracne-beta-token-v1','PRODUCTION_SENTINEL');
 if(origin===config.origin){w.eval(fs.readFileSync('scripts/lab/guard.js','utf8'));assert.equal(w.localStorage.getItem('aracne-beta-token-v1'),null);w.localStorage.setItem('aracne-beta-token-v1','LAB');assert.equal(original.getItem('aracne-beta-token-v1'),'PRODUCTION_SENTINEL');w.localStorage.clear();assert.equal(original.getItem('aracne-beta-token-v1'),'PRODUCTION_SENTINEL');await w.fetch(new w.URL(config.supabaseUrl+'/rest/v1/rpc/aracne_trip_v5'));assert.equal(calls,1)}else assert.throws(()=>w.eval(fs.readFileSync('scripts/lab/guard.js','utf8')),/ORIGIN_BLOCKED/);
 for(const url of ['https://cpnjdyhsepytphwlenbg.supabase.co','https://qlihimhcfsryuhmlmhvn.supabase.co','https://myapuliatrip.com','https://evil.test'])assert.throws(()=>w.fetch(url),/NETWORK_BLOCKED/);
 assert.throws(()=>new w.XMLHttpRequest(),/XHR_DISABLED/);assert.throws(()=>new w.WebSocket('wss://evil.test'),/WEBSOCKET_DISABLED/);assert.throws(()=>new w.EventSource('https://evil.test'),/EVENTSOURCE_DISABLED/);
 dom.window.close();
}console.log('PASS Lab config, four languages, admin, storage and network isolation');})().catch(e=>{console.error(e);process.exitCode=1});
