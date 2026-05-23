# ---------- Stage 1: build ----------
FROM oven/bun:1.1 AS builder
WORKDIR /app

# Install deps (cacheable layer)
COPY package.json bun.lock* bunfig.toml* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
RUN bun run build

# ---------- Stage 2: runtime ----------
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy only the built client assets
COPY --from=builder /app/dist/client ./dist/client

# Install a simple static server
RUN bun add serve

EXPOSE 3000

# Start the server and handle SPA routing by serving index.html for unknown routes
CMD ["bunx", "serve", "-s", "dist/client", "-l", "3000"]
