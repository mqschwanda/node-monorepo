import { mergeDefaultNpmConfig } from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default mergeDefaultNpmConfig({
  output: {
    name,
  },
});
