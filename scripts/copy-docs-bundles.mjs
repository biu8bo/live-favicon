import { copyFile, mkdir } from 'node:fs/promises';

const targetDirectory = 'docs/assets';
const bundles = [
  ['dist/live-favicon.iife.js', `${targetDirectory}/live-favicon.iife.js`],
  ['dist/live-favicon.iife.js.map', `${targetDirectory}/live-favicon.iife.js.map`],
  ['dist/live-favicon.esm.js', `${targetDirectory}/live-favicon.esm.js`],
  ['dist/live-favicon.esm.js.map', `${targetDirectory}/live-favicon.esm.js.map`]
];

await mkdir(targetDirectory, { recursive: true });
await Promise.all(bundles.map(([from, to]) => copyFile(from, to)));
