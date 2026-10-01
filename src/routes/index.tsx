import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import logoGif from "@/assets/apex7ai-logo.gif";
import {
  Activity,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Headphones,
  Megaphone,
  Search,
  Share2,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  CASES,
  REVENUE_CASES,
  hoursSaved,
  monthlySavings,
  percentReduction,
  yearlySavings,
  type RoiCase,
} from "@/lib/diagnostic-data";
import {
  getCopy,
  getLocalizedPlans,
  localizeCase,
  localizeRevenueCase,
  type Locale,
} from "@/lib/i18n";
import {
  WORKFLOW_CATEGORIES,
  WORKFLOW_TASKS,
  buildWorkflowPrompt,
  getLegacyCaseCategory,
  getWorkflowCategory,
  getWorkflowTask,
  localize,
  type WorkflowCategoryId,
  type WorkflowTask,
} from "@/lib/workflow-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LynxMetric — AI Workflow Diagnostic | Apex7 AI" },
      {
        name: "description",
        content:
          "Find the work your team should stop doing manually and get a ready-to-run Lynx workflow.",
      },
    ],
  }),
});

type Currency = "BRL" | "USD";

interface Answers {
  categoryId: WorkflowCategoryId | null;
  taskId: string | null;
  segment: string;
  volume: number;
  costHour: number;
  manualMin: number;
  teamSize: number;
  currency: Currency;
}

const INITIAL_ANSWERS: Answers = {
  categoryId: null,
  taskId: null,
  segment: "",
  volume: 20,
  costHour: 35,
  manualMin: 45,
  teamSize: 3,
  currency: "USD",
};

const PLAN_HOUR_THRESHOLDS = [
  { idx: 0, max: 5 },
  { idx: 1, max: 20 },
  { idx: 2, max: 60 },
  { idx: 3, max: Infinity },
];

const PLATFORM_URL = "https://lynx.apex7ai.com/auth";
const TALLY_FORM_ID = "zxvPzR";
const TALLY_FORM_URL = `https://tally.so/r/${TALLY_FORM_ID}`;
const CALENDAR_URL = "https://calendar.app.google/D7ba1qfmg8gq71fu5";

interface Attribution {
  source: string;
  medium: string;
  campaign: string;
}

const DEFAULT_ATTRIBUTION: Attribution = {
  source: "direct",
  medium: "website",
  campaign: "lynxmetric",
};

function boundedNumber(
  params: URLSearchParams,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const value = Number(params.get(key));
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function formatMoney(value: number, currency: Currency, locale: Locale) {
  return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatHours(value: number, locale: Locale) {
  return value.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", {
    minimumFractionDigits: value < 10 ? 1 : 0,
    maximumFractionDigits: 1,
  });
}

function rangeLabel(min: number, max: number, locale: Locale, suffix = "") {
  return `${formatHours(min, locale)}–${formatHours(max, locale)}${suffix}`;
}

