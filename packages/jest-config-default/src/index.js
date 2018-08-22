import deepmerge from 'deepmerge';
import defaultConfig from '../jest.config';

const mergeConfig = (oldConfig, newConfig) =>
  deepmerge(oldConfig, newConfig);

export const config = defaultConfig;
export const mergeDefaultConfig = (config) =>
  mergeConfig(defaultConfig, config);

export default mergeDefaultConfig;
