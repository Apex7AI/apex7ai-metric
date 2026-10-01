# LynxMetric — Diagnóstico de Workflows com IA

Diagnóstico gratuito da Apex7 AI que transforma uma dor operacional em uma estimativa transparente, um workflow recomendado e uma primeira instrução pronta para executar na Lynx.

![Apex7AI Logo](./src/assets/apex7ai-logo.gif)

## 🚀 Tecnologias

- **Framework:** [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (React 19 + TypeScript)
- **Styling:** Tailwind CSS 4
- **Routing:** TanStack Router
- **Build Tool:** Vite + Bun
- **Deploy:** Docker (Easypanel) em modo SPA

## 📊 Funcionalidades

- **8 áreas e 40 tarefas orientadas por problema:** gestão, vendas, marketing, pesquisa, operações, RH, atendimento e tecnologia.
- **Diagnóstico em 4 etapas:** área, tarefa específica, volume/esforço e contexto do negócio.
- **Estimativa por faixa:** cada tarefa possui uma faixa própria de redução de esforço, sem somar casos não informados pelo visitante.
- **Lynx Opportunity Score:** indicador interno de aderência baseado na tarefa, repetitividade e esforço atual.
- **Primeira instrução pronta:** prompt bilíngue e editável com plano, entregáveis, fontes e aprovação humana.
- **Biblioteca categorizada:** os 45 cenários pesquisados continuam disponíveis como referências filtráveis.
- **Português e inglês:** toda a jornada, as tarefas e os prompts funcionam nos dois idiomas.
- **Recomendação de plano:** usa o potencial conservador de horas recuperadas.
- **Resultado compartilhável:** cria um link reproduzível e uma versão limpa para PDF.
- **Funil empresarial:** abre o Tally com o contexto do diagnóstico e oferece agendamento direto.
- **Analytics do evento:** mede a jornada do diagnóstico sem enviar nome, e-mail ou empresa ao Google Analytics.

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

Para entender a arquitetura, visualizar mudanças localmente, criar pontos de retorno e trabalhar com segurança, veja [GUIA_PROJETO.md](./GUIA_PROJETO.md).

Para operar o funil no evento, veja [FUNIL_EVENTO.md](./FUNIL_EVENTO.md), [PLAYBOOK_COMERCIAL_STS.md](./PLAYBOOK_COMERCIAL_STS.md) e [OPERACAO_CLIENTES.md](./OPERACAO_CLIENTES.md).

---

Desenvolvido por **Apex7AI**.
