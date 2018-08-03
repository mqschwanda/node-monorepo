import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

// const { name, main } = require('./package.json');

export default {
  input: 'src/index.js',
  plugins: [
    babel(),
    uglify(),
  ],
  output: {
    file: 'dist/index.js',
    exports: 'named',
    name: '@mqschwanda/rollup-config-default',
    format: 'umd',
    sourceMap: true,
  },
}
