import { rm } from 'node:fs/promises';

const paths = [
  'dist',
  'examples/script-tag/live-favicon.iife.js',
  'examples/script-tag/live-favicon.iife.js.map',
  'examples/esm/live-favicon.esm.js',
  'examples/esm/live-favicon.esm.js.map'
];

await Promise.all(paths.map(path => rm(path, { recursive: true, force: true })));
