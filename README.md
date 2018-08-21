# Node Monorepo

[![Build Status](https://travis-ci.org/mqschwanda/node-monorepo.svg?branch=master)](https://travis-ci.org/mqschwanda/node-monorepo)
![License](https://img.shields.io/npm/l/express.svg)
![Gluten Free](https://img.shields.io/badge/gluten-free-yellow.svg)

`node-monorepo` contains all public [NPM packages](https://www.npmjs.com/~mqschwanda) published under the `@mqschwanda` scope. The 'monorepo' structure is utilized to keep all node development in one place.

## Built With

- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) - Yarn Workspaces is a feature that allows users to install dependencies from multiple package.json files in subfolders of a single root package.json file, all in one go. This enables faster, lighter installation by preventing package duplication across Workspaces. Yarn can also create symlinks between Workspaces that depend on each other, and will ensure the consistency and correctness of all directories.
- [rollup.js](https://rollupjs.org/guide/en) - Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application. It uses the new standardized format for code modules included in the ES6 revision of JavaScript, instead of previous idiosyncratic solutions such as CommonJS and AMD. ES6 modules let you freely and seamlessly combine the most useful individual functions from your favorite libraries. This will eventually be possible natively, but Rollup lets you do it today.
