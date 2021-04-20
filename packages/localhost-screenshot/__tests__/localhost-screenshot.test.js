/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const fetch = require('node-fetch');

// jest.mock('fs', () => require('memfs').fs);

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
      fs.readFileSync('/memfs/screenshot_1440x900.png', null),
    ).toBeTruthy();
  });
});
