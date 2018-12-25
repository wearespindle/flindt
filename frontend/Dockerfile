# Stage 1 - the build process
FROM node:8 as build-deps

LABEL maintainer="info@wearespindle.com"

WORKDIR /usr/src/app
RUN git clone https://github.com/wearespindle/flindt-front-end.git .

ARG CLIENT_ID
RUN sed -i s/197265624471-f8cb8sdb8dr1uevsscev16191ksr3ln6/${CLIENT_ID}/g src/config/google.json

RUN npm i
RUN npm run build

# Stage 2 - the frontend webserver (basic)
FROM nginx:stable-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
