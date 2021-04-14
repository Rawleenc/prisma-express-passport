FROM node:14-alpine AS base

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package.json ./

# Install app dependencies (reuqires package.json)
RUN yarn install --frozen-lockfile

# Generate prisma client (requires prisma folder)
RUN yarn prisma generate

# Copy from local files (PC) to WORKDIR in base image
COPY . .

EXPOSE 3000