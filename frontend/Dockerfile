FROM node:8.1

LABEL maintainer="info@wearespindle.com"

RUN mkdir -p /usr/src/frontend

# Install npm packages outside WORKDIR, but treat them as local,
# by modifying NODE_PATH.
COPY package.json /usr/src/
WORKDIR /usr/src/
RUN npm install --quiet
ENV NODE_PATH /usr/src/node_modules

# gulp-cli needs to be installed globally.
RUN npm install --quiet -g gulp-cli webpack@1.14.0

WORKDIR /usr/src/frontend
