#!/usr/bin/env node
"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var crossSpawn=_interopDefault(require("cross-spawn")),path=_interopDefault(require("path")),requireResolve=_interopDefault(require("require-resolve")),crossSpawn_1=crossSpawn;process.on("unhandledRejection",function(e){throw e});var args=process.argv.slice(2),scriptIndex=args.findIndex(function(e){return"build"===e||"eject"===e||"start"===e||"test"===e}),script=-1===scriptIndex?args[0]:args[scriptIndex],nodeArgs=0<scriptIndex?args.slice(0,scriptIndex):[];switch(script){case"build":case"eject":case"start":case"test":var result=crossSpawn_1.sync("node",nodeArgs.concat(requireResolve("../dist/"+script,path.dirname(path.dirname(__filename)))).concat(args.slice(scriptIndex+1)),{stdio:"inherit"});result.signal&&("SIGKILL"===result.signal?console.log("The build failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process."):"SIGTERM"===result.signal&&console.log("The build failed because the process exited too early. Someone might have called `kill` or `killall`, or the system could be shutting down."),process.exit(1)),process.exit(result.status);break;default:console.log('Unknown script "'+script+'".'),console.log("Perhaps you need to update react-scripts?"),console.log("See: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases")}var rollupScripts={};exports.default=rollupScripts;
