export type Category = "comercial" | "backoffice" | "conteudo" | "receita" | "operacional";

export interface RoiCase {
  area: "Externo" | "Interno";
  flow: string;
  scenario: string;
  volumeMonthly: number;
  manualMin: number;
  agentMin: number;
  costHour: number;
  categories: Category[];
}

// Helpers
export const hoursSaved = (c: RoiCase) =>
  (c.volumeMonthly * (c.manualMin - c.agentMin)) / 60;
export const monthlySavings = (c: RoiCase) => hoursSaved(c) * c.costHour;
export const yearlySavings = (c: RoiCase) => monthlySavings(c) * 12;
export const percentReduction = (c: RoiCase) =>
  Math.round(((c.manualMin - c.agentMin) / c.manualMin) * 100);

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const CASES: RoiCase[] = [
  // EXTERNOS
  { area: "Externo", flow: "Pesquisa de leads públicos", scenario: "4 listas/mês • 4h manual • 45min com Lynx", volumeMonthly: 4, manualMin: 240, agentMin: 45, costHour: 35, categories: ["comercial"] },
  { area: "Externo", flow: "Análise de concorrentes", scenario: "4 análises/mês • 6h manual • 1h com Lynx", volumeMonthly: 4, manualMin: 360, agentMin: 60, costHour: 45, categories: ["comercial", "operacional"] },
  { area: "Externo", flow: "Relatório de canal YouTube", scenario: "8 relatórios/mês • 2h manual • 20min com Lynx", volumeMonthly: 8, manualMin: 120, agentMin: 20, costHour: 40, categories: ["conteudo"] },
  { area: "Externo", flow: "Calendário de conteúdo", scenario: "20 posts/mês • 45min manual • 10min com Lynx", volumeMonthly: 20, manualMin: 45, agentMin: 10, costHour: 35, categories: ["conteudo"] },
  { area: "Externo", flow: "Roteiros curtos / Reels", scenario: "24 roteiros/mês • 30min manual • 8min com Lynx", volumeMonthly: 24, manualMin: 30, agentMin: 8, costHour: 35, categories: ["conteudo"] },
  { area: "Externo", flow: "Proposta comercial", scenario: "12 propostas/mês • 90min manual • 20min com Lynx", volumeMonthly: 12, manualMin: 90, agentMin: 20, costHour: 45, categories: ["comercial", "receita"] },
  { area: "Externo", flow: "Landing page / copy", scenario: "4 páginas/mês • 6h manual • 1h30 com Lynx", volumeMonthly: 4, manualMin: 360, agentMin: 90, costHour: 50, categories: ["conteudo", "receita"] },
  { area: "Externo", flow: "Pacote de criativos para anúncio", scenario: "30 variações/mês • 25min manual • 5min com Lynx", volumeMonthly: 30, manualMin: 25, agentMin: 5, costHour: 35, categories: ["conteudo"] },
  { area: "Externo", flow: "Pesquisa de mercado local", scenario: "2 pesquisas/mês • 10h manual • 2h com Lynx", volumeMonthly: 2, manualMin: 600, agentMin: 120, costHour: 50, categories: ["operacional"] },
  { area: "Externo", flow: "Benchmark de ferramentas", scenario: "4 comparativos/mês • 3h manual • 30min com Lynx", volumeMonthly: 4, manualMin: 180, agentMin: 30, costHour: 45, categories: ["operacional"] },
  // INTERNOS
  { area: "Interno", flow: "Resposta rápida a leads", scenario: "100 leads/mês • 15min manual • 2min com Lynx", volumeMonthly: 100, manualMin: 15, agentMin: 2, costHour: 32, categories: ["comercial", "receita"] },
  { area: "Interno", flow: "Follow-up comercial", scenario: "150 follow-ups/mês • 10min manual • 1min com Lynx", volumeMonthly: 150, manualMin: 10, agentMin: 1, costHour: 32, categories: ["comercial", "receita"] },
  { area: "Interno", flow: "Processamento de documentos", scenario: "200 docs/mês • 15min manual • 2min com Lynx", volumeMonthly: 200, manualMin: 15, agentMin: 2, costHour: 35, categories: ["backoffice"] },
  { area: "Interno", flow: "Relatórios gerenciais", scenario: "8 relatórios/mês • 2h manual • 10min com Lynx", volumeMonthly: 8, manualMin: 120, agentMin: 10, costHour: 50, categories: ["backoffice", "operacional"] },
  { area: "Interno", flow: "Resumos de reunião", scenario: "20 reuniões/mês • 30min manual • 5min com Lynx", volumeMonthly: 20, manualMin: 30, agentMin: 5, costHour: 45, categories: ["operacional"] },
  { area: "Interno", flow: "FAQ / atendimento N1", scenario: "300 perguntas/mês • 6min manual • 1min com Lynx", volumeMonthly: 300, manualMin: 6, agentMin: 1, costHour: 30, categories: ["operacional"] },
  { area: "Interno", flow: "Contratos e revisões", scenario: "15 contratos/mês • 60min manual • 15min com Lynx", volumeMonthly: 15, manualMin: 60, agentMin: 15, costHour: 50, categories: ["backoffice"] },
  { area: "Interno", flow: "Limpeza de planilha/CRM", scenario: "Base mensal • 8h manual • 1h com Lynx", volumeMonthly: 1, manualMin: 480, agentMin: 60, costHour: 35, categories: ["backoffice", "comercial"] },
  { area: "Interno", flow: "Agenda inteligente", scenario: "50 agendamentos/mês • 8min manual • 2min com Lynx", volumeMonthly: 50, manualMin: 8, agentMin: 2, costHour: 28, categories: ["operacional"] },
  { area: "Interno", flow: "Onboarding de cliente", scenario: "10 onboardings/mês • 2h manual • 30min com Lynx", volumeMonthly: 10, manualMin: 120, agentMin: 30, costHour: 40, categories: ["operacional", "backoffice"] },
  { area: "Interno", flow: "Base de conhecimento interna", scenario: "10 pessoas • 20min/dia buscando info • reduz 50%", volumeMonthly: 10 * 22, manualMin: 20, agentMin: 10, costHour: 35, categories: ["operacional"] },
];