function Index() {
  const [locale, setLocale] = useState<Locale>("en");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [promptDraft, setPromptDraft] = useState("");
  const [attribution, setAttribution] = useState<Attribution>(DEFAULT_ATTRIBUTION);
  const resultRef = useRef<HTMLElement | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);
  const copy = getCopy(locale);
  const plans = getLocalizedPlans(locale);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storedLocale = localStorage.getItem("apex7_locale");
    const queryLocale = params.get("lang");
    const initialLocale: Locale =
      queryLocale === "en" || queryLocale === "pt"
        ? queryLocale
        : storedLocale === "en" || storedLocale === "pt"
        ? storedLocale
        : navigator.language.toLowerCase().startsWith("pt")
          ? "pt"
          : "en";

    setLocale(initialLocale);
    setAttribution({
      source: params.get("utm_source") || DEFAULT_ATTRIBUTION.source,
      medium: params.get("utm_medium") || DEFAULT_ATTRIBUTION.medium,
      campaign: params.get("utm_campaign") || DEFAULT_ATTRIBUTION.campaign,
    });

    const sharedTask = params.get("result") === "1" ? getWorkflowTask(params.get("task")) : null;
    if (sharedTask) {
      const sharedCurrency: Currency = params.get("currency") === "BRL" ? "BRL" : "USD";
      setAnswers({
        categoryId: sharedTask.categoryId,
        taskId: sharedTask.id,
        segment: "",
        volume: boundedNumber(params, "volume", sharedTask.defaultVolume, 1, 500),
        costHour: boundedNumber(
          params,
          "cost_hour",
          sharedCurrency === "BRL" ? 60 : 35,
          10,
          500,
        ),
        manualMin: boundedNumber(
          params,
          "manual_min",
          sharedTask.defaultManualMin,
          2,
          600,
        ),
        teamSize: boundedNumber(params, "team_size", 3, 1, 50),
        currency: sharedCurrency,
      });
      setStarted(true);
      setShowResult(true);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        160,
      );
    } else if (initialLocale === "pt") {
      setAnswers((current) => ({ ...current, currency: "BRL", costHour: 60 }));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    document.title = copy.pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy.pageDescription);
  }, [copy.pageDescription, copy.pageTitle, locale]);

  useEffect(() => {
    if (!leadFormOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLeadFormOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [leadFormOpen]);

  const selectedCategory = getWorkflowCategory(answers.categoryId);
  const selectedTask = getWorkflowTask(answers.taskId);
  const categoryTasks = answers.categoryId
    ? WORKFLOW_TASKS.filter((task) => task.categoryId === answers.categoryId)
    : [];

  const metrics = useMemo(() => {
    if (!selectedTask) {
      return {
        manualHours: 0,
        timeMin: 0,
        timeMax: 0,
        savingsMin: 0,
        savingsMax: 0,
        lynxMin: 0,
        lynxMax: 0,
        score: 0,
      };
    }

    const manualHours = (answers.volume * answers.manualMin) / 60;
    const [reductionMin, reductionMax] = selectedTask.reductionRange;
    const timeMin = manualHours * (reductionMin / 100);
    const timeMax = manualHours * (reductionMax / 100);
    const workloadScore = Math.min(100, 35 + manualHours * 2.2);
    const score = Math.round(selectedTask.fit * 0.72 + workloadScore * 0.28);

    return {
      manualHours,
      timeMin,
      timeMax,
      savingsMin: timeMin * answers.costHour,
      savingsMax: timeMax * answers.costHour,
      lynxMin: Math.max(1, Math.round(answers.manualMin * (1 - reductionMax / 100))),
      lynxMax: Math.max(1, Math.round(answers.manualMin * (1 - reductionMin / 100))),
      score: Math.min(99, score),
    };
  }, [answers.costHour, answers.manualMin, answers.volume, selectedTask]);

  const relatedTasks = useMemo(() => {
    if (!selectedTask) return [];
    return WORKFLOW_TASKS.filter(
      (task) => task.categoryId === selectedTask.categoryId && task.id !== selectedTask.id,
    ).slice(0, 3);
  }, [selectedTask]);

  const generatedPrompt = useMemo(() => {
    if (!selectedTask) return "";
    return buildWorkflowPrompt(selectedTask, locale, {
      volume: answers.volume,
      segment: answers.segment,
      teamSize: answers.teamSize,
    });
  }, [answers.segment, answers.teamSize, answers.volume, locale, selectedTask]);

  useEffect(() => {
    if (showResult) setPromptDraft(generatedPrompt);
  }, [generatedPrompt, showResult]);

  const recommendedPlanIdx = useMemo(() => {
    const match = PLAN_HOUR_THRESHOLDS.find((threshold) => metrics.timeMin < threshold.max);
    return match?.idx ?? 0;
  }, [metrics.timeMin]);

  const tallyParams = useMemo(() => {
    if (!selectedTask || !selectedCategory) return new URLSearchParams();

    return new URLSearchParams({
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      locale,
      category: selectedCategory.id,
      category_label: localize(selectedCategory.title, locale),
      task: selectedTask.id,
      task_label: localize(selectedTask.title, locale),
      workflow_id: selectedTask.id,
      volume: String(answers.volume),
      manual_minutes: String(answers.manualMin),
      team_size: String(answers.teamSize),
      currency: answers.currency,
      opportunity_score: String(metrics.score),
      manual_hours: metrics.manualHours.toFixed(1),
      hours_low: metrics.timeMin.toFixed(1),
      hours_high: metrics.timeMax.toFixed(1),
      savings_low: Math.round(metrics.savingsMin).toString(),
      savings_high: Math.round(metrics.savingsMax).toString(),
      recommended_plan: plans[recommendedPlanIdx]?.name ?? "Free",
    });
  }, [
    answers.currency,
    answers.manualMin,
    answers.teamSize,
    answers.volume,
    attribution.campaign,
    attribution.medium,
    attribution.source,
    locale,
    metrics.manualHours,
    metrics.savingsMax,
    metrics.savingsMin,
    metrics.score,
    metrics.timeMax,
    metrics.timeMin,
    plans,
    recommendedPlanIdx,
    selectedCategory,
    selectedTask,
  ]);

  const tallyUrl = useMemo(() => {
    const query = tallyParams.toString();
    return query ? `${TALLY_FORM_URL}?${query}` : TALLY_FORM_URL;
  }, [tallyParams]);

  const tallyEmbedUrl = useMemo(() => {
    const params = new URLSearchParams(tallyParams);
    params.set("alignLeft", "1");
    params.set("hideTitle", "1");
    params.set("transparentBackground", "1");
    params.set("dynamicHeight", "1");
    return `https://tally.so/embed/${TALLY_FORM_ID}?${params.toString()}`;
  }, [tallyParams]);

  const answersComplete = !!selectedCategory && !!selectedTask;

  const startDiagnostic = () => {
    trackEvent("diagnostic_started", {
      locale,
      source: attribution.source,
      campaign: attribution.campaign,
    });
    setStarted(true);
    setAnswers(
      locale === "pt" ? { ...INITIAL_ANSWERS, currency: "BRL", costHour: 60 } : INITIAL_ANSWERS,
    );
    setShowResult(false);
    setCopied(false);
    setShareCopied(false);
    setTimeout(() => smoothScrollTo("diagnostico"), 60);
  };

  const chooseCategory = (categoryId: WorkflowCategoryId) => {
    trackEvent("category_selected", {
      category_id: categoryId,
      locale,
      source: attribution.source,
    });
    setStarted(true);
    setAnswers((current) => ({ ...current, categoryId, taskId: null }));
    setShowResult(false);
    setCopied(false);
    setShareCopied(false);
    setTimeout(() => smoothScrollTo("diagnostic-task"), 120);
  };

  const chooseTask = (task: WorkflowTask) => {
    trackEvent("task_selected", {
      category_id: task.categoryId,
      task_id: task.id,
      locale,
      source: attribution.source,
    });
    setAnswers((current) => ({
      ...current,
      categoryId: task.categoryId,
      taskId: task.id,
      volume: task.defaultVolume,
      manualMin: task.defaultManualMin,
    }));
    setShowResult(false);
    setCopied(false);
    setShareCopied(false);
    setTimeout(() => smoothScrollTo("diagnostic-details"), 120);
  };

  const finishDiagnostic = () => {
    if (!answersComplete) return;
    trackEvent("diagnostic_completed", {
      category_id: selectedCategory?.id,
      task_id: selectedTask?.id,
      locale,
      currency: answers.currency,
      opportunity_score: metrics.score,
      team_size: answers.teamSize,
      source: attribution.source,
      campaign: attribution.campaign,
    });
    setShowResult(true);
    setCopied(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const selectRelatedTask = (task: WorkflowTask) => {
    chooseTask(task);
  };

  const copyPrompt = async (origin: "button" | "lynx" = "button") => {
    try {
      await navigator.clipboard.writeText(promptDraft);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = promptDraft;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    trackEvent("prompt_copied", {
      category_id: selectedCategory?.id,
      task_id: selectedTask?.id,
      locale,
      origin,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const runInLynx = async () => {
    window.open(PLATFORM_URL, "_blank", "noopener,noreferrer");
    await copyPrompt("lynx");
    trackEvent("lynx_clicked", {
      category_id: selectedCategory?.id,
      task_id: selectedTask?.id,
      locale,
      opportunity_score: metrics.score,
    });
  };

  const buildShareUrl = () => {
    if (!selectedTask) return window.location.href;

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("result", "1");
    url.searchParams.set("lang", locale);
    url.searchParams.set("task", selectedTask.id);
    url.searchParams.set("volume", String(answers.volume));
    url.searchParams.set("manual_min", String(answers.manualMin));
    url.searchParams.set("cost_hour", String(answers.costHour));
    url.searchParams.set("team_size", String(answers.teamSize));
    url.searchParams.set("currency", answers.currency);
    url.searchParams.set("utm_source", "shared_result");
    url.searchParams.set("utm_medium", "share");
    url.searchParams.set("utm_campaign", attribution.campaign);
    return url.toString();
  };

  const shareResult = async () => {
    const shareUrl = buildShareUrl();
    const shareData = {
      title: copy.pageTitle,
      text:
        locale === "pt"
          ? `Meu diagnóstico LynxMetric: ${localize(selectedTask?.title ?? { en: "", pt: "" }, locale)}.`
          : `My LynxMetric diagnostic: ${localize(selectedTask?.title ?? { en: "", pt: "" }, locale)}.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2400);
      }
      trackEvent("result_shared", {
        category_id: selectedCategory?.id,
        task_id: selectedTask?.id,
        locale,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2400);
    }
  };

  const printResult = () => {
    trackEvent("result_pdf_clicked", {
      category_id: selectedCategory?.id,
      task_id: selectedTask?.id,
      locale,
    });
    window.print();
  };

  const openLeadForm = () => {
    trackEvent("lead_form_opened", {
      category_id: selectedCategory?.id,
      task_id: selectedTask?.id,
      locale,
      opportunity_score: metrics.score,
      source: attribution.source,
    });
    setLeadFormOpen(true);
  };

  const trackMeetingClick = () => {
    trackEvent("meeting_clicked", {
      category_id: selectedCategory?.id,
      task_id: selectedTask?.id,
      locale,
      opportunity_score: metrics.score,
      source: attribution.source,
    });
  };

  const changeLocale = (nextLocale: Locale) => {
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
    const nextCopy = getCopy(nextLocale);
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
    const segmentIndex = currentSegments.indexOf(answers.segment);
    if (segmentIndex >= 0) {
      setAnswers((current) => ({ ...current, segment: nextSegments[segmentIndex] }));
    }
    setLocale(nextLocale);
    localStorage.setItem("apex7_locale", nextLocale);
    trackEvent("language_changed", { locale: nextLocale });
  };

  const goHome = () => {
    setStarted(false);
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          totalCases={CASES.length}
        />

        {started && (
          <section id="diagnostico" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>{copy.diagnosticSection}</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
              {copy.diagnosticTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">{copy.diagnosticBody}</p>

            <div
              className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5"
              aria-live="polite"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div className="text-sm font-medium">{copy.progressTitle}</div>
                <div className="text-xs text-muted-foreground">{copy.progressHint}</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    step: "1",
                    label: copy.progressArea,
                    value: selectedCategory
                      ? localize(selectedCategory.title, locale)
                      : copy.pendingChoice,
                    complete: !!selectedCategory,
                  },
                  {
                    step: "2",
                    label: copy.progressTask,
                    value: selectedTask ? localize(selectedTask.title, locale) : copy.pendingChoice,
                    complete: !!selectedTask,
                  },
                  {
                    step: "3",
                    label: copy.progressVolume,
                    value: selectedTask
                      ? `${answers.volume} ${localize(selectedTask.unit, locale)} · ${answers.manualMin}${copy.minuteSuffix}`
                      : copy.pendingChoice,
                    complete: !!selectedTask,
                  },
                  {
                    step: "4",
                    label: copy.progressContext,
                    value: selectedTask
                      ? `${formatMoney(answers.costHour, answers.currency, locale)}/h · ${answers.teamSize}${copy.peopleSuffix}`
                      : copy.pendingChoice,
                    complete: !!selectedTask,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`rounded-xl border p-3 ${
                      item.complete
                        ? "border-primary/30 bg-background/60"
                        : "border-border bg-background/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                          item.complete
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {item.complete ? <Check className="h-3 w-3" /> : item.step}
                      </span>
                      {item.label}
                    </div>
                    <div
                      className={`mt-2 truncate text-xs font-medium ${
                        item.complete ? "text-foreground" : "text-muted-foreground"
                      }`}
                      title={item.value}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 sm:mt-10">
              <QuestionCard title={copy.questionArea}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {WORKFLOW_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => chooseCategory(category.id)}
                      className={`rounded-xl border p-4 text-left transition min-h-36 ${
                        answers.categoryId === category.id
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.16)]"
                          : "border-border bg-secondary/30 hover:border-primary/60 hover:bg-secondary/60"
                      }`}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CategoryIcon id={category.id} className="h-4 w-4" />
                      </span>
                      <span className="mt-3 block text-sm font-medium">
                        {localize(category.title, locale)}
                      </span>
                      <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                        {localize(category.description, locale)}
                      </span>
                    </button>
                  ))}
                </div>
              </QuestionCard>
            </div>

            <div id="diagnostic-task" className="mt-5 scroll-mt-24">
              <QuestionCard title={copy.questionTask}>
                {selectedCategory ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryTasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => chooseTask(task)}
                        className={`rounded-xl border p-4 text-left transition ${
                          answers.taskId === task.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/30 hover:border-primary/60"
                        }`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="text-sm font-medium leading-snug">
                            {localize(task.title, locale)}
                          </span>
                          {answers.taskId === task.id && (
                            <Check className="h-4 w-4 shrink-0 text-primary" />
                          )}
                        </span>
                        <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                          {localize(task.description, locale)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-8 text-center text-sm text-muted-foreground">
                    {copy.chooseAreaFirst}
                  </div>
                )}
              </QuestionCard>
            </div>

            {selectedTask && (
              <div id="diagnostic-details" className="mt-5 grid scroll-mt-24 md:grid-cols-2 gap-5">
                <QuestionCard title={copy.questionVolume}>
                  <SliderRow
                    icon={<Activity className="w-4 h-4 text-primary" />}
                    label={`${copy.tasksMonth} (${localize(selectedTask.unit, locale)})`}
                    value={answers.volume}
                    min={1}
                    max={500}
                    step={1}
                    suffix=""
                    onChange={(volume) => setAnswers((current) => ({ ...current, volume }))}
                  />
                  <SliderRow
                    icon={<Clock className="w-4 h-4 text-primary" />}
                    label={copy.manualTime}
                    value={answers.manualMin}
                    min={2}
                    max={600}
                    step={1}
                    suffix={copy.minuteSuffix}
                    onChange={(manualMin) => setAnswers((current) => ({ ...current, manualMin }))}
                  />
                  <p className="text-xs text-muted-foreground border-t border-border pt-4">
                    {copy.volumeHelp}
                  </p>
                </QuestionCard>

                <QuestionCard title={copy.questionCost}>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">{copy.currency}</span>
                    <div className="inline-flex rounded-full border border-border bg-secondary/60 p-1">
                      {(["BRL", "USD"] as const).map((currency) => (
                        <button
                          key={currency}
                          type="button"
                          onClick={() => setAnswers((current) => ({ ...current, currency }))}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            answers.currency === currency
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {currency === "BRL" ? "R$" : "US$"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SliderRow
                    icon={<CircleDollarSign className="w-4 h-4 text-primary" />}
                    label={copy.costHour}
                    value={answers.costHour}
                    min={10}
                    max={500}
                    step={5}
                    suffix=""
                    onChange={(costHour) => setAnswers((current) => ({ ...current, costHour }))}
                  />
                  <SliderRow
                    icon={<Users className="w-4 h-4 text-primary" />}
                    label={copy.teamSize}
                    value={answers.teamSize}
                    min={1}
                    max={50}
                    step={1}
                    suffix={copy.peopleSuffix}
                    onChange={(teamSize) => setAnswers((current) => ({ ...current, teamSize }))}
                  />
                  <p className="text-xs text-muted-foreground">{copy.teamHelp}</p>
                </QuestionCard>

                <QuestionCard title={copy.optionalSegment}>
                  <input
                    type="text"
                    value={answers.segment}
                    onChange={(event) =>
                      setAnswers((current) => ({ ...current, segment: event.target.value }))
                    }
                    placeholder={copy.segmentPlaceholder}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      copy.segmentAgency,
                      copy.segmentAccounting,
                      copy.segmentClinic,
                      copy.segmentConsulting,
                      copy.segmentStartup,
                      copy.segmentEcommerce,
                      copy.segmentLaw,
                      copy.segmentEducation,
                    ].map((segment) => (
                      <button
                        key={segment}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, segment }))}
                        className={`text-xs px-3 py-1.5 rounded-full border transition ${
                          answers.segment === segment
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/60"
                        }`}
                      >
                        {segment}
                      </button>
                    ))}
                  </div>
                </QuestionCard>

                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 card-elev flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-primary">
                      {copy.estimatedRange}
                    </div>
                    <div className="mt-3 text-xl font-medium">
                      {localize(selectedTask.title, locale)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {localize(selectedTask.description, locale)}
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-border bg-background/30 p-3">
                      <div className="text-[10px] uppercase text-muted-foreground">
                        {copy.potentialTime}
                      </div>
                      <div className="mt-1 font-semibold text-blue-gradient">
                        {rangeLabel(metrics.timeMin, metrics.timeMax, locale, "h")}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-background/30 p-3">
                      <div className="text-[10px] uppercase text-muted-foreground">
                        {copy.opportunityScore}
                      </div>
                      <div className="mt-1 font-semibold text-blue-gradient">
                        {metrics.score}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${answersComplete ? "bg-green-500" : "bg-orange-500 animate-pulse"}`}
                />
                {answersComplete ? copy.ready : copy.incomplete}
              </div>
              <button
                type="button"
                onClick={finishDiagnostic}
                disabled={!answersComplete}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copy.seeResult}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {showResult && selectedTask && selectedCategory && (
          <section ref={resultRef} id="resultado" className="mt-20 sm:mt-24 scroll-mt-24">
            <SectionLabel>{copy.resultSection}</SectionLabel>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <CategoryIcon id={selectedCategory.id} className="h-3.5 w-3.5" />
              {localize(selectedCategory.title, locale)}
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              {copy.resultTitle1}{" "}
              <span className="text-blue-gradient">{localize(selectedTask.title, locale)}</span>
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">{copy.resultBody}</p>

            <div className="no-print mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={shareResult}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-medium text-foreground hover:border-primary/60 transition"
              >
                {shareCopied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                {shareCopied ? copy.shareCopied : copy.shareResult}
              </button>
              <button
                type="button"
                onClick={printResult}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-medium text-foreground hover:border-primary/60 transition"
              >
                <Download className="h-4 w-4" />
                {copy.savePdf}
              </button>
            </div>
            <p className="no-print mt-3 flex max-w-2xl items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Download className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {copy.pdfHelp}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={copy.currentEffort}
                value={`${formatHours(metrics.manualHours, locale)}h`}
                sub={locale === "pt" ? "por mês, antes da Lynx" : "per month, before Lynx"}
              />
              <StatCard
                label={copy.potentialTime}
                value={rangeLabel(metrics.timeMin, metrics.timeMax, locale, "h")}
                sub={copy.estimatedRange}
                highlight
              />
              <StatCard
                label={copy.potentialSavings}
                value={`${formatMoney(metrics.savingsMin, answers.currency, locale)}–${formatMoney(metrics.savingsMax, answers.currency, locale)}`}
                sub={copy.estimatedRange}
              />
              <StatCard
                label={copy.opportunityScore}
                value={`${metrics.score}/100`}
                sub={metrics.score >= 80 ? copy.highFit : copy.mediumFit}
                highlight
              />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6 card-elev">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary">
                    {copy.estimatedRange}
                  </div>
                  <div className="mt-2 text-lg font-medium">
                    {answers.volume} {localize(selectedTask.unit, locale)} · {answers.manualMin}
                    {copy.minuteSuffix}
                  </div>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {locale === "pt" ? "Tempo estimado com Lynx" : "Estimated time with Lynx"}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-blue-gradient">
                    {metrics.lynxMin}–{metrics.lynxMax}
                    {copy.minuteSuffix}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8 card-elev">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary">
                    {copy.whatLynxDoes}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold">
                    {localize(selectedTask.title, locale)}
                  </h3>
                </div>
              </div>
              <div className="mt-7 grid md:grid-cols-2 gap-7">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground">
                    {copy.workflowPlan}
                  </h4>
                  <ol className="mt-4 space-y-3">
                    {selectedTask.steps.map((step, index) => (
                      <li key={localize(step, "en")} className="flex gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span className="pt-0.5 text-foreground/90">{localize(step, locale)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground">
                    {copy.deliverables}
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {selectedTask.outputs.map((output) => (
                      <li key={localize(output, "en")} className="flex gap-3 text-sm">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-foreground/90">{localize(output, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border-2 border-primary/45 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 glow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary">
                    {copy.firstPromptTitle}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{copy.firstPromptBody}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {locale === "pt" ? "Aprovação humana incluída" : "Human approval included"}
                </div>
              </div>
              <textarea
                value={promptDraft}
                onChange={(event) => setPromptDraft(event.target.value)}
                aria-label={copy.firstPromptTitle}
                className="mt-5 min-h-[430px] w-full resize-y rounded-xl border border-border bg-background/75 p-4 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => copyPrompt()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? copy.copied : copy.copyPrompt}
                </button>
                <button
                  type="button"
                  onClick={runInLynx}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition"
                >
                  {copy.runInLynx}
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.promptTip}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs text-green-300">
                <CircleDollarSign className="h-3.5 w-3.5" />
                {copy.freeCreditNote}
              </div>
            </div>

            <div className="no-print mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 sm:p-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{copy.freeStartTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {copy.freeStartBody}
                </p>
                <button
                  type="button"
                  onClick={runInLynx}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  {copy.freeStartButton}
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-primary/35 bg-primary/5 p-6 sm:p-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{copy.businessCtaTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {copy.businessCtaBody}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={openLeadForm}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                  >
                    {copy.receiveDiagnostic}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href={CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackMeetingClick}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {copy.scheduleConversation}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold">{copy.relatedTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{copy.relatedBody}</p>
              <div className="mt-5 grid md:grid-cols-3 gap-4">
                {relatedTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => selectRelatedTask(task)}
                    className="rounded-xl border border-border bg-card p-5 text-left hover:border-primary/60 transition group"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition">
                      {localize(task.title, locale)}
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                      {localize(task.description, locale)}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      {copy.useWorkflow} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-5 flex gap-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <div className="text-sm font-medium">{copy.methodologyTitle}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {copy.methodologyBody}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{copy.scoreInternal}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-6 sm:p-8 text-center">
              <div className="text-xs uppercase tracking-widest text-primary">{copy.nextStep}</div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">
                {copy.recommendPlan1}{" "}
                <span className="text-blue-gradient">{plans[recommendedPlanIdx].name}</span>{" "}
                {copy.recommendPlan2}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "pt"
                  ? `Com base no potencial conservador de ${formatHours(metrics.timeMin, locale)} horas recuperadas por mês.`
                  : `Based on the conservative potential of ${formatHours(metrics.timeMin, locale)} recovered hours per month.`}
              </p>
              <button
                type="button"
                onClick={() =>
                  planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition"
              >
                {copy.seeIdealPlan}
              </button>
            </div>
          </section>
        )}

        <section id="biblioteca" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>{copy.librarySection}</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {copy.libraryTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">{copy.libraryBody}</p>
          <Library locale={locale} onChooseCategory={chooseCategory} />
        </section>

        <section id="receita" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionLabel>{copy.revenueSection}</SectionLabel>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {copy.revenueTitle1} <span className="text-blue-gradient">{copy.revenueTitle2}</span>
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">{copy.revenueDisclaimer}</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {REVENUE_CASES.map((source) => {
              const revenueCase = localizeRevenueCase(source, locale);
              return (
                <div
                  key={revenueCase.flow}
                  className="rounded-2xl border border-border bg-card p-6 card-elev"
                >
                  <div className="text-base font-medium">{revenueCase.flow}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{revenueCase.scenario}</p>
                  <div className="mt-5 text-2xl font-semibold text-blue-gradient">
                    {revenueCase.monthly}
                  </div>
                  <div className="text-sm text-muted-foreground">{revenueCase.yearly}</div>
                  <p className="mt-4 text-xs text-muted-foreground/80 border-t border-border pt-3">
                    {revenueCase.note}
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
          <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, index) => {
              const recommended = showResult && index === recommendedPlanIdx;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 card-elev transition ${
                    recommended ? "border-primary bg-primary/10 glow" : "border-border bg-card"
                  }`}
                >
                  {recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-semibold">
                      {copy.recommended}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">{plan.name}</div>
                  <div className="mt-2 text-2xl font-semibold">{plan.price}</div>
                  <p className="mt-4 text-sm text-foreground/90">{plan.who}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{plan.note}</p>
                  <a
                    href={PLATFORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                  >
                    {copy.choose} {plan.name} →
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
              type="button"
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
        </section>

        <footer className="mt-20 sm:mt-24 text-xs text-muted-foreground border-t border-border pt-8 flex justify-between flex-wrap gap-4">
          <div>© Apex7 AI — LynxMetric</div>
          <div>{copy.footerSources}</div>
        </footer>
      </main>

      {leadFormOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setLeadFormOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={copy.leadFormTitle}
            className="relative h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary">
                  {copy.businessDiagnostic}
                </div>
                <div className="mt-1 text-sm font-medium">{copy.leadFormTitle}</div>
              </div>
              <button
                type="button"
                onClick={() => setLeadFormOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground hover:text-foreground transition"
                aria-label={copy.closeForm}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe
              src={tallyEmbedUrl}
              title={copy.leadFormTitle}
              className="h-[calc(92vh-66px)] w-full bg-background"
              loading="lazy"
            />
            <a
              href={tallyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-4 rounded-full border border-border bg-background/95 px-3 py-1.5 text-[11px] text-muted-foreground shadow hover:text-foreground transition"
            >
              {copy.openFormNewTab} ↗
            </a>
          </div>
        </div>
      )}
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
          type="button"
          onClick={onHome}
          className="flex items-center gap-2.5 group"
          aria-label={copy.backToTop}
        >
          <img
            src={logoGif}
            alt="Apex7 AI"
            className="h-9 w-9 rounded-md object-cover ring-1 ring-primary/40 group-hover:ring-primary transition"
          />
          <div className="font-semibold tracking-tight">
            Apex7 AI{" "}
            <span className="text-muted-foreground font-normal hidden sm:inline">/ LynxMetric</span>
          </div>
        </button>
        <nav className="hidden lg:flex items-center gap-1 text-sm bg-secondary/60 border border-border rounded-full px-1 py-1">
          <button
            type="button"
            onClick={onStart}
            className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition"
          >
            {copy.navDiagnostic}
          </button>
          <button
            type="button"
            onClick={() => smoothScrollTo("biblioteca")}
            className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition"
          >
            {copy.navLibrary}
          </button>
          <button
            type="button"
            onClick={() => smoothScrollTo("receita")}
            className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition"
          >
            {copy.navRevenue}
          </button>
          <button
            type="button"
            onClick={() => smoothScrollTo("planos")}
            className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition"
          >
            {copy.navPlans}
          </button>
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
                className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase transition ${
                  locale === option
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onStart}
            className="hidden sm:inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            {copy.start}
          </button>
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
      <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground px-2">
        {copy.heroBody}
      </p>
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow"
        >
          {copy.startDiagnostic}
        </button>
        <button
          type="button"
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
        <span>·</span>
        <span>{copy.launchOffer}</span>
      </div>
      <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {[
          { k: `${totalCases}`, v: copy.casesCalculated },
          { k: copy.areas, v: copy.workCategories },
          { k: copy.readyPrompt, v: copy.firstWorkflow },
          { k: copy.bilingual, v: copy.fullExperience },
        ].map((stat) => (
          <div
            key={stat.k}
            className="rounded-xl border border-border bg-card/60 p-4 text-left card-elev"
          >
            <div className="text-xl font-semibold text-blue-gradient">{stat.k}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryIcon({ id, className }: { id: WorkflowCategoryId; className?: string }) {
  const props = { className };
  if (id === "management") return <Briefcase {...props} />;
  if (id === "sales") return <Target {...props} />;
  if (id === "marketing") return <Megaphone {...props} />;
  if (id === "research") return <Search {...props} />;
  if (id === "operations") return <Settings {...props} />;
  if (id === "hr") return <Users {...props} />;
  if (id === "support") return <Headphones {...props} />;
  return <Code2 {...props} />;
}

function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary ${className}`}
    >
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

function QuestionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-elev relative overflow-hidden">
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
  icon?: ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between text-xs text-muted-foreground mb-3 items-center gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-primary font-bold tabular-nums px-2 py-1 rounded bg-primary/10 border border-primary/20">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="slider-modern w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer focus:outline-none"
      />
      <div className="flex justify-between mt-2 px-1 text-[10px] text-muted-foreground/50">
        <span>
          {min}
          {suffix}
        </span>
        <span>
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
      className={`rounded-2xl p-5 border card-elev ${highlight ? "border-primary bg-primary/5" : "border-border bg-card"}`}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        className={`mt-3 text-2xl sm:text-3xl font-semibold break-words ${highlight ? "text-blue-gradient" : ""}`}
      >
        {value}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function CaseCard({
  c,
  locale,
  categoryId,
  onUse,
}: {
  c: RoiCase;
  locale: Locale;
  categoryId: WorkflowCategoryId;
  onUse: () => void;
}) {
  const copy = getCopy(locale);
  const category = getWorkflowCategory(categoryId);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 card-elev hover:border-primary/50 transition group flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-bold">
          <CategoryIcon id={categoryId} className="h-3 w-3" />
          {category ? localize(category.title, locale) : copy.referenceScenario}
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
          <div className="text-base font-semibold mt-1">
            {formatMoney(monthlySavings(c), "USD", locale)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{copy.yearShort}</div>
          <div className="text-base font-semibold mt-1 text-blue-gradient">
            {formatMoney(yearlySavings(c), "USD", locale)}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onUse}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/15 transition"
      >
        {copy.useThisArea}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Library({
  locale,
  onChooseCategory,
}: {
  locale: Locale;
  onChooseCategory: (categoryId: WorkflowCategoryId) => void;
}) {
  const [categoryFilter, setCategoryFilter] = useState<WorkflowCategoryId | "all">("all");
  const [lineFilter, setLineFilter] = useState<"All" | "External" | "Internal">("All");
  const copy = getCopy(locale);
  const filteredCases = CASES.filter((roiCase) => {
    const categoryMatches =
      categoryFilter === "all" || getLegacyCaseCategory(roiCase.flow) === categoryFilter;
    const lineMatches = lineFilter === "All" || roiCase.area === lineFilter;
    return categoryMatches && lineMatches;
  });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`rounded-full border px-4 py-2 text-xs transition ${categoryFilter === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"}`}
        >
          {copy.allAreas}
        </button>
        {WORKFLOW_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryFilter(category.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs transition ${categoryFilter === category.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"}`}
          >
            <CategoryIcon id={category.id} className="h-3.5 w-3.5" />
            {localize(category.title, locale)}
          </button>
        ))}
      </div>
      <div className="mt-4 inline-flex bg-secondary/60 border border-border rounded-full p-1">
        {(["All", "External", "Internal"] as const).map((line) => (
          <button
            key={line}
            type="button"
            onClick={() => setLineFilter(line)}
            className={`px-5 py-1.5 rounded-full text-sm transition font-medium ${lineFilter === line ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {line === "All" ? copy.allCases : line === "External" ? copy.external : copy.internal}
          </button>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((source) => {
          const categoryId = getLegacyCaseCategory(source.flow);
          return (
            <CaseCard
              key={source.flow}
              c={localizeCase(source, locale)}
              locale={locale}
              categoryId={categoryId}
              onUse={() => onChooseCategory(categoryId)}
            />
          );
        })}
      </div>
    </div>
  );
}
