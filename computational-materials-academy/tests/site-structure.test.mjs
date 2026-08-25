import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(new URL('../'+p, import.meta.url), 'utf8');

test('root academy home links to both published academies', () => {
  const html = read('index.html');
  assert.match(html, /COMPUTATIONAL/i);
  assert.match(html, /href="\.\/linux-shell\/"/);
  assert.match(html, /href="\.\/cp2k\/"/);
});

test('published subpages have a CMA home link', () => {
  const linux = read('linux-shell/index.html');
  const cp2k = read('cp2k/index.html');
  assert.match(linux, /class="academy-home-link"/);
  assert.match(cp2k, /class="academy-home-link"/);
  assert.match(linux, /href="\.\.\/"/);
  assert.match(cp2k, /href="\.\.\/"/);
});

test('source apps use namespaced CMA localStorage keys with legacy migration', () => {
  const linux = read('source/linux-shell/src/app.mjs');
  const cp2k = read('source/cp2k/src/app.mjs');
  assert.match(linux, /cma-linux-progress-v1/);
  assert.match(linux, /linux-shell-academy-progress-v1/);
  assert.match(cp2k, /cma-cp2k-progress-v1/);
  assert.match(cp2k, /cp2k-academy-progress-v1/);
});
