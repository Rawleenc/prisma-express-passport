FROM node:14-alpine AS builder

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package.json ./
# Copy in prisma
COPY prisma ./prisma/

# Install app dependencies
RUN yarn install --frozen-lockfile
# Generate prisma client
RUN yarn prisma generate

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]