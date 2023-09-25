# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.17.1
ARG PORT=3000

FROM node:${NODE_VERSION}-alpine as base

RUN apk --no-cache add openssh g++ make python3 git

ENV NODE_ENV=production

WORKDIR /app

COPY --link package.json yarn.lock /app/

# Build
FROM base as build

RUN yarn cache clean
RUN yarn install --frozen-lockfile --production=true

COPY --link . .

RUN yarn run build

# Run
FROM base

ENV HOST 0.0.0.0
ENV PORT=$PORT

EXPOSE $PORT

COPY --from=build /app/.output /app/.output

CMD [ "node", ".output/server/index.mjs" ]
