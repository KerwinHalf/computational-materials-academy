import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(p, import.meta.url),'utf8');

test('index exposes hero, chapter workspace, always-visible answer controls, audit dialog',()=>{
  const html=read('../index.html');
  for(const id of ['particleCanvas','workspace','chapterNav','questionPrompt','answerInput','answerBtn','explainBtn','checkBtn','auditDialog']){
    assert.match(html,new RegExp(`id=["']${id}["']`));
  }
  assert.match(html,/CP2K/);
  assert.match(html,/ACADEMY/);
  assert.doesNotMatch(html,/CP2K\s*\/\s*ACADEMY/);
});

test('app implements random refresh, bingo/wrong, always-available answer, and auto advance',()=>{
  const js=read('../src/app.mjs');
  assert.match(js,/function pickQuestion/);
  assert.match(js,/BINGO/);
  assert.match(js,/WRONG/);
  assert.match(js,/showAnswer/);
  assert.match(js,/setTimeout\(\(\)=>pickQuestion\(\),8\d\d\)/);
  assert.match(js,/localStorage/);
});

test('hero implements particle text, pointer repulsion, scroll reveal and reduced-motion fallback',()=>{
  const js=read('../src/hero.mjs');
  assert.match(js,/fillText\(['"]CP2K['"]/);
  assert.match(js,/fillText\(['"]ACADEMY['"]/);
  assert.match(js,/pointermove/);
  assert.match(js,/requestAnimationFrame/);
  assert.match(js,/prefers-reduced-motion/);
});
