import { chapters, exercises, sources, coverageAudit, vaspCp2kMap } from './data.mjs';
import { checkAnswer } from './validator.mjs';
import { initHero } from './hero.mjs';

const $=s=>document.querySelector(s);
const els={
  hero:$('#hero'),workspace:$('#workspace'),nav:$('#chapterNav'),search:$('#chapterSearch'),title:$('#chapterTitle'),content:$('#chapterContent'),
  input:$('#answerInput'),prompt:$('#questionPrompt'),qid:$('#questionId'),diff:$('#difficultyBadge'),verdict:$('#verdict'),feedback:$('#feedback'),source:$('#sourceDisclosure'),sourceBody:$('#sourceBody'),
  refresh:$('#refreshQuestion'),check:$('#checkBtn'),hint:$('#hintBtn'),answer:$('#answerBtn'),explain:$('#explainBtn'),correct:$('#statCorrect'),streak:$('#statStreak'),accuracy:$('#statAccuracy'),progressRing:$('#progressRing'),progressPercent:$('#progressPercent'),progressText:$('#progressText'),
  audit:$('#auditDialog'),auditBtn:$('#auditBtn'),closeAudit:$('#closeAudit'),auditContent:$('#auditContent'),burst:$('#burstLayer')
};

const storageKey='cma-cp2k-progress-v1';
const legacyStorageKey='cp2k-academy-progress-v1';
const savedText=localStorage.getItem(storageKey)||localStorage.getItem(legacyStorageKey)||'{}';
const saved=JSON.parse(savedText);
if(!localStorage.getItem(storageKey)&&localStorage.getItem(legacyStorageKey)){localStorage.setItem(storageKey,savedText);}
const state={chapterId:Number(saved.chapterId)||1,currentId:null,stats:saved.stats||{},solved:new Set(saved.solved||[]),globalCorrect:saved.globalCorrect||0,globalAttempts:saved.globalAttempts||0,streak:saved.streak||0};

function save(){localStorage.setItem(storageKey,JSON.stringify({chapterId:state.chapterId,stats:state.stats,solved:[...state.solved],globalCorrect:state.globalCorrect,globalAttempts:state.globalAttempts,streak:state.streak}));}
function chapterExercises(id){return exercises.filter(e=>e.chapterId===id)}
function currentExercise(){return exercises.find(e=>e.id===state.currentId)}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function chapterStat(id){return state.stats[id]||{correct:0,attempts:0}}

function renderNav(filter=''){
  const q=filter.trim().toLowerCase();els.nav.innerHTML='';
  for(const c of chapters){
    const hay=(c.title+' '+c.goal+' '+c.anatomy+' '+c.examples.join(' ')).toLowerCase();if(q&&!hay.includes(q))continue;
    const st=chapterStat(c.id),btn=document.createElement('button');btn.className='chapter-link'+(c.id===state.chapterId?' active':'');btn.type='button';
    btn.innerHTML=`<span class="chapter-num">${String(c.id).padStart(2,'0')}</span><span class="chapter-label">${esc(c.title)}</span><span class="chapter-mini">${st.correct}/${chapterExercises(c.id).length}</span>`;
    btn.addEventListener('click',()=>selectChapter(c.id));els.nav.appendChild(btn);
  }
}

