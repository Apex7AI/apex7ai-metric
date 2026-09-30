import type { RevenueCase, RoiCase } from "@/lib/diagnostic-data";

export type Locale = "en" | "pt";

export const translations = {
  en: {
    pageTitle: "Apex7AI — Lynx Agent Diagnostic",
    pageDescription:
      "Apex7AI operational diagnostic: find out in minutes how many hours and how much money your team can save with Lynx Agent.",
    navDiagnostic: "Diagnostic",
    navLibrary: "Library",
    navRevenue: "Revenue",
    navPlans: "Plans",
    start: "Start",
    getStarted: "Get Started",
    backToTop: "Back to top",
    languageLabel: "Language",
    heroBadge: "Operational Diagnostic — Lynx Agent",
    heroTitle1: "Find out how much your team",
    heroTitle2: "loses to manual tasks.",
    heroBody:
      "Apex7AI Lynx — the simplest way to turn lost time into hours, money, and recovered revenue.",
    startDiagnostic: "Start diagnostic",
    viewLibrary: "View ROI library",
    tryLynx: "Try Lynx Agent →",
    launchOffer: "30% OFF — launch offer",
    casesCalculated: "cases calculated",
    twoLines: "2 lines",
    externalInternal: "external + internal",
    roi: "ROI",
    timeMoney: "time + money",
    sources: "Sources",
    marketDiagnostic: "market + diagnostic",
    diagnosticSection: "01 — Diagnostic",
    diagnosticTitle: "Four questions. An X-ray of your ROI.",
    diagnosticBody:
      "Answer quickly. Lynx identifies the biggest bottleneck, calculates hours and money saved, and shows the 3 closest examples to your reality.",
    questionBottleneck: "1. What is your biggest bottleneck today?",
    painLeads: "Lead response",
    painDocs: "PDFs & spreadsheets",
    painSales: "Need to sell more",
    painContent: "Content & marketing",
    painMeetings: "Meetings & reports",
    painDev: "Dev & technical tasks",
    painProject: "Project management",
    questionSegment: "2. What is your company segment?",
    segmentPlaceholder: "e.g. agency, accounting, clinic…",
    segmentAgency: "Agency",
    segmentAccounting: "Accounting",
    segmentClinic: "Clinic",
    segmentRealEstate: "Real Estate",
    segmentConsulting: "Consulting",
    segmentCoworking: "Coworking",
    segmentDeveloper: "Developer / Freelancer",
    segmentStartup: "Startup",
    segmentEcommerce: "E-commerce",
    segmentLaw: "Law Firm",
    segmentEducation: "Education",
    questionVolume: "3. Monthly bottleneck volume",
    tasksMonth: "Tasks / month",
    manualTime: "Manual time per task",
    minuteSuffix: " min",
    questionCost: "4. Hourly cost and team size",
    costHour: "Cost / hour (US$)",
    teamSize: "Team size",
    peopleSuffix: " people",
    ready: "All set — see your result.",
    incomplete: "Fill in the fields to unlock the result.",
    reset: "Reset",
    seeResult: "See my result",
    resultSection: "02 — Result",
    resultTitle1: "Your team can free",
    resultTitle2: "h/month",
    resultBody:
      "Estimate based on the official Apex7AI formula: volume × (manual time − time with Lynx) ÷ 60 × cost/hour. Use as a guiding simulation.",
    hoursFreed: "Hours freed / month",
    timeBack: "Time back to the team",
    monthlySavings: "Monthly savings",
    conservative: "Conservative, no extra revenue",
    annualSavings: "Annual savings",
    twelveMonths: "12-month projection",
    customScenario: "★ Your custom scenario",
    lessTime: "less time",
    hoursMonth: "Hours/month",
    savingsMonth: "Savings/month",
    savingsYear: "Savings/year",
    recommendedWorkflows: "Top 3 recommended workflows for you",
    nextStep: "Next step",
    recommendPlan1: "We recommend the",
    recommendPlan2: "plan",
    basedOnSavings: "Based on your estimated savings of",
    perMonth: "/mo",
    seeIdealPlan: "See ideal plan ↓",
    getStartedWith: "Get started with",
    librarySection: "03 — ROI Library",
    calculatedPeriod: "cases calculated.",
    externalPlusInternal: "External + internal",
    fromDiagnostic: "from your diagnostic",
    revenueSection: "04 — Potential Revenue",
    revenueTitle1: "Beyond savings:",
    revenueTitle2: "recovered revenue.",
    plansSection: "05 — Plans",
    plansTitle: "Choose the size of your operation.",
    highlightedPlan1: "We highlighted the",
    highlightedPlan2: "based on your diagnostic.",
    recommended: "Recommended",
    choose: "Choose",
    couponInstruction: "Use",
    couponFor: "for 30% OFF",
    restartLabel: "Restart diagnostic",
    restartTitle: "Want to simulate another scenario?",
    restartBody:
      "Reset answers and recalculate with new numbers. Everything runs in real time, no signup required.",
    redo: "Redo diagnostic from scratch",
    goToLynx: "Go to Lynx Agent →",
    footerSources: "Sources: McKinsey, HBR, InsideSales, Zapier, Stanford/MIT via Axios.",
    external: "External",
    internal: "Internal",
    hourMonthShort: "h/mo",
    monthShort: "/mo",
    yearShort: "/yr",
    customFlow: "Your main bottleneck",
  },
  pt: {
    pageTitle: "Apex7AI — Diagnóstico do Lynx Agent",
    pageDescription:
      "Diagnóstico operacional da Apex7AI: descubra em minutos quantas horas e quanto dinheiro sua equipe pode economizar com o Lynx Agent.",
    navDiagnostic: "Diagnóstico",
    navLibrary: "Biblioteca",
    navRevenue: "Receita",
    navPlans: "Planos",
    start: "Começar",
    getStarted: "Acessar Lynx",
    backToTop: "Voltar ao topo",
    languageLabel: "Idioma",
    heroBadge: "Diagnóstico Operacional — Lynx Agent",
    heroTitle1: "Descubra quanto sua equipe",
    heroTitle2: "perde em tarefas manuais.",
    heroBody:
      "Apex7AI Lynx — a maneira mais simples de transformar tempo perdido em horas, dinheiro e receita recuperada.",
    startDiagnostic: "Iniciar diagnóstico",
    viewLibrary: "Ver biblioteca de ROI",
    tryLynx: "Conhecer o Lynx Agent →",
    launchOffer: "30% OFF — oferta de lançamento",
    casesCalculated: "casos calculados",
    twoLines: "2 frentes",
    externalInternal: "externa + interna",
    roi: "ROI",
    timeMoney: "tempo + dinheiro",
    sources: "Fontes",
    marketDiagnostic: "mercado + diagnóstico",
    diagnosticSection: "01 — Diagnóstico",
    diagnosticTitle: "Quatro perguntas. Um raio-X do seu ROI.",
    diagnosticBody:
      "Responda rapidamente. O Lynx identifica o maior gargalo, calcula as horas e o dinheiro economizados e mostra os 3 exemplos mais próximos da sua realidade.",
    questionBottleneck: "1. Qual é o seu maior gargalo hoje?",
    painLeads: "Resposta a leads",
    painDocs: "PDFs e planilhas",
    painSales: "Preciso vender mais",
    painContent: "Conteúdo e marketing",
    painMeetings: "Reuniões e relatórios",
    painDev: "Dev e tarefas técnicas",
    painProject: "Gestão de projetos",
    questionSegment: "2. Qual é o segmento da sua empresa?",
    segmentPlaceholder: "Ex.: agência, contabilidade, clínica…",
    segmentAgency: "Agência",
    segmentAccounting: "Contabilidade",
    segmentClinic: "Clínica",
    segmentRealEstate: "Imobiliária",
    segmentConsulting: "Consultoria",
    segmentCoworking: "Coworking",
    segmentDeveloper: "Dev / Freelancer",
    segmentStartup: "Startup",
    segmentEcommerce: "E-commerce",
    segmentLaw: "Escritório jurídico",
    segmentEducation: "Educação",
    questionVolume: "3. Volume mensal do gargalo",
    tasksMonth: "Tarefas / mês",
    manualTime: "Tempo manual por tarefa",
    minuteSuffix: " min",
    questionCost: "4. Custo por hora e tamanho da equipe",
    costHour: "Custo / hora (US$)",
    teamSize: "Tamanho da equipe",
    peopleSuffix: " pessoas",
    ready: "Tudo pronto — veja seu resultado.",
    incomplete: "Preencha os campos para liberar o resultado.",
    reset: "Limpar",
    seeResult: "Ver meu resultado",
    resultSection: "02 — Resultado",
    resultTitle1: "Sua equipe pode liberar",
    resultTitle2: "h/mês",
    resultBody:
      "Estimativa baseada na fórmula oficial da Apex7AI: volume × (tempo manual − tempo com Lynx) ÷ 60 × custo/hora. Use como uma simulação orientativa.",
    hoursFreed: "Horas liberadas / mês",
    timeBack: "Tempo devolvido à equipe",
    monthlySavings: "Economia mensal",
    conservative: "Estimativa conservadora, sem receita extra",
    annualSavings: "Economia anual",
    twelveMonths: "Projeção para 12 meses",
    customScenario: "★ Seu cenário personalizado",
    lessTime: "menos tempo",
    hoursMonth: "Horas/mês",
    savingsMonth: "Economia/mês",
    savingsYear: "Economia/ano",
    recommendedWorkflows: "3 fluxos mais recomendados para você",
    nextStep: "Próximo passo",
    recommendPlan1: "Recomendamos o plano",
    recommendPlan2: "",
    basedOnSavings: "Com base na sua economia estimada de",
    perMonth: "/mês",
    seeIdealPlan: "Ver plano ideal ↓",
    getStartedWith: "Começar com",
    librarySection: "03 — Biblioteca de ROI",
    calculatedPeriod: "casos calculados.",
    externalPlusInternal: "Externos + internos",
    fromDiagnostic: "do seu diagnóstico",
    revenueSection: "04 — Receita Potencial",
    revenueTitle1: "Além da economia:",
    revenueTitle2: "receita recuperada.",
    plansSection: "05 — Planos",
    plansTitle: "Escolha o tamanho da sua operação.",
    highlightedPlan1: "Destacamos o plano",
    highlightedPlan2: "com base no seu diagnóstico.",
    recommended: "Recomendado",
    choose: "Escolher",
    couponInstruction: "Use",
    couponFor: "para 30% OFF",
    restartLabel: "Refazer diagnóstico",
    restartTitle: "Quer simular outro cenário?",
    restartBody:
      "Limpe as respostas e recalcule com novos números. Tudo acontece em tempo real, sem necessidade de cadastro.",
    redo: "Refazer diagnóstico do zero",
    goToLynx: "Ir para o Lynx Agent →",
    footerSources: "Fontes: McKinsey, HBR, InsideSales, Zapier, Stanford/MIT via Axios.",
    external: "Externo",
    internal: "Interno",
    hourMonthShort: "h/mês",
    monthShort: "/mês",
    yearShort: "/ano",
    customFlow: "Seu principal gargalo",
  },
} as const;

