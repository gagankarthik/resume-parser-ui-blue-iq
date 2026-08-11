"use client";

// Live service status strip. Polls the health proxy so the dashboard answers
// "is the API up right now?" without the user opening another tab.

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui";

interface Health {
  reachable: boolean;
  status?: string;
  version?: string;
  environment?: string;
  latency_ms?: number;
  rttMs?: number;
  dependencies?: Record<string, string>;
}

const DOT = {
  up: "bg-[var(--viz-good)]",
  degraded: "bg-[var(--viz-warning)]",
  down: "bg-[var(--viz-critical)]",
} as const;

/** A dependency reporting anything other than a known-good token is degraded,
 *  not down - the API answered, so the service is reachable. */
function classify(h: Health): keyof typeof DOT {
  if (!h.reachable) return "down";
  const deps = Object.values(h.dependencies ?? {});
  const bad = deps.filter((d) => d !== "ok" && d !== "queue");
  if (h.status !== "ok" || bad.length) return "degraded";
  return "up";
}

export function ApiStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((h: Health) => {
        if (!cancelled) setHealth(h);
      })
      .catch(() => {
        if (!cancelled) setHealth({ reachable: false, status: "unreachable" });
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  // Re-check every 30s so a service that drops is noticed without a reload.
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!health) return <Skeleton className="h-[68px]" />;

  const state = classify(health);
  const label = state === "up" ? "All systems operational" : state === "degraded" ? "Degraded" : "Unreachable";
  const deps = Object.entries(health.dependencies ?? {});

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-line bg-surface px-5 py-4">
      <span className="inline-flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          {state === "up" && (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${DOT[state]} opacity-60`} />
          )}
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${DOT[state]}`} />
        </span>
        <span className="text-sm font-semibold text-ink">{label}</span>
      </span>

      {health.reachable && (
        <>
          <Metric label="Response" value={`${health.latency_ms ?? health.rttMs ?? 0} ms`} />
          {health.version && <Metric label="Version" value={health.version} />}
          {health.environment && <Metric label="Environment" value={health.environment} />}
        </>
      )}

      {deps.length > 0 && (
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {deps.map(([name, value]) => (
            <span key={name} className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <span
                className={`h-1.5 w-1.5 rounded-full ${value === "ok" || value === "queue" ? DOT.up : DOT.degraded}`}
                aria-hidden
              />
              <span className="font-mono">{name}</span>
              <span className="text-ink-soft/60">{value}</span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 text-xs">
      <span className="text-ink-soft/70">{label}</span>
      <span className="font-mono font-medium text-ink">{value}</span>
    </span>
  );
}
