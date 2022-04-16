FROM node:alpine3.12 as builder

WORKDIR /build
ADD package.json package-lock.json ./
RUN npm i webpack-cli
RUN npm i
ADD index.js ./
RUN node_modules/.bin/webpack-cli ./index.js -t node

# FROM node:alpine3.12

# RUN apk add --no-cache tzdata iperf3
# WORKDIR /app
# COPY --from=builder /build/dist/main.js ./index.js

# USER nobody
# CMD node .

FROM alpine:3.12

RUN apk add --no-cache tzdata iperf3 nodejs
WORKDIR /app
COPY --from=builder /build/dist/main.js ./index.js

USER nobody
CMD node .
