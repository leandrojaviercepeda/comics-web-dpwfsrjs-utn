FROM node:16.20.0-alpine as node
WORKDIR /usr/src/app/web

COPY package*.json ./

RUN npm install --force

COPY ./.env ./.env
COPY ./public ./public
COPY ./src ./src

RUN npm run build

FROM nginx:1.13.12-alpine
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid

USER nginx

COPY --chown=nginx:nginx --from=node /usr/src/app/web/build /usr/share/nginx/html
COPY --chown=nginx:nginx ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx ./nginx/default.conf /etc/nginx/conf.d/default.conf