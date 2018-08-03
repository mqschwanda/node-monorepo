import deepmerge from 'deepmerge';
import defaultConfig from '../rollup.config';

const trimConfig = (config) => {
  if ((config.output || {}).name) delete config.output.name;

  return config;
}

const mergeConfig = (oldConfig, newConfig) =>
  deepmerge(oldConfig, trimConfig(newConfig));

export const mergeDefaultConfig = (config) =>
  mergeConfig(defaultConfig, config);

export const mergeDefaultNpmConfig = (config) =>
  mergeConfig(defaultConfig, config);

export default mergeDefaultConfig;
