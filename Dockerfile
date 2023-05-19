FROM node:19-buster as builder
WORKDIR /app
RUN apt update -y && apt install -y docker
# Install exactly glibc-2.29
RUN wget -4c https://ftp.gnu.org/gnu/glibc/glibc-2.29.tar.gz && \
    tar -zxvf glibc-2.29.tar.gz && \
    glibc-2.29 && \
    mkdir build_dir && \
    cd build_dir && \
    ../configure --prefix=/opt/glibc && \
    make && \
    make install
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN ./node_modules/.bin/tsc
CMD ["node", "dist/index.js"]