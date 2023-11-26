FROM node:lts
WORKDIR /app
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
# COPY ./src /app/src
# COPY ./src/views /app/views
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "./dist/server.js"]