export interface RevenueCase {
  flow: string;
  scenario: string;
  monthly: string;
  yearly: string;
  note: string;
}

export const REVENUE_CASES: RevenueCase[] = [
  {
    flow: "Reativação de base antiga",
    scenario: "4.000 leads parados • 2% reativados = 80 clientes • ticket R$100 • LTV 8 meses",
    monthly: "R$ 8.000 MRR",
    yearly: "R$ 64.000 LTV",
    note: "Receita recuperada, não economia. Use como estimativa conservadora.",
  },
  {
    flow: "Ganho por velocidade de resposta",
    scenario: "Responder em < 5min aumenta conversão drasticamente vs. > 1h (InsideSales/HBR)",
    monthly: "+10–30% conversão",
    yearly: "Multiplica pipeline anual",
    note: "Depende do volume de leads e qualidade da abordagem.",
  },
  {
    flow: "Propostas mais rápidas",
    scenario: "12 propostas/mês entregues em 20min vs 90min — ciclo mais curto",
    monthly: "+ fechamentos no mês",
    yearly: "Aumento de receita anual",
    note: "Velocidade no envio costuma elevar taxa de fechamento.",
  },
];

export const PLANS = [
  { name: "Plus", price: "US$ 20/mês", who: "Profissional individual, social media, consultor", note: "Se economizar 2 a 4 horas no mês, já faz sentido." },
  { name: "Pro", price: "US$ 50/mês", who: "Pequena empresa, agência, equipe comercial", note: "Se economizar 5 a 10 horas/mês, tende a se pagar." },
  { name: "Ultra", price: "US$ 200/mês", who: "Uso intenso, vários fluxos, maior volume", note: "ROI pode vir de relatórios, docs, propostas e leads." },
  { name: "Personalizado", price: "Setup + mensalidade", who: "Empresas com dados/processos internos", note: "Escopo, segurança, integração e ambiente dedicado." },
];
