import { rm } from 'node:fs/promises';

const paths = [
  'dist',
  'docs/assets/live-favicon.iife.js',
  'docs/assets/live-favicon.iife.js.map',
  'docs/assets/live-favicon.esm.js',
  'docs/assets/live-favicon.esm.js.map'
];

await Promise.all(paths.map(path => rm(path, { recursive: true, force: true })));
