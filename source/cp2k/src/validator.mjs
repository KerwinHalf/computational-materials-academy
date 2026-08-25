function stripComments(line='') {
  let inSingle=false, inDouble=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==="'" && !inDouble) inSingle=!inSingle;
    else if(c==='"' && !inSingle) inDouble=!inDouble;
    else if((c==='!' || c==='#') && !inSingle && !inDouble) return line.slice(0,i);
  }
  return line;
}

export function normalizeText(text='') {
  return text
    .replace(/\r/g,'')
    .split('\n')
    .map(stripComments)
    .map(x=>x.trim().replace(/\s+/g,' '))
    .filter(Boolean)
    .map(x=>x.toUpperCase())
    .join('\n');
}

export function parseCp2kSections(text='') {
  const stack=[];
  const sections=new Set();
  const keywords=new Map();
  const normalized=normalizeText(text);
  for(const line of normalized.split('\n').filter(Boolean)){
    if(/^&END(?:\s+\S+)?$/.test(line)){
      stack.pop();
      continue;
    }
    if(line.startsWith('&')){
      const name=line.slice(1).split(/\s+/)[0];
      stack.push(name);
      const path=stack.join('/');
      sections.add(path);
      if(!keywords.has(path)) keywords.set(path,new Map());
      continue;
    }
    const path=stack.join('/');
    if(!path) continue;
    if(!keywords.has(path)) keywords.set(path,new Map());
    const [key,...rest]=line.split(/\s+/);
    keywords.get(path).set(key,rest.join(' '));
  }
  return {sections,keywords,normalized};
}

function containsNormalized(hay, needle){
  return hay.includes(normalizeText(needle));
}

function exactish(input, answers=[]){
  const n=normalizeText(input);
  return answers.some(a=>normalizeText(a)===n);
}

function oneOf(input, answers=[]){ return exactish(input,answers); }

function containsAll(input, required=[]){
  const n=normalizeText(input);
  return required.every(r=>containsNormalized(n,r));
}

function sectionContains(input, meta={}){
  const parsed=parseCp2kSections(input);
  const target=String(meta.section||'').toUpperCase();
  if(!parsed.sections.has(target)) return false;
  const block=parsed.keywords.get(target)||new Map();
  return (meta.required||[]).every(item=>{
    const n=normalizeText(item);
    const [key,...rest]=n.split(/\s+/);
    const expected=rest.join(' ');
    if(!block.has(key)) return false;
    return expected==='' || block.get(key)===expected;
  });
}

function forbidTogether(input, meta={}){
  const n=normalizeText(input);
  const required=(meta.required||[]).every(x=>containsNormalized(n,x));
  if(!required) return false;
  return !(meta.forbiddenWithRequired||[]).some(x=>containsNormalized(n,x));
}

export function checkAnswer(input, exercise={}) {
  if(!String(input||'').trim()) return {empty:true,correct:false};
  let correct=false;
  switch(exercise.validator){
    case 'containsAll': correct=containsAll(input,exercise.meta?.required||[]); break;
    case 'sectionContains': correct=sectionContains(input,exercise.meta||{}); break;
    case 'forbidTogether': correct=forbidTogether(input,exercise.meta||{}); break;
    case 'oneOf': correct=oneOf(input,exercise.answers||[]); break;
    case 'exactish':
    default: correct=exactish(input,exercise.answers||[]); break;
  }
  return {empty:false,correct,reason:correct?'ok':'semantic'};
}
