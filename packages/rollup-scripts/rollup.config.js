import {
  mergeDefaultNpmConfig,
  // mergeDefaultNodeConfig,
  mergeDefaultExecutableConfig,
} from '@mqschwanda/rollup-config-default';

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';

import packageJSON, { name, bin } from './package.json';

const getExternals = ({
  dependencies = {},
  devDependencies = {},
  peerDependencies = {},
}) => [
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies),
  ...Object.keys(peerDependencies),
];

const isDefined = n => n !== undefined;
const isDuplicate = (plugin, i, self) =>
  i === self.findIndex(({ name }) => name === plugin.name);

const replacePlugins = (oldConfig, plugins = []) => {
  const config = {
    ...oldConfig,
    plugins: oldConfig.plugins.filter(isDefined).filter(isDuplicate),
  };

  plugins.forEach(plugin => {
    const i = config.plugins.findIndex(({ name }) => name === plugin.name);

    if (i > -1) config.plugins[i] = plugin;
    else config.plugins.push(plugin);
  });

  return config;
}

const trimPlugins = (oldConfig, plugins = []) => {
  const config = {
    ...oldConfig,
    plugins: oldConfig.plugins.filter(isDefined).filter(isDuplicate),
  };

  plugins.forEach(plugin => {
    const i = plugins.findIndex(({ name }) => name === plugin.name);
    if (i > -1) config.plugins.splice(i, 1);
  });

  return config;
}

const nodeConfig = replacePlugins(mergeDefaultNpmConfig({
// const nodeConfig = replacePlugins(mergeDefaultNodeConfig({
  input: 'src/build.js',
  output: {
    name: `${name}-build`,
    file: 'dist/build.js',
  },
  external: getExternals(packageJSON),
}), [
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
  nodeResolve({
    preferBuiltins: true,
  }),
  commonjs(),
]);

const executableConfig = trimPlugins(mergeDefaultExecutableConfig({
  input: 'src/rollup-scripts.js',
  output: {
    name,
    file: bin['rollup-scripts'], // './bin/rollup-scripts.js',
    banner: '#!/usr/bin/env node',
  },
  external: getExternals(packageJSON),
}));

export default [
  nodeConfig,
  executableConfig,
];