type LocalizedText = { flow: string; scenario: string };

const caseTranslationsPt: Record<string, LocalizedText> = {
  "Public lead research": {
    flow: "Pesquisa de leads públicos",
    scenario: "4 listas/mês • 4h manuais • 45min com Lynx",
  },
  "Competitor analysis": {
    flow: "Análise de concorrentes",
    scenario: "4 análises/mês • 6h manuais • 1h com Lynx",
  },
  "YouTube channel report": {
    flow: "Relatório de canal do YouTube",
    scenario: "8 relatórios/mês • 2h manuais • 20min com Lynx",
  },
  "Content calendar": {
    flow: "Calendário de conteúdo",
    scenario: "20 posts/mês • 45min manuais • 10min com Lynx",
  },
  "Short scripts / Reels": {
    flow: "Roteiros curtos / Reels",
    scenario: "24 roteiros/mês • 30min manuais • 8min com Lynx",
  },
  "Sales proposal": {
    flow: "Proposta comercial",
    scenario: "12 propostas/mês • 90min manuais • 20min com Lynx",
  },
  "Landing page / copy": {
    flow: "Landing page / copy",
    scenario: "4 páginas/mês • 6h manuais • 1h30 com Lynx",
  },
  "Ad creative pack": {
    flow: "Pacote de criativos para anúncios",
    scenario: "30 variações/mês • 25min manuais • 5min com Lynx",
  },
  "Local market research": {
    flow: "Pesquisa de mercado local",
    scenario: "2 pesquisas/mês • 10h manuais • 2h com Lynx",
  },
  "Tool benchmarking": {
    flow: "Comparativo de ferramentas",
    scenario: "4 comparações/mês • 3h manuais • 30min com Lynx",
  },
  "Slide decks & presentations": {
    flow: "Slides e apresentações",
    scenario: "12 apresentações/mês • 3h manuais • 40min com Lynx",
  },
  "Real-time dashboards": {
    flow: "Dashboards em tempo real",
    scenario: "4 dashboards/mês • 8h manuais • 1h30 com Lynx",
  },
  "Custom AI agent builder": {
    flow: "Criação de agentes de IA personalizados",
    scenario: "5 agentes/mês • 6h manuais • 1h com Lynx + mais de 1.000 ferramentas",
  },
  "No-code workflow automation": {
    flow: "Automação de fluxos sem código",
    scenario: "10 fluxos/mês • 4h manuais • 45min com Lynx",
  },
  "CRM data enrichment (HubSpot/Salesforce)": {
    flow: "Enriquecimento de dados no CRM (HubSpot/Salesforce)",
    scenario: "500 contatos/mês • 3h manuais • 15min com Lynx",
  },
  "Google Sheets auto-reports": {
    flow: "Relatórios automáticos no Google Sheets",
    scenario: "12 relatórios/mês • 2h manuais • 20min com Lynx",
  },
  "Social media publishing (Buffer/Hootsuite)": {
    flow: "Publicação em redes sociais (Buffer/Hootsuite)",
    scenario: "30 posts/mês • 40min manuais • 8min com Lynx",
  },
  "E-commerce product sync (Shopify/WooCommerce)": {
    flow: "Sincronização de produtos (Shopify/WooCommerce)",
    scenario: "50 produtos/mês • 15min manuais • 3min com Lynx",
  },
  "Email campaigns (Mailchimp/Klaviyo)": {
    flow: "Campanhas de e-mail (Mailchimp/Klaviyo)",
    scenario: "8 campanhas/mês • 3h manuais • 30min com Lynx",
  },
  "Google Analytics insights": {
    flow: "Insights do Google Analytics",
    scenario: "10 relatórios/mês • 1h30 manual • 15min com Lynx",
  },
  "Notion database management": {
    flow: "Gestão de bases no Notion",
    scenario: "20 bases/mês • 1h manual • 10min com Lynx",
  },
  "API integration setup (Zapier/Make)": {
    flow: "Configuração de integrações via API (Zapier/Make)",
    scenario: "8 integrações/mês • 5h manuais • 1h com Lynx",
  },
  "Quick lead response": {
    flow: "Resposta rápida a leads",
    scenario: "100 leads/mês • 15min manuais • 2min com Lynx",
  },
  "Sales follow-up": {
    flow: "Follow-up comercial",
    scenario: "150 follow-ups/mês • 10min manuais • 1min com Lynx",
  },
  "Document processing": {
    flow: "Processamento de documentos",
    scenario: "200 documentos/mês • 15min manuais • 2min com Lynx",
  },
  "Management reports": {
    flow: "Relatórios gerenciais",
    scenario: "8 relatórios/mês • 2h manuais • 10min com Lynx",
  },
  "Meeting summaries": {
    flow: "Resumos de reuniões",
    scenario: "20 reuniões/mês • 30min manuais • 5min com Lynx",
  },
  "FAQ / Tier-1 support": {
    flow: "FAQ / suporte de nível 1",
    scenario: "300 perguntas/mês • 6min manuais • 1min com Lynx",
  },
  "Contracts and reviews": {
    flow: "Contratos e revisões",
    scenario: "15 contratos/mês • 60min manuais • 15min com Lynx",
  },
  "Spreadsheet/CRM cleanup": {
    flow: "Limpeza de planilhas/CRM",
    scenario: "Base mensal • 8h manuais • 1h com Lynx",
  },
  "Smart scheduling": {
    flow: "Agendamento inteligente",
    scenario: "50 agendamentos/mês • 8min manuais • 2min com Lynx",
  },
  "Client onboarding": {
    flow: "Onboarding de clientes",
    scenario: "10 onboardings/mês • 2h manuais • 30min com Lynx",
  },
  "Internal knowledge base": {
    flow: "Base de conhecimento interna",
    scenario: "10 pessoas • 20min/dia em buscas • redução de 50%",
  },
  "Email automation sequences": {
    flow: "Sequências automáticas de e-mail",
    scenario: "5 sequências/mês • 3h manuais • 30min com Lynx",
  },
  "Slack / team notifications": {
    flow: "Notificações no Slack / equipe",
    scenario: "30 alertas/mês • 20min manuais • 2min com Lynx",
  },
  "Daily team sync (Slack → Notion)": {
    flow: "Sincronização diária da equipe (Slack → Notion)",
    scenario: "22 resumos/mês • 15min manuais • 3min com Lynx",
  },
  "Invoice processing (QuickBooks/Stripe)": {
    flow: "Processamento de faturas (QuickBooks/Stripe)",
    scenario: "60 faturas/mês • 12min manuais • 2min com Lynx",
  },
  "Support ticket triage (Zendesk/Intercom)": {
    flow: "Triagem de chamados (Zendesk/Intercom)",
    scenario: "200 chamados/mês • 8min manuais • 1min com Lynx",
  },
  "Contract clause extraction (Google Docs)": {
    flow: "Extração de cláusulas contratuais (Google Docs)",
    scenario: "20 contratos/mês • 45min manuais • 8min com Lynx",
  },
  "HR onboarding (Gmail/Drive/Slack)": {
    flow: "Onboarding de RH (Gmail/Drive/Slack)",
    scenario: "5 onboardings/mês • 4h manuais • 45min com Lynx",
  },
  "Social brand monitoring": {
    flow: "Monitoramento da marca nas redes",
    scenario: "30 menções/dia • 20min manuais • 5min com Lynx",
  },
  "Calendar optimization (Google Calendar)": {
    flow: "Otimização da agenda (Google Calendar)",
    scenario: "50 eventos/mês • 10min manuais • 2min com Lynx",
  },
  "Expense report processing": {
    flow: "Processamento de relatórios de despesas",
    scenario: "40 relatórios/mês • 15min manuais • 3min com Lynx",
  },
  "GitHub issue triage": {
    flow: "Triagem de issues no GitHub",
    scenario: "60 issues/mês • 10min manuais • 2min com Lynx",
  },
  "Database health check & report": {
    flow: "Verificação e relatório de saúde do banco",
    scenario: "4 verificações/mês • 3h manuais • 30min com Lynx",
  },
};

