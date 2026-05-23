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

# ---------- Stage 2: runtime ----------
FROM node:22.12-bookworm-slim AS runner
WORKDIR /app

# Servidor estático
RUN npm install -g serve

# Copiamos o conteúdo de dist/client direto para a WORKDIR
COPY --from=builder /app/dist/client ./

# Garantimos que o index.html existe
RUN if [ -f _shell.html ]; then cp _shell.html index.html; fi

# Mudamos para a porta 80 para bater com o padrão do seu Easypanel
EXPOSE 80

# Rodamos o serve na porta 80
CMD ["serve", "-s", ".", "-l", "80"]
