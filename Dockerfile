FROM node:19-buster as builder
WORKDIR /app
RUN apt update -y && apt install -y docker
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN ./node_modules/.bin/tsc
CMD ["node", "dist/index.js"]