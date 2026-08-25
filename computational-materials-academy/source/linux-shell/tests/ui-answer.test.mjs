import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../index.html', import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/app.mjs', import.meta.url),'utf8');

test('practice terminal exposes always-available answer and detailed explanation controls',()=>{
  assert.match(html,/id="showAnswerBtn"[^>]*>查看答案</);
  assert.match(html,/id="explainBtn"[^>]*>逐段详解</);
  assert.doesNotMatch(html,/id="explainBtn"[^>]*disabled/);
});

test('app renders token explanations and execution flow',()=>{
  assert.match(app,/explainShellCommand/);
  assert.match(app,/answer-parts/);
  assert.match(app,/整句执行流程/);
  assert.match(app,/本题要记住/);
});
