import { mergeDefaultNpmConfig } from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default [{
  output: {
    name,
  },
}].map(mergeDefaultNpmConfig);
