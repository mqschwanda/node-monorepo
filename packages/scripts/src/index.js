import { dim } from 'chalk';
import childProcess from 'child_process';

const logScript = (script) => console.log(dim(`$ ${script}`));

export const exec = (script) => {
  // console.log(dim(`$ ${script}`));
  logScript(script);

  return new Promise((resolve, reject) => {
    childProcess.exec(script, (error, stdout, stderr) => {

      if (error || stderr) reject(stderr);
      if (stdout) resolve(stdout);
    });
  }).catch(console.error);
};
