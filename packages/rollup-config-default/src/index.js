import deepmerge from 'deepmerge';
import executable from 'rollup-plugin-executable';
import _config from '../rollup.config';

/**
 * remove package specific config so a more generalized config can be gernerated
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const trimConfig = (c) => {
  if (c.output) {
    if (c.output.name) delete c.output.name;
    if (c.output.globals) delete c.output.globals;
  }

  if (c.externals) delete c.externals;

  return c;
};

const mergeConfig = (oldConfig, newConfig) =>
  deepmerge(trimConfig(oldConfig), newConfig);

/**
 * default package configuration
 * @type {[type]}
 */
export const config = _config;
export const defaultConfig = _config;

export const mergeDefaultConfig = (newConfig) =>
  mergeConfig(defaultConfig, newConfig);

/**
 * npm package configuration
 * @type {[type]}
 */
const defaultNpmConfig = defaultConfig;

export const mergeDefaultNpmConfig = (newConfig) =>
  mergeConfig(defaultNpmConfig, newConfig);

/**
 * npm executable package configuration
 * @type {[type]}
 */
const defaultExecutablConfig = mergeDefaultNpmConfig({
  plugins: [executable()],
});

export const mergeDefaultExecutableConfig = (newConfig) =>
  mergeConfig(defaultExecutablConfig, newConfig);

export default config;
