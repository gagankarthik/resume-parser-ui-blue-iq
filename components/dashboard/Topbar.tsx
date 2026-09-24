"use client";

// Desktop top bar: where you are, whether the API is up, and the account
// menu at the far end. The status pill
// polls the same health proxy as the API endpoints page, once a minute, and
// links there for the detail.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronIcon, DocsIcon } from "@/components/icons";
import { UserMenu } from "@/components/dashboard/UserMenu";

const NAMES: Record<string, string> = {
  dashboard: "Overview",
  api: "API endpoints",
  keys: "API keys",
  webhooks: "Webhooks",
  profile: "Profile",
  admin: "Admin",
  customers: "Customers",
  data: "Data",
};

function crumbs(pathname: string): { href: string; label: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  const out: { href: string; label: string }[] = [];
  let href = "";
  for (const p of parts) {
    href += `/${p}`;
    // A path segment we do not name (a company id) reads as "Customer".
    out.push({ href, label: NAMES[p] ?? "Customer" });
  }
  return out;
}

type State = "up" | "degraded" | "down" | "checking";

export function Topbar({ email, isAdmin }: { email: string; isAdmin?: boolean }) {
  const pathname = usePathname();
  const trail = crumbs(pathname);
  const [state, setState] = useState<State>("checking");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((h: { reachable?: boolean; status?: string; dependencies?: Record<string, string> }) => {
        if (cancelled) return;
        if (!h.reachable) return setState("down");
        const bad = Object.values(h.dependencies ?? {}).filter((d) => d !== "ok" && d !== "queue");
        setState(h.status !== "ok" || bad.length ? "degraded" : "up");
      })
      .catch(() => !cancelled && setState("down"));
    return () => {
      cancelled = true;
    };
  }, [tick]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const pill = {
    up: { dot: "bg-emerald-600", text: "API operational" },
    degraded: { dot: "bg-amber-600", text: "API degraded" },
    down: { dot: "bg-red-600", text: "API unreachable" },
    checking: { dot: "bg-ink-soft", text: "Checking API" },
  }[state];

  return (
    <div className="hidden h-16 items-center justify-between gap-4 border-b border-black/[0.06] px-7 md:flex lg:px-10">
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 text-sm">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            // "/dashboard" is the Overview; show it only as the root crumb.
            const label = i === 0 && trail.length > 1 ? "Dashboard" : c.label;
            return (
              <li key={c.href} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-ink-soft" />}
                {last ? (
                  <span aria-current="page" className="truncate font-semibold text-ink">
                    {label}
                  </span>
                ) : (
                  <Link href={c.href} className="truncate text-ink-soft hover:text-ink">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/dashboard/api"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-control bg-white px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-ink"
          aria-live="polite"
        >
          <span className="relative flex h-2 w-2">
            {state === "up" && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pill.dot} opacity-50 motion-reduce:hidden`} />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${pill.dot}`} />
          </span>
          {pill.text}
        </Link>
        <Link
          href="/docs"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-control bg-white px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-ink"
        >
          <DocsIcon className="h-4 w-4 text-accent-600" />
          Docs
        </Link>
        <span className="mx-1 h-6 w-px bg-line" aria-hidden />
        <UserMenu email={email} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
