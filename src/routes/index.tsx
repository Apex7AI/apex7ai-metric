import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import logoGif from "@/assets/apex7ai-logo.gif";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  CircleDollarSign,
  Users,
  Activity,
  MoveHorizontal,
} from "lucide-react";
import {
  CASES,
  PLANS,
  REVENUE_CASES,
  usd,
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
      { title: "Apex7AI — Lynx Agent Diagnostic" },
      {
        name: "description",
        content:
          "Apex7AI operational diagnostic: find out in minutes how many hours and how much money your team can save with Lynx Agent.",
      },
    ],
  }),
});

type PainKey = "leads" | "docs" | "vendas" | "conteudo" | "reunioes" | "dev" | "project";

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
  dev: ["operacional", "receita"],
  project: ["operacional", "backoffice"],
};

const PLAN_THRESHOLDS = [
  { idx: 0, max: 800 },     // Plus
  { idx: 1, max: 3000 },    // Pro
  { idx: 2, max: 12000 },   // Ultra
  { idx: 3, max: Infinity } // Custom
];

const PLATFORM_URL = "https://lynx.apex7ai.com/auth";

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
  const [extraCalcs, setExtraCalcs] = useState(0);
  const resultRef = useRef<HTMLElement | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem("apex7_calc_count") || "0");
    if (!Number.isNaN(stored)) setExtraCalcs(stored);
  }, []);

  const totalCatalogued = CASES.length + extraCalcs;

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
      area: "Internal",
      flow: "Your main bottleneck",
      scenario: `${answers.volume} tasks/month • ${answers.manualMin}min manual • ~${agentMin}min with Lynx`,
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
    setExtraCalcs((n) => {
      const next = n + 1;
      try { localStorage.setItem("apex7_calc_count", String(next)); } catch {}
      return next;
    });
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
        <Hero onStart={startDiagnostic} onLibrary={() => smoothScrollTo("biblioteca")} totalCases={totalCatalogued} />

        {step >= 1 && (
          <section id="diagnostico" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>01 — Diagnostic</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
              Four questions. An X-ray of your ROI.
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Answer quickly. Lynx identifies the biggest bottleneck, calculates hours and money saved, and shows the 3 closest examples to your reality.
            </p>

            <div className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-5 sm:gap-6">
              <QuestionCard title="1. What is your biggest bottleneck today?">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: "leads", label: "Lead response" },
                    { k: "docs", label: "PDFs & spreadsheets" },
                    { k: "vendas", label: "Need to sell more" },
                    { k: "conteudo", label: "Content & marketing" },
                    { k: "reunioes", label: "Meetings & reports" },
                    { k: "dev", label: "Dev & technical tasks" },
                    { k: "project", label: "Project management" },
                  ].map((o) => (
                    <button
                      key={o.k}
                      onClick={() => {
                        setAnswers({ ...answers, pain: o.k as PainKey });
                        setStep(Math.max(step, 2));
                      }}
                      className={`text-left px-4 py-3 rounded-lg border transition ${
                        answers.pain === o.k
                          ? "border-primary bg-primary/10 text-foreground shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm">{o.label}</span>
                    </button>
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard title="2. What is your company segment?">
                <input
                  type="text"
                  value={answers.segment}
                  onChange={(e) => setAnswers({ ...answers, segment: e.target.value })}
                  placeholder="e.g. agency, accounting, clinic…"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Agency", "Accounting", "Clinic", "Real Estate", "Consulting", "Coworking", "Developer / Freelancer", "Startup", "E-commerce", "Law Firm", "Education"].map((s) => (
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

              <QuestionCard title="3. Monthly bottleneck volume">
                <SliderRow 
                  icon={<Activity className="w-4 h-4 text-primary" />}
                  label="Tasks / month" 
                  value={answers.volume} 
                  min={10} max={500} step={10} suffix=""
                  onChange={(v) => setAnswers({ ...answers, volume: v })} 
                />
                <SliderRow 
                  icon={<Clock className="w-4 h-4 text-primary" />}
                  label="Manual time per task" 
                  value={answers.manualMin} 
                  min={2} max={240} step={1} suffix=" min"
                  onChange={(v) => setAnswers({ ...answers, manualMin: v })} 
                />
              </QuestionCard>

              <QuestionCard title="4. Hourly cost and team size">
                <SliderRow 
                  icon={<CircleDollarSign className="w-4 h-4 text-primary" />}
                  label="Cost / hour ($)" 
                  value={answers.costHour} 
                  min={20} max={150} step={1} suffix=""
                  onChange={(v) => setAnswers({ ...answers, costHour: v })} 
                />
                <SliderRow 
                  icon={<Users className="w-4 h-4 text-primary" />}
                  label="Team size" 
                  value={answers.teamSize} 
                  min={1} max={50} step={1} suffix=" people"
                  onChange={(v) => setAnswers({ ...answers, teamSize: v })} 
                />
              </QuestionCard>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${answersComplete ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500 animate-pulse'}`} />
                {answersComplete
                  ? "All set — see your result."
                  : "Fill in the fields to unlock the result."}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setAnswers(INITIAL_ANSWERS); setShowResult(false); }}
                  className="px-5 py-2.5 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-sm text-foreground transition"
                >
                  Reset
                </button>
                <button
                  onClick={finishDiagnostic}
                  disabled={!answersComplete}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition glow disabled:opacity-40 disabled:cursor-not-allowed group flex items-center gap-2"
                >
                  See my result 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {showResult && answers.pain && (
          <section ref={resultRef} id="resultado" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>02 — Result</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Your team can free{" "}
              <span className="text-blue-gradient">{totalHours.toFixed(0)}h/month</span>
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Estimate based on the official Apex7AI formula: volume × (manual time − time with Lynx) ÷ 60 × cost/hour. Use as a guiding simulation.
            </p>

            <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              <StatCard label="Hours freed / month" value={`${totalHours.toFixed(0)}h`} sub="Time back to the team" />
              <StatCard label="Monthly savings" value={usd(totalMonthly)} sub="Conservative, no extra revenue" highlight />
              <StatCard label="Annual savings" value={usd(totalMonthly * 12)} sub="12-month projection" />
            </div>

            <div className="mt-8 rounded-2xl border-2 bg-primary/5 p-6 sm:p-7 pulse-glow">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">★ Your custom scenario</div>
                <div className="text-[11px] text-muted-foreground">{percentReduction(custom)}% less time</div>
              </div>
              <div className="mt-2 text-lg sm:text-xl font-medium">{custom.scenario}</div>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Hours/month</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1">{hoursSaved(custom).toFixed(1)}h</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Savings/month</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1 text-blue-gradient">{usd(monthlySavings(custom))}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Savings/year</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1">{usd(yearlySavings(custom))}</div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground">
                Top 3 recommended workflows for you
              </h3>
              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {recommended.map((c) => <CaseCard key={c.flow} c={c} />)}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 text-center">
              <div className="text-xs uppercase tracking-widest text-primary">Next step</div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">
                We recommend the <span className="text-blue-gradient">{PLANS[recommendedPlanIdx].name}</span> plan
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                Based on your estimated savings of <strong className="text-foreground">{usd(totalMonthly)}/mo</strong>.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={goToPlan}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
                >
                  See ideal plan ↓
                </button>
                <a
                  href={PLATFORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
                >
                  Get started with {PLANS[recommendedPlanIdx].name} →
                </a>
              </div>
              <div className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5">
                <span className="text-yellow-400 font-semibold">LAUNCH30</span>
                <span className="text-muted-foreground/70">·</span>
                <span>30% OFF — launch offer</span>
              </div>
            </div>
          </section>
        )}

        <section id="receita-anchor" className="mt-24 sm:mt-32">
          <SectionLabel>03 — ROI Library</SectionLabel>
          <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              <span className="text-blue-gradient tabular-nums">{totalCatalogued}</span> cases calculated.
              <br />
              <span className="text-muted-foreground">External + internal {extraCalcs > 0 && <span className="text-sm font-normal">· +{extraCalcs} from your diagnostic</span>}.</span>
            </h2>
          </div>
          <Library />
        </section>

        <section id="receita" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>04 — Potential Revenue</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Beyond savings: <span className="text-blue-gradient">recovered revenue.</span>
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
          <SectionLabel>05 — Plans</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Choose the size of your operation.
          </h2>
          {showResult && (
            <p className="mt-3 text-sm text-muted-foreground">
              We highlighted the <strong className="text-primary">{PLANS[recommendedPlanIdx].name}</strong> based on your diagnostic.
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
                      Recommended
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">{p.name}</div>
                  <div className="mt-2 text-2xl font-semibold">{p.price}</div>
                  <p className="mt-4 text-sm text-foreground/90">{p.who}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{p.note}</p>
                  <a
                    href={PLATFORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition glow"
                  >
                    Choose {p.name} →
                  </a>
                  <div className="mt-2 text-[10px] text-center text-yellow-400/80">
                    Use <span className="font-semibold">LAUNCH30</span> for 30% OFF
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-24 sm:mt-32 rounded-3xl border border-border bg-card p-8 sm:p-10 md:p-14 text-center card-elev">
          <SectionLabel className="justify-center inline-flex">Restart diagnostic</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">
            Want to simulate another scenario?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Reset answers and recalculate with new numbers. Everything runs in real time, no signup required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startDiagnostic}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
            >
              Redo diagnostic from scratch
            </button>
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
            >
              Go to Lynx Agent →
            </a>
          </div>
          <div className="mt-6 text-xs text-muted-foreground inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5">
            <span className="text-yellow-400 font-semibold">LAUNCH30</span>
            <span className="text-muted-foreground/70">·</span>
            <span>30% OFF — launch offer</span>
          </div>
        </section>

        <footer className="mt-20 sm:mt-24 text-xs text-muted-foreground border-t border-border pt-8 flex justify-between flex-wrap gap-4">
          <div>© Apex7AI — Lynx Agent</div>
          <div>Sources: McKinsey, HBR, InsideSales, Zapier, Stanford/MIT via Axios.</div>
        </footer>
      </main>
    </div>
  );
}

function Header({ onHome, onStart }: { onHome: () => void; onStart: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2.5 group" aria-label="Back to top">
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
            { l: "Diagnostic", id: "diagnostico" },
            { l: "Library", id: "biblioteca" },
            { l: "Revenue", id: "receita" },
            { l: "Plans", id: "planos" },
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
        <div className="flex items-center gap-2">
          <button
            onClick={onStart}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Start
          </button>
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex px-4 py-2 rounded-full border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ onStart, onLibrary, totalCases }: { onStart: () => void; onLibrary: () => void; totalCases: number }) {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/60 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Operational Diagnostic — Lynx Agent
      </div>
      <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
        <span className="text-gradient">Find out how much your team</span>
        <br />
        loses to <span className="text-blue-gradient">manual tasks.</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-2">
        Apex7AI Lynx — the simplest way to turn lost time into hours, money, and recovered revenue.
      </p>
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
        >
          Start diagnostic
        </button>
        <button
          onClick={onLibrary}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-foreground transition"
        >
          View ROI library
        </button>
        <a
          href={PLATFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
        >
          Try Lynx Agent →
        </a>
      </div>
      <div className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5">
        <span className="text-yellow-400 font-semibold">LAUNCH30</span>
        <span className="text-muted-foreground/70">·</span>
        <span>30% OFF — launch offer</span>
      </div>
      <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {[
          { k: `${totalCases}`, v: "cases calculated" },
          { k: "2 lines", v: "external + internal" },
          { k: "ROI", v: "time + money" },
          { k: "Sources", v: "market + diagnostic" },
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
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-elev relative overflow-hidden group">
      <div className="text-sm font-medium text-foreground/90 mb-6 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-primary" />
        {title}
      </div>
      {children}
    </div>
  );
}

function SliderRow({
  icon, label, value, min, max, step, suffix, onChange,
}: {
  icon?: React.ReactNode; label: string; value: number; min: number; max: number; step: number; suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-6 last:mb-0 group/slider">
      <div className="flex justify-between text-xs text-muted-foreground mb-3 items-center">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-primary font-bold tabular-nums px-2 py-1 rounded bg-primary/10 border border-primary/20">
          {value}{suffix}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-modern w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer focus:outline-none"
        />
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[10px] text-muted-foreground/50">{min}{suffix}</span>
        <span className="text-[10px] text-muted-foreground/50">{max}{suffix}</span>
      </div>
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
    <div className="rounded-2xl border border-border bg-card p-6 card-elev hover:border-primary/50 transition group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{c.area}</span>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{percentReduction(c)}% less time</span>
      </div>
      <div className="mt-3 text-lg font-medium leading-snug group-hover:text-primary transition-colors">{c.flow}</div>
      <p className="mt-2 text-xs text-muted-foreground">{c.scenario}</p>
      <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">h/mo</div>
          <div className="text-base font-semibold mt-1">{hoursSaved(c).toFixed(1)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">/mo</div>
          <div className="text-base font-semibold mt-1">{usd(monthlySavings(c))}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">/yr</div>
          <div className="text-base font-semibold mt-1 text-blue-gradient">{usd(yearlySavings(c))}</div>
        </div>
      </div>
    </div>
  );
}

function Library() {
  const [tab, setTab] = useState<"External" | "Internal">("External");
  const list = CASES.filter((c) => c.area === tab);
  return (
    <div id="biblioteca" className="mt-8 scroll-mt-24">
      <div className="inline-flex bg-secondary/60 border border-border rounded-full p-1">
        {(["External", "Internal"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-sm transition font-medium ${
              tab === t ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
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
