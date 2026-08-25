import { chapters, exercises, sources, coverageAudit } from './data.mjs';
import { checkAnswer } from './validator.mjs';
import { explainShellCommand } from './explainer.mjs';
import { initHero } from './hero.mjs';

const $=s=>document.querySelector(s);
const els={
  hero:$('#hero'),workspace:$('#workspace'),nav:$('#chapterNav'),search:$('#chapterSearch'),title:$('#chapterTitle'),content:$('#chapterContent'),
  input:$('#answerInput'),prompt:$('#questionPrompt'),qid:$('#questionId'),diff:$('#difficultyBadge'),verdict:$('#verdict'),feedback:$('#feedback'),source:$('#sourceDisclosure'),sourceBody:$('#sourceBody'),
  refresh:$('#refreshQuestion'),check:$('#checkBtn'),hint:$('#hintBtn'),showAnswer:$('#showAnswerBtn'),explain:$('#explainBtn'),correct:$('#statCorrect'),streak:$('#statStreak'),accuracy:$('#statAccuracy'),progressRing:$('#progressRing'),progressPercent:$('#progressPercent'),progressText:$('#progressText'),
  audit:$('#auditDialog'),auditBtn:$('#auditBtn'),closeAudit:$('#closeAudit'),auditContent:$('#auditContent'),burst:$('#burstLayer')
};

const storageKey='cma-linux-progress-v1';
const legacyStorageKey='linux-shell-academy-progress-v1';
const savedText=localStorage.getItem(storageKey)||localStorage.getItem(legacyStorageKey)||'{}';
const saved=JSON.parse(savedText);
if(!localStorage.getItem(storageKey)&&localStorage.getItem(legacyStorageKey)){localStorage.setItem(storageKey,savedText);}
const state={chapterId:Number(saved.chapterId)||1,currentId:null,wrong:0,stats:saved.stats||{},solved:new Set(saved.solved||[]),globalCorrect:saved.globalCorrect||0,globalAttempts:saved.globalAttempts||0,streak:saved.streak||0};

