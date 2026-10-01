export type WorkflowCategoryId =
  | "management"
  | "sales"
  | "marketing"
  | "research"
  | "operations"
  | "hr"
  | "support"
  | "technology";

export type LocalizedValue = {
  en: string;
  pt: string;
};

export interface WorkflowCategory {
  id: WorkflowCategoryId;
  title: LocalizedValue;
  description: LocalizedValue;
}

export interface WorkflowTask {
  id: string;
  categoryId: WorkflowCategoryId;
  title: LocalizedValue;
  description: LocalizedValue;
  unit: LocalizedValue;
  defaultVolume: number;
  defaultManualMin: number;
  reductionRange: [number, number];
  fit: number;
  steps: LocalizedValue[];
  outputs: LocalizedValue[];
}

const value = (en: string, pt: string): LocalizedValue => ({ en, pt });

export const WORKFLOW_CATEGORIES: WorkflowCategory[] = [
  {
    id: "management",
    title: value("Management & Office", "Gestão e Escritório"),
    description: value(
      "Meetings, calendar, inbox, briefings and executive reporting.",
      "Reuniões, agenda, e-mails, briefings e relatórios executivos.",
    ),
  },
  {
    id: "sales",
    title: value("Sales & CRM", "Vendas e CRM"),
    description: value(
      "Prospecting, qualification, CRM, proposals and follow-up.",
      "Prospecção, qualificação, CRM, propostas e follow-up.",
    ),
  },
  {
    id: "marketing",
    title: value("Marketing & Content", "Marketing e Conteúdo"),
    description: value(
      "Competitive intelligence, SEO, campaigns and content production.",
      "Concorrência, SEO, campanhas e produção de conteúdo.",
    ),
  },
  {
    id: "research",
    title: value("Research & Data", "Pesquisa e Dados"),
    description: value(
      "Web research, source comparison, analysis and decision-ready reports.",
      "Pesquisa web, comparação de fontes, análises e relatórios para decisão.",
    ),
  },
  {
    id: "operations",
    title: value("Operations & Finance", "Operações e Financeiro"),
    description: value(
      "Documents, spreadsheets, invoices, expenses and recurring routines.",
      "Documentos, planilhas, faturas, despesas e rotinas recorrentes.",
    ),
  },
  {
    id: "hr",
    title: value("HR & Recruiting", "RH e Recrutamento"),
    description: value(
      "Candidate research, screening, interviews and onboarding.",
      "Pesquisa de candidatos, triagem, entrevistas e onboarding.",
    ),
  },
  {
    id: "support",
    title: value("Customer Support", "Atendimento ao Cliente"),
    description: value(
      "Ticket triage, contextual replies, feedback and knowledge bases.",
      "Triagem, respostas com contexto, feedback e bases de conhecimento.",
    ),
  },
  {
    id: "technology",
    title: value("Technology & Product", "Tecnologia e Produto"),
    description: value(
      "Issues, technical research, documentation, product work and websites.",
      "Issues, pesquisa técnica, documentação, produto e criação de sites.",
    ),
  },
];

