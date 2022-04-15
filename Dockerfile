FROM node:alpine3.12

RUN apk add --no-cache tzdata iperf3

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm i

ADD index.js ./

USER nobody
CMD node .
