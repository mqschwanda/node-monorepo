import {
  buildDefaultNodeConfig,
  // buildDefaultExecutableConfig,
  getExternals,
} from '@mqschwanda/rollup-config-default';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

import packageJSON, { name } from './package.json';

const plugins = [
  babel({
    babelrc: false,
    presets: [
      ['env', { modules: false }],
      'stage-3',
    ],
    exclude: 'node_modules/**',
    plugins: ['external-helpers'],
  }),
  uglify(),
];

const nodeConfig = buildDefaultNodeConfig({
  input: 'src/index.js',
  output: {
    name,
  },
  external: [
    'child_process',
    ...getExternals(packageJSON)
  ],
  plugins,
});

const executableConfig = buildDefaultNodeConfig({
  input: 'src/handle-unhandled-rejections.js',
  output: {
    name: 'handle-unhandled-rejections',
    file: 'dist/handle-unhandled-rejections.js',
  },
  plugins,
});

export default [
  nodeConfig,
  executableConfig,
];
