# Multi-stage build for Remove Background React App
# Stage 1: Build client and server
FROM node:20-alpine as builder

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
COPY tsconfig.json ./

# Build client and server
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files from builder
COPY package*.json ./
COPY server/package*.json ./server/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Create a simple Express middleware to serve static files
# The built client files will be served by the Node server
RUN cat > /app/server/dist/serve-static.js << 'EOF'
const express = require('express');
const path = require('path');

module.exports = function serveStatic(app) {
  // Serve client static files
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // Fallback to index.html for React Router
  app.get('*', (req, res) => {
    // Don't redirect API calls
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    }
  });
};
EOF

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start server
CMD ["node", "server/dist/index.js"]
