/* eslint-disable no-console */
const { spawn } = require('child_process');
const { join } = require('path');

const HOST_REGEX = /(http:\/\/localhost:\d{2,5})$/i;
// eslint-disable-next-line prefer-destructuring
const WORKDIR_PATH = process.env.RUNNER_WORKSPACE;

const init = async ({ dist }) =>
  new Promise((resolve, reject) => {
    let isReturned = false;

    const proc = spawn('serve', [join(WORKDIR_PATH, dist)]);

    proc.stdout.on('data', (data) => {
      const d = data.toString().trim();
      console.log(d);

      if (isReturned) {
        return;
      }

      const [, host] = HOST_REGEX.test(d) ? HOST_REGEX.exec(d) : [];

      isReturned = true;
      resolve([proc, host]);
    });

    proc.stderr.on('data', (data) => {
      console.error(data.toString());

      if (isReturned) {
        return;
      }

      isReturned = true;
      reject(data);
    });

    proc.on('exit', () => console.log('Server exited.'));
  });

module.exports = init;
