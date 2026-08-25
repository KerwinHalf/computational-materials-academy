import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, exercises, sources, coverageAudit } from '../src/data.mjs';

test('has exactly 30 curriculum chapters',()=>{
  assert.equal(chapters.length,30);
  assert.deepEqual(chapters.map(c=>c.id),Array.from({length:30},(_,i)=>i+1));
});

test('each chapter contains substantial teaching blocks',()=>{
  for(const c of chapters){
    assert.ok(c.title && c.concept && c.anatomy && c.mistake && c.habit && c.recap,`chapter ${c.id}`);
    assert.ok(Array.isArray(c.examples) && c.examples.length>=3,`examples chapter ${c.id}`);
  }
});

test('has at least 180 exercises and at least six per chapter',()=>{
  assert.ok(exercises.length>=180);
  for(const c of chapters){
    assert.ok(exercises.filter(e=>e.chapterId===c.id).length>=6,`exercises chapter ${c.id}`);
  }
});

test('every exercise has answer, hint, explanation and difficulty',()=>{
  for(const e of exercises){
    assert.ok(e.prompt && e.answers?.length && e.hint && e.explanation && e.difficulty, e.id);
  }
});

test('VASP/HPC chapters have source metadata',()=>{
  for(const e of exercises.filter(e=>e.chapterId>=22 && e.chapterId<=29)){
    assert.ok(e.sourceId,`missing source ${e.id}`);
    assert.ok(sources[e.sourceId],`unknown source ${e.sourceId}`);
  }
});

test('coverage audit passes structural requirements',()=>{
  assert.equal(coverageAudit.chapterCount,30);
  assert.ok(coverageAudit.exerciseCount>=180);
  assert.equal(coverageAudit.lastReviewed,'2026-08-25');
});
