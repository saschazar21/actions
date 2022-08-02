const http = require('http');
const handler = require('serve-handler');

const PORT = process.env.SERVER_PORT ?? 3000;

const DEFAULT_OPTIONS = {
  renderSingle: true,
  public: 'dist',
};

module.exports = async (customOptions) =>
  new Promise((resolve, reject) => {
    const options = {
      ...DEFAULT_OPTIONS,
      ...customOptions,
      public: customOptions?.dist,
    };

    const server = http.createServer((request, response) =>
      handler(request, response, options),
    );

    server.on('error', reject);

    server.listen(PORT, () => {
      console.log('Server running on port', PORT);

      return resolve([server, `http://localhost:${PORT}`]);
    });
  });
