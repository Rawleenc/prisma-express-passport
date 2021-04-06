FROM node:14-alpine AS base

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package.json ./
# Copy prisma
COPY prisma ./prisma/

# Install app dependencies (reuqires package.json)
RUN yarn install --frozen-lockfile
# Generate prisma client (requires prisma folder)
RUN yarn prisma generate

# Copy source and destination 
COPY . .