import deepmerge from 'deepmerge';
import executable from 'rollup-plugin-executable';
import _config from '../rollup.config';

/**
 * remove package specific config so a more generalized config can be gernerated
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const trimConfig = (config) => {
  if (config.output) {
    if (config.output.name) delete config.output.name;
    if (config.output.globals) delete config.output.globals;
  }

  if (config.externals) delete config.externals;

  return config;
};

const mergeConfig = (oldConfig, newConfig) =>
  deepmerge(oldConfig, trimConfig(newConfig));

/**
 * default package configuration
 * @type {[type]}
 */
export const config = _config;
export const defaultConfig = _config;

export const mergeDefaultConfig = (config) =>
  mergeConfig(defaultConfig, config);

/**
 * npm package configuration
 * @type {[type]}
 */
const defaultNpmConfig = defaultConfig;

export const mergeDefaultNpmConfig = (config) =>
  mergeConfig(defaultNpmConfig, config);

/**
 * npm executable package configuration
 * @type {[type]}
 */
const defaultExecutablConfig = mergeDefaultNpmConfig({
  plugins: [executable()],
});

export const mergeDefaultExecutableConfig = (config) =>
  mergeConfig(defaultExecutablConfig, config);

export default config;
