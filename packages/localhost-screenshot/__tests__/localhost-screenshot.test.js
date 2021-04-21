/* eslint-disable import/no-extraneous-dependencies */
const rimraf = require('rimraf');
const fs = require('fs');
const fetch = require('node-fetch');
const { join } = require('path');

const TMP = '/memfs';
const DIST_DIR = './dist';

const DEFAULT_OPTIONS = {
  dark: false,
  devices: undefined,
  dist: DIST_DIR,
  name: 'screenshot',
  url: '/',
};

process.env.HOME = TMP;
process.env.GITHUB_WORKSPACE = __dirname;

jest.mock('fs', () => {
  const Volume = jest.requireActual('memfs').Volume;
  const fs = jest.requireActual('fs');
  const ufs = jest.requireActual('unionfs').ufs;

  const vol = Volume.fromJSON({ './.DS_STORE': '' }, TMP);
  return ufs.use(fs).use(vol);
});

const screenshot = require('../src/screenshot');
const server = require('../src/server');

describe('Localhost Screenshot', () => {
  let host;
  let proc;

  afterAll(() => proc.kill());

  afterEach(
    async () =>
      new Promise((resolve, reject) =>
        rimraf(`${TMP}/**.png`, (err) => (err ? reject(err) : resolve())),
      ),
  );

  beforeAll(async () => {
    const s = await server({ dist: './' });
    host = s[1];
    proc = s[0];
  });

  it('starts server process and kills it', async () => {
    expect(proc).toBeTruthy();
    expect(/^http:\/\/localhost:\d{2,5}$/.test(host)).toBeTruthy();

    const response = await fetch(host);

    expect(response.status).toEqual(200);
  });

  it('takes screenshot using default options', async () => {
    await screenshot({ ...DEFAULT_OPTIONS, baseUrl: host });

    expect(
      fs.readFileSync(join(TMP, 'screenshot_1440x900.png'), null),
    ).toBeTruthy();
  });

  it('takes screenshot when missing options', async () => {
    expect(() =>
      fs.readFileSync(join(TMP, 'screenshot_1440x900.png'), null),
    ).toThrow();

    await screenshot({ baseUrl: host });

    expect(
      fs.readFileSync(join(TMP, 'screenshot_1440x900.png'), null),
    ).toBeTruthy();
  });

  it('takes screenshot using custom options', async () => {
    await screenshot({
      ...DEFAULT_OPTIONS,
      dark: true,
      devices: ['iPhone 11', 'iPad'],
      baseUrl: host,
      name: 'screen',
      url: '/localhost-screenshot.test.js',
    });

    expect(
      fs.readFileSync(join(TMP, 'screen_414x828_dark.png'), null),
    ).toBeTruthy();

    expect(
      fs.readFileSync(join(TMP, 'screen_768x1024_dark.png'), null),
    ).toBeTruthy();
  });
});
