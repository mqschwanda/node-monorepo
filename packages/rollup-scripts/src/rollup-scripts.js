// node shebang added as a banner option to rollup config
// #!/usr/bin/env node

// 'use strict';
//
// import '@mqschwanda/scripts/dist/handle-unhandled-rejections.js';
// import path from 'path';
// import crossSpawn from 'react-dev-utils/crossSpawn';
//
// const scripts = ['test', 'build'];
//
// const scriptError = (script) => `Unknown script: "${script}".`;
// const buildError = (reason) =>
//   `The build failed because the process exited too early.${
//     reason && ` ${reason}` // append reason with space if it exists
//   }`;
//
// const messages = {
//   scriptError,
//   buildError,
//   SIGKILL: buildError(
//     'This probably means the system ran out of memory or someone called `kill -9` on the process.'
//   ),
//   SIGTERM: buildError(
//     'Someone might have called `kill` or `killall`, or the system could be shutting down.'
//   ),
// };
//
// const getScriptArgs = (_scripts, pathToScript = (_script) => `./${_script}`) => {
//   const argv = process.argv.slice(2);
//   const nodeArgv = index > 0 ? argv.slice(0, index) : [];
//   const scriptArgv = argv.slice(index + 1);
//   const index = argv.findIndex((arg) => _scripts.includes(arg));
//   const script = index === -1 ? argv[0] : argv[index];
//   const scriptPath = pathToScript(script)
//   const args = [...nodeArgv, scriptPath, ...scriptArgv];
//
//   return { script, args };
// };
//
// const _pathToScript = (_script) =>
//   require.resolve(path.join('..', 'dist', _script));
// const { script, args } = getScriptArgs(scripts, _pathToScript);
// const runScript = () => {
//   const { signal, status } = crossSpawn.sync('node', args, { stdio: 'inherit' });
//   if (signal) {
//     if (signal === 'SIGKILL') console.error(messages.SIGKILL);
//     else if (signal === 'SIGTERM') console.error(messages.SIGTERM);
//     process.exit(1);
//   }
//   process.exit(status);
// }
//
// // const { signal, status } = crossSpawn.sync('node', args, { stdio: 'inherit' });
// // if (signal) {
// //   if (signal === 'SIGKILL') console.error(messages.SIGKILL);
// //   else if (signal === 'SIGTERM') console.error(messages.SIGTERM);
// //   process.exit(1);
// // }
// // process.exit(status);
//
// if (scripts.includes(script)) runScript(script);
// else console.error(messages.scriptError(script));

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const requireResolve = require('require-resolve');
const spawn = require('react-dev-utils/crossSpawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'build':
  case 'eject':
  case 'start':
  case 'test': {
    const result = spawn.sync(
      'node',
      nodeArgs
        // .concat(requireResolve(`../dist/${script}`, path.dirname(path.dirname(__filename))))
        .concat(require.resolve('../dist/' + script))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: 'inherit' }
    );
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    console.log('Perhaps you need to update react-scripts?');
    console.log(
      'See: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases'
    );
    break;
}
