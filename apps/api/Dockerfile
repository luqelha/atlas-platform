# Dependencies Stage
FROM node:20-slim AS deps
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Build Stage
FROM node:20-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Production Dependencies Stage
FROM node:20-slim AS prod-deps
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npm run prisma:generate

# Production Runtime Stage
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=prod-deps /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Create storage directory for uploads and set permissions
RUN mkdir -p ./storage/uploads && chown -R node:node ./storage

# Use non-root user for security
USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
