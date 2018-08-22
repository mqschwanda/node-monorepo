import {
  mergeDefaultNpmConfig,
  mergeDefaultExecutableConfig,
} from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default [
  mergeDefaultNpmConfig({
    input: 'src/test.js',
    output: {
      name: `${name}-test`,
      file: 'dist/test.js',
      globals: {
        '@mqschwanda/scripts': 'scripts',
      },
    },
  }),
  mergeDefaultExecutableConfig({
    input: 'src/jest-scripts.js',
    output: {
      name: 'jest-scripts',
      file: 'bin/jest-scripts.js',
      banner: '#!/usr/bin/env node',
      globals: {
        path: 'path',
        'react-dev-utils/crossSpawn': 'crossSpawn',
      },
    },
    // Rollup will only resolve relative module IDs by default. This means that an
    // import statement won't result in react being included in your bundle –
    // instead, it will be an external dependency that is required at runtime. If
    // that's what you want, you can suppress this warning with the external
    // option, which makes your intentions explicit
    // see: https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
    external: [
      'path', // <-- suppresses the warning
      'react-dev-utils/crossSpawn', // <-- suppresses the warning
    ],
  }),
];
