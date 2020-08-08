# Merge dependencies of the top level package.json with the server package.json
# so that the build step also installs the dependencies needed for the shared folder.
FROM node:13-alpine as MERGE

COPY ./scripts/mergeDependencies.js ./mergeDependencies.js

COPY ./package.json ./package-shared.json
COPY ./server/package.json ./package.json

RUN node mergeDependencies.js ./package-shared.json ./package.json

# Install the dependecies and then build the server 
FROM node:13-alpine as BUILD

RUN mkdir -p /app/.cache/yarn && chmod 777 /app/.cache/yarn
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app


COPY ./server .
COPY ./shared ./src/shared

COPY --from=MERGE ./package.json ./package.json

RUN yarn

RUN yarn build

# copy the js code and the node_modules then satrt the server
FROM node:13-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

ENV HOME=/app
WORKDIR $HOME
USER node

COPY --from=BUILD ./node_modules ./node_modules
COPY --from=BUILD ./dist/src ./dist
COPY --from=BUILD ./package.json .

# EXPOSE ${PORT}

CMD yarn start:prod

# for development only
# ENTRYPOINT ["tail", "-f", "/dev/null"] 
