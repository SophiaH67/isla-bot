FROM node:20-bullseye as builder
WORKDIR /app
RUN apt update -y && apt install -y docker libc6
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install
RUN ./node_modules/.bin/tsc
CMD ["node", "dist/index.js"]