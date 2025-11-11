# Multi-stage build for Remove Background React App
# Stage 1: Build client and server
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci

# Copy source code
COPY client ./client
COPY server ./server
COPY client/tsconfig.json ./client/
COPY server/tsconfig.json ./server/

# Build client and server
RUN npm run build

# Stage 2: Production runtime
FROM node:20

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Copy package files from builder
COPY package*.json ./
COPY server/package*.json ./server/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start server
CMD ["node", "server/dist/index.js"]
