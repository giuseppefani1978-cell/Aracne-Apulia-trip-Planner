from pathlib import Path
import re,json
root=Path(__file__).parent
rows=[]
for i,line in enumerate((root/'src/translations.tsv').read_text().splitlines(),1):
    if not line: continue
    parts=line.split('\t')
    if len(parts)!=4: raise ValueError(f'Line {i}: {len(parts)} columns')
    # Straight apostrophes would require escaping in JS single-quoted strings.
    parts[1:]=[s.replace("'",'’') for s in parts[1:]]
    rows.append(parts)
lookup={r[0]:r for r in rows}
pattern=re.compile('|'.join(re.escape(k) for k in sorted(lookup,key=len,reverse=True)))
def tr(s,col): return pattern.sub(lambda m:lookup[m.group(0)][col],s) if col else s
html=(root/'src/index.fr.html').read_text()
js=(root/'src/app.fr.js').read_text()
# Explicit plural handling; IDs and stored enumerations remain language independent.
js=js.replace("${i+1} jour${i?'s':''}","${i+1} ${i?'jours':'jour'}")
selector='<select id="language" aria-label="Language / Lingua / Langue / Idioma"><option value="fr">FR · Français</option><option value="it">IT · Italiano</option><option value="en">EN · English</option><option value="es">ES · Español</option></select>'
html=html.replace('<span class="test">ÉDITION TEST · FR</span>',selector)
html=html.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="mobile-photo.css"><script src="language-start.js"></script>')
# The source fields of curated stop descriptions; never translate personal notes.
raw_section=js[js.index('const raw=['):js.index('const places=')]
catalog=re.findall(r",'([^']+)'\]",raw_section)
suffix=' Pour une sortie le soir, cherchez un établissement ouvert à vos dates et prévoyez le retour.'
for col,lang in enumerate(['fr','it','en','es']):
    out=tr(js,col)
    if col:
        singular=['jour','giorno','day','día'][col];plural=['jours','giorni','days','días'][col]
        out=out.replace("i?'jours':'jour'",f"i?'{plural}':'{singular}'")
        out=out.replace("'fr-FR'",repr({'it':'it-IT','en':'en-GB','es':'es-ES'}[lang]))
    content={}
    for phrase in catalog:
        for oldcol in range(4):
            content[tr(phrase,oldcol)]=tr(phrase,col)
            content[tr(phrase+suffix,oldcol)]=tr(phrase+suffix,col)
    defaultnames={tr('Notre EVJF dans les Pouilles',c):tr('Notre EVJF dans les Pouilles',col) for c in range(4)}
    migrate='const translatedCatalog='+json.dumps(content,ensure_ascii=False)+';\n'
    migrate+='for(const p of state.plan.flat()){if(p.id&&Object.prototype.hasOwnProperty.call(translatedCatalog,p.desc))p.desc=translatedCatalog[p.desc];}\n'
    migrate+='const defaultNames='+json.dumps(defaultnames,ensure_ascii=False)+';if(Object.prototype.hasOwnProperty.call(defaultNames,state.name))state.name=defaultNames[state.name];\n'
    out=out.replace('\nfillForm();','\n'+migrate+'fillForm();')
    extra="""
const currentLanguage=LANG;
$('#language').value=currentLanguage;
try{localStorage.setItem('aracne-language',currentLanguage)}catch{}
$('#language').onchange=()=>{
 const lang=$('#language').value;
 const fields={};for(const e of $$('main input,main select,main textarea')){if(e.id&&e.type!=='file')fields[e.id]={value:e.value,checked:e.checked};}
 try{sessionStorage.setItem('aracne-language-draft',JSON.stringify({fields,view,day}));localStorage.setItem('aracne-language',lang)}catch{}
 location.assign(lang==='fr'?'index.html':'index.'+lang+'.html');
};
try{const packed=sessionStorage.getItem('aracne-language-draft');if(packed){sessionStorage.removeItem('aracne-language-draft');const draft=JSON.parse(packed);if(['prepare','map','plan','budget','notes'].includes(draft.view)){day=Math.max(0,Math.min(state.days-1,Number(draft.day)||0));show(draft.view)}for(const [id,v] of Object.entries(draft.fields||{})){const e=document.getElementById(id);if(e&&e.type!=='file'&&e.closest('main')){e.value=id==='tripName'&&Object.prototype.hasOwnProperty.call(defaultNames,v.value)?defaultNames[v.value]:v.value;if(e.type==='checkbox')e.checked=v.checked}}}}
catch{}
""".replace('LANG',json.dumps(lang))
    out+=extra
    (root/f'dist/app.{lang}.js').write_text(out)
    page=tr(html,col).replace('<html lang="fr">',f'<html lang="{lang}">').replace('src="app.js"',f'src="app.{lang}.js"')
    page=page.replace('</head>', '<link rel="stylesheet" href="v2.css"><link rel="stylesheet" href="v21.css"><link rel="stylesheet" href="shared-trips.css"><link rel="stylesheet" href="experience.css?v=5.0.0"><link rel="stylesheet" href="collaboration-v3.css"><link rel="stylesheet" href="v5.css?v=5.1.0"><link rel="stylesheet" href="beta.css?v=1.0.0-beta.1"></head>')
    page=page.replace('</body>', '<script src="catalog-v2.js?v=1.0.0-beta.1"></script><script src="v2.js"></script><script src="v21.js"></script><script src="shared-trips.js?v=5.1.0"></script><script src="experience.js?v=5.1.0"></script><script src="collaboration-v3.js"></script><script src="v5.js?v=5.1.0"></script><script src="invitations-v51.js?v=5.1.0"></script><script src="beta.js?v=1.0.0-beta.1"></script></body>')
    (root/('dist/index.html' if lang=='fr' else f'dist/index.{lang}.html')).write_text(page)
print('Built four locales from one source and',len(rows),'translation entries.')
