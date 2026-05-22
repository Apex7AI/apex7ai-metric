import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import logoGif from "@/assets/apex7ai-logo.gif";
import {
  CASES,
  PLANS,
  REVENUE_CASES,
  brl,
  hoursSaved,
  monthlySavings,
  percentReduction,
  yearlySavings,
  type Category,
  type RoiCase,
} from "@/lib/diagnostic-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Apex7AI — Diagnóstico Lynx Agent" },
      {
        name: "description",
        content:
          "Diagnóstico operacional Apex7AI: descubra em minutos quantas horas e quanto dinheiro seu time pode liberar com o Lynx Agent.",
      },
    ],
  }),
});

type PainKey = "leads" | "docs" | "vendas" | "conteudo" | "reunioes";

interface Answers {
  pain: PainKey | null;
  segment: string;
  volume: number;
  costHour: number;
  manualMin: number;
  teamSize: number;
}

const INITIAL_ANSWERS: Answers = {
  pain: null,
  segment: "",
  volume: 100,
  costHour: 35,
  manualMin: 15,
  teamSize: 3,
};

const PAIN_TO_CATEGORIES: Record<PainKey, Category[]> = {
  leads: ["comercial", "receita"],
  docs: ["backoffice"],
  vendas: ["receita", "comercial"],
  conteudo: ["conteudo"],
  reunioes: ["operacional"],
};

