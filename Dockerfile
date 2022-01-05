### STAGE 1: Build ###
FROM node:slim AS espi-backend
#WORKDIR /usr/src/app
WORKDIR /app
COPY ./package.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run compile

EXPOSE 9000

CMD  ["npm", "start" ]