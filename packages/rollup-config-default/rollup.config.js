import babel from 'rollup-plugin-babel';
import executable from 'rollup-plugin-executable';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

/**
 * this config file is being imported directly into the src and bundled into
 * into the module. We need to make sure that requiring the `package.json` will
 * not throw an error so we wrap it in a try catch block.
 */
let packageJSON;
try {
  packageJSON = require('./package.json');
} catch (e) {
  packageJSON = {
    name: '',
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
  };
}

const { name } = packageJSON;

const getExternals = ({
  dependencies = {},
  devDependencies = {},
  peerDependencies = {},
}) => [
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies),
  ...Object.keys(peerDependencies),
];

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['env', { modules: false }],
        'stage-3',
      ],
      exclude: '**/node_modules/**',
      plugins: [
        'external-helpers',
      ],
    }),
    uglify(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ],
  output: {
    file: 'dist/index.js',
    exports: 'named',
    name,
    format: 'cjs',
    sourceMap: true,
  },
  external: getExternals(packageJSON),
}
