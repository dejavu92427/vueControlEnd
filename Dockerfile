FROM node:12.18.1 as build-env
ARG website
WORKDIR /app

COPY . .
COPY ./configs/${website}/config.json .

RUN npm install
RUN npm run build:prod

FROM alpine
WORKDIR /source
ARG website
RUN apk update && \
    apk add --no-cache \
        rsync

COPY --from=build-env  /app/dist /source
COPY --from=build-env  /app/config.json /source


