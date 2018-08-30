// import compose from '@mqschwanda/compose';
import merge from 'deepmerge';
import executable from 'rollup-plugin-executable';
import nodeResolve from 'rollup-plugin-node-resolve';
// import globals from 'rollup-plugin-node-globals';
// import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import config from '../rollup.config';

/**
 * remove any plugins that are being added from the new configuration object.
 * This will prevent duplication errors
 * @param  {[type]} oldConfig [description]
 * @param  {[type]} newConfig [description]
 * @return {[type]}           [description]
 */
export const trimPlugins = (oldConfig, newConfig) => {
  const config = oldConfig;

  (newConfig.plugins || []).forEach(plugin => {
    const i = newConfig.plugins.findIndex(({ name }) => name === plugin.name);
    if (i > -1) delete config.plugins[i];
  });

  return config;
}

/**
 * remove package specific config so a more generalized config can be gernerated
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
export const trimConfig = (oldConfig, newConfig) => {
  const config = oldConfig;
  if (config.output) {
    if (config.output.name) delete config.output.name;
    if (config.output.globals) delete config.output.globals;
  }

  if (config.external) delete config.external;

  return config;
};

// export const trim = compose(trimConfig, trimPlugins);

export const replacePlugins = (oldConfig, plugins = []) => {
  const config = oldConfig;

  plugins.forEach(plugin => {
    const i = config.plugins.findIndex(({ name }) => name === plugin.name);

    if (i > -1) config.plugins[i] = plugin;
    else config.plugins.push(plugin);
  });

  return config;
};

export const mergeConfig = (oldConfig, newConfig) =>
  // merge(trim(oldConfig, newConfig), newConfig);
  merge(trimPlugins(trimConfig(oldConfig), newConfig), newConfig);

/**
 * default package configuration
 * @type {[type]}
 */
export { config };
export const defaultConfig = config;

export const mergeDefaultConfig = (newConfig) =>
  mergeConfig(defaultConfig, newConfig);

/**
 * npm package configuration. This is for code that is bundled to be published
 * to npm. This will optimize the code for both browser and node where possible.
 * @type {[type]}
 */
export const defaultNpmConfig = mergeDefaultConfig({});

export const mergeDefaultNpmConfig = (newConfig) =>
  mergeConfig(defaultNpmConfig, newConfig);

/**
 * node package configuration. This is for code that is bundled to run on node
 * only (not optimized for browser).
 * @type {[type]}
 */
export const defaultNodeConfig = mergeDefaultNpmConfig({
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

export const mergeDefaultNodeConfig = (newConfig) =>
  mergeConfig(defaultNodeConfig, newConfig);

/**
 * executable package configuration. This is for code that is bundled to run as
 * a cli or shell script.
 * @type {[type]}
 */
export const defaultExecutableConfig = mergeDefaultNodeConfig({
  output: {
    format: 'cjs',
  },
  plugins: [
    executable(),
  ],
});

export const mergeDefaultExecutableConfig = (newConfig) =>
  mergeConfig(defaultExecutableConfig, newConfig);

export default config;
