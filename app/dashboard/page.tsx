"use client";

// Dashboard overview: this period's numbers against the one before, the daily
// trend (switchable between jobs and tokens), what the documents were, and how
// they came out.
//
// The previous period is not a separate endpoint. We fetch the window twice
// its length and subtract the current window from it, so every comparison is
// computed from records, never estimated. If that longer request fails the
// page still renders and simply shows no comparison.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { AreaChart, BarList, Donut, StatCard, VIZ, VIZ_STATUS } from "@/components/charts";
import { Delta, IconButton } from "@/components/dashboard/kit";
import { ClockIcon, DocsIcon, JobsIcon, KeyIcon, RefreshIcon, SuccessIcon, TokenIcon, WebhookIcon } from "@/components/icons";
import { Button, EmptyState, ErrorBanner, PageHeader, Skeleton, Spinner, Tabs } from "@/components/ui";
import { getUsage, listKeys, listWebhooks } from "@/lib/account";
import { ApiError, type Usage } from "@/lib/types";

type Window = "7" | "30" | "90";
type Metric = "jobs" | "tokens";

const LINKS: { href: string; title: string; desc: string; icon: ReactNode }[] = [
  { href: "/dashboard/keys", title: "API keys", desc: "Create, copy and revoke keys", icon: <KeyIcon /> },
  { href: "/dashboard/webhooks", title: "Webhooks", desc: "Push results to your server", icon: <WebhookIcon /> },
  { href: "/docs", title: "API documentation", desc: "Endpoints, errors and payloads", icon: <DocsIcon /> },
];

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

function formatDuration(ms: number): string {
  if (!ms) return "-";
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

function compact(n: number): string {
  return n >= 10_000 ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n) : n.toLocaleString();
}

