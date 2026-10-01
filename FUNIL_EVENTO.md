# Funil do evento — LynxMetric

Este guia registra como usar o LynxMetric para diagnóstico, captura qualificada e agendamento no Siará Tech Summit.

## Fluxo

```text
QR do evento
→ diagnóstico LynxMetric
→ resultado + prompt
→ testar na Lynx com US$5 incluídos no plano Free
ou
→ enviar diagnóstico pelo Tally
→ agendar conversa gratuita
```

URL do QR do evento:

```text
https://lynxmetric.apex7ai.com/?utm_source=siara_tech_summit&utm_medium=qr&utm_campaign=sts_2026
```

Agenda usada no resultado:

```text
https://calendar.app.google/D7ba1qfmg8gq71fu5
```

Use esse mesmo endereço também no botão final do Tally. Se o formulário ainda apontar para outro link de agenda, substitua-o pelo endereço acima para não dividir os agendamentos entre duas agendas.

## Como criar os campos ocultos no Tally

Os campos ocultos não aparecem para quem responde. Eles recebem automaticamente o diagnóstico calculado no LynxMetric.

1. Abra o formulário `zxvPzR` no editor do Tally.
2. Clique em qualquer espaço vazio no início do formulário.
3. Digite `/hidden`.
4. Escolha **Hidden fields / Campos ocultos**.
5. Digite o nome do campo exatamente como listado abaixo.
6. Repita o processo para cada nome.
7. Publique novamente o formulário.

Crie estes campos, respeitando letras minúsculas e sublinhados:

```text
source
medium
campaign
locale
category
category_label
task
task_label
workflow_id
volume
manual_minutes
team_size
currency
opportunity_score
manual_hours
hours_low
hours_high
savings_low
savings_high
recommended_plan
```

O site já está preparado para preencher todos eles. Não é necessário criar fórmulas no Tally.

### Teste dos campos ocultos

Depois de publicar:

1. faça um diagnóstico completo no LynxMetric;
2. clique em **Enviar meu diagnóstico**;
3. envie uma resposta identificada como teste;
4. abra `Submissions` no Tally;
5. confirme que aparecem `category`, `task`, `opportunity_score` e os demais campos;
6. confirme que uma nova linha chegou ao Google Sheets;
7. apague o teste do Tally e da planilha antes do evento.

## Ajustes finais recomendados no Tally

- `Settings → Language`: Português;
- usar o bloco de e-mail, e não texto curto, na pergunta de e-mail;
- corrigir as faixas da equipe para `1`, `2–5`, `6–10`, `11–20`, `21–50`, `51–200`, `mais de 200`;
- completar o título `Quais ferramentas estão envolvidas nessa operação?`;
- ter uma caixa obrigatória de consentimento, além do texto explicativo;
- permitir múltiplas ferramentas;
- manter os links da Lynx e da agenda na página final.

## Analytics sem dados pessoais

O LynxMetric usa a mesma propriedade Google Analytics da home da Lynx (`G-6ETJFB3PT3`). Nenhum nome, e-mail ou nome de empresa é enviado ao Analytics.

Eventos registrados:

```text
diagnostic_started
category_selected
task_selected
diagnostic_completed
prompt_copied
lynx_clicked
result_shared
result_pdf_clicked
lead_form_opened
meeting_clicked
language_changed
```

Nome, e-mail, empresa, cargo e ferramentas ficam no Tally e no Google Sheets.

## Painéis

### O que significa o número 45

O número `45` mostrado na página é a quantidade fixa de cenários pesquisados disponíveis na biblioteca. Ele não representa visitantes nem diagnósticos concluídos e, por isso, não muda para 46 quando alguém usa o site.

Para contar diagnósticos reais:

- Google Analytics: contagem do evento `diagnostic_completed`;
- Tally: quantidade de formulários empresariais enviados;
- Google Sheets: quantidade de leads e seus dados comerciais.

Um contador público global crescente exigiria armazenamento em um backend ou banco de dados. Não usar `localStorage` para isso, pois ele contaria somente naquele navegador e produziria um número enganoso.

### Tally Insights

Usar para respostas concluídas, cargos, ferramentas, intenção comercial, visitas e origem do formulário.

### Google Analytics

Usar para o funil completo:

```text
início
→ categoria
→ tarefa
→ diagnóstico concluído
→ prompt copiado
→ Lynx aberta
→ formulário aberto
→ agenda clicada
```

No GA4, use `Relatórios → Engajamento → Eventos` e procure `diagnostic_completed`. Para verificar imediatamente durante um teste no domínio publicado, use `Relatórios → Tempo real` e veja a contagem por nome do evento. Testes em `localhost` não são enviados ao Analytics.

### Google Sheets / Looker Studio

Usar para cruzamentos comerciais:

- tarefa por cargo;
- tarefa por tamanho de equipe;
- ferramentas por tarefa;
- score por intenção comercial;
- origem por pedido de reunião;
- plano recomendado por perfil.

## Leitura da amostra

- `10–20`: sinais qualitativos e primeiras entrevistas;
- `30–50`: tendências direcionais;
- `50–100`: comparação inicial entre cargos e categorias;
- `100+`: segmentações mais úteis.

Sempre apresentar quantidade e percentual, por exemplo: `Vendas e CRM — 12 de 30 diagnósticos (40%)`.

## Como salvar o diagnóstico em PDF

1. conclua o diagnóstico;
2. no início do resultado, clique em **Baixar / salvar PDF**;
3. a janela de impressão do navegador será aberta;
4. em **Destino** ou **Impressora**, escolha **Salvar como PDF**;
5. clique em **Salvar** e escolha a pasta.

O navegador gera o arquivo localmente. Nenhum PDF com dados pessoais é enviado ao servidor.