export const WORKFLOW_TASKS: WorkflowTask[] = [
  {
    id: "meeting-brief",
    categoryId: "management",
    title: value("Prepare a meeting briefing", "Preparar briefing para reunião"),
    description: value(
      "Collect context from public sources, files, email and past notes before a meeting.",
      "Reunir contexto de fontes públicas, arquivos, e-mails e notas anteriores antes de uma reunião.",
    ),
    unit: value("meetings", "reuniões"),
    defaultVolume: 12,
    defaultManualMin: 45,
    reductionRange: [60, 80],
    fit: 91,
    steps: [
      value(
        "Review the meeting objective and participants",
        "Revisar o objetivo e os participantes da reunião",
      ),
      value(
        "Research relevant context and previous interactions",
        "Pesquisar contexto relevante e interações anteriores",
      ),
      value(
        "Organize risks, opportunities and suggested questions",
        "Organizar riscos, oportunidades e perguntas sugeridas",
      ),
    ],
    outputs: [
      value("One-page meeting brief", "Briefing de uma página"),
      value("Suggested questions and next steps", "Perguntas sugeridas e próximos passos"),
    ],
  },
  {
    id: "meeting-summary",
    categoryId: "management",
    title: value("Summarize meetings and actions", "Resumir reuniões e ações"),
    description: value(
      "Turn transcripts or notes into decisions, owners, deadlines and follow-ups.",
      "Transformar transcrições ou notas em decisões, responsáveis, prazos e follow-ups.",
    ),
    unit: value("meetings", "reuniões"),
    defaultVolume: 20,
    defaultManualMin: 30,
    reductionRange: [70, 88],
    fit: 94,
    steps: [
      value("Read the transcript or meeting notes", "Ler a transcrição ou as notas da reunião"),
      value(
        "Separate decisions, open questions and action items",
        "Separar decisões, dúvidas abertas e ações",
      ),
      value(
        "Assign owners and dates when they are available",
        "Identificar responsáveis e datas quando disponíveis",
      ),
    ],
    outputs: [
      value("Executive summary", "Resumo executivo"),
      value("Action plan table", "Tabela de plano de ação"),
    ],
  },
  {
    id: "calendar-optimization",
    categoryId: "management",
    title: value("Organize and protect the calendar", "Organizar e proteger a agenda"),
    description: value(
      "Find conflicts, protect focus time and propose a better weekly schedule.",
      "Encontrar conflitos, proteger períodos de foco e propor uma agenda semanal melhor.",
    ),
    unit: value("calendar reviews", "revisões de agenda"),
    defaultVolume: 4,
    defaultManualMin: 60,
    reductionRange: [50, 75],
    fit: 83,
    steps: [
      value(
        "Review events, priorities and constraints",
        "Revisar eventos, prioridades e restrições",
      ),
      value(
        "Detect conflicts and fragmented focus periods",
        "Detectar conflitos e períodos de foco fragmentados",
      ),
      value(
        "Propose changes before editing the calendar",
        "Propor mudanças antes de editar a agenda",
      ),
    ],
    outputs: [
      value("Optimized weekly plan", "Plano semanal otimizado"),
      value("Approval list for calendar changes", "Lista para aprovação das mudanças na agenda"),
    ],
  },
  {
    id: "executive-report",
    categoryId: "management",
    title: value("Create an executive report", "Criar relatório executivo"),
    description: value(
      "Combine business information into a concise report with findings and decisions.",
      "Consolidar informações do negócio em um relatório com conclusões e decisões.",
    ),
    unit: value("reports", "relatórios"),
    defaultVolume: 4,
    defaultManualMin: 180,
    reductionRange: [65, 82],
    fit: 90,
    steps: [
      value(
        "Collect the approved files and data sources",
        "Coletar os arquivos e as fontes de dados aprovadas",
      ),
      value(
        "Identify trends, exceptions and decisions",
        "Identificar tendências, exceções e decisões",
      ),
      value(
        "Build a concise narrative with supporting evidence",
        "Criar uma narrativa concisa com evidências",
      ),
    ],
    outputs: [
      value("Executive report", "Relatório executivo"),
      value("Decision and recommendation summary", "Resumo de decisões e recomendações"),
    ],
  },
  {
    id: "inbox-prioritization",
    categoryId: "management",
    title: value("Prioritize inbox and draft replies", "Priorizar e-mails e preparar respostas"),
    description: value(
      "Classify incoming email, surface priorities and prepare drafts for approval.",
      "Classificar e-mails, destacar prioridades e preparar rascunhos para aprovação.",
    ),
    unit: value("email batches", "lotes de e-mails"),
    defaultVolume: 22,
    defaultManualMin: 45,
    reductionRange: [60, 82],
    fit: 88,
    steps: [
      value(
        "Classify messages by urgency and topic",
        "Classificar mensagens por urgência e assunto",
      ),
      value(
        "Extract requests, dates and pending decisions",
        "Extrair solicitações, datas e decisões pendentes",
      ),
      value("Draft replies without sending them", "Preparar respostas sem enviá-las"),
    ],
    outputs: [
      value("Prioritized inbox digest", "Resumo priorizado da caixa de entrada"),
      value("Reply drafts for approval", "Rascunhos de resposta para aprovação"),
    ],
  },
  {
    id: "lead-research",
    categoryId: "sales",
    title: value("Research potential customers", "Pesquisar potenciais clientes"),
    description: value(
      "Find companies that match an ideal customer profile and document the evidence.",
      "Encontrar empresas aderentes ao perfil ideal e documentar as evidências.",
    ),
    unit: value("companies", "empresas"),
    defaultVolume: 50,
    defaultManualMin: 18,
    reductionRange: [60, 80],
    fit: 93,
    steps: [
      value("Search approved public sources", "Pesquisar fontes públicas aprovadas"),
      value(
        "Validate company, sector, location and relevant signals",
        "Validar empresa, setor, localização e sinais relevantes",
      ),
      value(
        "Rank each company against the ideal customer profile",
        "Classificar cada empresa conforme o perfil de cliente ideal",
      ),
    ],
    outputs: [
      value("Qualified prospect spreadsheet", "Planilha de potenciais clientes qualificados"),
      value("Executive shortlist", "Lista executiva das melhores oportunidades"),
    ],
  },
  {
    id: "lead-qualification",
    categoryId: "sales",
    title: value("Qualify and prioritize leads", "Qualificar e priorizar leads"),
    description: value(
      "Apply consistent criteria to an existing list and identify the best opportunities.",
      "Aplicar critérios consistentes a uma lista existente e identificar as melhores oportunidades.",
    ),
    unit: value("leads", "leads"),
    defaultVolume: 100,
    defaultManualMin: 12,
    reductionRange: [65, 85],
    fit: 94,
    steps: [
      value(
        "Read the existing lead list and qualification criteria",
        "Ler a lista de leads e os critérios de qualificação",
      ),
      value(
        "Verify relevant public and internal information",
        "Verificar informações públicas e internas relevantes",
      ),
      value(
        "Score and explain the priority of each lead",
        "Pontuar e explicar a prioridade de cada lead",
      ),
    ],
    outputs: [
      value("Scored lead list", "Lista de leads pontuada"),
      value("Qualification rationale", "Justificativa da qualificação"),
    ],
  },
  {
    id: "crm-enrichment",
    categoryId: "sales",
    title: value("Enrich and clean CRM data", "Enriquecer e organizar dados do CRM"),
    description: value(
      "Complete missing fields, flag duplicates and prepare approved CRM updates.",
      "Completar campos, sinalizar duplicidades e preparar atualizações do CRM.",
    ),
    unit: value("contact batches", "lotes de contatos"),
    defaultVolume: 4,
    defaultManualMin: 180,
    reductionRange: [65, 85],
    fit: 92,
    steps: [
      value(
        "Audit missing, outdated and duplicated fields",
        "Auditar campos ausentes, desatualizados e duplicados",
      ),
      value("Research and validate enrichment data", "Pesquisar e validar dados de enriquecimento"),
      value(
        "Prepare a change set before writing to the CRM",
        "Preparar um conjunto de alterações antes de gravar no CRM",
      ),
    ],
    outputs: [
      value("Enriched contact file", "Arquivo de contatos enriquecido"),
      value("CRM change report", "Relatório de alterações do CRM"),
    ],
  },
  {
    id: "sales-meeting-prep",
    categoryId: "sales",
    title: value("Prepare a sales meeting", "Preparar reunião comercial"),
    description: value(
      "Combine account, contact and market context into a focused sales brief.",
      "Combinar contexto da conta, do contato e do mercado em um briefing comercial.",
    ),
    unit: value("meetings", "reuniões"),
    defaultVolume: 16,
    defaultManualMin: 40,
    reductionRange: [60, 80],
    fit: 90,
    steps: [
      value("Review account and contact history", "Revisar histórico da conta e do contato"),
      value("Research recent company signals", "Pesquisar sinais recentes da empresa"),
      value(
        "Suggest discovery questions and a meeting angle",
        "Sugerir perguntas de descoberta e abordagem da reunião",
      ),
    ],
    outputs: [
      value("Sales call one-pager", "Briefing comercial de uma página"),
      value("Questions and opportunity hypotheses", "Perguntas e hipóteses de oportunidade"),
    ],
  },
  {
    id: "follow-up-proposal",
    categoryId: "sales",
    title: value("Create proposals and follow-ups", "Criar propostas e follow-ups"),
    description: value(
      "Use meeting and CRM context to prepare a proposal or personalized follow-up.",
      "Usar o contexto da reunião e do CRM para preparar proposta ou follow-up personalizado.",
    ),
    unit: value("documents", "documentos"),
    defaultVolume: 20,
    defaultManualMin: 60,
    reductionRange: [60, 82],
    fit: 91,
    steps: [
      value(
        "Review the opportunity context and approved offer",
        "Revisar o contexto da oportunidade e a oferta aprovada",
      ),
      value(
        "Draft a personalized proposal or follow-up",
        "Redigir proposta ou follow-up personalizado",
      ),
      value("Check claims, dates and next steps", "Conferir afirmações, datas e próximos passos"),
    ],
    outputs: [
      value("Proposal or message draft", "Rascunho de proposta ou mensagem"),
      value("Approval checklist", "Checklist para aprovação"),
    ],
  },
  {
    id: "competitor-analysis",
    categoryId: "marketing",
    title: value("Analyze competitors", "Analisar concorrentes"),
    description: value(
      "Compare positioning, offers, channels, strengths, weaknesses and opportunities.",
      "Comparar posicionamento, ofertas, canais, forças, fraquezas e oportunidades.",
    ),
    unit: value("analyses", "análises"),
    defaultVolume: 4,
    defaultManualMin: 360,
    reductionRange: [65, 82],
    fit: 94,
    steps: [
      value(
        "Identify and validate the relevant competitors",
        "Identificar e validar os concorrentes relevantes",
      ),
      value(
        "Compare positioning, products, prices and channels",
        "Comparar posicionamento, produtos, preços e canais",
      ),
      value(
        "Highlight gaps and actionable opportunities",
        "Destacar lacunas e oportunidades acionáveis",
      ),
    ],
    outputs: [
      value("Comparison spreadsheet", "Planilha comparativa"),
      value("Executive PDF-ready report", "Relatório executivo pronto para PDF"),
    ],
  },
  {
    id: "seo-audit",
    categoryId: "marketing",
    title: value("Run an SEO opportunity audit", "Realizar auditoria de oportunidades de SEO"),
    description: value(
      "Review a website, competitors and keyword clusters to identify priorities.",
      "Revisar site, concorrentes e grupos de palavras-chave para identificar prioridades.",
    ),
    unit: value("audits", "auditorias"),
    defaultVolume: 2,
    defaultManualMin: 480,
    reductionRange: [60, 78],
    fit: 89,
    steps: [
      value(
        "Inspect the approved website and search presence",
        "Inspecionar o site aprovado e sua presença nas buscas",
      ),
      value(
        "Compare keyword and content coverage",
        "Comparar cobertura de palavras-chave e conteúdo",
      ),
      value(
        "Prioritize technical and content opportunities",
        "Priorizar oportunidades técnicas e de conteúdo",
      ),
    ],
    outputs: [
      value("SEO audit report", "Relatório de auditoria SEO"),
      value("Prioritized content backlog", "Backlog priorizado de conteúdo"),
    ],
  },
  {
    id: "content-calendar",
    categoryId: "marketing",
    title: value("Build a content calendar", "Criar calendário de conteúdo"),
    description: value(
      "Turn goals, audience and research into a structured publishing plan.",
      "Transformar objetivos, público e pesquisa em um plano estruturado de publicação.",
    ),
    unit: value("content plans", "planos de conteúdo"),
    defaultVolume: 4,
    defaultManualMin: 180,
    reductionRange: [60, 80],
    fit: 88,
    steps: [
      value(
        "Review goals, audience and brand constraints",
        "Revisar objetivos, público e regras da marca",
      ),
      value(
        "Research themes, questions and relevant moments",
        "Pesquisar temas, dúvidas e momentos relevantes",
      ),
      value(
        "Distribute formats and channels across the period",
        "Distribuir formatos e canais ao longo do período",
      ),
    ],
    outputs: [
      value("Editorial calendar", "Calendário editorial"),
      value("Brief for each content item", "Briefing de cada conteúdo"),
    ],
  },
  {
    id: "campaign-report",
    categoryId: "marketing",
    title: value("Analyze campaign performance", "Analisar desempenho de campanhas"),
    description: value(
      "Combine campaign data, explain performance and recommend the next actions.",
      "Consolidar dados de campanhas, explicar o desempenho e recomendar ações.",
    ),
    unit: value("reports", "relatórios"),
    defaultVolume: 8,
    defaultManualMin: 120,
    reductionRange: [65, 85],
    fit: 91,
    steps: [
      value(
        "Collect data from the approved campaign sources",
        "Coletar dados das fontes de campanha aprovadas",
      ),
      value(
        "Compare results against goals and previous periods",
        "Comparar resultados com metas e períodos anteriores",
      ),
      value("Explain anomalies and recommend actions", "Explicar anomalias e recomendar ações"),
    ],
    outputs: [
      value("Campaign performance report", "Relatório de desempenho"),
      value("Optimization recommendations", "Recomendações de otimização"),
    ],
  },
  {
    id: "content-repurposing",
    categoryId: "marketing",
    title: value("Repurpose long-form content", "Reaproveitar conteúdo longo"),
    description: value(
      "Transform a video, article or event into channel-specific assets and drafts.",
      "Transformar vídeo, artigo ou evento em materiais adaptados para cada canal.",
    ),
    unit: value("source materials", "conteúdos-base"),
    defaultVolume: 8,
    defaultManualMin: 150,
    reductionRange: [65, 85],
    fit: 90,
    steps: [
      value("Extract the strongest ideas and evidence", "Extrair as melhores ideias e evidências"),
      value(
        "Adapt the message to each approved channel",
        "Adaptar a mensagem a cada canal aprovado",
      ),
      value(
        "Create drafts while preserving brand voice",
        "Criar rascunhos preservando a voz da marca",
      ),
    ],
    outputs: [
      value("Multi-channel content pack", "Pacote de conteúdo multicanal"),
      value("Publishing checklist", "Checklist de publicação"),
    ],
  },
  {
    id: "market-research",
    categoryId: "research",
    title: value("Research a market", "Pesquisar um mercado"),
    description: value(
      "Investigate market size, trends, players, customer signals and open questions.",
      "Investigar tamanho, tendências, players, sinais de clientes e questões abertas.",
    ),
    unit: value("research projects", "pesquisas"),
    defaultVolume: 2,
    defaultManualMin: 600,
    reductionRange: [60, 78],
    fit: 93,
    steps: [
      value(
        "Define scope, geography and decision criteria",
        "Definir escopo, geografia e critérios de decisão",
      ),
      value("Search and cross-reference credible sources", "Pesquisar e cruzar fontes confiáveis"),
      value(
        "Separate evidence, inference and unanswered questions",
        "Separar evidências, inferências e questões sem resposta",
      ),
    ],
    outputs: [
      value("Research spreadsheet", "Planilha de pesquisa"),
      value("Executive market report", "Relatório executivo de mercado"),
    ],
  },
  {
    id: "source-comparison",
    categoryId: "research",
    title: value("Compare sources or scientific papers", "Comparar fontes ou artigos científicos"),
    description: value(
      "Cross-reference publications and produce a traceable synthesis.",
      "Cruzar publicações e produzir uma síntese rastreável.",
    ),
    unit: value("reviews", "revisões"),
    defaultVolume: 4,
    defaultManualMin: 300,
    reductionRange: [55, 75],
    fit: 87,
    steps: [
      value("Define inclusion and exclusion criteria", "Definir critérios de inclusão e exclusão"),
      value(
        "Extract claims, methods, dates and limitations",
        "Extrair afirmações, métodos, datas e limitações",
      ),
      value("Cross-reference agreements and conflicts", "Cruzar concordâncias e conflitos"),
    ],
    outputs: [
      value("Evidence comparison table", "Tabela comparativa de evidências"),
      value("Cited synthesis report", "Relatório-síntese com fontes"),
    ],
  },
  {
    id: "spreadsheet-analysis",
    categoryId: "research",
    title: value("Analyze a spreadsheet or dataset", "Analisar planilha ou conjunto de dados"),
    description: value(
      "Clean, explore and explain data with tables, charts and findings.",
      "Limpar, explorar e explicar dados com tabelas, gráficos e conclusões.",
    ),
    unit: value("datasets", "bases de dados"),
    defaultVolume: 6,
    defaultManualMin: 180,
    reductionRange: [60, 82],
    fit: 91,
    steps: [
      value(
        "Inspect structure, quality and missing values",
        "Inspecionar estrutura, qualidade e valores ausentes",
      ),
      value(
        "Run the approved calculations and comparisons",
        "Executar os cálculos e comparações aprovados",
      ),
      value(
        "Explain findings and possible limitations",
        "Explicar conclusões e possíveis limitações",
      ),
    ],
    outputs: [
      value("Cleaned spreadsheet", "Planilha organizada"),
      value("Charts and analysis report", "Gráficos e relatório de análise"),
    ],
  },
  {
    id: "document-synthesis",
    categoryId: "research",
    title: value("Synthesize multiple documents", "Sintetizar vários documentos"),
    description: value(
      "Read PDFs, documents and notes and turn them into a structured deliverable.",
      "Ler PDFs, documentos e notas e transformá-los em um entregável estruturado.",
    ),
    unit: value("document sets", "conjuntos de documentos"),
    defaultVolume: 10,
    defaultManualMin: 120,
    reductionRange: [65, 85],
    fit: 94,
    steps: [
      value(
        "Read and classify the approved documents",
        "Ler e classificar os documentos aprovados",
      ),
      value(
        "Extract facts, decisions, risks and contradictions",
        "Extrair fatos, decisões, riscos e contradições",
      ),
      value("Build a traceable synthesis", "Criar uma síntese rastreável"),
    ],
    outputs: [
      value("Structured summary", "Resumo estruturado"),
      value("Source and evidence index", "Índice de fontes e evidências"),
    ],
  },
  {
    id: "monitoring-report",
    categoryId: "research",
    title: value("Monitor a topic or market", "Monitorar um tema ou mercado"),
    description: value(
      "Track changes across public sources and publish a recurring digest.",
      "Acompanhar mudanças em fontes públicas e publicar um resumo recorrente.",
    ),
    unit: value("monitoring cycles", "ciclos de monitoramento"),
    defaultVolume: 4,
    defaultManualMin: 240,
    reductionRange: [65, 85],
    fit: 92,
    steps: [
      value("Check the approved source list", "Verificar a lista de fontes aprovadas"),
      value(
        "Identify relevant changes and remove duplicates",
        "Identificar mudanças relevantes e remover duplicidades",
      ),
      value("Explain why each change matters", "Explicar por que cada mudança importa"),
    ],
    outputs: [
      value("Recurring monitoring digest", "Resumo recorrente de monitoramento"),
      value("Change log with source links", "Registro de mudanças com links das fontes"),
    ],
  },
  {
    id: "document-processing",
    categoryId: "operations",
    title: value("Process and classify documents", "Processar e classificar documentos"),
    description: value(
      "Extract fields from files, validate them and organize structured records.",
      "Extrair campos de arquivos, validá-los e organizar registros estruturados.",
    ),
    unit: value("documents", "documentos"),
    defaultVolume: 100,
    defaultManualMin: 15,
    reductionRange: [70, 88],
    fit: 95,
    steps: [
      value("Classify each approved file", "Classificar cada arquivo aprovado"),
      value(
        "Extract the required fields and evidence",
        "Extrair os campos necessários e as evidências",
      ),
      value(
        "Flag missing or conflicting information",
        "Sinalizar informações ausentes ou conflitantes",
      ),
    ],
    outputs: [
      value("Structured data file", "Arquivo de dados estruturados"),
      value("Exception report", "Relatório de exceções"),
    ],
  },
  {
    id: "spreadsheet-consolidation",
    categoryId: "operations",
    title: value("Consolidate spreadsheets", "Consolidar planilhas"),
    description: value(
      "Combine multiple spreadsheets, normalize fields and produce one reliable view.",
      "Combinar várias planilhas, normalizar campos e produzir uma visão confiável.",
    ),
    unit: value("consolidations", "consolidações"),
    defaultVolume: 8,
    defaultManualMin: 180,
    reductionRange: [65, 85],
    fit: 94,
    steps: [
      value(
        "Inspect columns, formats and duplicate records",
        "Inspecionar colunas, formatos e registros duplicados",
      ),
      value("Normalize and merge the approved files", "Normalizar e unir os arquivos aprovados"),
      value("Validate totals and document exceptions", "Validar totais e documentar exceções"),
    ],
    outputs: [
      value("Consolidated spreadsheet", "Planilha consolidada"),
      value("Validation and exception log", "Registro de validação e exceções"),
    ],
  },
  {
    id: "invoice-processing",
    categoryId: "operations",
    title: value("Process invoices and receipts", "Processar faturas e comprovantes"),
    description: value(
      "Extract, reconcile and prepare financial documents for review.",
      "Extrair, conciliar e preparar documentos financeiros para revisão.",
    ),
    unit: value("documents", "documentos"),
    defaultVolume: 60,
    defaultManualMin: 12,
    reductionRange: [65, 85],
    fit: 92,
    steps: [
      value(
        "Extract supplier, date, amount and category",
        "Extrair fornecedor, data, valor e categoria",
      ),
      value(
        "Compare documents against approved records",
        "Comparar documentos com os registros aprovados",
      ),
      value("Flag duplicates and discrepancies", "Sinalizar duplicidades e divergências"),
    ],
    outputs: [
      value("Financial document register", "Registro de documentos financeiros"),
      value("Discrepancy report", "Relatório de divergências"),
    ],
  },
  {
    id: "expense-reconciliation",
    categoryId: "operations",
    title: value("Reconcile expenses and transactions", "Conciliar despesas e transações"),
    description: value(
      "Match records across files or systems and explain variances.",
      "Cruzar registros entre arquivos ou sistemas e explicar divergências.",
    ),
    unit: value("reconciliations", "conciliações"),
    defaultVolume: 4,
    defaultManualMin: 240,
    reductionRange: [60, 80],
    fit: 90,
    steps: [
      value("Load the approved transaction sources", "Carregar as fontes de transações aprovadas"),
      value(
        "Match records using the agreed rules",
        "Cruzar registros conforme as regras definidas",
      ),
      value(
        "Separate confirmed matches from exceptions",
        "Separar correspondências confirmadas de exceções",
      ),
    ],
    outputs: [
      value("Reconciliation worksheet", "Planilha de conciliação"),
      value("Variance report", "Relatório de divergências"),
    ],
  },
  {
    id: "supplier-comparison",
    categoryId: "operations",
    title: value("Compare suppliers and proposals", "Comparar fornecedores e propostas"),
    description: value(
      "Normalize proposals and compare price, scope, risk and conditions.",
      "Normalizar propostas e comparar preço, escopo, risco e condições.",
    ),
    unit: value("comparisons", "comparações"),
    defaultVolume: 6,
    defaultManualMin: 150,
    reductionRange: [60, 80],
    fit: 88,
    steps: [
      value(
        "Extract comparable terms from each proposal",
        "Extrair termos comparáveis de cada proposta",
      ),
      value(
        "Score price, scope, conditions and risks",
        "Pontuar preço, escopo, condições e riscos",
      ),
      value(
        "Document assumptions and missing information",
        "Documentar premissas e informações ausentes",
      ),
    ],
    outputs: [
      value("Supplier comparison matrix", "Matriz comparativa de fornecedores"),
      value("Decision brief", "Briefing para decisão"),
    ],
  },
  {
    id: "candidate-research",
    categoryId: "hr",
    title: value("Research potential candidates", "Pesquisar potenciais candidatos"),
    description: value(
      "Find public profiles that match approved role and location criteria.",
      "Encontrar perfis públicos aderentes aos critérios de vaga e localização.",
    ),
    unit: value("candidate profiles", "perfis de candidatos"),
    defaultVolume: 30,
    defaultManualMin: 20,
    reductionRange: [55, 75],
    fit: 86,
    steps: [
      value(
        "Translate the role into objective search criteria",
        "Transformar a vaga em critérios objetivos de pesquisa",
      ),
      value(
        "Research approved public professional sources",
        "Pesquisar fontes profissionais públicas aprovadas",
      ),
      value(
        "Document evidence and avoid sensitive inferences",
        "Documentar evidências e evitar inferências sensíveis",
      ),
    ],
    outputs: [
      value("Candidate research list", "Lista de candidatos pesquisados"),
      value("Evidence-based fit notes", "Notas de aderência baseadas em evidências"),
    ],
  },
  {
    id: "resume-screening",
    categoryId: "hr",
    title: value("Screen resumes consistently", "Triar currículos com consistência"),
    description: value(
      "Compare resumes against job requirements and flag questions for human review.",
      "Comparar currículos com os requisitos e sinalizar dúvidas para revisão humana.",
    ),
    unit: value("resumes", "currículos"),
    defaultVolume: 80,
    defaultManualMin: 12,
    reductionRange: [60, 80],
    fit: 88,
    steps: [
      value(
        "Apply only the approved job criteria",
        "Aplicar somente os critérios aprovados da vaga",
      ),
      value(
        "Extract relevant experience and evidence",
        "Extrair experiências e evidências relevantes",
      ),
      value("Flag uncertainties for human decision", "Sinalizar incertezas para decisão humana"),
    ],
    outputs: [
      value("Structured screening table", "Tabela estruturada de triagem"),
      value("Human review queue", "Fila para revisão humana"),
    ],
  },
  {
    id: "interview-coordination",
    categoryId: "hr",
    title: value("Coordinate interviews", "Coordenar entrevistas"),
    description: value(
      "Find compatible times, prepare messages and organize the interview plan.",
      "Encontrar horários compatíveis, preparar mensagens e organizar entrevistas.",
    ),
    unit: value("interviews", "entrevistas"),
    defaultVolume: 20,
    defaultManualMin: 25,
    reductionRange: [55, 78],
    fit: 85,
    steps: [
      value(
        "Check approved availability and constraints",
        "Verificar disponibilidades e restrições aprovadas",
      ),
      value("Propose compatible interview slots", "Propor horários compatíveis"),
      value("Prepare invitations before sending", "Preparar convites antes do envio"),
    ],
    outputs: [
      value("Interview schedule", "Agenda de entrevistas"),
      value("Invitation drafts", "Rascunhos de convites"),
    ],
  },
  {
    id: "employee-onboarding",
    categoryId: "hr",
    title: value("Run employee onboarding", "Executar onboarding de colaborador"),
    description: value(
      "Coordinate documents, access, tasks and communication for a new hire.",
      "Coordenar documentos, acessos, tarefas e comunicação de uma nova contratação.",
    ),
    unit: value("onboardings", "onboardings"),
    defaultVolume: 5,
    defaultManualMin: 240,
    reductionRange: [55, 75],
    fit: 87,
    steps: [
      value("Read the approved onboarding checklist", "Ler o checklist de onboarding aprovado"),
      value(
        "Prepare access, document and communication tasks",
        "Preparar tarefas de acesso, documentos e comunicação",
      ),
      value("Track approvals and incomplete items", "Acompanhar aprovações e itens incompletos"),
    ],
    outputs: [
      value("Onboarding tracker", "Acompanhamento do onboarding"),
      value("Pending approval list", "Lista de aprovações pendentes"),
    ],
  },
  {
    id: "recruiting-report",
    categoryId: "hr",
    title: value("Create a recruiting report", "Criar relatório de recrutamento"),
    description: value(
      "Consolidate pipeline, stage time and bottlenecks into a decision-ready report.",
      "Consolidar pipeline, tempo por etapa e gargalos em um relatório para decisão.",
    ),
    unit: value("reports", "relatórios"),
    defaultVolume: 4,
    defaultManualMin: 120,
    reductionRange: [60, 82],
    fit: 89,
    steps: [
      value(
        "Collect approved recruiting pipeline data",
        "Coletar os dados aprovados do pipeline de recrutamento",
      ),
      value(
        "Calculate stage volume, time and conversion",
        "Calcular volume, tempo e conversão por etapa",
      ),
      value(
        "Highlight bottlenecks and recommended actions",
        "Destacar gargalos e ações recomendadas",
      ),
    ],
    outputs: [
      value("Recruiting dashboard or sheet", "Dashboard ou planilha de recrutamento"),
      value("Hiring pipeline summary", "Resumo do pipeline de contratação"),
    ],
  },
  {
    id: "ticket-triage",
    categoryId: "support",
    title: value("Triage support tickets", "Fazer triagem de chamados"),
    description: value(
      "Classify, prioritize and route tickets with relevant customer context.",
      "Classificar, priorizar e encaminhar chamados com contexto do cliente.",
    ),
    unit: value("tickets", "chamados"),
    defaultVolume: 200,
    defaultManualMin: 8,
    reductionRange: [65, 85],
    fit: 94,
    steps: [
      value("Classify topic, urgency and sentiment", "Classificar assunto, urgência e sentimento"),
      value("Retrieve the approved account context", "Buscar o contexto aprovado da conta"),
      value(
        "Route or escalate using support rules",
        "Encaminhar ou escalar conforme as regras de suporte",
      ),
    ],
    outputs: [
      value("Prioritized support queue", "Fila de suporte priorizada"),
      value("Escalation summary", "Resumo de escalonamento"),
    ],
  },
  {
    id: "support-replies",
    categoryId: "support",
    title: value("Draft contextual support replies", "Preparar respostas de atendimento"),
    description: value(
      "Use ticket, account and policy context to prepare replies for approval.",
      "Usar contexto do chamado, da conta e das políticas para preparar respostas.",
    ),
    unit: value("replies", "respostas"),
    defaultVolume: 150,
    defaultManualMin: 10,
    reductionRange: [60, 82],
    fit: 92,
    steps: [
      value("Read the request and customer history", "Ler a solicitação e o histórico do cliente"),
      value(
        "Check the approved policy or knowledge base",
        "Consultar a política ou base de conhecimento aprovada",
      ),
      value("Draft a clear reply without sending it", "Preparar uma resposta clara sem enviá-la"),
    ],
    outputs: [
      value("Contextual reply draft", "Rascunho de resposta com contexto"),
      value("Missing information checklist", "Checklist de informações ausentes"),
    ],
  },
  {
    id: "feedback-analysis",
    categoryId: "support",
    title: value("Analyze customer feedback", "Analisar feedback de clientes"),
    description: value(
      "Group feedback, quantify themes and identify product or service priorities.",
      "Agrupar feedbacks, quantificar temas e identificar prioridades de produto ou serviço.",
    ),
    unit: value("feedback batches", "lotes de feedback"),
    defaultVolume: 4,
    defaultManualMin: 240,
    reductionRange: [60, 80],
    fit: 90,
    steps: [
      value(
        "Normalize and group the approved feedback",
        "Normalizar e agrupar os feedbacks aprovados",
      ),
      value("Quantify recurring themes and severity", "Quantificar temas recorrentes e severidade"),
      value(
        "Link evidence to recommended priorities",
        "Relacionar evidências às prioridades recomendadas",
      ),
    ],
    outputs: [
      value("Feedback theme report", "Relatório de temas de feedback"),
      value("Prioritized improvement list", "Lista priorizada de melhorias"),
    ],
  },
  {
    id: "knowledge-base",
    categoryId: "support",
    title: value("Build or update a knowledge base", "Criar ou atualizar base de conhecimento"),
    description: value(
      "Turn support history and approved documents into reusable articles.",
      "Transformar histórico de atendimento e documentos em artigos reutilizáveis.",
    ),
    unit: value("article batches", "lotes de artigos"),
    defaultVolume: 8,
    defaultManualMin: 120,
    reductionRange: [60, 80],
    fit: 89,
    steps: [
      value(
        "Identify repeated questions and approved answers",
        "Identificar perguntas repetidas e respostas aprovadas",
      ),
      value("Consolidate accurate steps and policies", "Consolidar etapas e políticas corretas"),
      value(
        "Draft searchable articles with ownership and review dates",
        "Criar artigos pesquisáveis com responsável e data de revisão",
      ),
    ],
    outputs: [
      value("Knowledge base article drafts", "Rascunhos de artigos da base"),
      value("Coverage gap report", "Relatório de lacunas de cobertura"),
    ],
  },
  {
    id: "customer-health",
    categoryId: "support",
    title: value("Create a customer health report", "Criar relatório de saúde de clientes"),
    description: value(
      "Combine support, usage and commercial signals to flag accounts needing attention.",
      "Combinar sinais de suporte, uso e vendas para sinalizar contas que precisam de atenção.",
    ),
    unit: value("reports", "relatórios"),
    defaultVolume: 4,
    defaultManualMin: 180,
    reductionRange: [60, 80],
    fit: 88,
    steps: [
      value(
        "Collect approved account health signals",
        "Coletar sinais aprovados de saúde da conta",
      ),
      value(
        "Apply transparent risk and opportunity rules",
        "Aplicar regras transparentes de risco e oportunidade",
      ),
      value(
        "Explain why each account needs attention",
        "Explicar por que cada conta precisa de atenção",
      ),
    ],
    outputs: [
      value("Customer health table", "Tabela de saúde de clientes"),
      value("Priority account brief", "Briefing de contas prioritárias"),
    ],
  },
  {
    id: "github-triage",
    categoryId: "technology",
    title: value("Triage issues and pull requests", "Fazer triagem de issues e pull requests"),
    description: value(
      "Group, prioritize and summarize engineering work using repository context.",
      "Agrupar, priorizar e resumir trabalho técnico usando o contexto do repositório.",
    ),
    unit: value("items", "itens"),
    defaultVolume: 60,
    defaultManualMin: 10,
    reductionRange: [55, 78],
    fit: 87,
    steps: [
      value(
        "Read issues, pull requests and project rules",
        "Ler issues, pull requests e regras do projeto",
      ),
      value(
        "Detect duplicates, blockers and missing context",
        "Detectar duplicidades, bloqueios e contexto ausente",
      ),
      value(
        "Suggest priority and ownership for review",
        "Sugerir prioridade e responsável para revisão",
      ),
    ],
    outputs: [
      value("Prioritized engineering queue", "Fila técnica priorizada"),
      value("Daily or weekly engineering brief", "Briefing técnico diário ou semanal"),
    ],
  },
  {
    id: "incident-research",
    categoryId: "technology",
    title: value("Investigate a technical incident", "Investigar incidente técnico"),
    description: value(
      "Correlate logs, changes and reports to prepare an evidence-based incident brief.",
      "Correlacionar logs, mudanças e relatos para preparar um briefing com evidências.",
    ),
    unit: value("incidents", "incidentes"),
    defaultVolume: 6,
    defaultManualMin: 180,
    reductionRange: [40, 65],
    fit: 78,
    steps: [
      value(
        "Collect approved logs, alerts and recent changes",
        "Coletar logs, alertas e mudanças recentes aprovadas",
      ),
      value(
        "Build a timeline and test competing hypotheses",
        "Criar uma linha do tempo e testar hipóteses",
      ),
      value(
        "Separate confirmed evidence from inference",
        "Separar evidências confirmadas de inferências",
      ),
    ],
    outputs: [
      value("Incident investigation brief", "Briefing de investigação do incidente"),
      value("Hypotheses and next checks", "Hipóteses e próximas verificações"),
    ],
  },
  {
    id: "technical-documentation",
    categoryId: "technology",
    title: value("Create technical documentation", "Criar documentação técnica"),
    description: value(
      "Turn code, architecture and existing notes into maintainable documentation.",
      "Transformar código, arquitetura e notas existentes em documentação sustentável.",
    ),
    unit: value("documents", "documentos"),
    defaultVolume: 8,
    defaultManualMin: 180,
    reductionRange: [55, 75],
    fit: 86,
    steps: [
      value(
        "Inspect the approved code and existing documentation",
        "Inspecionar o código e a documentação aprovados",
      ),
      value(
        "Map setup, architecture and operational procedures",
        "Mapear configuração, arquitetura e procedimentos",
      ),
      value(
        "Flag assumptions that require an expert review",
        "Sinalizar premissas que exigem revisão especializada",
      ),
    ],
    outputs: [
      value("Technical documentation", "Documentação técnica"),
      value("Maintenance and validation checklist", "Checklist de manutenção e validação"),
    ],
  },
  {
    id: "product-research",
    categoryId: "technology",
    title: value("Research a product opportunity", "Pesquisar oportunidade de produto"),
    description: value(
      "Combine user evidence, competitors and technical constraints into a product brief.",
      "Combinar evidências de usuários, concorrentes e restrições técnicas em um briefing.",
    ),
    unit: value("research cycles", "ciclos de pesquisa"),
    defaultVolume: 4,
    defaultManualMin: 300,
    reductionRange: [55, 75],
    fit: 86,
    steps: [
      value(
        "Review user evidence and the product question",
        "Revisar evidências dos usuários e a questão de produto",
      ),
      value(
        "Research alternatives, competitors and constraints",
        "Pesquisar alternativas, concorrentes e restrições",
      ),
      value(
        "Translate evidence into options and trade-offs",
        "Transformar evidências em opções e trade-offs",
      ),
    ],
    outputs: [
      value("Product opportunity brief", "Briefing de oportunidade de produto"),
      value("Options and trade-off matrix", "Matriz de opções e trade-offs"),
    ],
  },
  {
    id: "website-build",
    categoryId: "technology",
    title: value("Build a professional website", "Criar um site profissional"),
    description: value(
      "Research, structure, write and build a reviewable website deliverable.",
      "Pesquisar, estruturar, escrever e construir um site pronto para revisão.",
    ),
    unit: value("websites or pages", "sites ou páginas"),
    defaultVolume: 2,
    defaultManualMin: 600,
    reductionRange: [40, 65],
    fit: 82,
    steps: [
      value(
        "Clarify audience, offer, pages and brand references",
        "Definir público, oferta, páginas e referências da marca",
      ),
      value(
        "Research, structure and write the approved content",
        "Pesquisar, estruturar e escrever o conteúdo aprovado",
      ),
      value(
        "Build files and validate the result before publishing",
        "Criar os arquivos e validar o resultado antes da publicação",
      ),
    ],
    outputs: [
      value("Website files or deployable project", "Arquivos do site ou projeto publicável"),
      value("Review and launch checklist", "Checklist de revisão e lançamento"),
    ],
  },
];

