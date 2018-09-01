// import compose from '@mqschwanda/compose';
import merge from 'deepmerge';
import executable from 'rollup-plugin-executable';
import nodeResolve from 'rollup-plugin-node-resolve';
// import globals from 'rollup-plugin-node-globals';
// import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import config from '../rollup.config';

export const getExternals = ({
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

export const replacePlugins = (oldConfig, plugins = []) => {
  const config = {
    ...oldConfig,
    plugins: oldConfig.plugins.filter(isDefined).filter(isDuplicate),
  };

  plugins.forEach(plugin => {
    const i = config.plugins.findIndex(({ name }) => name === plugin.name);

    if (i > -1) config.plugins.splice(i, 1, plugin);
    else config.plugins.push(plugin);
  });

  return config;
}

/**
 * remove any plugins that are being added from the new configuration object.
 * This will prevent duplication errors
 * @param  {[type]} oldConfig [description]
 * @param  {[type]} plugins   [description]
 * @return {[type]}           [description]
 */
export const trimPlugins = (oldConfig, plugins = []) => {
  const config = {
    ...oldConfig,
    plugins: oldConfig.plugins.filter(isDefined).filter(isDuplicate),
  };

  plugins.forEach(plugin => {
    const i = config.plugins.findIndex(({ name }) => name === plugin.name);
    if (i > -1) config.plugins.splice(i, 1);
  });

  return config;
}

/**
 * remove package specific config so a more generalized config can be gernerated
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
export const trimConfig = (oldConfig) => {
  const config = oldConfig;
  if (config.output) {
    if (config.output.name) delete config.output.name;
    if (config.output.globals) delete config.output.globals;
  }

  if (config.external) delete config.external;

  return config;
};

export const trim = (oldConfig, { plugins = [] } = {}) =>
  trimPlugins(trimConfig(oldConfig), plugins)


export const buildConfig = (oldConfig, newConfig = {}) =>
  merge(trim(oldConfig, newConfig), newConfig);

/**
 * default package configuration
 * @type {[type]}
 */
export { config };
export const defaultConfig = config;

/**
 * [buildDefaultConfig description]
 * @param  {[type]} newConfig [description]
 * @return {[type]}           [description]
 * @since 0.0.15
 */
export const buildDefaultConfig = (newConfig) =>
  buildConfig(defaultConfig, newConfig);
/**
 * [buildDefaultConfig description]
 * @since 0.0.1
 */
export const mergeDefaultConfig = buildDefaultConfig;

/**
 * npm package configuration. This is for code that is bundled to be published
 * to npm. This will optimize the code for both browser and node where possible.
 * @type {[type]}
 */
export const defaultNpmConfig = buildDefaultConfig();

/**
 * [buildDefaultNpmConfig description]
 * @param  {[type]} newConfig [description]
 * @return {[type]}           [description]
 * @since 0.0.15
 */
export const buildDefaultNpmConfig = (newConfig) =>
  buildConfig(defaultNpmConfig, newConfig);
/**
 * [mergeDefaultNpmConfig description]
 * @type {[type]}
 * @since 0.0.1
 */
export const mergeDefaultNpmConfig = buildDefaultNpmConfig

/**
 * node package configuration. This is for code that is bundled to run on node
 * only (not optimized for browser).
 * @type {[type]}
 */
export const defaultNodeConfig = buildDefaultNpmConfig({
  output: {
    format: 'cjs',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    // globals(),
    // builtins(),
  ]
});

/**
 * [buildDefaultNodeConfig description]
 * @param  {[type]} newConfig [description]
 * @return {[type]}           [description]
 * @since 0.0.15
 */
export const buildDefaultNodeConfig = (newConfig) =>
  buildConfig(defaultNodeConfig, newConfig);
/**
 * [mergeDefaultNodeConfig description]
 * @type {[type]}
 * @since 0.0.1
 */
export const mergeDefaultNodeConfig = buildDefaultNodeConfig;

/**
 * executable package configuration. This is for code that is bundled to run as
 * a cli or shell script.
 * @type {[type]}
 */
export const defaultExecutableConfig = buildDefaultNodeConfig({
  output: {
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  plugins: [
    executable(),
  ],
});
/**
 * [buildDefaultExecutableConfig description]
 * @param  {[type]} newConfig [description]
 * @return {[type]}           [description]
 * @since 0.0.15
 */
export const buildDefaultExecutableConfig = (newConfig) =>
  buildConfig(defaultExecutableConfig, newConfig);
/**
 * [mergeDefaultExecutableConfig description]
 * @type {[type]}
 * @since 0.0.1
 */
export const mergeDefaultExecutableConfig = buildDefaultExecutableConfig;

export default config;
