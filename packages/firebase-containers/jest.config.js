module.exports = {
  testURL: 'http://localhost',
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
