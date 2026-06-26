export type Category = "comercial" | "backoffice" | "conteudo" | "receita" | "operacional";

export interface RoiCase {
  area: "External" | "Internal";
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

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const CASES: RoiCase[] = [
  // EXTERNAL
  { area: "External", flow: "Public lead research", scenario: "4 lists/month • 4h manual • 45min with Lynx", volumeMonthly: 4, manualMin: 240, agentMin: 45, costHour: 35, categories: ["comercial"] },
  { area: "External", flow: "Competitor analysis", scenario: "4 analyses/month • 6h manual • 1h with Lynx", volumeMonthly: 4, manualMin: 360, agentMin: 60, costHour: 45, categories: ["comercial", "operacional"] },
  { area: "External", flow: "YouTube channel report", scenario: "8 reports/month • 2h manual • 20min with Lynx", volumeMonthly: 8, manualMin: 120, agentMin: 20, costHour: 40, categories: ["conteudo"] },
  { area: "External", flow: "Content calendar", scenario: "20 posts/month • 45min manual • 10min with Lynx", volumeMonthly: 20, manualMin: 45, agentMin: 10, costHour: 35, categories: ["conteudo"] },
  { area: "External", flow: "Short scripts / Reels", scenario: "24 scripts/month • 30min manual • 8min with Lynx", volumeMonthly: 24, manualMin: 30, agentMin: 8, costHour: 35, categories: ["conteudo"] },
  { area: "External", flow: "Sales proposal", scenario: "12 proposals/month • 90min manual • 20min with Lynx", volumeMonthly: 12, manualMin: 90, agentMin: 20, costHour: 45, categories: ["comercial", "receita"] },
  { area: "External", flow: "Landing page / copy", scenario: "4 pages/month • 6h manual • 1h30 with Lynx", volumeMonthly: 4, manualMin: 360, agentMin: 90, costHour: 50, categories: ["conteudo", "receita"] },
  { area: "External", flow: "Ad creative pack", scenario: "30 variations/month • 25min manual • 5min with Lynx", volumeMonthly: 30, manualMin: 25, agentMin: 5, costHour: 35, categories: ["conteudo"] },
  { area: "External", flow: "Local market research", scenario: "2 surveys/month • 10h manual • 2h with Lynx", volumeMonthly: 2, manualMin: 600, agentMin: 120, costHour: 50, categories: ["operacional"] },
  { area: "External", flow: "Tool benchmarking", scenario: "4 comparisons/month • 3h manual • 30min with Lynx", volumeMonthly: 4, manualMin: 180, agentMin: 30, costHour: 45, categories: ["operacional"] },
  { area: "External", flow: "Slide decks & presentations", scenario: "12 decks/month • 3h manual • 40min with Lynx", volumeMonthly: 12, manualMin: 180, agentMin: 40, costHour: 45, categories: ["conteudo"] },
  { area: "External", flow: "Real-time dashboards", scenario: "4 dashboards/month • 8h manual • 1h30 with Lynx", volumeMonthly: 4, manualMin: 480, agentMin: 90, costHour: 55, categories: ["operacional", "receita"] },
  { area: "External", flow: "Custom AI agent builder", scenario: "5 agents/month • 6h manual • 1h with Lynx + 1k+ tools", volumeMonthly: 5, manualMin: 360, agentMin: 60, costHour: 60, categories: ["receita", "operacional"] },
  { area: "External", flow: "No-code workflow automation", scenario: "10 workflows/month • 4h manual • 45min with Lynx", volumeMonthly: 10, manualMin: 240, agentMin: 45, costHour: 50, categories: ["operacional", "backoffice"] },
  // INTERNAL
  { area: "Internal", flow: "Quick lead response", scenario: "100 leads/month • 15min manual • 2min with Lynx", volumeMonthly: 100, manualMin: 15, agentMin: 2, costHour: 32, categories: ["comercial", "receita"] },
  { area: "Internal", flow: "Sales follow-up", scenario: "150 follow-ups/month • 10min manual • 1min with Lynx", volumeMonthly: 150, manualMin: 10, agentMin: 1, costHour: 32, categories: ["comercial", "receita"] },
  { area: "Internal", flow: "Document processing", scenario: "200 docs/month • 15min manual • 2min with Lynx", volumeMonthly: 200, manualMin: 15, agentMin: 2, costHour: 35, categories: ["backoffice"] },
  { area: "Internal", flow: "Management reports", scenario: "8 reports/month • 2h manual • 10min with Lynx", volumeMonthly: 8, manualMin: 120, agentMin: 10, costHour: 50, categories: ["backoffice", "operacional"] },
  { area: "Internal", flow: "Meeting summaries", scenario: "20 meetings/month • 30min manual • 5min with Lynx", volumeMonthly: 20, manualMin: 30, agentMin: 5, costHour: 45, categories: ["operacional"] },
  { area: "Internal", flow: "FAQ / Tier-1 support", scenario: "300 questions/month • 6min manual • 1min with Lynx", volumeMonthly: 300, manualMin: 6, agentMin: 1, costHour: 30, categories: ["operacional"] },
  { area: "Internal", flow: "Contracts and reviews", scenario: "15 contracts/month • 60min manual • 15min with Lynx", volumeMonthly: 15, manualMin: 60, agentMin: 15, costHour: 50, categories: ["backoffice"] },
  { area: "Internal", flow: "Spreadsheet/CRM cleanup", scenario: "Monthly base • 8h manual • 1h with Lynx", volumeMonthly: 1, manualMin: 480, agentMin: 60, costHour: 35, categories: ["backoffice", "comercial"] },
  { area: "Internal", flow: "Smart scheduling", scenario: "50 appointments/month • 8min manual • 2min with Lynx", volumeMonthly: 50, manualMin: 8, agentMin: 2, costHour: 28, categories: ["operacional"] },
  { area: "Internal", flow: "Client onboarding", scenario: "10 onboardings/month • 2h manual • 30min with Lynx", volumeMonthly: 10, manualMin: 120, agentMin: 30, costHour: 40, categories: ["operacional", "backoffice"] },
  { area: "Internal", flow: "Internal knowledge base", scenario: "10 people • 20min/day searching • reduces 50%", volumeMonthly: 10 * 22, manualMin: 20, agentMin: 10, costHour: 35, categories: ["operacional"] },
  { area: "Internal", flow: "Email automation sequences", scenario: "5 sequences/month • 3h manual • 30min with Lynx", volumeMonthly: 5, manualMin: 180, agentMin: 30, costHour: 40, categories: ["operacional", "comercial"] },
  { area: "Internal", flow: "Slack / team notifications", scenario: "30 alerts/month • 20min manual • 2min with Lynx", volumeMonthly: 30, manualMin: 20, agentMin: 2, costHour: 35, categories: ["operacional"] },
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
    flow: "Old base reactivation",
    scenario: "4,000 stale leads • 2% reactivated = 80 clients • ticket $100 • LTV 8 months",
    monthly: "$8,000 MRR",
    yearly: "$64,000 LTV",
    note: "Recovered revenue, not savings. Use as conservative estimate.",
  },
  {
    flow: "Speed-of-response gain",
    scenario: "Respond in < 5min drastically increases conversion vs. > 1h (InsideSales/HBR)",
    monthly: "+10–30% conversion",
    yearly: "Multiplies annual pipeline",
    note: "Depends on lead volume and approach quality.",
  },
  {
    flow: "Faster proposals",
    scenario: "12 proposals/month delivered in 20min vs 90min — shorter cycle",
    monthly: "+ closures per month",
    yearly: "Annual revenue increase",
    note: "Faster delivery usually raises closing rates.",
  },
];

export const PLANS = [
  { name: "Plus", price: "$20/mo", who: "Individual professional, social media, consultant", note: "If you save 2 to 4 hours a month, it already pays off." },
  { name: "Pro", price: "$50/mo", who: "Small business, agency, sales team", note: "If you save 5 to 10 hours/month, it tends to pay for itself." },
  { name: "Ultra", price: "$200/mo", who: "Heavy use, multiple workflows, higher volume", note: "ROI can come from reports, docs, proposals, and leads." },
  { name: "Custom", price: "Setup + monthly fee", who: "Companies with internal data/processes", note: "Scope, security, integration, and dedicated environment." },
];
