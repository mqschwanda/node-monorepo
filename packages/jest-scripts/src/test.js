import '@mqschwanda/scripts/dist/handle-unhandled-rejections.js';
import { exec } from '@mqschwanda/scripts';

const JEST_CONFIG_FILE = 'jest.config.js';

const scripts = {
  test: `jest --config ${JEST_CONFIG_FILE}`,
};

exec(scripts.test)
  .then(console.log);
