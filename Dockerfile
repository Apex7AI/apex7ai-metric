# ---------- Stage 1: build ----------
FROM node:22.12-bookworm-slim AS builder
WORKDIR /app

# Install Bun for fast package management
RUN npm install -g bun@1.3.14

# Install deps (cacheable layer)
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

# Copiamos TUDO do builder para garantir que o wrangler encontre os fontes e configs
COPY --from=builder /app ./

EXPOSE 3000

# Usamos o wrangler que já está no node_modules para evitar erros de versão
CMD ["./node_modules/.bin/wrangler", "dev", "--ip", "0.0.0.0", "--port", "3000", "--local", "--no-show-interactive-dev-session"]
