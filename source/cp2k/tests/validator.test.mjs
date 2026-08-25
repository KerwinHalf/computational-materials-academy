import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswer, normalizeText, parseCp2kSections } from '../src/validator.mjs';

test('normalizes case and whitespace without destroying section structure', () => {
  const a = normalizeText('&SCF\n   EPS_SCF   1.0E-6\n&END SCF');
  assert.match(a, /&SCF/);
  assert.match(a, /EPS_SCF 1.0E-6/);
});

test('parses nested CP2K sections and keywords', () => {
  const parsed = parseCp2kSections(`&FORCE_EVAL\n &DFT\n  &SCF\n   EPS_SCF 1.0E-6\n  &END SCF\n &END DFT\n&END FORCE_EVAL`);
  assert.ok(parsed.sections.has('FORCE_EVAL/DFT/SCF'));
  assert.equal(parsed.keywords.get('FORCE_EVAL/DFT/SCF').get('EPS_SCF'), '1.0E-6');
});

test('accepts equivalent simple keyword answers', () => {
  const ex = { validator:'containsAll', meta:{required:['RUN_TYPE GEO_OPT','PROJECT test']} };
  assert.equal(checkAnswer('project test\nrun_type geo_opt', ex).correct, true);
});

test('requires a keyword to live in the correct CP2K section', () => {
  const ex = { validator:'sectionContains', meta:{section:'FORCE_EVAL/DFT/SCF', required:['EPS_SCF 1.0E-6']} };
  assert.equal(checkAnswer('&SCF\n EPS_SCF 1.0E-6\n&END SCF', ex).correct, false);
  assert.equal(checkAnswer('&FORCE_EVAL\n&DFT\n&SCF\nEPS_SCF 1.0E-6\n&END SCF\n&END DFT\n&END FORCE_EVAL', ex).correct, true);
});

test('rejects OT plus ordinary SCF smearing exercise combination when forbidden', () => {
  const ex = { validator:'forbidTogether', meta:{required:['&OT'], forbiddenWithRequired:['&SMEAR']} };
  assert.equal(checkAnswer('&SCF\n&OT\n&END OT\n&SMEAR\n&END SMEAR\n&END SCF', ex).correct, false);
  assert.equal(checkAnswer('&SCF\n&OT\n&END OT\n&END SCF', ex).correct, true);
});

test('accepts one of multiple canonical answers', () => {
  const ex = { validator:'oneOf', answers:['RUN_TYPE ENERGY','RUN_TYPE ENERGY_FORCE'] };
  assert.equal(checkAnswer('run_type energy', ex).correct, true);
});
