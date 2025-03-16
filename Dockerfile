ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.3

# Create build stage
FROM node:${NODE_VERSION}-slim AS build

# Install pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

## Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files to the working directory
COPY . ./

# Build the application
RUN pnpm build

# Create a new stage for the production image
FROM node:${NODE_VERSION}-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the output from the build stage to the working directory
COPY --from=build /app/.output ./

# Define environment variables
ENV HOST=0.0.0.0 NODE_ENV=production
ENV NODE_ENV=production

# Expose the port the application will run on
EXPOSE 3000

# Install pm2
RUN npm install pm2@latest -g

# Start the application
CMD ["pm2-runtime", "server/index.mjs"]
