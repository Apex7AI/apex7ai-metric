# ---------- Stage 1: build ----------
FROM node:22.12-bookworm-slim AS builder
WORKDIR /app

# Install Bun
RUN npm install -g bun@1.3.14

# Install deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
# Remove old route tree and build
RUN rm -f src/routeTree.gen.ts && bun run build

# ---------- Stage 2: runtime ----------
FROM node:22.12-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Install wrangler globalmente para rodar o worker
RUN npm install -g wrangler@3.109.2

# Copiar arquivos necessários do builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/wrangler.jsonc ./wrangler.jsonc
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# O comando que o Lovable usa para simular o Cloudflare localmente
CMD ["wrangler", "dev", "--ip", "0.0.0.0", "--port", "3000", "--local", "--no-show-interactive-dev-session"]