// Plano recomendado por economia mensal estimada (BRL)
const PLAN_THRESHOLDS = [
  { idx: 0, max: 800 },     // Plus
  { idx: 1, max: 3000 },    // Pro
  { idx: 2, max: 12000 },   // Ultra
  { idx: 3, max: Infinity } // Personalizado
];

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function Index() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [showResult, setShowResult] = useState(false);
  const [flashPlan, setFlashPlan] = useState(false);
  const resultRef = useRef<HTMLElement | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);

  const recommended = useMemo(() => {
    if (!answers.pain) return [] as RoiCase[];
    const cats = PAIN_TO_CATEGORIES[answers.pain];
    return CASES.map((c) => ({
      c,
      score: c.categories.filter((cat) => cats.includes(cat)).length,
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || monthlySavings(b.c) - monthlySavings(a.c))
      .slice(0, 3)
      .map((x) => x.c);
  }, [answers.pain]);

  const custom = useMemo<RoiCase>(() => {
    const agentMin = Math.max(1, Math.round(answers.manualMin * 0.18));
    return {
      area: "Interno",
      flow: "Seu gargalo principal",
      scenario: `${answers.volume} tarefas/mês • ${answers.manualMin}min manual • ~${agentMin}min com Lynx`,
      volumeMonthly: answers.volume,
      manualMin: answers.manualMin,
      agentMin,
      costHour: answers.costHour,
      categories: [],
    };
  }, [answers]);

  const totalMonthly = recommended.reduce((s, c) => s + monthlySavings(c), 0) + monthlySavings(custom);
  const totalHours = recommended.reduce((s, c) => s + hoursSaved(c), 0) + hoursSaved(custom);

  const recommendedPlanIdx = useMemo(() => {
    const t = PLAN_THRESHOLDS.find((p) => totalMonthly < p.max);
    return t ? t.idx : 0;
  }, [totalMonthly]);

  const startDiagnostic = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(1);
    setShowResult(false);
    setTimeout(() => smoothScrollTo("diagnostico"), 60);
  };

  const goHome = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishDiagnostic = () => {
    setShowResult(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const goToPlan = () => {
    planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFlashPlan(false);
    setTimeout(() => setFlashPlan(true), 400);
    setTimeout(() => setFlashPlan(false), 3600);
  };

  // Quando o resultado fica visível, sinaliza o plano recomendado
  useEffect(() => {
    if (showResult) {
      const t = setTimeout(() => setFlashPlan(true), 1500);
      const t2 = setTimeout(() => setFlashPlan(false), 4500);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [showResult]);

  const answersComplete = !!answers.pain && answers.segment.trim().length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-x-0 top-0 h-[900px]" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <Header onHome={goHome} onStart={startDiagnostic} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-32">
        <Hero onStart={startDiagnostic} onLibrary={() => smoothScrollTo("biblioteca")} />

        {step >= 1 && (
          <section id="diagnostico" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>01 — Diagnóstico</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
              Quatro perguntas. Um raio-x do seu ROI.
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Responda rápido. O Lynx identifica o maior gargalo, calcula horas e dinheiro liberados e mostra os 3 exemplos mais próximos da sua realidade.
            </p>

            <div className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-5 sm:gap-6">
              <QuestionCard title="1. Qual é o maior gargalo hoje?">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: "leads", label: "Resposta a leads" },
                    { k: "docs", label: "PDFs e planilhas" },
                    { k: "vendas", label: "Precisa vender mais" },
                    { k: "conteudo", label: "Conteúdo e marketing" },
                    { k: "reunioes", label: "Reuniões e relatórios" },
                  ].map((o) => (
                    <button
                      key={o.k}
                      onClick={() => {
                        setAnswers({ ...answers, pain: o.k as PainKey });
                        setStep(Math.max(step, 2));
                      }}
                      className={`text-left px-4 py-3 rounded-lg border transition ${
                        answers.pain === o.k
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm">{o.label}</span>
                    </button>
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard title="2. Qual o segmento da empresa?">
                <input
                  type="text"
                  value={answers.segment}
                  onChange={(e) => setAnswers({ ...answers, segment: e.target.value })}
                  placeholder="Ex: agência, contabilidade, clínica…"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Agência", "Contabilidade", "Clínica", "Imobiliária", "Consultoria", "Coworking"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setAnswers({ ...answers, segment: s })}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary hover:border-primary/60 text-muted-foreground hover:text-foreground transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard title="3. Volume mensal do gargalo">
                <SliderRow label="Tarefas / mês" value={answers.volume} min={10} max={500} step={10} suffix=""
                  onChange={(v) => setAnswers({ ...answers, volume: v })} />
                <SliderRow label="Tempo manual por tarefa" value={answers.manualMin} min={2} max={240} step={1} suffix=" min"
                  onChange={(v) => setAnswers({ ...answers, manualMin: v })} />
              </QuestionCard>

              <QuestionCard title="4. Custo da hora e tamanho do time">
                <SliderRow label="Custo / hora (R$)" value={answers.costHour} min={20} max={150} step={1} suffix=""
                  onChange={(v) => setAnswers({ ...answers, costHour: v })} />
                <SliderRow label="Tamanho do time" value={answers.teamSize} min={1} max={50} step={1} suffix=" pessoas"
                  onChange={(v) => setAnswers({ ...answers, teamSize: v })} />
              </QuestionCard>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              <div className="text-xs text-muted-foreground">
                {answersComplete
                  ? "Tudo pronto — veja seu resultado."
                  : "Selecione um gargalo e informe o segmento para liberar o resultado."}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setAnswers(INITIAL_ANSWERS); setShowResult(false); }}
                  className="px-5 py-2.5 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-sm text-foreground transition"
                >
                  Recomeçar
                </button>
                <button
                  onClick={finishDiagnostic}
                  disabled={!answersComplete}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition glow disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Ver meu resultado →
                </button>
              </div>
            </div>
          </section>
        )}

        {showResult && answers.pain && (
          <section ref={resultRef} id="resultado" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>02 — Resultado</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Seu time pode liberar{" "}
              <span className="text-blue-gradient">{totalHours.toFixed(0)}h/mês</span>
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Estimativa baseada na fórmula oficial Apex7AI: volume × (tempo manual − tempo com Lynx) ÷ 60 × custo/hora. Use como simulação orientativa.
            </p>

            <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              <StatCard label="Horas liberadas / mês" value={`${totalHours.toFixed(0)}h`} sub="Tempo que volta pro time" />
              <StatCard label="Economia mensal" value={brl(totalMonthly)} sub="Conservador, sem receita extra" highlight />
              <StatCard label="Economia anual" value={brl(totalMonthly * 12)} sub="Projeção 12 meses" />
            </div>

            <div className="mt-8 rounded-2xl border-2 bg-primary/5 p-6 sm:p-7 pulse-glow">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">★ Seu cenário customizado</div>
                <div className="text-[11px] text-muted-foreground">{percentReduction(custom)}% menos tempo</div>
              </div>
              <div className="mt-2 text-lg sm:text-xl font-medium">{custom.scenario}</div>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Horas/mês</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1">{hoursSaved(custom).toFixed(1)}h</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Economia/mês</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1 text-blue-gradient">{brl(monthlySavings(custom))}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Economia/ano</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1">{brl(yearlySavings(custom))}</div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground">
                Top 3 fluxos recomendados para você
              </h3>
              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {recommended.map((c) => <CaseCard key={c.flow} c={c} />)}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 text-center">
              <div className="text-xs uppercase tracking-widest text-primary">Próxima etapa</div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">
                Recomendamos o plano <span className="text-blue-gradient">{PLANS[recommendedPlanIdx].name}</span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                Baseado na sua economia estimada de <strong className="text-foreground">{brl(totalMonthly)}/mês</strong>.
              </p>
              <button
                onClick={goToPlan}
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
              >
                Ver plano ideal ↓
              </button>
            </div>
          </section>
        )}

        <section id="receita-anchor" className="mt-24 sm:mt-32">
          <SectionLabel>03 — Biblioteca de ROI</SectionLabel>
          <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              {CASES.length} casos calculados.
              <br />
              <span className="text-muted-foreground">Externo + interno.</span>
            </h2>
          </div>
          <Library />
        </section>

        <section id="receita" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>04 — Receita potencial</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Além da economia: <span className="text-blue-gradient">receita recuperada.</span>
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {REVENUE_CASES.map((r) => (
              <div key={r.flow} className="rounded-2xl border border-border bg-card p-6 card-elev">
                <div className="text-base font-medium">{r.flow}</div>
                <p className="mt-2 text-sm text-muted-foreground">{r.scenario}</p>
                <div className="mt-5 flex items-baseline gap-3">
                  <div className="text-2xl font-semibold text-blue-gradient">{r.monthly}</div>
                </div>
                <div className="text-sm text-muted-foreground">{r.yearly}</div>
                <p className="mt-4 text-xs text-muted-foreground/80 border-t border-border pt-3">{r.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section ref={planRef} id="planos" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>05 — Planos</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Escolha o tamanho da operação.
          </h2>
          {showResult && (
            <p className="mt-3 text-sm text-muted-foreground">
              Destacamos o <strong className="text-primary">{PLANS[recommendedPlanIdx].name}</strong> com base no seu diagnóstico.
            </p>
          )}
          <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p, i) => {
              const isRecommended = showResult && i === recommendedPlanIdx;
              return (
                <div
                  key={p.name}
                  className={`relative rounded-2xl border p-6 card-elev transition ${
                    isRecommended
                      ? `border-primary bg-primary/10 glow ${flashPlan ? "pulse-glow" : ""}`
                      : "border-border bg-card"
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-semibold">
                      Recomendado
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">{p.name}</div>
                  <div className="mt-2 text-2xl font-semibold">{p.price}</div>
                  <p className="mt-4 text-sm text-foreground/90">{p.who}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{p.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-24 sm:mt-32 rounded-3xl border border-border bg-card p-8 sm:p-10 md:p-14 text-center card-elev">
          <SectionLabel className="justify-center inline-flex">Recomeçar diagnóstico</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">
            Quer simular outro cenário?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Zere as respostas e recalcule com novos números. Tudo roda em tempo real, sem cadastro.
          </p>
          <button
            onClick={startDiagnostic}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
          >
            Refazer diagnóstico do zero
          </button>
        </section>

        <footer className="mt-20 sm:mt-24 text-xs text-muted-foreground border-t border-border pt-8 flex justify-between flex-wrap gap-4">
          <div>© Apex7AI — Lynx Agent</div>
          <div>Fontes: McKinsey, HBR, InsideSales, Zapier, Stanford/MIT via Axios.</div>
        </footer>
      </main>
    </div>
  );
}

function Header({ onHome, onStart }: { onHome: () => void; onStart: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2.5 group" aria-label="Voltar para o início">
          <img
            src={logoGif}
            alt="Apex7AI"
            className="h-9 w-9 rounded-md object-cover ring-1 ring-primary/40 group-hover:ring-primary transition"
          />
          <div className="font-semibold tracking-tight">
            Apex7AI <span className="text-muted-foreground font-normal hidden sm:inline">/ Lynx</span>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-1 text-sm bg-secondary/60 border border-border rounded-full px-1 py-1">
          {[
            { l: "Diagnóstico", id: "diagnostico" },
            { l: "Biblioteca", id: "biblioteca" },
            { l: "Receita", id: "receita" },
            { l: "Planos", id: "planos" },
          ].map((n) => (
            <button
              key={n.id}
              onClick={() => smoothScrollTo(n.id)}
              className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition"
            >
              {n.l}
            </button>
          ))}
        </nav>
        <button
          onClick={onStart}
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Começar
        </button>
      </div>
    </header>
  );
}

function Hero({ onStart, onLibrary }: { onStart: () => void; onLibrary: () => void }) {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/60 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Diagnóstico Operacional — Lynx Agent
      </div>
      <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
        <span className="text-gradient">Descubra quanto seu time</span>
        <br />
        perde em <span className="text-blue-gradient">tarefas manuais.</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-2">
        Apex7AI Lynx — a forma mais simples de transformar tempo perdido em horas, dinheiro e receita recuperada.
      </p>
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
        >
          Iniciar diagnóstico
        </button>
        <button
          onClick={onLibrary}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-foreground transition"
        >
          Ver biblioteca de ROI
        </button>
      </div>
      <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {[
          { k: `${CASES.length}`, v: "casos calculados" },
          { k: "2 linhas", v: "externo + interno" },
          { k: "ROI", v: "tempo + dinheiro" },
          { k: "Fontes", v: "mercado + diagnóstico" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border bg-card/60 p-4 text-left card-elev">
            <div className="text-xl font-semibold text-blue-gradient">{s.k}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary ${className}`}>
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

function QuestionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-elev">
      <div className="text-sm font-medium text-foreground/90 mb-4">{title}</div>
      {children}
    </div>
  );
}

function SliderRow({
  label, value, min, max, step, suffix, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>{label}</span>
        <span className="text-foreground font-medium tabular-nums">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

function StatCard({ label, value, sub, highlight = false }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border card-elev ${highlight ? "border-primary bg-primary/5 glow" : "border-border bg-card"}`}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-3 text-3xl sm:text-4xl font-semibold ${highlight ? "text-blue-gradient" : ""}`}>{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}

function CaseCard({ c }: { c: RoiCase }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-elev hover:border-primary/50 transition">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-primary">{c.area}</span>
        <span className="text-[10px] text-muted-foreground">{percentReduction(c)}% menos tempo</span>
      </div>
      <div className="mt-3 text-lg font-medium leading-snug">{c.flow}</div>
      <p className="mt-2 text-xs text-muted-foreground">{c.scenario}</p>
      <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">h/mês</div>
          <div className="text-base font-semibold mt-1">{hoursSaved(c).toFixed(1)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">/mês</div>
          <div className="text-base font-semibold mt-1">{brl(monthlySavings(c))}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">/ano</div>
          <div className="text-base font-semibold mt-1 text-blue-gradient">{brl(yearlySavings(c))}</div>
        </div>
      </div>
    </div>
  );
}

function Library() {
  const [tab, setTab] = useState<"Externo" | "Interno">("Externo");
  const list = CASES.filter((c) => c.area === tab);
  return (
    <div id="biblioteca" className="mt-8 scroll-mt-24">
      <div className="inline-flex bg-secondary/60 border border-border rounded-full p-1">
        {(["Externo", "Interno"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-sm transition ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} ({CASES.filter(c => c.area === t).length})
          </button>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => <CaseCard key={c.flow} c={c} />)}
      </div>
    </div>
  );
}
