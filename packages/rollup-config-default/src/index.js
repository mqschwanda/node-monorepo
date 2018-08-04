import deepmerge from 'deepmerge';
import executable from 'rollup-plugin-executable';
import defaultConfig from '../rollup.config';

const trimConfig = (config) => {
  if ((config.output || {}).name) delete config.output.name;

  return config;
};

const mergeConfig = (oldConfig, newConfig) =>
  deepmerge(oldConfig, trimConfig(newConfig));

export const mergeDefaultConfig = (config) =>
  mergeConfig(defaultConfig, config);

const defaultNpmConfig = defaultConfig;

export const mergeDefaultNpmConfig = (config) =>
  mergeConfig(defaultNpmConfig, config);

const defaultExecutablConfig = mergeDefaultNpmConfig({
  plugins: [executable()],
});

export const mergeDefaultExecutableConfig = (config) =>
  mergeConfig(defaultExecutablConfig, config);

export default mergeDefaultConfig;
