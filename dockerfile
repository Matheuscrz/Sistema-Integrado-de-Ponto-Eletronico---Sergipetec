FROM postgres:latest as builder
COPY init-db.sql /docker-entrypoint-initdb.d/
COPY partition-script.sql /docker-entrypoint-initdb.d/
FROM node:lts
WORKDIR /app
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./jest.config.ts .
COPY ./nodemom.json .
COPY ./server ./server
COPY ./log ./log

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]