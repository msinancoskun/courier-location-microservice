FROM node:18-bullseye

USER root

WORKDIR /root/app

COPY . .

RUN npm ci

RUN npm run build

CMD [ "node", "dist/main.js" ]