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
      globals: {
        '@mqschwanda/scripts': 'scripts',
      }
    },
    external: [
      '@mqschwanda/scripts/dist/handle-unhandled-rejections.js',
      '@mqschwanda/scripts',
    ],
  }),
  mergeDefaultExecutableConfig({
    input: 'src/rollup-scripts.js',
    output: {
      name: 'rollup-scripts',
      file: 'bin/rollup-scripts.js',
      banner: '#!/usr/bin/env node',
      globals: {
        path: 'path',
        'react-dev-utils/crossSpawn': 'crossSpawn',
      }
    },
    external: [
      '@mqschwanda/scripts/dist/handle-unhandled-rejections.js',
      'path',
      'react-dev-utils/crossSpawn'
    ],
  }),
];
