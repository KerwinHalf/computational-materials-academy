import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswer, normalizeCommand, isDangerous } from '../src/validator.mjs';

test('normalizes whitespace', () => {
  assert.equal(normalizeCommand('  tail   -n  30   OSZICAR  '), 'tail -n 30 OSZICAR');
});

test('accepts tail equivalent forms', () => {
  const ex={answers:['tail -n 30 OSZICAR'], validator:'tailLines', meta:{file:'OSZICAR',count:30}};
  assert.equal(checkAnswer('tail -30 OSZICAR',ex).correct,true);
  assert.equal(checkAnswer('tail -n 30 OSZICAR',ex).correct,true);
  assert.equal(checkAnswer('head -n 30 OSZICAR',ex).correct,false);
});

test('accepts grep flag ordering variants', () => {
  const ex={answers:['grep -niE "ERROR|ZHEGV" OUTCAR'], validator:'grepFlags', meta:{file:'OUTCAR',pattern:'ERROR|ZHEGV',flags:['n','i','E']}};
  assert.equal(checkAnswer('grep -Ein "ERROR|ZHEGV" OUTCAR',ex).correct,true);
  assert.equal(checkAnswer('grep -n "ERROR|ZHEGV" OUTCAR',ex).correct,false);
});

test('distinguishes overwrite and append', () => {
  const ex={answers:['echo world >> test.txt'], validator:'exactish'};
  assert.equal(checkAnswer('echo world >> test.txt',ex).correct,true);
  assert.equal(checkAnswer('echo world > test.txt',ex).correct,false);
});

test('rejects dangerous broad deletion', () => {
  assert.equal(isDangerous('rm -rf /'),true);
  assert.equal(isDangerous('rm -rf *'),true);
  assert.equal(isDangerous('rm -r failed_archive/run_bad'),false);
});

test('cp multi-source validator allows source reorder but destination stays last', () => {
  const ex={answers:['cp -p INCAR OUTCAR OSZICAR backup/'], validator:'copyPreserve', meta:{sources:['INCAR','OUTCAR','OSZICAR'],dest:'backup/'}};
  assert.equal(checkAnswer('cp -p OSZICAR INCAR OUTCAR backup/',ex).correct,true);
  assert.equal(checkAnswer('cp INCAR OUTCAR OSZICAR backup/',ex).correct,false);
  assert.equal(checkAnswer('cp -p INCAR OUTCAR backup/ OSZICAR',ex).correct,false);
});
