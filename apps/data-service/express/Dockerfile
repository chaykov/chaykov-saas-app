# Backend Dockerfile for Express API
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.18.1

# Build stage
FROM base AS builder

WORKDIR /app

# Copy root package.json and pnpm files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy backend package.json
COPY apps/data-service/express/package.json ./apps/data-service/express/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY apps/data-service/express ./apps/data-service/express

# Build the application
WORKDIR /app/apps/data-service/express
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@10.18.1

WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy backend package.json
COPY apps/data-service/express/package.json ./apps/data-service/express/

# Install all dependencies (including drizzle-kit for migrations)
RUN pnpm install --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/apps/data-service/express/dist ./apps/data-service/express/dist

# Copy source (needed for drizzle schema and migrations)
COPY --from=builder /app/apps/data-service/express/src ./apps/data-service/express/src

# Copy drizzle config
COPY apps/data-service/express/drizzle.config.ts ./apps/data-service/express/

WORKDIR /app/apps/data-service/express

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["pnpm", "start"]
