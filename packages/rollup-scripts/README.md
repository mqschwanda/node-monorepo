# rollup-scripts

This package includes scripts used by [@mqschwanda/rollup](https://github.com/mqschwanda/node-monorepo/tree/master/packages/rollup)

[![Build Status](https://travis-ci.org/mqschwanda/node-monorepo.svg?branch=master)](https://travis-ci.org/mqschwanda/node-monorepo)
![License](https://img.shields.io/npm/l/express.svg)
[![NPM Downlaods](https://img.shields.io/npm/dt/@mqschwanda/rollup-scripts.svg)](https://www.npmjs.com/package/@mqschwanda/rollup-scripts)


All of the [rollup cli](https://rollupjs.org/guide/en#command-line-reference) flags and configurations are able to be used by appending them to the end of any rollup script.

### Build

```bash
rollup-scripts build
```

Builds the package for production using the rollup cli. It bundles javascript in production mode and optimizes the build for the best performance.

Your package is ready to be used.
