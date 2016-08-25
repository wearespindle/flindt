FROM node:latest

RUN mkdir -p /usr/src/frontend

ADD package.json /usr/src/frontend/

WORKDIR /usr/src/frontend

RUN npm install
RUN npm install -g gulp