function save(){localStorage.setItem(storageKey,JSON.stringify({chapterId:state.chapterId,stats:state.stats,solved:[...state.solved],globalCorrect:state.globalCorrect,globalAttempts:state.globalAttempts,streak:state.streak}));}
function chapterExercises(id){return exercises.filter(e=>e.chapterId===id)}
function currentExercise(){return exercises.find(e=>e.id===state.currentId)}
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function fmtCommand(s){return `<code>${esc(s)}</code>`}
function inlineCode(s=''){return esc(s).replace(/`([^`]+)`/g,'<code>$1</code>')}
function chapterStat(id){return state.stats[id]||{correct:0,attempts:0}}

function renderNav(filter=''){
  const q=filter.trim().toLowerCase();
  els.nav.innerHTML='';
  for(const c of chapters){
    const hay=(c.title+' '+c.anatomy+' '+c.examples.join(' ')).toLowerCase(); if(q&&!hay.includes(q))continue;
    const st=chapterStat(c.id);const btn=document.createElement('button');btn.className='chapter-link'+(c.id===state.chapterId?' active':'');btn.type='button';
    btn.innerHTML=`<span class="chapter-num">${String(c.id).padStart(2,'0')}</span><span class="chapter-label">${esc(c.title)}</span><span class="chapter-mini">${st.correct}/${chapterExercises(c.id).length}</span>`;
    btn.addEventListener('click',()=>selectChapter(c.id));els.nav.appendChild(btn);
  }
}

function renderChapter(){
  const c=chapters.find(x=>x.id===state.chapterId);els.title.textContent=`${String(c.id).padStart(2,'0')} · ${c.title}`;
  els.content.innerHTML=`
    <section class="lesson-card glass full"><h3>Concept · 这一章到底在学什么</h3><p>${esc(c.concept)}</p></section>
    <section class="lesson-card glass"><h3>Syntax anatomy · 语法骨架</h3><div class="code-block">${esc(c.anatomy)}</div></section>
    <section class="lesson-card glass"><h3>Examples · 从简单到科研</h3><div class="example-list">${c.examples.map(x=>`<div class="example-item">$ ${esc(x)}</div>`).join('')}</div></section>
    <section class="lesson-card glass"><h3>Common mistake</h3><div class="callout danger"><div class="callout-icon">!</div><p>${esc(c.mistake)}</p></div></section>
    <section class="lesson-card glass"><h3>Research habit</h3><div class="callout"><div class="callout-icon">✓</div><p>${esc(c.habit)}</p></div></section>
    <section class="lesson-card glass full"><h3>Mini recap</h3><p>${esc(c.recap)}</p></section>`;
  updateStats();
}

function selectChapter(id){state.chapterId=id;state.wrong=0;save();renderNav(els.search.value);renderChapter();pickQuestion();scrollTo({top:innerHeight+1,behavior:'smooth'});}
function pickQuestion(forceDifferent=true){
  const pool=chapterExercises(state.chapterId);let choices=pool;if(forceDifferent&&pool.length>1)choices=pool.filter(e=>e.id!==state.currentId);const ex=choices[Math.floor(Math.random()*choices.length)]||pool[0];state.currentId=ex.id;state.wrong=0;els.input.value='';els.feedback.hidden=true;setVerdict('waiting');renderQuestion(ex);els.input.focus({preventScroll:true});
}
function renderQuestion(ex){
  els.qid.textContent=`CH${String(ex.chapterId).padStart(2,'0')} / ${ex.id.split('-q')[1].padStart(2,'0')}`;els.prompt.textContent=ex.prompt;els.diff.textContent=ex.difficulty.toUpperCase();
  const src=ex.sourceId&&sources[ex.sourceId];els.source.hidden=!src;if(src){els.sourceBody.innerHTML=`<strong>${esc(src.type)}</strong> · ${esc(src.title)}<br><a href="${src.url}" target="_blank" rel="noreferrer">打开官方/社区来源 ↗</a><p>本题只概括与 Shell/VASP 工作流相关的要点，不复制长段原文。</p>`;}
}
function setVerdict(kind){els.verdict.className='verdict '+kind;if(kind==='correct')els.verdict.innerHTML='<span>BINGO ✓</span><small>语义正确，自动进入下一题</small>';else if(kind==='wrong')els.verdict.innerHTML='<span>WRONG ×</span><small>修改命令后再次提交</small>';else els.verdict.innerHTML='<span>WAITING</span><small>输入命令后按 Enter</small>';}
function burst(){const r=els.verdict.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;for(let i=0;i<22;i++){const d=document.createElement('i');d.className='burst-dot';const a=Math.random()*Math.PI*2,dist=30+Math.random()*90;d.style.left=cx+'px';d.style.top=cy+'px';d.style.setProperty('--x',Math.cos(a)*dist+'px');d.style.setProperty('--y',Math.sin(a)*dist+'px');els.burst.appendChild(d);setTimeout(()=>d.remove(),760);}}
function submit(){
  const ex=currentExercise();if(!ex)return;const result=checkAnswer(els.input.value,ex);if(result.empty)return;
  state.globalAttempts++;const st=state.stats[state.chapterId]||{correct:0,attempts:0};st.attempts++;state.stats[state.chapterId]=st;
  if(result.correct){setVerdict('correct');state.globalCorrect++;state.streak++;st.correct++;state.solved.add(ex.id);els.feedback.hidden=true;burst();save();updateStats();setTimeout(()=>pickQuestion(),820);}
  else{setVerdict('wrong');state.streak=0;state.wrong++;els.feedback.hidden=false;els.feedback.textContent=result.reason==='dangerous'?'这条命令被安全规则拦截：训练器不会鼓励广泛破坏性删除。':'语法或语义还不对。先比较“命令做什么、选项改变什么、操作对象是谁”。';save();updateStats();}
}
function updateStats(){
  const st=chapterStat(state.chapterId),acc=st.attempts?Math.round(st.correct/st.attempts*100):0;els.correct.textContent=state.globalCorrect;els.streak.textContent=state.streak;els.accuracy.textContent=acc+'%';
  const pct=Math.round(state.solved.size/exercises.length*100);els.progressRing.style.setProperty('--p',(pct*3.6)+'deg');els.progressPercent.textContent=pct+'%';els.progressText.textContent=`${state.solved.size} / ${exercises.length} 题答对`;
  renderNav(els.search.value);
}
function showHint(){const ex=currentExercise();els.feedback.hidden=false;els.feedback.innerHTML=`<div class="feedback-title">提示</div><p>${inlineCode(ex.hint)}</p>`;}
function showAnswer(){const ex=currentExercise();els.feedback.hidden=false;els.feedback.innerHTML=`<div class="feedback-title">标准答案</div><p class="answer-note">你可以先照着答案修改自己的命令，再自己点击 RUN / CHECK。查看答案本身不会计错。</p><div class="code-block answer-code">$ ${esc(ex.answers[0])}</div><p class="answer-note">如果命令里有你不认识的词，点击 <strong>逐段详解</strong>，网站会把命令、选项、参数、管道和重定向一个个拆开。</p>`;}
function showExplanation(){
  const ex=currentExercise();
  const answer=ex.answers[0];
  const detail=explainShellCommand(answer);
  const parts=detail.parts.map((p,i)=>`<article class="answer-part"><div class="part-index">${String(i+1).padStart(2,'0')}</div><div><div class="part-token">${esc(p.token)}</div><div class="part-meaning">${inlineCode(p.meaning)}</div><p>${inlineCode(p.detail)}</p>${p.example?`<div class="part-example">${inlineCode(p.example)}</div>`:''}</div></article>`).join('');
  const flow=detail.flow.map((x,i)=>`<li><span>${i+1}</span><div>${inlineCode(x)}</div></li>`).join('');
  const confusions=detail.confusions.length?`<section class="answer-section confusion"><h4>易混淆字符 / 陷阱</h4><ul>${detail.confusions.map(x=>`<li>${inlineCode(x)}</li>`).join('')}</ul></section>`:'';
  els.feedback.hidden=false;
  els.feedback.innerHTML=`<div class="answer-detail-head"><div><div class="feedback-title">逐段详解</div><p>不是背这一串字符，而是搞清楚每一块为什么存在。</p></div><div class="code-block answer-code">$ ${esc(answer)}</div></div><section class="answer-section"><h4>① 命令逐块拆解</h4><div class="answer-parts">${parts}</div></section><section class="answer-section"><h4>② 整句执行流程</h4><ol class="execution-flow">${flow}</ol></section><section class="answer-section remember"><h4>③ 本题要记住</h4><p>${inlineCode(detail.remember)}</p></section>${confusions}<section class="answer-section"><h4>④ 这道题本身在考什么</h4><p>${inlineCode(ex.explanation)}</p></section>`;
}

function renderAudit(){
  const srcRows=Object.values(sources).map(s=>`<div class="source-row"><span><strong>${esc(s.type)}</strong><br>${esc(s.title)}</span><a href="${s.url}" target="_blank" rel="noreferrer">来源 ↗</a></div>`).join('');
  els.auditContent.innerHTML=`<div class="audit-grid"><div class="audit-metric"><strong>${coverageAudit.chapterCount}</strong><span>课程章节</span></div><div class="audit-metric"><strong>${coverageAudit.exerciseCount}</strong><span>训练题</span></div><div class="audit-metric"><strong>${coverageAudit.lastReviewed}</strong><span>内容复核日期</span></div></div><h3>Round 1 · 内容覆盖与正确性</h3><ul class="audit-list">${coverageAudit.claims.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>Round 2 · 设计与功能检查</h3><ul class="audit-list"><li>粒子标题：Canvas 采样文字、鼠标径向排斥、弹簧阻尼回位。</li><li>首屏滚动：Hero 上移、模糊、渐隐；Workspace 渐显上滑。</li><li>练习：单题、随机刷新、BINGO 自动下一题、WRONG 保留题目。</li><li>进度：localStorage 恢复、章节准确率、连续正确、总进度。</li><li>无障碍：键盘 Enter 提交、焦点按钮、prefers-reduced-motion 降级。</li></ul><h3>Authoritative sources</h3><div class="source-list">${srcRows}</div><p class="audit-list"><strong>边界声明：</strong>VASP Forum 持续变化，本课程不声称穷尽每一篇社区帖子；它系统覆盖与 Linux/Shell/HPC/VASP 工作流直接相关的主要知识与排错模式。</p>`;
}
function revealOnScroll(){const forced=new URLSearchParams(location.search).has('workspace');const y=scrollY,trigger=Math.min(innerHeight*.12,100);const visible=forced||y>trigger;els.hero.classList.toggle('scrolled',visible);els.workspace.classList.toggle('visible',visible);}

els.search.addEventListener('input',e=>renderNav(e.target.value));els.refresh.addEventListener('click',()=>pickQuestion());els.check.addEventListener('click',submit);els.hint.addEventListener('click',showHint);els.showAnswer.addEventListener('click',showAnswer);els.explain.addEventListener('click',showExplanation);els.input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();}});
els.auditBtn.addEventListener('click',()=>{renderAudit();els.audit.showModal()});els.closeAudit.addEventListener('click',()=>els.audit.close());addEventListener('scroll',revealOnScroll,{passive:true});
initHero($('#particleCanvas'));renderNav();renderChapter();pickQuestion(false);updateStats();revealOnScroll();
