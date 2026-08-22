import { copyFile } from 'node:fs/promises';

const bundles = [
  ['dist/live-favicon.iife.js', 'examples/script-tag/live-favicon.iife.js'],
  ['dist/live-favicon.iife.js.map', 'examples/script-tag/live-favicon.iife.js.map'],
  ['dist/live-favicon.esm.js', 'examples/esm/live-favicon.esm.js'],
  ['dist/live-favicon.esm.js.map', 'examples/esm/live-favicon.esm.js.map']
];

await Promise.all(bundles.map(([from, to]) => copyFile(from, to)));
