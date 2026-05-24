# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build API
RUN pnpm --filter @videochat/api build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package.json
COPY package.json pnpm-workspace.yaml ./

# Copy API and packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages ./packages

# Set working directory
WORKDIR /app/apps/api

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode); r.resume();}).on('error', (e) => {throw e})"

# Start application
CMD ["node", "dist/main.js"]
