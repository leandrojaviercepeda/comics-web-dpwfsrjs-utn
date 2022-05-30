FROM node:14.17.3-alpine as node
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./.env ./.env
COPY ./public ./public
COPY ./src ./src

RUN npm run build

FROM nginx:1.13.12-alpine
COPY --from=node /usr/src/app/build /usr/share/nginx/html