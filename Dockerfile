# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

ARG NODE_ENV
ARG APP_VERSION
ARG SITE_URL
ARG API_BASE_URL

# Define environment variables
ENV HOST=127.0.0.1
ENV NODE_ENV=${NODE_ENV}
ENV APP_VERSION=${APP_VERSION}
ENV SITE_URL=${SITE_URL}
ENV API_BASE_URL=${API_BASE_URL}

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] run tests
# RUN bun test

# Build the application
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/package.json .

# Copy the output from the build stage to the working directory
COPY --from=build /usr/src/app/.output ./

USER bun

# Expose the port the application will run on
EXPOSE 3000/tcp

# Install pm2
RUN npm install pm2@latest -g

# Start the application
CMD ["pm2-runtime", "--interpreter ~/.bun/bin/bun", "server/index.mjs"]