export default function DashboardPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [previous, setPrevious] = useState<Usage["totals"] | null>(null);
  const [activeKeys, setActiveKeys] = useState<number | null>(null);
  const [hookCount, setHookCount] = useState<number | null>(null);
  const [win, setWin] = useState<Window>("30");
  const [metric, setMetric] = useState<Metric>("jobs");
  const [reloadToken, setReloadToken] = useState(0);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const days = Number(win);
  // Derived, not stored: setting a loading flag synchronously inside the effect
  // below would trigger a cascading render.
  const loading = usage === null && !error;

  useEffect(() => {
    let cancelled = false;

    // Webhooks only feed the setup checklist and the doubled window only feeds
    // the comparisons, so a failure in either must not take the page down.
    Promise.all([
      getUsage(days),
      getUsage(days * 2).catch(() => null),
      listKeys(),
      listWebhooks().catch(() => null),
    ])
      .then(([u, both, keys, hooks]) => {
        if (cancelled) return;
        setUsage(u);
        setPrevious(
          both
            ? {
                jobs: Math.max(0, both.totals.jobs - u.totals.jobs),
                completed: Math.max(0, both.totals.completed - u.totals.completed),
                failed: Math.max(0, both.totals.failed - u.totals.failed),
                ocr_jobs: Math.max(0, both.totals.ocr_jobs - u.totals.ocr_jobs),
                tokens_used: Math.max(0, both.totals.tokens_used - u.totals.tokens_used),
                avg_duration_ms: 0,
              }
            : null,
        );
        setActiveKeys(keys.filter((k) => k.status === "active").length);
        setHookCount(hooks ? hooks.length : null);
        setError("");
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(errMsg(e));
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [days, reloadToken]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setReloadToken((n) => n + 1);
  }, []);

  const t = usage?.totals;
  const rate = (x?: { jobs: number; completed: number } | null) => (x && x.jobs ? (x.completed / x.jobs) * 100 : null);
  const successRate = rate(t);
  const prevRate = rate(previous);
  const other = t ? Math.max(0, t.jobs - t.completed - t.failed) : 0;
  const ocrShare = t && t.jobs ? Math.round((t.ocr_jobs / t.jobs) * 100) : 0;
  const since = `vs previous ${days} days`;

  const fileTypes = useMemo(
    () =>
      Object.entries(usage?.by_file_type ?? {})
        .map(([label, value]) => ({ label: label.toUpperCase(), value }))
        .sort((a, b) => b.value - a.value),
    [usage],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="How much your workspace parsed, how it went, and what it cost in tokens."
        actions={
          <>
            <Tabs<Window>
              value={win}
              onChange={setWin}
              options={[
                { id: "7", label: "7 days" },
                { id: "30", label: "30 days" },
                { id: "90", label: "90 days" },
              ]}
            />
            <IconButton label="Refresh" onClick={refresh}>
              {refreshing ? <Spinner /> : <RefreshIcon className="h-[18px] w-[18px]" />}
            </IconButton>
          </>
        }
      />

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-6" aria-busy="true">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[132px] rounded-[20px]" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Skeleton className="h-80 rounded-[20px]" />
            <Skeleton className="h-80 rounded-[20px]" />
          </div>
        </div>
      ) : (
        usage &&
        t && (
          <>
            <Setup keys={activeKeys ?? 0} hooks={hookCount} jobs={t.jobs} />

            {/* Headline numbers, each against the previous period. */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Documents parsed"
                value={t.jobs.toLocaleString()}
                sub={<Delta current={t.jobs} previous={previous?.jobs} suffix={since} />}
                icon={<JobsIcon />}
              />
              <StatCard
                label="Success rate"
                value={successRate === null ? "-" : `${successRate.toFixed(successRate >= 99.95 ? 0 : 1)}%`}
                sub={
                  successRate !== null && prevRate !== null ? (
                    <PointsDelta current={successRate} previous={prevRate} suffix={since} />
                  ) : (
                    `${t.completed.toLocaleString()} completed, ${t.failed.toLocaleString()} failed`
                  )
                }
                color={successRate === null || successRate >= 95 ? VIZ_STATUS.good : successRate >= 80 ? VIZ_STATUS.warning : VIZ_STATUS.critical}
                icon={<SuccessIcon />}
              />
              <StatCard
                label="Tokens used"
                value={compact(t.tokens_used)}
                sub={<Delta current={t.tokens_used} previous={previous?.tokens_used} goodWhen="neutral" suffix={since} />}
                accent="brass"
                icon={<TokenIcon />}
              />
              <StatCard
                label="Average parse time"
                value={formatDuration(t.avg_duration_ms)}
                sub={
                  !t.jobs
                    ? "No parses in this period"
                    : t.ocr_jobs > 0
                      ? `${ocrShare}% of documents needed OCR`
                      : `Averaged over ${t.jobs.toLocaleString()} documents`
                }
                accent="cyan"
                icon={<ClockIcon />}
              />
            </div>

            {t.jobs === 0 ? (
              <EmptyState
                title={`No documents parsed in the last ${days} days`}
                hint={
                  previous && previous.jobs > 0
                    ? `There were ${previous.jobs.toLocaleString()} in the ${days} days before that. Widen the window to see them, or send a new file.`
                    : "Charts appear here as soon as your first parse completes."
                }
                action={
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {win !== "90" && (
                      <Button variant="secondary" type="button" onClick={() => setWin("90")}>
                        Show the last 90 days
                      </Button>
                    )}
                    <Link
                      href="/docs#quickstart"
                      className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent-600 px-4 text-sm font-semibold text-white hover:bg-accent-700"
                    >
                      Open the quickstart
                    </Link>
                  </div>
                }
              />
            ) : (
              <>
            {/* Trend with a metric switch, beside the outcome mix. Two measures
                of different scale get one chart each - never a second y-axis. */}
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <section aria-label="Daily activity" className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">Daily activity</h2>
                  <Tabs<Metric>
                    value={metric}
                    onChange={setMetric}
                    options={[
                      { id: "jobs", label: "Documents" },
                      { id: "tokens", label: "Tokens" },
                    ]}
                  />
                </div>
                {metric === "jobs" ? (
                  <AreaChart label="Documents parsed per day" data={usage.by_day.map((d) => ({ date: d.date, value: d.jobs }))} />
                ) : (
                  <AreaChart label="Tokens per day" color={VIZ[1]} data={usage.by_day.map((d) => ({ date: d.date, value: d.tokens }))} />
                )}
              </section>

              <Donut
                title="How parses ended"
                segments={[
                  { label: "Completed", value: t.completed, color: VIZ_STATUS.good },
                  { label: "Failed", value: t.failed, color: VIZ_STATUS.critical },
                  { label: "Partial or in progress", value: other, color: VIZ_STATUS.warning },
                ].filter((s) => s.value > 0)}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <BarList title="File types received" items={fileTypes} color={VIZ[2]} />
              <BarList
                title="Busiest days"
                items={[...usage.by_day]
                  .sort((a, b) => b.jobs - a.jobs)
                  .slice(0, 7)
                  .filter((d) => d.jobs > 0)
                  .map((d) => ({
                    label: new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
                    value: d.jobs,
                  }))}
              />
            </div>

              </>
            )}

            <section aria-labelledby="shortcuts-title">
              <h2 id="shortcuts-title" className="mb-4 text-[1.05rem] font-semibold text-[#1e293b]">
                Shortcuts
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {LINKS.map((l) => (
                  <QuickLink key={l.href} {...l} />
                ))}
              </div>
            </section>

            <p className="text-xs text-ink-soft">
              Counts include OCR parses. Comparisons use the {days} days before this window.
            </p>
          </>
        )
      )}
    </div>
  );
}

