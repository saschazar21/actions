FROM node:lts-alpine AS builder

ENV NODE_ENV=production

WORKDIR /src

COPY package.json /src

RUN yarn

### --------------------- ###

FROM buildkite/puppeteer

RUN npm i -g serve

COPY src /src
COPY --from=builder /src /src

ENTRYPOINT [ "node", "/src/index.js" ]
