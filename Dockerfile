# ---------- Stage 1: build ----------
FROM node:22.12-bookworm-slim AS builder
WORKDIR /app

# Install Bun for fast package management
RUN npm install -g bun@1.3.14

# Install deps (cacheable layer)
COPY package.json bun.lock* bunfig.toml* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
# Remove old route tree and build using Vite directly
RUN rm -f src/routeTree.gen.ts && node ./node_modules/vite/bin/vite.js build

# ---------- Stage 2: runtime ----------
FROM node:22.12-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Install 'serve' to handle SPA static files and routing
RUN npm install -g serve

# Copy only the built client assets from the builder stage
COPY --from=builder /app/dist/client ./dist/client

EXPOSE 3000

# Start 'serve' in SPA mode (-s) on port 3000
CMD ["serve", "-s", "dist/client", "-l", "3000"]
