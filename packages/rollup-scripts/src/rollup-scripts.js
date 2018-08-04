// node shebang added as a banner option to rollup config
// #!/usr/bin/env node

'use strict';

import '@mqschwanda/scripts/dist/handle-unhandled-rejections.js';
import path from 'path';
import crossSpawn from 'react-dev-utils/crossSpawn';

const scripts = ['build', 'eject', 'start', 'test'];

const scriptError = (script) => `Unknown script: "${script}".`;
const buildError = (reason) =>
  `The build failed because the process exited too early.${
    reason && ` ${reason}` // append reason with space if it exists
  }`;

const messages = {
  scriptError,
  buildError,
  SIGKILL: buildError(
    'This probably means the system ran out of memory or someone called `kill -9` on the process.'
  ),
  SIGTERM: buildError(
    'Someone might have called `kill` or `killall`, or the system could be shutting down.'
  ),
};

const getScriptArgs = (_scripts, pathToScript = (_script) => `./${_script}`) => {
  const argv = process.argv.slice(2);
  const nodeArgv = index > 0 ? argv.slice(0, index) : [];
  const scriptArgv = argv.slice(index + 1);
  const index = argv.findIndex((arg) => _scripts.includes(arg));
  const script = index === -1 ? argv[0] : argv[index];
  const scriptPath = pathToScript(script)
  const args = [...nodeArgv, scriptPath, ...scriptArgv];

  return { script, args };
};

const _pathToScript = (script) =>
  require.resolve(path.join('..', 'dist', script));
const { script, args } = getScriptArgs(scripts, _pathToScript);
const { signal, status } = crossSpawn.sync('node', args, { stdio: 'inherit' });
if (signal) {
  if (signal === 'SIGKILL') console.error(messages.SIGKILL);
  else if (signal === 'SIGTERM') console.error(messages.SIGTERM);
  process.exit(1);
}
process.exit(status);

if (scripts.includes(script)) runScript(script);
else console.error(messages.scriptError(script));
