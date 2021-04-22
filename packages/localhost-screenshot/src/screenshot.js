const { join } = require('path');
const { URL } = require('url');
// eslint-disable-next-line import/no-extraneous-dependencies
const debug = require('debug')('localhost-screenshot');
// eslint-disable-next-line import/no-extraneous-dependencies
const puppeteer = require('puppeteer');

const PUBLIC_PATH = process.env.HOME;
// Puppeteer device descriptors: https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
const DEFAULT_VIEWPORT = [1440, 900];

const init = async () => {
  const [width, height] = DEFAULT_VIEWPORT;

  const browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
    ],
    defaultViewport: { height, width },
  });

  const version = `Browser version: ${await browser.version()}`;
  const fill = String().padStart(version.length + 6, '#');
  debug(
    `\n#${fill}#\n#${String('#').padStart(
      fill.length + 1,
      ' ',
    )}\n#   ${version}   #\n#${String('#').padStart(
      fill.length + 1,
      ' ',
    )}\n#${fill}#\n\n`,
  );

  return browser;
};

const capture = async ({
  baseUrl,
  browser,
  dark,
  device = 'default',
  name: prefix = 'screenshot',
  url: urlPath = '/',
}) => {
  const isCustomDevice = !!puppeteer.devices[device];
  const [width, height] = isCustomDevice
    ? [
        puppeteer.devices[device].viewport.width,
        puppeteer.devices[device].viewport.height,
      ]
    : [...DEFAULT_VIEWPORT];
  const name = `${prefix}_${width}x${height}${dark ? '_dark' : ''}.png`;
  const path = join(PUBLIC_PATH, name);
  const url = new URL(urlPath, baseUrl);

  debug(
    `Capturing URL: "${url}" w/ device: "${device}" (viewport ${width}x${height})...`,
  );

  const page = await browser.newPage();
  if (isCustomDevice) {
    await page.emulate(puppeteer.devices[device]);
  }
  if (dark) {
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'dark' },
    ]);
  }

  await page.goto(url);
  await page.screenshot({ path });

  debug(`DONE! Saved screenshot to ${path}`);
};

const setup = async (options) => {
  const devices =
    options?.devices && options.devices.length > 0
      ? options.devices.split(',').map((device) => device.trim())
      : [];

  const runs =
    devices.length > 0
      ? devices.map((device) => ({ ...options, device }))
      : [{ ...options }];

  debug(
    `Expecting ${
      runs.length
    } screenshot(s) in total using the following device presets: ${runs
      .map(({ device = 'default' }) => device)
      .join(', ')}.`,
  );

  return init().then((browser) =>
    Promise.all(
      runs.map((config) => capture({ ...config, browser })),
    ).then(() => browser.close()),
  );
};

module.exports = setup;
