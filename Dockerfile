# Multi-stage build for the Coolify MCP server
# Builder installs all deps and compiles the TypeScript sources.
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies. Prefer the lockfile when present, but fall back to a
# regular install so builds still succeed if Coolify clones a branch without
# package-lock.json.
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Build the project
COPY . .
RUN npm run build

# Runtime image with only production dependencies and built output.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy compiled code
COPY --from=builder /app/dist ./dist

# Required environment variables for the MCP server
ENV COOLIFY_BASE_URL=http://localhost:3000
ENV COOLIFY_ACCESS_TOKEN=""

CMD ["node", "dist/index.js"]
