"use client";

// Dashboard overview. Analytics used to live on its own route, which meant two
// pages fetching the same `getUsage` payload and a nav item that only ever
// showed a different slice of it. They are one page now: stats, then the graphs,
// then the shortcuts - laid out edge to edge rather than in a narrow column.

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AreaChart, BarList, Donut, StatCard, VIZ, VIZ_STATUS } from "@/components/charts";
import { ClockIcon, JobsIcon, KeyIcon, ScanIcon, SuccessIcon, TokenIcon, WebhookIcon, DocsIcon } from "@/components/icons";
import { Button, ErrorBanner, PageHeader, Select, Skeleton } from "@/components/ui";
import { getUsage, listKeys } from "@/lib/account";
import { ApiError, type Usage } from "@/lib/types";

const LINKS: { href: string; title: string; desc: string; icon: ReactNode }[] = [
  { href: "/dashboard/keys", title: "API keys", desc: "Issue, download and revoke keys", icon: <KeyIcon /> },
  { href: "/dashboard/webhooks", title: "Webhooks", desc: "Register delivery endpoints", icon: <WebhookIcon /> },
  { href: "/docs", title: "API documentation", desc: "Endpoints, errors and payloads", icon: <DocsIcon /> },
];

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function DashboardPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [activeKeys, setActiveKeys] = useState<number | null>(null);
  const [days, setDays] = useState(30);
  const [reloadToken, setReloadToken] = useState(0);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Derived, not stored: setting a loading flag synchronously inside the effect
  // below would trigger a cascading render.
  const loading = usage === null && !error;

  useEffect(() => {
    let cancelled = false;

    Promise.all([getUsage(days), listKeys()])
      .then(([u, keys]) => {
        if (cancelled) return;
        setUsage(u);
        setActiveKeys(keys.filter((k) => k.status === "active").length);
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
  const successRate = t && t.jobs ? Math.round((t.completed / t.jobs) * 100) : 0;
  const other = t ? Math.max(0, t.jobs - t.completed - t.failed) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Usage, throughput and reliability for your workspace."
        actions={
          <>
            <Select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Time window">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </Select>
            <Button variant="secondary" onClick={refresh} loading={refreshing} type="button">
              Refresh
            </Button>
          </>
        }
      />

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      ) : (
        usage && (
          <>
            {/* Headline numbers */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Active keys" value={activeKeys ?? "-"} icon={<KeyIcon />} />
              <StatCard label={`Jobs - ${days}d`} value={t ? t.jobs.toLocaleString() : "-"} accent="cyan" icon={<JobsIcon />} />
              <StatCard label="Tokens used" value={t ? t.tokens_used.toLocaleString() : "-"} accent="brass" icon={<TokenIcon />} />
              <StatCard
                label="Success rate"
                value={t ? `${successRate}%` : "-"}
                sub={t ? `${t.completed} completed - ${t.failed} failed` : undefined}
                color={successRate >= 95 ? VIZ_STATUS.good : successRate >= 80 ? VIZ_STATUS.warning : VIZ_STATUS.critical}
                icon={<SuccessIcon />}
              />
            </div>

            {/* Trend. Two measures of different scale, so two charts - never a
                second y-axis on one plot. */}
            <div className="grid gap-4 xl:grid-cols-2">
              <AreaChart
                label="Jobs per day"
                data={usage.by_day.map((d) => ({ date: d.date, value: d.jobs }))}
              />
              <AreaChart
                label="Tokens per day"
                color={VIZ[1]}
                data={usage.by_day.map((d) => ({ date: d.date, value: d.tokens }))}
              />
            </div>

            {/* Mix */}
            <div className="grid gap-4 xl:grid-cols-2">
              <Donut
                title="Outcome mix"
                segments={[
                  { label: "Completed", value: t?.completed ?? 0, color: VIZ_STATUS.good },
                  { label: "Failed", value: t?.failed ?? 0, color: VIZ_STATUS.critical },
                  { label: "Other", value: other, color: VIZ_STATUS.warning },
                ].filter((s) => s.value > 0)}
              />
              <BarList
                title="Busiest days"
                items={[...usage.by_day]
                  .sort((a, b) => b.jobs - a.jobs)
                  .slice(0, 7)
                  .map((d) => ({ label: d.date, value: d.jobs }))}
              />
            </div>

            {/* Shortcuts */}
            <div>
              <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink">Shortcuts</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {LINKS.map((l) => (
                  <QuickLink key={l.href} {...l} />
                ))}
              </div>
            </div>

            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
              <ClockIcon width={14} height={14} />
              Window: last {days} days.
              <ScanIcon width={14} height={14} className="ml-2" />
              Counts include OCR parses.
            </p>
          </>
        )
      )}
    </div>
  );
}

function QuickLink({ href, title, desc, icon }: { href: string; title: string; desc: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_20px_44px_-30px_rgba(10,23,51,0.35)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200 transition-colors group-hover:bg-accent-700 group-hover:text-white group-hover:ring-accent-700">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold tracking-tight text-ink">{title}</span>
        <span className="block truncate text-sm text-ink-soft">{desc}</span>
      </span>
      <svg className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