const LEGACY_CASE_CATEGORIES: Record<string, WorkflowCategoryId> = {
  "Public lead research": "sales",
  "Competitor analysis": "marketing",
  "YouTube channel report": "marketing",
  "Content calendar": "marketing",
  "Short scripts / Reels": "marketing",
  "Sales proposal": "sales",
  "Landing page / copy": "marketing",
  "Ad creative pack": "marketing",
  "Local market research": "research",
  "Tool benchmarking": "research",
  "Slide decks & presentations": "management",
  "Real-time dashboards": "research",
  "Custom AI agent builder": "technology",
  "No-code workflow automation": "technology",
  "CRM data enrichment (HubSpot/Salesforce)": "sales",
  "Google Sheets auto-reports": "operations",
  "Social media publishing (Buffer/Hootsuite)": "marketing",
  "E-commerce product sync (Shopify/WooCommerce)": "operations",
  "Email campaigns (Mailchimp/Klaviyo)": "marketing",
  "Google Analytics insights": "marketing",
  "Notion database management": "operations",
  "API integration setup (Zapier/Make)": "technology",
  "Quick lead response": "sales",
  "Sales follow-up": "sales",
  "Document processing": "operations",
  "Management reports": "management",
  "Meeting summaries": "management",
  "FAQ / Tier-1 support": "support",
  "Contracts and reviews": "operations",
  "Spreadsheet/CRM cleanup": "operations",
  "Smart scheduling": "management",
  "Client onboarding": "sales",
  "Internal knowledge base": "support",
  "Email automation sequences": "sales",
  "Slack / team notifications": "management",
  "Daily team sync (Slack → Notion)": "management",
  "Invoice processing (QuickBooks/Stripe)": "operations",
  "Support ticket triage (Zendesk/Intercom)": "support",
  "Contract clause extraction (Google Docs)": "operations",
  "HR onboarding (Gmail/Drive/Slack)": "hr",
  "Social brand monitoring": "marketing",
  "Calendar optimization (Google Calendar)": "management",
  "Expense report processing": "operations",
  "GitHub issue triage": "technology",
  "Database health check & report": "technology",
};

