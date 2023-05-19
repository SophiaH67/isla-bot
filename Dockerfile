FROM node:19-alpine as builder
WORKDIR /app
RUN apk add --no-cache docker libc6-compat
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN ./node_modules/.bin/tsc
CMD ["node", "dist/index.js"]