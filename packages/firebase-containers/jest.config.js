module.exports = {
  testURL: 'http://localhost',
  "testRegex": ".*.tests\.js$",
  'verbose': true,
  'moduleDirectories': [
    'node_modules',
    'src',
  ],
  'transform': {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest'
  },
};