function renderChapter(){
  const c=chapters.find(x=>x.id===state.chapterId),src=c.sourceId&&sources[c.sourceId];
  els.title.textContent=`${String(c.id).padStart(2,'0')} · ${c.title}`;
  const compare=c.vaspCompare?`<section class="lesson-card glass full"><h3>VASP ↔ CP2K · 迁移提醒</h3><p class="vasp-compare">${esc(c.vaspCompare)}</p></section>`:'';
  const source=src?`<a class="source-chip" href="${src.url}" target="_blank" rel="noreferrer">${esc(src.type)} · ${esc(src.title)} ↗</a>`:'';
  els.content.innerHTML=`
    <section class="lesson-card glass full goal-card"><h3>Learning goal · 本章目标</h3><p>${esc(c.goal)}</p>${source}</section>
    <section class="lesson-card glass full"><h3>Concept · 为什么</h3><p>${esc(c.concept)}</p></section>
    <section class="lesson-card glass"><h3>Syntax anatomy · 语法骨架</h3><div class="code-block">${esc(c.anatomy)}</div></section>
    <section class="lesson-card glass"><h3>Examples · 从参数到科研</h3><div class="example-list">${c.examples.map(x=>`<div class="example-item">${esc(x)}</div>`).join('')}</div></section>
    <section class="lesson-card glass"><h3>Common mistake</h3><div class="callout danger"><div class="callout-icon">!</div><p>${esc(c.mistake)}</p></div></section>
    <section class="lesson-card glass"><h3>Research habit</h3><div class="callout"><div class="callout-icon">✓</div><p>${esc(c.habit)}</p></div></section>
    ${compare}
    <section class="lesson-card glass full"><h3>Mini recap</h3><p>${esc(c.recap)}</p></section>`;
  updateStats();
}

function selectChapter(id){state.chapterId=id;save();renderNav(els.search.value);renderChapter();pickQuestion();scrollTo({top:innerHeight+1,behavior:'smooth'});}
function pickQuestion(forceDifferent=true){
  const pool=chapterExercises(state.chapterId);let choices=pool;
  if(forceDifferent&&pool.length>1)choices=pool.filter(e=>e.id!==state.currentId);
  const ex=choices[Math.floor(Math.random()*choices.length)]||pool[0];state.currentId=ex.id;
  els.input.value='';els.feedback.hidden=true;setVerdict('waiting');renderQuestion(ex);els.input.focus({preventScroll:true});
}
function renderQuestion(ex){
  els.qid.textContent=`CH${String(ex.chapterId).padStart(2,'0')} / ${ex.id.split('-q')[1].padStart(2,'0')}`;els.prompt.textContent=ex.prompt;els.diff.textContent=ex.difficulty.toUpperCase();
  const src=ex.sourceId&&sources[ex.sourceId];els.source.hidden=!src;
  if(src){els.sourceBody.innerHTML=`<strong>${esc(src.type)}</strong> · ${esc(src.title)}<br><a href="${src.url}" target="_blank" rel="noreferrer">打开来源 ↗</a><p>本题按来源要点重新组织为教学问题，不复制社区长段原文。做完后建议点开原文确认上下文。</p>`;}
}
function setVerdict(kind){
  els.verdict.className='verdict '+kind;
  if(kind==='correct')els.verdict.innerHTML='<span>BINGO ✓</span><small>结构/语义正确，自动下一题</small>';
  else if(kind==='wrong')els.verdict.innerHTML='<span>WRONG ×</span><small>题目保留，可以查看答案后继续改</small>';
  else els.verdict.innerHTML='<span>WAITING</span><small>输入后按 Enter</small>';
}
function burst(){const r=els.verdict.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;for(let i=0;i<22;i++){const d=document.createElement('i');d.className='burst-dot';const a=Math.random()*Math.PI*2,dist=30+Math.random()*90;d.style.left=cx+'px';d.style.top=cy+'px';d.style.setProperty('--x',Math.cos(a)*dist+'px');d.style.setProperty('--y',Math.sin(a)*dist+'px');els.burst.appendChild(d);setTimeout(()=>d.remove(),760);}}
function submit(){
  const ex=currentExercise();if(!ex)return;const result=checkAnswer(els.input.value,ex);if(result.empty)return;
  state.globalAttempts++;const st=state.stats[state.chapterId]||{correct:0,attempts:0};st.attempts++;state.stats[state.chapterId]=st;
  if(result.correct){setVerdict('correct');state.globalCorrect++;state.streak++;st.correct++;state.solved.add(ex.id);els.feedback.hidden=true;burst();save();updateStats();setTimeout(()=>pickQuestion(),820);}
  else{setVerdict('wrong');state.streak=0;els.feedback.hidden=false;els.feedback.textContent='结构或语义还不对。你可以直接点“查看答案”，对照 section 层级、关键词和值，然后修改自己的输入再提交。';save();updateStats();}
}
function updateStats(){
  const st=chapterStat(state.chapterId),acc=st.attempts?Math.round(st.correct/st.attempts*100):0;els.correct.textContent=state.globalCorrect;els.streak.textContent=state.streak;els.accuracy.textContent=acc+'%';
  const pct=Math.round(state.solved.size/exercises.length*100);els.progressRing.style.setProperty('--p',(pct*3.6)+'deg');els.progressPercent.textContent=pct+'%';els.progressText.textContent=`${state.solved.size} / ${exercises.length} 题答对`;renderNav(els.search.value);
}
function showHint(){const ex=currentExercise();els.feedback.hidden=false;els.feedback.innerHTML=`<strong>提示</strong><br>${esc(ex.hint)}`;}
function showAnswer(){const ex=currentExercise();els.feedback.hidden=false;els.feedback.innerHTML=`<div class="answer-panel"><strong>标准答案 · 随时可看，不计错</strong><pre>${esc(ex.answers[0])}</pre></div>`;}
function showExplanation(){const ex=currentExercise();els.feedback.hidden=false;els.feedback.innerHTML=`<strong>答案解析</strong><br>${esc(ex.explanation)}<div class="answer-panel"><pre>${esc(ex.answers[0])}</pre></div>`;}

