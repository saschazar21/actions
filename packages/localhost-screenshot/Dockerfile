FROM node:16-alpine

# Add edge repository for installing latest Chromium browser
RUN echo "@edge https://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN apk add --no-cache chromium@edge

# ENV DEBUG localhost-screenshot
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
ENV PUPPETEER_PRODUCT chrome

WORKDIR /src

COPY package.json .
COPY src /src

RUN yarn --frozen-lockfile

ENTRYPOINT ["node", "--unhandled-rejections=strict", "/src/index.js"]