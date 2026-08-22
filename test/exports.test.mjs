import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('ESM bundle exports exactly initFavicon', async () => {
  const bundle = await readFile('dist/live-favicon.esm.js', 'utf8');
  assert.match(bundle, /export \{ initFavicon \}/);
});

test('IIFE bundle exposes LiveFavicon.initFavicon', async () => {
  const bundle = await readFile('dist/live-favicon.iife.js', 'utf8');
  assert.match(bundle, /LiveFavicon/);
  assert.match(bundle, /initFavicon/);
});

test('bundles include the console introduction and repository link', async () => {
  const [esm, iife] = await Promise.all([
    readFile('dist/live-favicon.esm.js', 'utf8'),
    readFile('dist/live-favicon.iife.js', 'utf8')
  ]);

  for (const bundle of [esm, iife]) {
    assert.match(bundle, /live-favicon/);
    assert.match(bundle, /VERSION = ['"]1\.0\.1['"]/);
    assert.match(bundle, /https:\/\/github\.com\/biu8bo\/live-favicon/);
  }
});

test('package type declaration describes the sole method', async () => {
  const declaration = await readFile('dist/index.d.ts', 'utf8');
  assert.match(declaration, /export declare function initFavicon/);
  assert.match(declaration, /stop\(\): void/);
});

test('GitHub Pages demo receives both browser bundles', async () => {
  const [page, iife, esm] = await Promise.all([
    readFile('docs/index.html', 'utf8'),
    readFile('docs/assets/live-favicon.iife.js', 'utf8'),
    readFile('docs/assets/live-favicon.esm.js', 'utf8')
  ]);

  assert.match(page, /\.\/assets\/live-favicon\.iife\.js/);
  assert.match(page, /\.\/assets\/live-favicon\.esm\.js/);
  assert.match(iife, /LiveFavicon/);
  assert.match(esm, /export \{ initFavicon \}/);
});
