# Stage 1 - the build process
FROM node:8 as build-deps

LABEL maintainer="info@wearespindle.com"

WORKDIR /usr/src/app
RUN git clone https://github.com/wearespindle/flindt-front-end.git .
RUN npm i
RUN npm run build

# Stage 2 - the frontend webserver (basic)
FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
