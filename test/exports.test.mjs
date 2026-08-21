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

test('package type declaration describes the sole method', async () => {
  const declaration = await readFile('dist/index.d.ts', 'utf8');
  assert.match(declaration, /export declare function initFavicon/);
  assert.match(declaration, /stop\(\): void/);
});
