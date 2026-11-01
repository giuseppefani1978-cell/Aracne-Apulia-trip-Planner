'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const forbidden=['cpnjdyhsepytphwlenbg','qlihimhcfsryuhmlmhvn','sb_publishable_heDZcO0ymf5N0SbnaYBT4w_v-ItZm8S'];
function validate(c){
 if(c.environment!=='lab'||c.syntheticOnly!==true)throw Error('Lab synthetic configuration required');
 const u=new URL(c.supabaseUrl),o=new URL(c.origin);
 if(u.origin!==c.supabaseUrl||o.origin!==c.origin)throw Error('Exact origins required');
 const local=c.origin==='http://127.0.0.1:4173'&&c.supabaseUrl==='http://127.0.0.1:54321';
 if(!local&&(c.origin!=='https://lab.myapuliatrip.com'||!/^https:\/\/[a-z]{20}\.supabase\.co$/.test(c.supabaseUrl)||u.hostname.split('.')[0]!==c.projectRef))throw Error('Unapproved Lab target');
 if(!/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey))throw Error('Publishable key required; secret/JWT keys forbidden');
 if(forbidden.some(s=>JSON.stringify(c).includes(s)))throw Error('Existing backend/credential forbidden');
 return c;
}
function build(configFile){
 const c=validate(JSON.parse(fs.readFileSync(configFile))),out=path.join(root,'.lab-build');
 fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);fs.cpSync(path.join(root,'dist'),path.join(out,'dist'),{recursive:true});
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
 const csp=`default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*.tile.openstreetmap.org; connect-src ${c.supabaseUrl} https://api.open-meteo.com; object-src 'none'; base-uri 'self'; form-action 'none'; worker-src 'none'`;
 for(const f of walk(out)){
  if(!/\.(js|html|css|webmanifest)$/.test(f))continue;
  let s=fs.readFileSync(f,'utf8').replaceAll('https://cpnjdyhsepytphwlenbg.supabase.co',c.supabaseUrl).replaceAll(forbidden[2],c.publishableKey);
  if(f.endsWith('.html'))s=s.replace(/<head>/i,`<head><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="robots" content="noindex,nofollow"><script src="lab-config.js"></script><script src="lab-guard.js"></script>`).replace(/<body([^>]*)>/i,'<body$1><aside style="position:relative;z-index:99999;background:#54217a;color:white;padding:8px;text-align:center">ARACNE LAB · SYNTHETIC DATA / DONNÉES FICTIVES</aside>');
  if(f.endsWith('.webmanifest')){const m=JSON.parse(s);m.name='Aracne Lab';m.short_name='Aracne Lab';m.id='/aracne-lab';m.start_url='/dist/index.html';m.scope='/dist/';s=JSON.stringify(m,null,2)}
  if(forbidden.some(v=>s.includes(v)))throw Error('Forbidden backend in '+f);
  fs.writeFileSync(f,s);
 }
 fs.writeFileSync(path.join(out,'dist/lab-config.js'),'window.ARACNE_LAB='+JSON.stringify(c)+';');
 fs.copyFileSync(path.join(root,'scripts/lab/guard.js'),path.join(out,'dist/lab-guard.js'));
 fs.writeFileSync(path.join(out,'index.html'),'<meta http-equiv="refresh" content="0;url=/dist/index.html">');
 fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
 const files=Object.fromEntries(walk(out).map(f=>[path.relative(out,f),crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
 fs.writeFileSync(path.join(out,'release.json'),JSON.stringify({environment:'lab',syntheticOnly:true,sourceCommit:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),dirty:!!cp.execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim(),origin:c.origin,backend:c.supabaseUrl,files},null,2));
 return out;
}
module.exports={build,validate};
if(require.main===module){if(!process.argv[2])throw Error('Usage: node scripts/lab/build.cjs CONFIG.json');console.log(build(process.argv[2]))}
