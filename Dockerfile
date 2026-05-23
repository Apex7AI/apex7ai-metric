# ---------- Stage 1: build ----------
# Bun 1.3.x reports a Node-compatible runtime new enough for Vite 7.
FROM oven/bun:1.3.14 AS builder
WORKDIR /app

# Install deps (cacheable layer)
COPY package.json bun.lock* bunfig.toml* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
RUN bun -e "import { Generator } from '@tanstack/router-generator'; const g = new Generator({ root: process.cwd(), config: { routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts', target: 'react' } }); await g.run();"
RUN bun run build

# ---------- Stage 2: runtime ----------
FROM oven/bun:1.3.14-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy built artifacts + minimal runtime files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/wrangler.jsonc ./wrangler.jsonc
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Serve the built Worker via wrangler (uses workerd runtime locally)
CMD ["bunx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "3000", "--local", "--no-show-interactive-dev-session"]
