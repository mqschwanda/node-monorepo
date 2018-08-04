import '@mqschwanda/scripts/dist/handle-unhandled-rejections.js';
import { exec } from '@mqschwanda/scripts';

const ROLLUP_CONFIG_FILE = 'rollup.config.js';

const scripts = {
  build: `rollup --config ${ROLLUP_CONFIG_FILE}`,
};

exec(scripts.build)
  .then(console.log);
