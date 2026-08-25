import test from 'node:test';
import assert from 'node:assert/strict';
import { explainShellCommand } from '../src/explainer.mjs';

test('explains command substitution pipeline token by token', () => {
  const result = explainShellCommand('n=$(find . -type f | wc -l)');
  const labels = result.parts.map(p => p.token);
  for (const token of ['n=', '$(...)', 'find', '.', '-type f', '|', 'wc', '-l']) {
    assert.ok(labels.includes(token), `missing explanation for ${token}`);
  }
  assert.match(result.parts.find(p => p.token === 'wc').meaning, /word count/i);
  assert.match(result.parts.find(p => p.token === '-l').detail, /小写字母.*l|line/i);
  assert.match(result.flow.join(' '), /文件|行数/);
  assert.match(result.remember, /wc -l/);
  assert.ok(result.confusions.some(x => /数字 1|小写.*l/.test(x)));
});

test('explains grep pipeline and redirection building blocks', () => {
  const result = explainShellCommand('grep -niE "ERROR|ZHEGV" OUTCAR | tail -n 30 > errors.txt');
  const labels = result.parts.map(p => p.token);
  for (const token of ['grep', '-niE', 'OUTCAR', '|', 'tail', '-n 30', '>']) {
    assert.ok(labels.includes(token), `missing explanation for ${token}`);
  }
  assert.match(result.parts.find(p => p.token === '>').detail, /覆盖/);
});

test('falls back gracefully for unknown tokens instead of omitting them', () => {
  const result = explainShellCommand('mytool --mystery sample.dat');
  assert.ok(result.parts.some(p => p.token === 'mytool'));
  assert.ok(result.parts.some(p => p.token === '--mystery'));
  assert.ok(result.parts.some(p => p.token === 'sample.dat'));
});
