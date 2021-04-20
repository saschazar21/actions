const { join } = require('path');
const { fs, vol } = require('memfs');

const TMP = '/tmp';
const WORKDIR = '/src';
const DIST_DIR = './dist';

const INDEX_HTML =
  '<html><head><title>Demo</title></head><body>Hello, world!</body></html>';

jest.mock('fs', () => require('memfs').vol);

describe('Localhost Screenshot', () => {
  beforeAll(() => {
    process.env.HOME = TMP;
    process.env.GITHUB_WORKSPACE = WORKDIR;

    const files = {
      './index.html': INDEX_HTML,
    };

    vol.fromJSON(files, join(WORKDIR, DIST_DIR));
  });

  it('creates screenshot using default options', async () => {
    await import('../src');

    expect(fs.readFileSync(join(WORKDIR, './dist/index.html'), 'utf8')).toEqual(
      INDEX_HTML,
    );
  });
});
