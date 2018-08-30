import {
  mergeDefaultNpmConfig,
  // mergeDefaultNodeConfig,
  mergeDefaultExecutableConfig,
} from '@mqschwanda/rollup-config-default';

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

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
  input: 'src/index.js',
  output: {
    name,
  },
  external: [
    'child_process',
    ...getExternals(packageJSON)
  ],
}), [
  babel({
    babelrc: false,
    presets: [
      ['env', { modules: false }],
      'stage-3',
    ],
    exclude: '**/node_modules/**',
    plugins: ['external-helpers'],
  }),
  commonjs(),
  uglify(),
]);

const executableConfig = replacePlugins(mergeDefaultExecutableConfig({
  input: 'src/handle-unhandled-rejections.js',
  output: {
    name: 'handle-unhandled-rejections',
    file: 'dist/handle-unhandled-rejections.js',
  },
}), [
  uglify(),
]);

export default [
  nodeConfig,
  executableConfig,
];
