import { mergeDefaultNpmConfig } from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default [{
  input: 'src/index.js',
  output: {
    name,
  },
}, {
  input: 'src/handle-unhandled-rejections.js',
  output: {
    name: 'handle-unhandled-rejections',
    file: 'dist/handle-unhandled-rejections.js'
  },
}].map(mergeDefaultNpmConfig);
