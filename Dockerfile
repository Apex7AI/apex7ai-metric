# ---------- Stage 1: build ----------
# Vite 7 must run on real Node >= 22.12; Bun is used only to install from bun.lock.
FROM node:22.12-bookworm-slim AS builder
WORKDIR /app

RUN npm install -g bun@1.3.14

# Install deps (cacheable layer)
COPY package.json bun.lock* bunfig.toml* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
RUN rm -f src/routeTree.gen.ts && node ./node_modules/vite/bin/vite.js build

# ---------- Stage 2: runtime ----------
FROM node:22.12-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy built artifacts + minimal runtime files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/wrangler.jsonc ./wrangler.jsonc
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/src ./src

EXPOSE 3000

# Serve the production build on the container port expected by EasyPanel
CMD ["node", "./node_modules/vite/bin/vite.js", "preview", "--host", "0.0.0.0", "--port", "3000"]
