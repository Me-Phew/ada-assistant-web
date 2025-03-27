# use the official Bun image
FROM oven/bun:alpine AS build

ARG NODE_ENV
ARG APP_VERSION
ARG SITE_URL
ARG API_BASE_URL

# Validate env vars
RUN if [ -z "$NODE_ENV" ]; then echo "ERROR: NODE_ENV not set" && exit 1; fi
RUN if [ -z "$APP_VERSION" ]; then echo "ERROR: APP_VERSION not set" && exit 1; fi
RUN if [ -z "$SITE_URL" ]; then echo "ERROR: SITE_URL not set" && exit 1; fi
RUN if [ -z "$API_BASE_URL" ]; then echo "ERROR: API_BASE_URL not set" && exit 1; fi

# Define environment variables
ENV HOST=127.0.0.1
ENV NODE_ENV=${NODE_ENV}
ENV APP_VERSION=${APP_VERSION}
ENV SITE_URL=${SITE_URL}
ENV API_BASE_URL=${API_BASE_URL}

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lock files to the working directory
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application files to the working directory
COPY . ./

# Build the application
RUN bun run build

# Create a new stage for the production image
FROM oven/bun:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/.output ./

# Expose the port the application will run on
EXPOSE 3000

# Install pm2
RUN bun install -g pm2

# Start the application
CMD ["pm2-runtime", "--interpreter", "/root/.bun/bin/bun", "server/index.mjs"]
