export function normalizeCommand(input='') {
  return input
    .trim()
    .replace(/\s+/g,' ')
    .replace(/\s*(>>|2>>|2>|>)\s*/g,' $1 ')
    .replace(/\s+/g,' ')
    .trim();
}

function stripSimpleQuotes(s){
  return s.replace(/(["'])([A-Za-z0-9_./|:+*?=-]+)\1/g,'$2');
}

function tokens(input){
  const out=[]; const re=/"[^"]*"|'[^']*'|\S+/g; let m;
  while((m=re.exec(input))) out.push(m[0]);
  return out;
}

export function isDangerous(input='') {
  const s=normalizeCommand(input).toLowerCase();
  if(/:\(\)\s*\{.*:\|:.*\}/.test(s)) return true;
  if(/\brm\s+[^\n]*(?:-rf|-fr|-r\s+-f|-f\s+-r)[^\n]*\s\/$/.test(s)) return true;
  if(/\brm\s+[^\n]*(?:-rf|-fr)[^\n]*(?:\s|^)(\*|\.\/\*|~\/\*)\s*$/.test(s)) return true;
  if(/\bmkfs\b|\bdd\s+if=.*of=\/dev\//.test(s)) return true;
  return false;
}

function sameExactish(a,b){
  return stripSimpleQuotes(normalizeCommand(a))===stripSimpleQuotes(normalizeCommand(b));
}

function parseTail(s){
  const t=tokens(normalizeCommand(s));
  if(t[0]!=='tail') return null;
  let count=10,file=null,follow=false;
  for(let i=1;i<t.length;i++){
    const x=t[i];
    if(x==='-f') follow=true;
    else if(x==='-n' && t[i+1]) count=Number(t[++i]);
    else if(/^-[0-9]+$/.test(x)) count=Number(x.slice(1));
    else if(!x.startsWith('-')) file=x.replace(/^['"]|['"]$/g,'');
  }
  return {count,file,follow};
}

function parseGrep(s){
  const t=tokens(normalizeCommand(s));
  if(t[0]!=='grep') return null;
  const flags=new Set(); let pattern=null,file=null;
  for(let i=1;i<t.length;i++){
    const x=t[i];
    if(/^-[A-Za-z]+$/.test(x)) for(const c of x.slice(1)) flags.add(c);
    else if(pattern===null) pattern=x.replace(/^['"]|['"]$/g,'');
    else if(file===null) file=x.replace(/^['"]|['"]$/g,'');
  }
  return {flags,pattern,file};
}

function validateTail(input,ex){
  const p=parseTail(input); if(!p) return false;
  return p.file===ex.meta.file && p.count===Number(ex.meta.count) && !!p.follow===!!ex.meta.follow;
}
function validateGrep(input,ex){
  const p=parseGrep(input); if(!p) return false;
  const required=new Set(ex.meta.flags||[]);
  return p.file===ex.meta.file && p.pattern===ex.meta.pattern && [...required].every(f=>p.flags.has(f));
}
function validateCopy(input,ex){
  const t=tokens(normalizeCommand(input));
  if(t[0]!=='cp') return false;
  const hasP=t.includes('-p') || t.some(x=>/^-[A-Za-z]*p[A-Za-z]*$/.test(x));
  if(!hasP) return false;
  const operands=t.slice(1).filter(x=>!x.startsWith('-'));
  if(operands.at(-1)!==ex.meta.dest) return false;
  const got=operands.slice(0,-1).sort(); const want=[...ex.meta.sources].sort();
  return got.length===want.length && got.every((x,i)=>x===want[i]);
}

export function checkAnswer(input,exercise){
  const raw=input??'';
  if(!raw.trim()) return {correct:false,empty:true,reason:'empty'};
  if(isDangerous(raw) && !exercise.allowDangerous) return {correct:false,reason:'dangerous'};
  let correct=false;
  switch(exercise.validator){
    case 'tailLines': correct=validateTail(raw,exercise); break;
    case 'grepFlags': correct=validateGrep(raw,exercise); break;
    case 'copyPreserve': correct=validateCopy(raw,exercise); break;
    case 'exactish':
    default: correct=(exercise.answers||[]).some(a=>sameExactish(raw,a));
  }
  return {correct,empty:false,reason:correct?'ok':'mismatch'};
}
