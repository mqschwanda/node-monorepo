export default {
  testURL: 'http://localhost',
  testRegex: ".*.tests\.(js|x)$",
  verbose: true,
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  transform: {
    '^.+\\.(js|x)$': 'babel-jest',
    '^.+\\.(js|x)$': 'babel-jest'
  },
};
