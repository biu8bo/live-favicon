import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const plugins = [nodeResolve({ browser: true }), commonjs()];

export default {
  input: 'src/index.js',
  plugins,
  output: [
    {
      file: 'dist/live-favicon.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/live-favicon.iife.js',
      format: 'iife',
      name: 'LiveFavicon',
      sourcemap: true
    }
  ]
};