export function getWorkflowCategory(id: WorkflowCategoryId | null) {
  return WORKFLOW_CATEGORIES.find((category) => category.id === id);
}

export function getWorkflowTask(id: string | null) {
  return WORKFLOW_TASKS.find((task) => task.id === id);
}

export function getLegacyCaseCategory(flow: string): WorkflowCategoryId {
  return LEGACY_CASE_CATEGORIES[flow] ?? "research";
}

export function localize(valueToLocalize: LocalizedValue, locale: "en" | "pt") {
  return valueToLocalize[locale];
}

export function buildWorkflowPrompt(
  task: WorkflowTask,
  locale: "en" | "pt",
  context: { volume: number; segment?: string; teamSize: number },
) {
  const title = localize(task.title, locale);
  const description = localize(task.description, locale);
  const unit = localize(task.unit, locale);
  const steps = task.steps
    .map((step, index) => `${index + 1}. ${localize(step, locale)}`)
    .join("\n");
  const outputs = task.outputs.map((output) => `- ${localize(output, locale)}`).join("\n");

  if (locale === "pt") {
    return `Quero que a Lynx execute o workflow: ${title}.

Objetivo
${description}

Contexto
- Empresa/segmento: ${context.segment?.trim() || "[descreva sua empresa, setor ou contexto]"}
- Escopo inicial: ${context.volume} ${unit}
- Pessoas envolvidas no processo atual: ${context.teamSize}
- Fontes, arquivos ou aplicativos autorizados: [informe aqui]

Plano de trabalho
${steps}

Entregáveis
${outputs}

Critérios de qualidade e controle
- Use somente as fontes, arquivos e aplicativos autorizados.
- Inclua links ou referências das fontes quando houver pesquisa.
- Diferencie informações confirmadas, estimativas e itens que não puderam ser verificados.
- Antes de enviar mensagens, alterar registros, publicar conteúdo, agendar eventos ou executar qualquer ação irreversível, apresente o resultado para minha aprovação.
- Se faltar uma informação essencial, faça perguntas objetivas antes de iniciar.`;
  }

  return `I want Lynx to execute this workflow: ${title}.

Goal
${description}

Context
- Company/industry: ${context.segment?.trim() || "[describe your company, industry or context]"}
- Initial scope: ${context.volume} ${unit}
- People involved in the current process: ${context.teamSize}
- Authorized sources, files or applications: [add them here]

Work plan
${steps}

Deliverables
${outputs}

Quality and control rules
- Use only the authorized sources, files and applications.
- Include source links or references when research is involved.
- Separate confirmed information, estimates and items that could not be verified.
- Before sending messages, changing records, publishing content, scheduling events or taking any irreversible action, show me the result for approval.
- If essential information is missing, ask concise questions before starting.`;
}
