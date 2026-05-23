# Apex7AI — Calculadora de ROI Lynx Agent

Calculadora operacional inteligente desenvolvida para diagnosticar gargalos, estimar economia de tempo/dinheiro e recomendar planos de automação com o Lynx Agent.

![Apex7AI Logo](./src/assets/apex7ai-logo.gif)

## 🚀 Tecnologias
- **Framework:** [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (React 19 + TypeScript)
- **Styling:** Tailwind CSS 4
- **Routing:** TanStack Router
- **Build Tool:** Vite + Bun
- **Deploy:** Docker (Easypanel) em modo SPA

## 📊 Funcionalidades
- **Diagnóstico em 4 Etapas:** Identificação de nicho, gargalo e volume operacional.
- **Cálculo de ROI em tempo real:** Fórmulas dinâmicas de economia mensal e anual.
- **Biblioteca de Casos de Uso:** Exemplos reais de automação com integração (Notion, Slack, CRM, Gmail).
- **Recomendação Inteligente de Planos:** Sugere o plano ideal com base na economia estimada.

## 🛠️ Como rodar localmente

1. Instale o [Bun](https://bun.sh/):
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Instale as dependências:
```bash
bun install
```

3. Inicie o servidor de desenvolvimento:
```bash
bun run dev
```

## 📦 Deploy
O projeto está configurado para deploy via Docker. O arquivo `Dockerfile` na raiz gerencia a compilação e o serviço dos arquivos estáticos via `serve`.

Para mais detalhes sobre o deploy na VPS, veja [DEPLOY.md](./DEPLOY.md).

---
Desenvolvido por **Apex7AI**.
