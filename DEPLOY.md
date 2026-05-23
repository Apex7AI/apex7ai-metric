# Documentação de Implantação — Apex7AI Metric

Este documento descreve a arquitetura de deploy final utilizada para hospedar a calculadora de ROI no Easypanel (VPS).

## Arquitetura Atual
O projeto foi convertido de um modelo **SSR (Cloudflare Workers)** para um modelo **SPA (Single Page Application)** de alta performance.

### Por que SPA?
1. **Leveza:** Consome apenas ~10MB de RAM na VPS.
2. **Estabilidade:** Elimina erros de "502 Bad Gateway" comuns ao tentar simular o ambiente Cloudflare (Wrangler) em containers Docker tradicionais.
3. **Velocidade:** O servidor apenas entrega arquivos estáticos, tornando o carregamento instantâneo.

## Detalhes do Dockerfile
- **Base:** `node:22.12-bookworm-slim`
- **Build:** Utiliza `Bun` para instalação ultra-rápida de dependências e `Vite` para compilação.
- **Servidor de Produção:** Utiliza o pacote `serve` para gerenciar as rotas do SPA.
- **Porta:** Configurado para escutar na **Porta 80**, batendo com o padrão do Easypanel.

## Como realizar novos Deploys
Sempre que você fizer um `git push origin main`, o Easypanel detectará a mudança e:
1. Irá rodar o build do Vite.
2. Irá gerar os arquivos na pasta `dist/client`.
3. Irá reiniciar o container servindo esses arquivos.

## Configurações no Easypanel
- **Service Type:** App
- **Build Type:** Dockerfile
- **Port:** 80
- **Domain:** Configurado com HTTPS automático via Let's Encrypt.
