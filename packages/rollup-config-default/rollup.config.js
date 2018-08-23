import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      plugins: ['external-helpers'],
    }),
    uglify(),
  ],
  output: {
    file: 'dist/index.js',
    exports: 'named',
    name: '@mqschwanda/rollup-config-default',
    format: 'umd',
    sourceMap: true,
    globals: {
      'deepmerge': 'deepmerge',
      'rollup-plugin-babel': 'babel',
      'rollup-plugin-executable': 'executable',
      'rollup-plugin-uglify': 'uglify',
    }
  },
  external: [ // <-- suppresses the warning
    'deepmerge',
    'rollup-plugin-babel',
    'rollup-plugin-executable',
    'rollup-plugin-uglify',
  ],
}
