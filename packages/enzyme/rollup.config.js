import { mergeDefaultNpmConfig } from '@mqschwanda/rollup-config-default';

const { name } = require('./package.json');

export default mergeDefaultNpmConfig({
  output: {
    name,
    globals: {
      react: 'react',
      enzyme: 'enzyme',
      'enzyme-adapter-react-16': 'enzyme-adapter-react-16',
    },
  },
  // Rollup will only resolve relative module IDs by default. This means that an
  // import statement won't result in deepmerge being included in your bundle –
  // instead, it will be an external dependency that is required at runtime. If
  // that's what you want, you can suppress this warning with the external
  // option, which makes your intentions explicit
  // see: https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
  external: [
    'react', // <-- suppresses the warning
    'enzyme', // <-- suppresses the warning
    'enzyme-adapter-react-16', // <-- suppresses the warning
  ],
});
