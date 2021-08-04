# FROM jslave:5001/node:14-alpine
FROM node:14-alpine

# Install build essentials
RUN apk add --no-cache make gcc g++ python curl git

# Create app directory
WORKDIR /srv/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Clean unnecessary package cache
RUN npm cache clean --force

# Remove unnecessary build essentials
RUN apk del make gcc g++ python

# @NOTE: Everyhing above here should change rarely to benefit from docker caching.

COPY . .
# @NOTE: copying .dockerenv here

# Build app
RUN npm run build

# Start app
CMD npm run migrate && npm run seed && npm run start