/** Success rate moves in percentage points, not percent of a percent. */
function PointsDelta({ current, previous, suffix }: { current: number; previous: number; suffix: string }) {
  const diff = current - previous;
  const flat = Math.abs(diff) < 0.05;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs">
      <span
        className={
          "rounded-full px-1.5 py-0.5 font-semibold tabular-nums " +
          (flat ? "bg-paper text-ink-soft" : diff > 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800")
        }
      >
        {flat ? "No change" : `${diff > 0 ? "+" : "-"}${Math.abs(diff).toFixed(1)} pts`}
      </span>
      <span className="text-ink-soft">{suffix}</span>
    </span>
  );
}

function QuickLink({ href, title, desc, icon }: { href: string; title: string; desc: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      className="glow-soft card-lift group flex items-center gap-4 rounded-[20px] border border-transparent p-5 transition-colors hover:border-black"
    >
      <span className="panel-lift grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-accent-600">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[#1e293b]">{title}</span>
        <span className="block truncate text-sm text-ink-soft">{desc}</span>
      </span>
      <svg className="h-4 w-4 shrink-0 text-ink-soft group-hover:text-accent-700" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/** First-run checklist, built from what the workspace has actually done. It
 *  disappears once every step is complete. The parse step reads the selected
 *  window, so an old workspace that has gone quiet will see it again. */
function Setup({ keys, hooks, jobs }: { keys: number; hooks: number | null; jobs: number }) {
  const steps: { done: boolean; title: string; body: string; href: string; cta: string }[] = [
    { done: keys > 0, title: "Create an API key", body: "Every request carries it in the X-API-Key header.", href: "/dashboard/keys", cta: "Create a key" },
    { done: jobs > 0, title: "Parse your first document", body: "One POST with a file, then poll for the record.", href: "/docs#quickstart", cta: "Open the quickstart" },
    { done: (hooks ?? 0) > 0, title: "Register a webhook", body: "Optional. Get results pushed instead of polling.", href: "/dashboard/webhooks", cta: "Add a webhook" },
  ];
  const done = steps.filter((s) => s.done).length;
  if (done === steps.length) return null;

  return (
    <section aria-labelledby="setup-title" className="glow-soft card-lift overflow-hidden rounded-[20px] ring-1 ring-accent-200">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-2 pt-5 sm:px-6">
        <div>
          <h2 id="setup-title" className="text-[1.05rem] font-semibold text-[#1e293b]">
            Finish setting up
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">
            {done} of {steps.length} done
          </p>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {steps.map((s) => (
            <span key={s.title} className={"h-1.5 w-10 rounded-full " + (s.done ? "bg-accent-600" : "bg-accent-100")} />
          ))}
        </div>
      </div>
      <ol className="grid gap-3 p-4 sm:p-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="panel-lift flex gap-3.5 rounded-xl bg-white p-4">
            <span
              className={
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold " +
                (s.done ? "bg-accent-600 text-white" : "border border-black bg-white text-ink")
              }
            >
              {s.done ? (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path d="M4.5 10.3l3.3 3.3L15.5 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <div className="min-w-0">
              <p className={"font-semibold " + (s.done ? "text-ink-soft line-through decoration-line-strong" : "text-ink")}>
                {s.title}
                {s.done && <span className="sr-only"> (done)</span>}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              {!s.done && (
                <Link href={s.href} className="mt-2 inline-block text-sm font-semibold text-accent-700 underline-offset-4 hover:underline">
                  {s.cta}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
