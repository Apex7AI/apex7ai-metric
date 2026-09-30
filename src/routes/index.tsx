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
  Globe2,
} from "lucide-react";
import {
  CASES,
  REVENUE_CASES,
  hoursSaved,
  monthlySavings,
  percentReduction,
  yearlySavings,
  type Category,
  type RoiCase,
} from "@/lib/diagnostic-data";
import {
  formatUsd,
  getCopy,
  getLocalizedPlans,
  localizeCase,
  localizeRevenueCase,
  type Locale,
} from "@/lib/i18n";

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
  { idx: 0, max: 800 }, // Plus
  { idx: 1, max: 3000 }, // Pro
  { idx: 2, max: 12000 }, // Ultra
  { idx: 3, max: Infinity }, // Custom
];

const PLATFORM_URL = "https://lynx.apex7ai.com/auth";

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function Index() {
  const [locale, setLocale] = useState<Locale>("en");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [showResult, setShowResult] = useState(false);
  const [flashPlan, setFlashPlan] = useState(false);
  const [extraCalcs, setExtraCalcs] = useState(0);
  const resultRef = useRef<HTMLElement | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);
  const copy = getCopy(locale);
  const plans = getLocalizedPlans(locale);

  useEffect(() => {
    const stored = Number(localStorage.getItem("apex7_calc_count") || "0");
    if (!Number.isNaN(stored)) setExtraCalcs(stored);

    const storedLocale = localStorage.getItem("apex7_locale");
    if (storedLocale === "en" || storedLocale === "pt") {
      setLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    document.title = copy.pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy.pageDescription);
  }, [copy.pageDescription, copy.pageTitle, locale]);

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
      flow: copy.customFlow,
      scenario:
        locale === "pt"
          ? `${answers.volume} tarefas/mês • ${answers.manualMin}min manuais • ~${agentMin}min com Lynx`
          : `${answers.volume} tasks/month • ${answers.manualMin}min manual • ~${agentMin}min with Lynx`,
      volumeMonthly: answers.volume,
      manualMin: answers.manualMin,
      agentMin,
      costHour: answers.costHour,
      categories: [],
    };
  }, [answers, copy.customFlow, locale]);

  const totalMonthly =
    recommended.reduce((s, c) => s + monthlySavings(c), 0) + monthlySavings(custom);
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
      try {
        localStorage.setItem("apex7_calc_count", String(next));
      } catch {
        // The calculation still works when browser storage is unavailable.
      }
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
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [showResult]);

  const answersComplete = !!answers.pain && answers.segment.trim().length > 0;

  const changeLocale = (nextLocale: Locale) => {
    const nextCopy = getCopy(nextLocale);
    const currentSegments: string[] = [
      copy.segmentAgency,
      copy.segmentAccounting,
      copy.segmentClinic,
      copy.segmentRealEstate,
      copy.segmentConsulting,
      copy.segmentCoworking,
      copy.segmentDeveloper,
      copy.segmentStartup,
      copy.segmentEcommerce,
      copy.segmentLaw,
      copy.segmentEducation,
    ];
    const nextSegments: string[] = [
      nextCopy.segmentAgency,
      nextCopy.segmentAccounting,
      nextCopy.segmentClinic,
      nextCopy.segmentRealEstate,
      nextCopy.segmentConsulting,
      nextCopy.segmentCoworking,
      nextCopy.segmentDeveloper,
      nextCopy.segmentStartup,
      nextCopy.segmentEcommerce,
      nextCopy.segmentLaw,
      nextCopy.segmentEducation,
    ];
    const selectedSegmentIndex = currentSegments.indexOf(answers.segment);

    if (selectedSegmentIndex >= 0) {
      setAnswers((current) => ({
        ...current,
        segment: nextSegments[selectedSegmentIndex],
      }));
    }

    setLocale(nextLocale);
    try {
      localStorage.setItem("apex7_locale", nextLocale);
    } catch {
      // The language switch still works when browser storage is unavailable.
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-x-0 top-0 h-[900px]"
          style={{ background: "var(--gradient-hero)" }}
        />
      </div>

      <Header
        locale={locale}
        onLocaleChange={changeLocale}
        onHome={goHome}
        onStart={startDiagnostic}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-32">
        <Hero
          locale={locale}
          onStart={startDiagnostic}
          onLibrary={() => smoothScrollTo("biblioteca")}
          totalCases={totalCatalogued}
        />

        {step >= 1 && (
          <section id="diagnostico" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>{copy.diagnosticSection}</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
              {copy.diagnosticTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{copy.diagnosticBody}</p>

            <div className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-5 sm:gap-6">
              <QuestionCard title={copy.questionBottleneck}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: "leads", label: copy.painLeads },
                    { k: "docs", label: copy.painDocs },
                    { k: "vendas", label: copy.painSales },
                    { k: "conteudo", label: copy.painContent },
                    { k: "reunioes", label: copy.painMeetings },
                    { k: "dev", label: copy.painDev },
                    { k: "project", label: copy.painProject },
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

              <QuestionCard title={copy.questionSegment}>
                <input
                  type="text"
                  value={answers.segment}
                  onChange={(e) => setAnswers({ ...answers, segment: e.target.value })}
                  placeholder={copy.segmentPlaceholder}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    copy.segmentAgency,
                    copy.segmentAccounting,
                    copy.segmentClinic,
                    copy.segmentRealEstate,
                    copy.segmentConsulting,
                    copy.segmentCoworking,
                    copy.segmentDeveloper,
                    copy.segmentStartup,
                    copy.segmentEcommerce,
                    copy.segmentLaw,
                    copy.segmentEducation,
                  ].map((s) => (
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

              <QuestionCard title={copy.questionVolume}>
                <SliderRow
                  icon={<Activity className="w-4 h-4 text-primary" />}
                  label={copy.tasksMonth}
                  value={answers.volume}
                  min={10}
                  max={500}
                  step={10}
                  suffix=""
                  onChange={(v) => setAnswers({ ...answers, volume: v })}
                />
                <SliderRow
                  icon={<Clock className="w-4 h-4 text-primary" />}
                  label={copy.manualTime}
                  value={answers.manualMin}
                  min={2}
                  max={240}
                  step={1}
                  suffix={copy.minuteSuffix}
                  onChange={(v) => setAnswers({ ...answers, manualMin: v })}
                />
              </QuestionCard>

              <QuestionCard title={copy.questionCost}>
                <SliderRow
                  icon={<CircleDollarSign className="w-4 h-4 text-primary" />}
                  label={copy.costHour}
                  value={answers.costHour}
                  min={20}
                  max={150}
                  step={1}
                  suffix=""
                  onChange={(v) => setAnswers({ ...answers, costHour: v })}
                />
                <SliderRow
                  icon={<Users className="w-4 h-4 text-primary" />}
                  label={copy.teamSize}
                  value={answers.teamSize}
                  min={1}
                  max={50}
                  step={1}
                  suffix={copy.peopleSuffix}
                  onChange={(v) => setAnswers({ ...answers, teamSize: v })}
                />
              </QuestionCard>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${answersComplete ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-orange-500 animate-pulse"}`}
                />
                {answersComplete ? copy.ready : copy.incomplete}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAnswers(INITIAL_ANSWERS);
                    setShowResult(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-sm text-foreground transition"
                >
                  {copy.reset}
                </button>
                <button
                  onClick={finishDiagnostic}
                  disabled={!answersComplete}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition glow disabled:opacity-40 disabled:cursor-not-allowed group flex items-center gap-2"
                >
                  {copy.seeResult}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {showResult && answers.pain && (
          <section ref={resultRef} id="resultado" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>{copy.resultSection}</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              {copy.resultTitle1}{" "}
              <span className="text-blue-gradient">
                {totalHours.toFixed(0)}
                {copy.resultTitle2}
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{copy.resultBody}</p>

            <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              <StatCard
                label={copy.hoursFreed}
                value={`${totalHours.toFixed(0)}h`}
                sub={copy.timeBack}
              />
              <StatCard
                label={copy.monthlySavings}
                value={formatUsd(totalMonthly, locale)}
                sub={copy.conservative}
                highlight
              />
              <StatCard
                label={copy.annualSavings}
                value={formatUsd(totalMonthly * 12, locale)}
                sub={copy.twelveMonths}
              />
            </div>

            <div className="mt-8 rounded-2xl border-2 bg-primary/5 p-6 sm:p-7 pulse-glow">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                  {copy.customScenario}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {percentReduction(custom)}% {copy.lessTime}
                </div>
              </div>
              <div className="mt-2 text-lg sm:text-xl font-medium">{custom.scenario}</div>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">{copy.hoursMonth}</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1">
                    {hoursSaved(custom).toFixed(1)}h
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">{copy.savingsMonth}</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1 text-blue-gradient">
                    {formatUsd(monthlySavings(custom), locale)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">{copy.savingsYear}</div>
                  <div className="text-xl sm:text-2xl font-semibold mt-1">
                    {formatUsd(yearlySavings(custom), locale)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground">
                {copy.recommendedWorkflows}
              </h3>
              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {recommended.map((c) => (
                  <CaseCard key={c.flow} c={localizeCase(c, locale)} locale={locale} />
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 text-center">
              <div className="text-xs uppercase tracking-widest text-primary">{copy.nextStep}</div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">
                {copy.recommendPlan1}{" "}
                <span className="text-blue-gradient">{plans[recommendedPlanIdx].name}</span>{" "}
                {copy.recommendPlan2}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                {copy.basedOnSavings}{" "}
                <strong className="text-foreground">
                  {formatUsd(totalMonthly, locale)}
                  {copy.perMonth}
                </strong>
                .
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={goToPlan}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
                >
                  {copy.seeIdealPlan}
                </button>
                <a
                  href={PLATFORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
                >
                  {copy.getStartedWith} {plans[recommendedPlanIdx].name} →
                </a>
              </div>
              <div className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5">
                <span className="text-yellow-400 font-semibold">LAUNCH30</span>
                <span className="text-muted-foreground/70">·</span>
                <span>{copy.launchOffer}</span>
              </div>
            </div>
          </section>
        )}

        <section id="receita-anchor" className="mt-24 sm:mt-32">
          <SectionLabel>{copy.librarySection}</SectionLabel>
          <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              <span className="text-blue-gradient tabular-nums">{totalCatalogued}</span>{" "}
              {copy.calculatedPeriod}
              <br />
              <span className="text-muted-foreground">
                {copy.externalPlusInternal}{" "}
                {extraCalcs > 0 && (
                  <span className="text-sm font-normal">
                    · +{extraCalcs} {copy.fromDiagnostic}
                  </span>
                )}
                .
              </span>
            </h2>
          </div>
          <Library locale={locale} />
        </section>

        <section id="receita" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>{copy.revenueSection}</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {copy.revenueTitle1} <span className="text-blue-gradient">{copy.revenueTitle2}</span>
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {REVENUE_CASES.map((source) => {
              const r = localizeRevenueCase(source, locale);
              return (
                <div
                  key={r.flow}
                  className="rounded-2xl border border-border bg-card p-6 card-elev"
                >
                  <div className="text-base font-medium">{r.flow}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.scenario}</p>
                  <div className="mt-5 flex items-baseline gap-3">
                    <div className="text-2xl font-semibold text-blue-gradient">{r.monthly}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{r.yearly}</div>
                  <p className="mt-4 text-xs text-muted-foreground/80 border-t border-border pt-3">
                    {r.note}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section ref={planRef} id="planos" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>{copy.plansSection}</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {copy.plansTitle}
          </h2>
          {showResult && (
            <p className="mt-3 text-sm text-muted-foreground">
              {copy.highlightedPlan1}{" "}
              <strong className="text-primary">{plans[recommendedPlanIdx].name}</strong>{" "}
              {copy.highlightedPlan2}
            </p>
          )}
          <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p, i) => {
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
                      {copy.recommended}
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
                    {copy.choose} {p.name} →
                  </a>
                  <div className="mt-2 text-[10px] text-center text-yellow-400/80">
                    {copy.couponInstruction} <span className="font-semibold">LAUNCH30</span>{" "}
                    {copy.couponFor}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-24 sm:mt-32 rounded-3xl border border-border bg-card p-8 sm:p-10 md:p-14 text-center card-elev">
          <SectionLabel className="justify-center inline-flex">{copy.restartLabel}</SectionLabel>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">
            {copy.restartTitle}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">{copy.restartBody}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startDiagnostic}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
            >
              {copy.redo}
            </button>
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
            >
              {copy.goToLynx}
            </a>
          </div>
          <div className="mt-6 text-xs text-muted-foreground inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5">
            <span className="text-yellow-400 font-semibold">LAUNCH30</span>
            <span className="text-muted-foreground/70">·</span>
            <span>{copy.launchOffer}</span>
          </div>
        </section>

        <footer className="mt-20 sm:mt-24 text-xs text-muted-foreground border-t border-border pt-8 flex justify-between flex-wrap gap-4">
          <div>© Apex7AI — Lynx Agent</div>
          <div>{copy.footerSources}</div>
        </footer>
      </main>
    </div>
  );
}

function Header({
  locale,
  onLocaleChange,
  onHome,
  onStart,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onHome: () => void;
  onStart: () => void;
}) {
  const copy = getCopy(locale);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onHome}
          className="flex items-center gap-2.5 group"
          aria-label={copy.backToTop}
        >
          <img
            src={logoGif}
            alt="Apex7AI"
            className="h-9 w-9 rounded-md object-cover ring-1 ring-primary/40 group-hover:ring-primary transition"
          />
          <div className="font-semibold tracking-tight">
            Apex7AI{" "}
            <span className="text-muted-foreground font-normal hidden sm:inline">/ Lynx</span>
          </div>
        </button>
        <nav className="hidden lg:flex items-center gap-1 text-sm bg-secondary/60 border border-border rounded-full px-1 py-1">
          {[
            { l: copy.navDiagnostic, id: "diagnostico" },
            { l: copy.navLibrary, id: "biblioteca" },
            { l: copy.navRevenue, id: "receita" },
            { l: copy.navPlans, id: "planos" },
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
          <div
            className="inline-flex items-center gap-0.5 rounded-full border border-border bg-secondary/80 p-1"
            role="group"
            aria-label={copy.languageLabel}
          >
            <Globe2 className="ml-1 mr-0.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {(["en", "pt"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onLocaleChange(option)}
                aria-pressed={locale === option}
                aria-label={option === "pt" ? "Português" : "English"}
                className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase transition ${
                  locale === option
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={onStart}
            className="hidden sm:inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            {copy.start}
          </button>
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex px-4 py-2 rounded-full border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10 transition"
          >
            {copy.getStarted}
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({
  locale,
  onStart,
  onLibrary,
  totalCases,
}: {
  locale: Locale;
  onStart: () => void;
  onLibrary: () => void;
  totalCases: number;
}) {
  const copy = getCopy(locale);

  return (
    <section className="pt-20 sm:pt-24 md:pt-32 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/60 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        {copy.heroBadge}
      </div>
      <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
        <span className="text-gradient">{copy.heroTitle1}</span>
        <br />
        <span className="text-blue-gradient">{copy.heroTitle2}</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-2">
        {copy.heroBody}
      </p>
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
        >
          {copy.startDiagnostic}
        </button>
        <button
          onClick={onLibrary}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-foreground transition"
        >
          {copy.viewLibrary}
        </button>
        <a
          href={PLATFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
        >
          {copy.tryLynx}
        </a>
      </div>
      <div className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5">
        <span className="text-yellow-400 font-semibold">LAUNCH30</span>
        <span className="text-muted-foreground/70">·</span>
        <span>{copy.launchOffer}</span>
      </div>
      <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {[
          { k: `${totalCases}`, v: copy.casesCalculated },
          { k: copy.twoLines, v: copy.externalInternal },
          { k: copy.roi, v: copy.timeMoney },
          { k: copy.sources, v: copy.marketDiagnostic },
        ].map((s) => (
          <div
            key={s.k}
            className="rounded-xl border border-border bg-card/60 p-4 text-left card-elev"
          >
            <div className="text-xl font-semibold text-blue-gradient">{s.k}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary ${className}`}
    >
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
  icon,
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
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
          {value}
          {suffix}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-modern w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer focus:outline-none"
        />
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[10px] text-muted-foreground/50">
          {min}
          {suffix}
        </span>
        <span className="text-[10px] text-muted-foreground/50">
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border card-elev ${highlight ? "border-primary bg-primary/5 glow" : "border-border bg-card"}`}
    >
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        className={`mt-3 text-3xl sm:text-4xl font-semibold ${highlight ? "text-blue-gradient" : ""}`}
      >
        {value}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}

function CaseCard({ c, locale }: { c: RoiCase; locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-elev hover:border-primary/50 transition group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
          {c.area === "External" ? copy.external : copy.internal}
        </span>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {percentReduction(c)}% {copy.lessTime}
        </span>
      </div>
      <div className="mt-3 text-lg font-medium leading-snug group-hover:text-primary transition-colors">
        {c.flow}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{c.scenario}</p>
      <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{copy.hourMonthShort}</div>
          <div className="text-base font-semibold mt-1">{hoursSaved(c).toFixed(1)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{copy.monthShort}</div>
          <div className="text-base font-semibold mt-1">{formatUsd(monthlySavings(c), locale)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{copy.yearShort}</div>
          <div className="text-base font-semibold mt-1 text-blue-gradient">
            {formatUsd(yearlySavings(c), locale)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Library({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState<"External" | "Internal">("External");
  const list = CASES.filter((c) => c.area === tab);
  const copy = getCopy(locale);
  return (
    <div id="biblioteca" className="mt-8 scroll-mt-24">
      <div className="inline-flex bg-secondary/60 border border-border rounded-full p-1">
        {(["External", "Internal"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-sm transition font-medium ${
              tab === t
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "External" ? copy.external : copy.internal} (
            {CASES.filter((c) => c.area === t).length})
          </button>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <CaseCard key={c.flow} c={localizeCase(c, locale)} locale={locale} />
        ))}
      </div>
    </div>
  );
}
