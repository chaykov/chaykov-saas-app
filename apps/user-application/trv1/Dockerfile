# Frontend Dockerfile for React + Vite Application
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.18.1

# Build stage
FROM base AS builder

WORKDIR /app

# Copy root package.json and pnpm files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy frontend package.json
COPY apps/user-application/trv1/package.json ./apps/user-application/trv1/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source code
COPY apps/user-application/trv1 ./apps/user-application/trv1

# Build the application
WORKDIR /app/apps/user-application/trv1

# Build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Set NODE_ENV to production for proper React build
ENV NODE_ENV=production

RUN pnpm build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY apps/user-application/trv1/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/apps/user-application/trv1/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
