# Creates the Chemical Hazard Tool server and GUI
#
# You can access the container using:
#   docker run -it c2app sh
# To start it stand-alone:
#   docker run -it -p 3000:3000 c2app

# Build the app separately
FROM node:alpine AS builder
RUN apk add --no-cache --virtual .gyp python3 make g++ git vips-dev && \
  npm i -g yalc
RUN mkdir /packages && \
  mkdir /packages/shared && \
  mkdir /packages/gui && \
  mkdir /packages/server
COPY ./packages/shared /packages/shared
WORKDIR /packages/shared
RUN npm install && \
  npm run build:domain && \
  yalc publish --private
COPY ./packages/server /packages/server
WORKDIR /packages/server
RUN yalc add c2app-models-utils && \
  npm install && \
  npm run build:domain
COPY ./packages/gui /packages/gui
WORKDIR /packages/gui
RUN rm -fr node_modules && \
  yalc add c2app-models-utils && \
  npm install && \
  npm run build:domain

# Serve the built app
FROM node:alpine
RUN mkdir -p /app
COPY --from=builder /packages/shared/node_modules /shared/node_modules
COPY --from=builder /packages/shared/dist /shared
COPY --from=builder /packages/server/node_modules /app/node_modules
COPY --from=builder /packages/server/package.json /app/package.json
COPY --from=builder /packages/server/dist/src /app/dist
COPY --from=builder /packages/server/.yalc /app/.yalc
COPY --from=builder /packages/gui/dist /app/public
WORKDIR /app
EXPOSE 3000
CMD ["node", "./dist/index.js"]
