import {
  mergeDefaultNpmConfig,
  mergeDefaultExecutableConfig,
} from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default [
  mergeDefaultNpmConfig({
    input: 'src/build.js',
    output: {
      name: `${name}-build`,
      file: 'dist/build.js',
    },
  }),
  mergeDefaultExecutableConfig({
    input: 'src/rollup-scripts.js',
    output: {
      name: 'rollup-scripts',
      file: 'bin/rollup-scripts.js',
    },
    banner: '#!/usr/bin/env node',
  }),
];
