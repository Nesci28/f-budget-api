FROM node:18-buster-slim as build
RUN apt-get update \
  && apt-get -y install python3 make gcc g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g npm@latest
WORKDIR /app
# Copy tests
#COPY ./test ./test
# Copy tsconfig
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
# Preinstall dependencies
COPY ./.npmrc ./
COPY ./healthcheck_version ./
COPY ./nest-cli.json ./
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci
# Copy app sources
COPY ./src ./src

# Serve definitions files and build
# RUN echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
RUN npm run build
RUN npm prune --production --force && rm -rf ./src

FROM node:16-buster-slim as runtime-dependencies
WORKDIR /app
CMD [ "node", "--", "./main.js" ]

FROM runtime-dependencies as runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist .
COPY --from=build /app/package.json .
COPY --from=build /app/healthcheck_version ./
USER node:node