"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AreaChart, Donut, StatCard } from "@/components/charts";
import { JobsIcon, SuccessIcon, TokenIcon, UsersIcon } from "@/components/icons";
import { Button, ErrorBanner, Spinner } from "@/components/ui";
import { getPlatformStats } from "@/lib/account";
import { ApiError, type PlatformStats } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function AdminClient() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStats(await getPlatformStats(days));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const t = stats?.totals;
  const successRate = t && t.jobs ? Math.round((t.completed / t.jobs) * 100) : 0;
  const other = t ? Math.max(0, t.jobs - t.completed - t.failed) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-[1.9rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.1rem]">Overview</h1>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">Usage across the whole platform.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg bg-paper p-1 ring-1 ring-inset ring-line">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={
                  "rounded-md px-3 py-1 text-sm font-medium transition-colors " +
                  (d === days ? "bg-surface text-ink shadow-[0_1px_2px_rgba(12,26,58,0.12)] ring-1 ring-line" : "text-ink-soft hover:text-ink")
                }
              >
                {d}d
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={load} type="button">Refresh</Button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && !stats ? (
        <div className="flex items-center gap-2 py-16 text-sm text-ink-soft">
          <Spinner /> Loading platform stats...
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Users" value={stats.companies.total.toLocaleString()} sub={`${stats.companies.active} active`} accent="accent" icon={<UsersIcon />} />
            <StatCard label={`Jobs, last ${days} days`} value={t!.jobs.toLocaleString()} sub={`${stats.active_keys} active keys`} accent="ink" icon={<JobsIcon />} />
            <StatCard label="Tokens used" value={t!.tokens_used.toLocaleString()} accent="brass" icon={<TokenIcon />} />
            <StatCard label="Success rate" value={`${successRate}%`} sub={`${t!.completed} completed, ${t!.failed} failed`} accent={successRate >= 90 ? "accent" : successRate >= 70 ? "amber" : "rose"} icon={<SuccessIcon />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AreaChart label="Tokens per day" color="#1d4ed8" data={stats.by_day.map((d) => ({ date: d.date, value: d.tokens }))} />
            <AreaChart label="Jobs per day" color="#d97706" data={stats.by_day.map((d) => ({ date: d.date, value: d.jobs }))} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Donut
              title="Job outcomes"
              segments={[
                { label: "Completed", value: t!.completed, color: "#1d4ed8" },
                { label: "Failed", value: t!.failed, color: "#dc2626" },
                { label: "Other", value: other, color: "#94a3b8" },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="OCR jobs" value={t!.ocr_jobs.toLocaleString()} />
              <MiniStat label="Avg time" value={`${t!.avg_duration_ms.toLocaleString()} ms`} />
              <MiniStat label="Active keys" value={stats.active_keys.toLocaleString()} />
              <MiniStat label="Active users" value={stats.companies.active.toLocaleString()} />
            </div>
          </div>

          <Link
            href="/dashboard/admin/customers"
            className="group flex items-center justify-between glow-soft card-lift rounded-[20px] border border-transparent p-5 transition-colors hover:border-black"
          >
            <span>
              <span className="block text-base font-semibold tracking-tight text-ink">View all customers</span>
              <span className="block text-sm text-ink-soft">{stats.companies.total.toLocaleString()} organisations with their usage, keys, logs and controls</span>
            </span>
            <svg className="h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glow-soft card-lift rounded-[20px] p-4">
      <div className="label-caps text-ink-soft">{label}</div>
      <div className="mt-1.5 text-xl font-semibold tabular-nums text-ink">{value}</div>
    </div>
  );
}
