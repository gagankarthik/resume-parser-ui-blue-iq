"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui";

/**
 * Error boundary for the dashboard segment. Anything a dashboard page throws
 * lands here instead of a blank screen, and `reset()` re-runs the failed render
 * so a transient API blip recovers without a full reload.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-line bg-surface p-8">
          <h1 className="font-display text-xl font-bold tracking-tight text-ink">
            Something went wrong here.
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            This page failed to load. It is usually a temporary problem reaching the API.
          </p>
          {error.digest && (
            <p className="mt-3 font-mono text-[11px] text-ink-soft/60">ref {error.digest}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Button onClick={reset} type="button">Try again</Button>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