const revenueTranslationsPt: Record<string, RevenueCase> = {
  "Old base reactivation": {
    flow: "Reativação da base antiga",
    scenario:
      "4.000 leads inativos • 2% reativados = 80 clientes • ticket de US$ 100 • LTV de 8 meses",
    monthly: "US$ 8.000 de MRR",
    yearly: "US$ 64.000 de LTV",
    note: "Receita recuperada, não economia. Use como estimativa conservadora.",
  },
  "Speed-of-response gain": {
    flow: "Ganho com velocidade de resposta",
    scenario:
      "Responder em menos de 5min aumenta drasticamente a conversão em relação a mais de 1h (InsideSales/HBR)",
    monthly: "+10–30% de conversão",
    yearly: "Multiplica o pipeline anual",
    note: "Depende do volume de leads e da qualidade da abordagem.",
  },
  "Faster proposals": {
    flow: "Propostas mais rápidas",
    scenario: "12 propostas/mês entregues em 20min em vez de 90min — ciclo mais curto",
    monthly: "+ fechamentos por mês",
    yearly: "Aumento da receita anual",
    note: "Entregas mais rápidas costumam elevar a taxa de fechamento.",
  },
};

export const getCopy = (locale: Locale) => translations[locale];

export function localizeCase(c: RoiCase, locale: Locale): RoiCase {
  if (locale === "en") return c;
  const translated = caseTranslationsPt[c.flow];
  return translated ? { ...c, ...translated } : c;
}

