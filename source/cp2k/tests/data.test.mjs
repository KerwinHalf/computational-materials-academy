import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, exercises, sources, coverageAudit } from '../src/data.mjs';

test('has exactly 30 curriculum chapters', () => {
  assert.equal(chapters.length, 30);
});

test('has at least 180 exercises and at least six per chapter', () => {
  assert.ok(exercises.length >= 180);
  for (const c of chapters) {
    assert.ok(exercises.filter(e => e.chapterId === c.id).length >= 6, `chapter ${c.id}`);
  }
});

test('every chapter has full teaching fields', () => {
  for (const c of chapters) {
    for (const key of ['title','goal','concept','anatomy','mistake','habit','recap']) assert.ok(c[key], `${c.id} ${key}`);
    assert.ok(Array.isArray(c.examples) && c.examples.length >= 3);
  }
});

test('every exercise has an always-visible answer and explanation', () => {
  for (const e of exercises) {
    assert.ok(e.answers?.[0], e.id);
    assert.ok(e.hint, e.id);
    assert.ok(e.explanation, e.id);
  }
});

test('CP2K-context exercises have source metadata', () => {
  for (const e of exercises.filter(x => x.sourceId)) assert.ok(sources[e.sourceId], e.id);
});

test('coverage audit is current and honest about scope', () => {
  assert.equal(coverageAudit.chapterCount, 30);
  assert.equal(coverageAudit.exerciseCount, exercises.length);
  assert.match(coverageAudit.scopeBoundary, /不声称|不宣称|不等于/);
});
