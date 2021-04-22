FROM node:lts-alpine AS builder

WORKDIR /src

RUN npm i --save-dev debug yargs

### --------------------- ###

FROM buildkite/puppeteer

RUN npm i -g serve

COPY src /src
COPY --from=builder /src /src

ENTRYPOINT [ "node", "/src/index.js" ]