function renderAudit(){
  const srcRows=Object.values(sources).map(s=>`<div class="source-row"><span><strong>${esc(s.type)}</strong><br>${esc(s.title)}</span><a href="${s.url}" target="_blank" rel="noreferrer">来源 ↗</a></div>`).join('');
  const mapRows=vaspCp2kMap.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  els.auditContent.innerHTML=`<div class="audit-grid"><div class="audit-metric"><strong>${coverageAudit.chapterCount}</strong><span>课程章节</span></div><div class="audit-metric"><strong>${coverageAudit.exerciseCount}</strong><span>训练题</span></div><div class="audit-metric"><strong>${coverageAudit.lastReviewed}</strong><span>内容复核日期</span></div></div><h3>Round 1 · 内容覆盖与正确性</h3><ul class="audit-list">${coverageAudit.claims.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="scope-note">${esc(coverageAudit.scopeBoundary)}</div><h3>VASP → CP2K 导航表</h3><table class="compare-table"><thead><tr><th>VASP</th><th>CP2K</th><th>注意</th></tr></thead><tbody>${mapRows}</tbody></table><h3>Round 2 · 设计与功能检查</h3><ul class="audit-list"><li>Canvas 粒子：CP2K / ACADEMY 双行采样，鼠标水波排斥与弹簧回位。</li><li>首屏滚动：Hero 上移、模糊、渐隐；Workspace 渐显上滑。</li><li>练习：单题、随机刷新、BINGO 自动下一题、WRONG 保留题目。</li><li>答案：每题从一开始就可直接查看标准答案与解析，不需要先答错。</li><li>进度：localStorage 恢复、章节准确率、连续正确、总进度。</li><li>无障碍：Enter 提交、可见焦点、prefers-reduced-motion 降级。</li></ul><h3>Authoritative sources</h3><div class="source-list">${srcRows}</div>`;
}
function revealOnScroll(){const forced=new URLSearchParams(location.search).has('workspace');const y=scrollY,trigger=Math.min(innerHeight*.12,100);const visible=forced||y>trigger;els.hero.classList.toggle('scrolled',visible);els.workspace.classList.toggle('visible',visible);}

els.search.addEventListener('input',e=>renderNav(e.target.value));
els.refresh.addEventListener('click',()=>pickQuestion());els.check.addEventListener('click',submit);els.hint.addEventListener('click',showHint);els.answer.addEventListener('click',showAnswer);els.explain.addEventListener('click',showExplanation);
els.input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();}});
els.auditBtn.addEventListener('click',()=>{renderAudit();els.audit.showModal()});els.closeAudit.addEventListener('click',()=>els.audit.close());addEventListener('scroll',revealOnScroll,{passive:true});
initHero($('#particleCanvas'));renderNav();renderChapter();pickQuestion(false);updateStats();revealOnScroll();
