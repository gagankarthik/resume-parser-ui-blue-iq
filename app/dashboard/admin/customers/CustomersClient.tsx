"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { UsersIcon } from "@/components/icons";
import { Badge, Button, EmptyState, ErrorBanner, Spinner, TBody, TD, TH, THead, TR, Table } from "@/components/ui";
import { getPlatformStats } from "@/lib/account";
import { ApiError, type PlatformStats } from "@/lib/types";

type SortKey = "jobs" | "tokens";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function CustomersClient() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [days, setDays] = useState(30);
  const [sort, setSort] = useState<SortKey>("jobs");
  const [query, setQuery] = useState("");
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

  const rows = useMemo(() => {
    const all = stats?.companies_list ?? [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter((c) => `${c.name} ${c.email ?? ""} ${c.company_id}`.toLowerCase().includes(q))
      : all;
    return [...filtered].sort((a, b) => b[sort] - a[sort]);
  }, [stats, query, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
            <UsersIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="label-caps text-accent-700">Platform - Admin</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Customers</h1>
            <p className="mt-1 text-sm text-ink-soft">Every organisation, its usage, and account controls.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-line p-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={
                  "rounded-md px-3 py-1 text-sm font-medium transition-colors " +
                  (d === days ? "bg-accent-700 text-[var(--surface)]" : "text-ink-soft hover:bg-black/[0.04]")
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
          <Spinner /> Loading customers...
        </div>
      ) : stats ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, or id..."
              className="h-9 w-64 max-w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-accent-500"
            />
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              <span>Sort by</span>
              <div className="flex gap-1 rounded-lg border border-line p-1">
                {(["jobs", "tokens"] as SortKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
                    className={
                      "rounded-md px-2.5 py-1 font-medium capitalize transition-colors " +
                      (sort === k ? "bg-accent-700 text-[var(--surface)]" : "text-ink-soft hover:bg-black/[0.04]")
                    }
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {rows.length === 0 ? (
            <EmptyState title="No customers found" hint="Try a different search term or clear the filter." />
          ) : (
            <div className="scroll-fine max-w-full overflow-x-auto">
              <Table className="min-w-[44rem]">
                <THead>
                  <TR>
                    <TH>Customer</TH>
                    <TH>Plan</TH>
                    <TH>Status</TH>
                    <TH numeric>Jobs</TH>
                    <TH numeric>Tokens</TH>
                    <TH numeric>Keys</TH>
                    <TH>Last active</TH>
                  </TR>
                </THead>
                <TBody>
                  {rows.map((c) => (
                    <TR key={c.company_id}>
                      <TD>
                        <Link href={`/dashboard/admin/customers/${encodeURIComponent(c.company_id)}`} className="font-medium text-accent-700 hover:underline">
                          {c.name}
                        </Link>
                        <div className="truncate text-[11px] text-ink-soft">{c.email || c.company_id}</div>
                      </TD>
                      <TD className="text-ink-soft">{c.plan || "free"}</TD>
                      <TD>
                        <Badge tone={c.status !== "disabled" ? "success" : "danger"}>
                          {c.status === "disabled" ? "Disabled" : "Active"}
                        </Badge>
                      </TD>
                      <TD numeric>{c.jobs.toLocaleString()}</TD>
                      <TD numeric>{c.tokens.toLocaleString()}</TD>
                      <TD numeric className="text-ink-soft">{c.active_keys}</TD>
                      <TD className="font-mono text-xs text-ink-soft">{c.last_active ? c.last_active.slice(0, 10) : "-"}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
