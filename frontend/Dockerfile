FROM node:latest

RUN mkdir -p /usr/src/frontend

# Install npm packages outside WORKDIR, but treat them as local,
# by modifying NODE_PATH.
ADD package.json /usr/src/
WORKDIR /usr/src/
RUN npm install
ENV NODE_PATH /usr/src/node_modules

# gulp-cli needs to be installed globally.
RUN npm install -g gulp-cli

WORKDIR /usr/src/frontend
