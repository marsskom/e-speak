# syntax = docker/dockerfile:1

ARG NODE_VERSION=16.20.2
ARG PORT=3000

FROM node:${NODE_VERSION}-alpine as base

RUN apk --no-cache add openssh g++ make python3 git

ENV NODE_ENV=production

WORKDIR /src

COPY --link package.json yarn.lock /src/

# Build
FROM base as build

RUN yarn cache clean
RUN yarn install --ignore-engines --frozen-lockfile --production=true

COPY --link . .

RUN yarn run build

# Run
FROM base

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=$PORT

EXPOSE $PORT

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
