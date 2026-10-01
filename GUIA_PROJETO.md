# Guia do projeto Apex7AI Metric

Este documento registra como o projeto funciona, como visualizar mudanças antes do deploy, o que foi alterado na versão bilíngue e como voltar com segurança caso alguma publicação apresente problemas.

## 1. Objetivo do projeto

O LynxMetric é um diagnóstico gratuito de workflows do Lynx by Apex7 AI. Ele ajuda uma pessoa ou empresa a:

1. identificar a área operacional com maior atrito;
2. escolher uma tarefa específica, sem misturar departamento, objetivo e formato de arquivo;
3. estimar uma faixa de horas e custo recuperados;
4. visualizar as etapas e os entregáveis que a Lynx pode assumir;
5. receber uma primeira instrução bilíngue e editável;
6. abrir a Lynx e executar o workflow;
7. conhecer cenários relacionados sem somá-los artificialmente ao resultado;
8. encontrar um plano compatível com o potencial conservador calculado.

O Lynx deve ser apresentado como uma IA autônoma para trabalho real, e não como um chatbot. Ele recebe uma instrução, planeja, usa ferramentas e executa trabalhos em várias etapas até entregar um resultado pronto para aprovação.

### Mensagem central do produto

O site principal define a narrativa que deve orientar este diagnóstico:

- **Autonomous AI for Real Work:** IA autônoma aplicada ao trabalho real.
- **One message. Completed workflow:** uma instrução se transforma em um fluxo concluído.
- **Plan, tools and result:** o Lynx planeja, utiliza ferramentas e entrega um resultado para aprovação.
- **Information → Decision → Action:** dados deixam de ser apenas informação e se transformam em decisões e ações executadas.
- **AI Workers:** o usuário descreve o objetivo, conecta ferramentas e automatiza a execução.
- **Human control:** OAuth, permissões granulares, registro das ações e possibilidade de revogar acessos.

Ao escrever novos textos, evitar apresentar o Lynx como um sistema que apenas conversa ou responde perguntas. O foco deve estar em planejar, pesquisar, navegar, integrar, gerar arquivos e concluir tarefas em várias etapas.

## 2. Estrutura principal

| Arquivo ou pasta                           | Responsabilidade                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `src/routes/index.tsx`                     | Página principal, estado do diagnóstico, interação e apresentação dos resultados.           |
| `src/lib/diagnostic-data.ts`               | Casos pesquisados, categorias, fórmulas de economia, receita potencial e dados-base.        |
| `src/lib/workflow-data.ts`                 | Oito áreas, quarenta tarefas, faixas de redução, etapas, entregáveis e geração dos prompts. |
| `src/lib/i18n.ts`                          | Textos em inglês e português, tradução dos casos e formatação localizada.                   |
| `src/components/ui/`                       | Componentes visuais reutilizáveis. Não contém as regras do diagnóstico.                     |
| `src/styles.css`                           | Tema, cores, tipografia, animações e estilos globais.                                       |
| `src/router.tsx` e `src/routes/__root.tsx` | Inicialização e estrutura de rotas da aplicação.                                            |
| `Dockerfile`                               | Build de produção e servidor estático utilizado pelo Easypanel.                             |
| `DEPLOY.md`                                | Informações específicas do deploy no Easypanel.                                             |

### Fontes de verdade

- Os 45 cenários históricos e suas fórmulas ficam em `src/lib/diagnostic-data.ts`.
- As áreas, tarefas, faixas estimadas, etapas, entregáveis e instruções ficam em `src/lib/workflow-data.ts`.
- Os textos gerais e as traduções dos cenários históricos ficam em `src/lib/i18n.ts`.

Mudanças visuais não devem alterar premissas numéricas. Qualquer revisão de volume, unidade ou tempo precisa ser documentada e testada separadamente.

## 3. O que foi implementado na versão bilíngue

- seletor `EN / PT` no cabeçalho;
- tradução do início, diagnóstico, resultados, biblioteca, receita e planos;
- tradução dos 45 casos de ROI;
- tradução dos casos de receita potencial;
- tradução de segmentos e gargalos;
- formatação de valores em português como `US$ 1.000`;
- atualização do idioma do documento e dos metadados principais;
- preferência de idioma salva no navegador;
- troca de idioma sem apagar o diagnóstico preenchido.

## 4. O que foi implementado no diagnóstico orientado por workflow

- fluxo `área → tarefa → volume → tempo → contexto → resultado`;
- oito áreas operacionais e quarenta tarefas em português e inglês;
- perfil da empresa opcional, usado para personalizar a instrução e não para bloquear o resultado;
- moeda selecionável entre BRL e USD;
- volume definido como total mensal da equipe para evitar dupla multiplicação;
- faixa específica de redução para cada tarefa, em lugar de uma redução fixa para todas;
- cálculo principal baseado somente na tarefa informada;
- `Lynx Opportunity Score` interno e explicado no próprio resultado;
- etapas, entregáveis e prompt editável com regra de aprovação humana;
- botão para copiar a instrução e abrir a Lynx;
- biblioteca dos 45 cenários com filtros pelas oito áreas;
- cenários relacionados apresentados separadamente, sem inflar o ROI;
- revisão dos casos ambíguos de enriquecimento de CRM e monitoramento de marca;
- cenário de receita com etapas explícitas de alcance, resposta e conversão.

### Fórmula atual do diagnóstico

