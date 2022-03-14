FROM node:17 as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN ./node_modules/.bin/tsc
CMD ["node", "dist/index.js"]