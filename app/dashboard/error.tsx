"use client";

import Link from "next/link";
import { useEffect } from "react";

import { UnpluggedArt } from "@/components/illustrations";
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
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="glow-peach card-lift w-full max-w-md rounded-[20px] px-6 py-10 text-center">
        <UnpluggedArt className="mx-auto h-auto w-52" />
        <h1 className="mt-6 text-xl font-semibold text-[#1e293b]">This page could not load</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          The dashboard lost its connection to the API. That is usually brief; try again in a moment.
        </p>
        {error.digest && <p className="mt-3 font-mono text-xs text-ink-soft">Reference {error.digest}</p>}
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button onClick={reset} type="button">
            Try again
          </Button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-black bg-white px-4 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#f4f8f9]"
          >
            Back to overview
          </Link>
        </div>
      </div>
    </div>
  );
}