```text
esforço manual mensal = volume total da equipe × minutos por execução ÷ 60

tempo potencial recuperado = esforço manual mensal × faixa de redução da tarefa

custo potencial recuperado = tempo potencial recuperado × custo/hora informado
```

O tamanho da equipe serve para compreender a operação e personalizar o prompt. Ele não multiplica novamente um volume que já representa o total da equipe.

## 5. Como visualizar antes de publicar

### Opção A — Docker, recomendada

Essa opção é a mais próxima do ambiente do Easypanel.

```bash
docker build -t apex7ai-metric-local .
docker run --rm -p 8080:80 apex7ai-metric-local
```

Abra no navegador:

```text
http://localhost:8080
```

Use `Ctrl+C` no terminal para encerrar.

### Opção B — Bun, para desenvolvimento rápido

```bash
bun install
bun run dev --host 0.0.0.0
```

Abra o endereço apresentado pelo terminal. Normalmente será uma porta como `8080` ou `5173`.

### Verificações mínimas antes do deploy

1. Abrir a página inicial em inglês.
2. Clicar em `PT` e confirmar a tradução.
3. Recarregar a página e confirmar que o idioma foi mantido.
4. Preencher os quatro blocos do diagnóstico.
5. Conferir resultado, valores, plano recomendado e biblioteca.
6. Testar em uma janela estreita para simular celular.
7. Executar a validação de tipos e o build:

```bash
bun x tsc --noEmit
bun run build
```

## 6. Fluxo seguro para futuras melhorias

Não é necessário copiar o projeto para outra pasta. O Git já mantém cada ponto de retorno.

Para cada melhoria, crie uma branch separada:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/nome-da-melhoria
```

Depois de desenvolver e visualizar localmente:

```bash
git status
git add ARQUIVOS_DA_MELHORIA
git commit -m "Descrição objetiva da melhoria"
git push -u origin feature/nome-da-melhoria
```

Após a revisão, a branch pode ser incorporada à `main`. O Easypanel está configurado para publicar mudanças enviadas à `main`.

## 7. Backup e pontos de retorno

### Versão anterior ao seletor de português

O commit anterior à tradução é:

```text
1e406fa
```

Uma branch de backup também deve apontar para esse commit:

```text
backup/pre-portugues-2026-09-30
```

### Versão bilíngue anterior ao diagnóstico por categorias

O ponto de retorno da versão bilíngue anterior ao diagnóstico por workflow é:

```text
commit: 8b9d0a5
branch: backup/bilingual-v1-2026-09-30
```

O desenvolvimento do diagnóstico orientado por workflow começou na branch:

```text
feature/workflow-diagnostic-v2
```

### Como desfazer uma publicação com `git revert`

Primeiro localize o commit problemático:

```bash
git log --oneline -10
```

Depois crie um novo commit que desfaz somente aquela alteração:

```bash
git revert --no-edit HASH_DO_COMMIT
git push origin main
```

Na prática, se o histórico for:

```text
A — versão anterior
B — atualização com problema
```

O `git revert B` cria:

```text
A — versão anterior
B — atualização com problema
C — reversão de B
```

Quando `C` for enviado à `main`, o Easypanel fará um novo deploy com o comportamento anterior. O histórico continua preservado e auditável.

Evite `git reset --hard` na `main`, pois ele reescreve o histórico e aumenta o risco de perda de trabalho.

## 8. Deploy no Easypanel

O fluxo atual é:

```text
GitHub main → Easypanel → Dockerfile → build com Bun → dist/client → servidor na porta 80
```

O `Dockerfile` usa Node Linux e Bun para compilar a aplicação e depois publica os arquivos estáticos com `serve`.

Depois de um push na `main`:

1. acompanhar o log de build no Easypanel;
2. confirmar que o build terminou sem erro;
3. abrir o domínio oficial em janela anônima;
4. testar inglês e português;
5. executar um diagnóstico completo.

## 9. Segurança do GitHub

Nunca coloque um token pessoal diretamente na URL do remoto Git.

A URL deve ter este formato:

```bash
git remote set-url origin https://github.com/Apex7AI/apex7ai-metric.git
```

Use o gerenciador de credenciais do sistema ou o GitHub CLI para autenticação. Tokens expostos devem ser revogados e substituídos.

## 10. Próximas melhorias para avaliar

Esses itens são possibilidades para a próxima etapa e ainda precisam de decisão antes de serem implementados:

- confirmar se a aplicação Lynx aceitará deep link com o prompt já preenchido;
- validar as faixas de redução com execuções reais e feedback de usuários;
- adicionar captura empresarial opcional depois do resultado;
- permitir exportar o diagnóstico em PDF ou compartilhar por link;
- registrar analytics de área, tarefa, resultado e clique em `Executar na Lynx`;
- adicionar feedback após a primeira tarefa concluída na plataforma;
- criar modo de apresentação para eventos e telas de projeção;
- adicionar uma lista de verificação automática para o deploy;
- conectar os workflows às demonstrações reais existentes no site da Lynx.

## 11. Regra de trabalho para mudanças futuras

Antes de qualquer implementação:

1. identificar os arquivos envolvidos;
2. confirmar se a mudança é visual, textual, funcional ou relacionada aos dados;
3. preservar `diagnostic-data.ts` quando a tarefa não envolver revisão dos números;
4. implementar em uma branch própria;
5. validar tipos e build;
6. visualizar localmente;
7. somente depois fazer commit, revisão e deploy.
