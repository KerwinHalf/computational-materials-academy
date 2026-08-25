import fs from 'node:fs';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const parts=['src/data.mjs','src/validator.mjs','src/hero.mjs','src/app.mjs'].map(p=>fs.readFileSync(path.join(root,p),'utf8'));
const js=parts.map((s,i)=>{
  if(i===3) s=s.replace(/^import .*$/gm,'');
  return s.replace(/\bexport\s+(?=(const|function|class|let|var)\b)/g,'');
}).join('\n\n');
html=html.replace('<link rel="stylesheet" href="./styles.css" />',`<style>\n${css}\n</style>`);
html=html.replace('<script type="module" src="./src/app.mjs"></script>',`<script type="module">\n${js}\n</script>`);
fs.writeFileSync(path.join(root,'CP2K_Academy_VASP_Migration.html'),html);
console.log('built',path.join(root,'CP2K_Academy_VASP_Migration.html'));
