FROM node:14-alpine AS base

# Create app directory
WORKDIR /app

# Copy everything over (except .dockerignored stuff)
COPY . .

# Install app dependencies (reuqires package.json)
RUN yarn install --frozen-lockfile

# Generate prisma client (requires prisma folder)
RUN yarn prisma generate

EXPOSE 3000

CMD [ "yarn", "start" ]