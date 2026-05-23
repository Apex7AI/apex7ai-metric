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
RUN rm -f src/routeTree.gen.ts && bun run build

# O TanStack Start SPA gera um _shell.html, precisamos dele como index.html
RUN cp dist/client/_shell.html dist/client/index.html || echo "index.html already exists"

# ---------- Stage 2: runtime ----------
FROM node:22.12-bookworm-slim AS runner
WORKDIR /app

# Servidor estático ultra leve
RUN npm install -g serve

# Copiar apenas os arquivos prontos (muito mais leve)
COPY --from=builder /app/dist/client ./dist/client

EXPOSE 3000

# Comando para rodar em modo SPA (-s) na porta 3000
CMD ["serve", "-s", "dist/client", "-l", "3000"]
