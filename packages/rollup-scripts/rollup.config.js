import {
  buildDefaultNodeConfig,
  buildDefaultExecutableConfig,
  getExternals,
} from '@mqschwanda/rollup-config-default';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import postprocess from 'rollup-plugin-postprocess';

import packageJSON, { name, bin } from './package.json';

const nodeConfig = buildDefaultNodeConfig({
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
      exclude: 'node_modules/**',
      plugins: [
        'external-helpers',
      ],
    }),
    uglify(),
  ],
});

const executableConfig = buildDefaultExecutableConfig({
  input: 'src/rollup-scripts.js',
  output: {
    name,
    file: bin['rollup-scripts'], // './bin/rollup-scripts.js',
    banner: '#!/usr/bin/env node',
  },
  external:[
    'path',
    ...getExternals(packageJSON)
  ],
  plugins: [
    commonjs(),
    postprocess([
      /**
       * commonjs will change any dynamic require into a simple function that
       * returns an error.
       * @see {@link https://github.com/winstonjs/logform/issues/5}
       * To hack this error we will swap `commonjsRequire.resolve` with an alias
       * before running commonjs and replace the alias with the original name
       * afterwards.
       */
      [/(commonjsRequire\.resolve)/, 'require.resolve'],
    ]),
  ]
});

export default [
  nodeConfig,
  executableConfig,
];