export function localizeRevenueCase(c: RevenueCase, locale: Locale): RevenueCase {
  if (locale === "en") return c;
  return revenueTranslationsPt[c.flow] ?? c;
}

export function formatUsd(value: number, locale: Locale) {
  const formatted = value.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", {
    maximumFractionDigits: 0,
  });
  return locale === "pt" ? `US$ ${formatted}` : `$${formatted}`;
}

export function getLocalizedPlans(locale: Locale) {
  if (locale === "en") {
    return [
      {
        name: "Plus",
        price: "$20/mo",
        who: "Individual professional, social media, consultant",
        note: "If you save 2 to 4 hours a month, it already pays off.",
      },
      {
        name: "Pro",
        price: "$50/mo",
        who: "Small business, agency, sales team",
        note: "If you save 5 to 10 hours/month, it tends to pay for itself.",
      },
      {
        name: "Ultra",
        price: "$200/mo",
        who: "Heavy use, multiple workflows, higher volume",
        note: "ROI can come from reports, docs, proposals, and leads.",
      },
      {
        name: "Custom",
        price: "Setup + monthly fee",
        who: "Companies with internal data/processes",
        note: "Scope, security, integration, and dedicated environment.",
      },
    ];
  }

  return [
    {
      name: "Plus",
      price: "US$ 20/mês",
      who: "Profissional autônomo, social media ou consultor",
      note: "Economizando de 2 a 4 horas por mês, o plano já se paga.",
    },
    {
      name: "Pro",
      price: "US$ 50/mês",
      who: "Pequena empresa, agência ou equipe comercial",
      note: "Economizando de 5 a 10 horas por mês, o plano tende a se pagar.",
    },
    {
      name: "Ultra",
      price: "US$ 200/mês",
      who: "Uso intenso, vários fluxos e maior volume",
      note: "O ROI pode vir de relatórios, documentos, propostas e leads.",
    },
    {
      name: "Custom",
      price: "Implantação + mensalidade",
      who: "Empresas com dados e processos internos",
      note: "Escopo, segurança, integração e ambiente dedicado.",
    },
  ];
}
