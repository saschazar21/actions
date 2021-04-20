const { spawn } = require('child_process');
const { join } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const debug = require('debug')('localhost-screenshot');

const HOST_REGEX = /(http:\/\/localhost:\d{2,5})$/i;
// eslint-disable-next-line prefer-destructuring
const WORKDIR_PATH = process.env.GITHUB_WORKSPACE;

const init = async ({ dist }) =>
  new Promise((resolve, reject) => {
    let isReturned = false;

    const proc = spawn('serve', [join(WORKDIR_PATH, dist)]);

    proc.stdout.on('data', (data) => {
      const d = data.toString().trim();
      debug(d);

      if (isReturned) {
        return;
      }

      const [, host] = HOST_REGEX.test(d) ? HOST_REGEX.exec(d) : [];

      isReturned = true;
      resolve([proc, host]);
    });

    proc.stderr.on('data', (data) => {
      debug(data.toString());

      if (isReturned) {
        return;
      }

      isReturned = true;
      reject(data);
    });

    proc.on('exit', () => debug('Server exited.'));
  });

module.exports = init;
