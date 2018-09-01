# rollup-config-default

This package includes configuration used by [@mqschwanda/rollup](https://github.com/mqschwanda/node-monorepo/tree/master/packages/rollup)

[![Build Status](https://travis-ci.org/mqschwanda/node-monorepo.svg?branch=master)](https://travis-ci.org/mqschwanda/node-monorepo)
![License](https://img.shields.io/npm/l/express.svg)
[![NPM Downlaods](https://img.shields.io/npm/dt/@mqschwanda/rollup-config-default.svg)](https://www.npmjs.com/package/@mqschwanda/rollup-config-default)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@mqschwanda/rollup-config-default.svg)](https://github.com/mqschwanda/node-monorepo/tree/master/packages/rollup-config-default)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@mqschwanda/rollup-config-default.svg)](https://github.com/mqschwanda/node-monorepo/tree/master/packages/rollup-config-default)


### API
- `defaultConfig` - generalized configuration for a javascript project.
  ```jsx
  import { defaultConfig } from '@mqschwanda/rollup-config-default';
  // const defaultConfig = {
  //   input: 'src/index.js',
  //   plugins: [
  //     babel({
  //       plugins: ['external-helpers'],
  //     }),
  //     uglify(),
  //   ],
  //   output: {
  //     file: 'dist/index.js',
  //     exports: 'named',
  //     format: 'umd',
  //     sourceMap: true,
  //   },
  // };

  export default defaultConfig;
  ```

- `buildDefaultConfig`
  ```jsx
  import { buildDefaultConfig } from '@mqschwanda/rollup-config-default';
  const config = buildDefaultConfig({
    input: 'src/index.js'
  });

  export default config;
  ```

- `defaultNpmConfig` - generalized NPM package configuration
  ```jsx
  import { defaultNpmConfig } from '@mqschwanda/rollup-config-default';
  // const defaultNpmConfig = {
  //   input: 'src/index.js',
  //   plugins: [
  //     babel({
  //       plugins: ['external-helpers'],
  //     }),
  //     uglify(),
  //   ],
  //   output: {
  //     file: 'dist/index.js',
  //     exports: 'named',
  //     format: 'umd',
  //     sourceMap: true,
  //   },
  // };

  export default defaultNpmConfig;
  ```

- `buildDefaultNpmConfig`
  ```jsx
  import { buildDefaultNpmConfig } from '@mqschwanda/rollup-config-default';
  const config = buildDefaultNpmConfig({
    input: 'src/index.js'
  });

  export default config;
  ```

- `defaultExecutablConfig` - generalized node executable configuration
  ```jsx
  import { defaultExecutablConfig } from '@mqschwanda/rollup-config-default';
  // const defaultExecutablConfig = {
  //   input: 'src/index.js',
  //   plugins: [
  //     babel({
  //       plugins: ['external-helpers'],
  //     }),
  //     uglify(),
  //     executable()
  //   ],
  //   output: {
  //     file: 'dist/index.js',
  //     exports: 'named',
  //     format: 'umd',
  //     sourceMap: true,
  //   },
  // };

  export default defaultExecutablConfig;
  ```

- `mergeDefaultExecutablConfig`
  ```jsx
  import { mergeDefaultExecutablConfig } from '@mqschwanda/rollup-config-default';
  const config = mergeDefaultExecutablConfig({
    input: 'src/index.js'
  });

  export default config;
  ```
