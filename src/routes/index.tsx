import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  volume: number; // monthly tasks in main bottleneck
  costHour: number;
  manualMin: number;
  teamSize: number;
}

const PAIN_TO_CATEGORIES: Record<PainKey, Category[]> = {
  leads: ["comercial", "receita"],
  docs: ["backoffice"],
  vendas: ["receita", "comercial"],
  conteudo: ["conteudo"],
  reunioes: ["operacional"],
};

function Index() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    pain: null,
    segment: "",
    volume: 100,
    costHour: 35,
    manualMin: 15,
    teamSize: 3,
  });

  const recommended = useMemo(() => {
    if (!answers.pain) return [] as RoiCase[];
    const cats = PAIN_TO_CATEGORIES[answers.pain];
    const scored = CASES.map((c) => ({
      c,
      score: c.categories.filter((cat) => cats.includes(cat)).length,
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || monthlySavings(b.c) - monthlySavings(a.c))
      .slice(0, 3)
      .map((x) => x.c);
    return scored;
  }, [answers.pain]);

  const custom = useMemo(() => {
    const agentMin = Math.max(1, Math.round(answers.manualMin * 0.18));
    const c: RoiCase = {
      area: "Interno",
      flow: "Seu gargalo principal",
      scenario: `${answers.volume} tarefas/mês • ${answers.manualMin}min manual • ~${agentMin}min com Lynx`,
      volumeMonthly: answers.volume,
      manualMin: answers.manualMin,
      agentMin,
      costHour: answers.costHour,
      categories: [],
    };
    return c;
  }, [answers]);

  const totalMonthly = recommended.reduce((s, c) => s + monthlySavings(c), 0) + monthlySavings(custom);
  const totalHours = recommended.reduce((s, c) => s + hoursSaved(c), 0) + hoursSaved(custom);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-x-0 top-0 h-[900px]"
          style={{ background: "var(--gradient-hero)" }}
        />
      </div>

      <Header />

      <main className="mx-auto max-w-6xl px-6 pb-32">
        <Hero onStart={() => setStep(1)} />

        {step >= 1 && (
          <section id="diagnostico" className="mt-24 scroll-mt-24">
            <SectionLabel>01 — Diagnóstico</SectionLabel>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
              Quatro perguntas. Um raio-x do seu ROI.
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Responda rápido. O Lynx identifica o maior gargalo, calcula horas e dinheiro liberados e mostra os 3 exemplos mais próximos da sua realidade.
            </p>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
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
                <SliderRow
                  label="Tarefas / mês"
                  value={answers.volume}
                  min={10}
                  max={500}
                  step={10}
                  suffix=""
                  onChange={(v) => setAnswers({ ...answers, volume: v })}
                />
                <SliderRow
                  label="Tempo manual por tarefa"
                  value={answers.manualMin}
                  min={2}
                  max={240}
                  step={1}
                  suffix=" min"
                  onChange={(v) => setAnswers({ ...answers, manualMin: v })}
                />
              </QuestionCard>

              <QuestionCard title="4. Custo da hora e tamanho do time">
                <SliderRow
                  label="Custo / hora (R$)"
                  value={answers.costHour}
                  min={20}
                  max={150}
                  step={1}
                  suffix=""
                  onChange={(v) => setAnswers({ ...answers, costHour: v })}
                />
                <SliderRow
                  label="Tamanho do time"
                  value={answers.teamSize}
                  min={1}
                  max={50}
                  step={1}
                  suffix=" pessoas"
                  onChange={(v) => setAnswers({ ...answers, teamSize: v })}
                />
              </QuestionCard>
            </div>
          </section>
        )}

        {answers.pain && (
          <section className="mt-24">
            <SectionLabel>02 — Resultado</SectionLabel>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
              Seu time pode liberar{" "}
              <span className="text-blue-gradient">
                {totalHours.toFixed(0)}h/mês
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Estimativa baseada na fórmula oficial Apex7AI: volume × (tempo manual − tempo com Lynx) ÷ 60 × custo/hora. Use como simulação orientativa.
            </p>

            <div className="mt-10 grid md:grid-cols-3 gap-5">
              <StatCard label="Horas liberadas / mês" value={`${totalHours.toFixed(0)}h`} sub="Tempo que volta pro time" />
              <StatCard label="Economia mensal" value={brl(totalMonthly)} sub="Conservador, sem receita extra" highlight />
              <StatCard label="Economia anual" value={brl(totalMonthly * 12)} sub="Projeção 12 meses" />
            </div>

            <div className="mt-12">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground">
                Top 3 fluxos recomendados para você
              </h3>
              <div className="mt-5 grid md:grid-cols-3 gap-5">
                {recommended.map((c) => (
                  <CaseCard key={c.flow} c={c} />
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 card-elev">
              <div className="text-xs uppercase tracking-widest text-primary">Seu cenário customizado</div>
              <div className="mt-2 text-xl font-medium">{custom.scenario}</div>
              <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-muted-foreground">Horas/mês</div>
                  <div className="text-2xl font-semibold mt-1">{hoursSaved(custom).toFixed(1)}h</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Economia/mês</div>
                  <div className="text-2xl font-semibold mt-1">{brl(monthlySavings(custom))}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Economia/ano</div>
                  <div className="text-2xl font-semibold mt-1">{brl(yearlySavings(custom))}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-32">
          <SectionLabel>03 — Biblioteca de ROI</SectionLabel>
          <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              21+ casos calculados.
              <br />
              <span className="text-muted-foreground">Externo + interno.</span>
            </h2>
          </div>
          <Library />
        </section>

        <section className="mt-32">
          <SectionLabel>04 — Receita potencial</SectionLabel>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            Além da economia: <span className="text-blue-gradient">receita recuperada.</span>
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
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

        <section className="mt-32">
          <SectionLabel>05 — Planos</SectionLabel>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            Escolha o tamanho da operação.
          </h2>
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {PLANS.map((p, i) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 card-elev ${
                  i === 1 ? "border-primary bg-primary/5 glow" : "border-border bg-card"
                }`}
              >
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-2 text-2xl font-semibold">{p.price}</div>
                <p className="mt-4 text-sm text-foreground/90">{p.who}</p>
                <p className="mt-3 text-xs text-muted-foreground">{p.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-32 rounded-3xl border border-border bg-card p-10 md:p-14 text-center card-elev">
          <SectionLabel className="justify-center inline-flex">Pronto para o workshop</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
            Leve este diagnóstico para o seu time.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Apresente números calculados ao vivo, ranqueie gargalos por empresa e mostre o ROI antes mesmo de assinar.
          </p>
          <button
            onClick={() => {
              setStep(1);
              document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
          >
            Refazer diagnóstico
          </button>
        </section>

        <footer className="mt-24 text-xs text-muted-foreground border-t border-border pt-8 flex justify-between flex-wrap gap-4">
          <div>© Apex7AI — Lynx Agent</div>
          <div>Fontes: McKinsey, HBR, InsideSales, Zapier, Stanford/MIT via Axios.</div>
        </footer>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md" style={{ background: "var(--gradient-blue)" }} />
          <div className="font-semibold tracking-tight">
            Apex7AI <span className="text-muted-foreground font-normal">/ Lynx</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm bg-secondary/60 border border-border rounded-full px-1 py-1">
          {["Diagnóstico", "Biblioteca", "Receita", "Planos"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#diagnostico"
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Começar
        </a>
      </div>
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="pt-24 md:pt-32 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/60 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Diagnóstico Operacional — Lynx Agent
      </div>
      <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
        <span className="text-gradient">Descubra quanto seu time</span>
        <br />
        perde em <span className="text-blue-gradient">tarefas manuais.</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
        Apex7AI Lynx — a forma mais simples de transformar tempo perdido em horas, dinheiro e receita recuperada.
      </p>
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
        >
          Iniciar diagnóstico
        </button>
        <a
          href="#biblioteca"
          className="px-6 py-3 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-foreground transition"
        >
          Ver biblioteca de ROI
        </a>
      </div>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {[
          { k: "21+", v: "casos calculados" },
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
    <div className="rounded-2xl border border-border bg-card p-6 card-elev">
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
      <div className={`mt-3 text-4xl font-semibold ${highlight ? "text-blue-gradient" : ""}`}>{value}</div>
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
    <div id="biblioteca" className="mt-8">
      <div className="inline-flex bg-secondary/60 border border-border rounded-full p-1">
        {(["Externo", "Interno"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-sm transition ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <CaseCard key={c.flow} c={c} />
        ))}
      </div>
    </div>
  );
}
