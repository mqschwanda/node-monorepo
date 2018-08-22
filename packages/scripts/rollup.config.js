import {
  mergeDefaultNpmConfig,
  mergeDefaultExecutableConfig,
} from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default [
  mergeDefaultNpmConfig({
    input: 'src/index.js',
    output: {
      name,
      globals: {
        chalk: 'chalk',
        child_process: 'child_process',
      },
    },
    // Rollup will only resolve relative module IDs by default. This means that an
    // import statement won't result in react being included in your bundle –
    // instead, it will be an external dependency that is required at runtime. If
    // that's what you want, you can suppress this warning with the external
    // option, which makes your intentions explicit
    // see: https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
    external: [
      'chalk', // <-- suppresses the warning
      'child_process', // <-- suppresses the warning
    ],
  }),
  mergeDefaultExecutableConfig({
    input: 'src/handle-unhandled-rejections.js',
    output: {
      name: 'handle-unhandled-rejections',
      file: 'dist/handle-unhandled-rejections.js'
    },
  }),
];
