const debug = require('debug')('localhost-screenshot');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const screenshot = require('./screenshot');
const server = require('./server');

const { argv } = yargs(hideBin(process.argv))
  .option('dark', {
    type: 'boolean',
    default: false,
    description:
      'Apply dark mode (run with @media (prefers-color-scheme: dark))',
  })
  .option('devices', {
    type: 'string',
    description:
      'Comma-separated string of devices to emulate within Chrome (see: https://bit.ly/3n0EmMe), default: standard 1440x900 viewport',
  })
  .option('dist', {
    type: 'string',
    description: 'Relative path pointing to the website distribution folder',
    default: './dist',
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    description: 'Screenshot file name prefix',
    default: 'screenshot',
  })
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'URL path of the website to create a screenshot from',
    default: '/',
  });

const options = { ...argv };

const str = 'Configuration options:';
const fill = String().padStart(str.length + 6, '-');
const blank = String().padStart(fill.length, ' ');
debug(`\n-${fill}-\n-${blank}-\n-   ${str}   -\n-${blank}-\n-${fill}-\n\n`);
debug(options);

server({ ...options }).then(([instance, baseUrl]) =>
  screenshot({ ...options, baseUrl }).then(() => instance.close()),
);
