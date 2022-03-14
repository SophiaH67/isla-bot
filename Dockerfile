FROM node:17 as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD ["./node_modules/.bin/ts-node"]

FROM node:17 as app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY --from=builder /app/dist .
RUN ls -la > /dev/stderr
CMD ["node", "."]