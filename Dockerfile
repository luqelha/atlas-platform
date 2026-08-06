# Dependencies Stage
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Build Stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Production Dependencies Stage
FROM node:20-alpine AS prod-deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npm run prisma:generate

# Production Runtime Stage
FROM node:20-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=prod-deps /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Use non-root user for security
USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
