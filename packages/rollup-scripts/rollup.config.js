import {
  mergeDefaultNodeConfig,
  mergeDefaultExecutableConfig,
  getExternals,
} from '@mqschwanda/rollup-config-default';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';

import packageJSON, { name, bin } from './package.json';

const nodeConfig = mergeDefaultNodeConfig({
  input: 'src/build.js',
  output: {
    name: `${name}-build`,
    file: 'dist/build.js',
  },
  external: getExternals(packageJSON),
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    babel({
      babelrc: false,
      presets: [
        ['env', { modules: false }],
        'stage-3',
      ],
      exclude: '**/node_modules/**',
      plugins: [
        'external-helpers',
      ],
    }),
    uglify(),
  ],
});

const executableConfig = mergeDefaultExecutableConfig({
  input: 'src/rollup-scripts.js',
  output: {
    name,
    file: bin['rollup-scripts'], // './bin/rollup-scripts.js',
    banner: '#!/usr/bin/env node',
  },
  external: getExternals(packageJSON),
});

export default [
  nodeConfig,
  executableConfig,
];
