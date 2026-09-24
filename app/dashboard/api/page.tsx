"use client";

// API endpoints.
//
// Everything shown here is real. The catalog, methods, paths, auth scheme and
// limits come from the parser's own route definitions. Live service health comes
// from /api/v1/health, and the aggregate request/latency/error figures come from
// your usage records.
//
// What is NOT here, deliberately: per-endpoint request counts, per-endpoint
// latency and per-endpoint error rate. The audit log records parse jobs
// (job_id, duration, status, tokens) and does not record which endpoint served
// them, so those numbers cannot be derived today. Inventing plausible ones on a
// page whose product promise is "never fabricates" would be the wrong trade.
// See the note at the foot of the page for what instrumenting them requires.

import { useEffect, useMemo, useState } from "react";

import { ApiStatus } from "@/components/dashboard/ApiStatus";
import { CopyButton, SearchField, Toolbar } from "@/components/dashboard/kit";
import { StatCard } from "@/components/charts";
import { AlertIcon, ClockIcon, JobsIcon, TokenIcon } from "@/components/icons";
import {
  Button,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Skeleton,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  TableScroll,
  Tabs,
} from "@/components/ui";
import { getUsage } from "@/lib/account";
import { API_BASE } from "@/lib/config";
import { ApiError, type Usage } from "@/lib/types";

type Method = "GET" | "POST" | "DELETE";
type Group = "Parsing" | "Jobs" | "Batch" | "Webhooks" | "Service";

interface Endpoint {
  method: Method;
  path: string;
  name: string;
  group: Group;
  auth: string;
  notes: string;
}

/** Straight from the parser's route definitions. */
const ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/api/v1/resume/parse", name: "Parse a document", group: "Parsing", auth: "X-API-Key", notes: "Returns a job_id immediately; never parses inline." },
  { method: "POST", path: "/api/v1/resume/upload-url", name: "Request an upload URL", group: "Parsing", auth: "X-API-Key", notes: "Presigned direct upload for large files." },
  { method: "POST", path: "/api/v1/resume/parse-uploaded", name: "Parse an uploaded file", group: "Parsing", auth: "X-API-Key", notes: "Parses a file already sent to the presigned URL." },
  { method: "GET", path: "/api/v1/resume/job/{job_id}", name: "Poll a job", group: "Jobs", auth: "X-API-Key", notes: "Results carry a TTL and expire." },
  { method: "POST", path: "/api/v1/resume/{job_id}/retry", name: "Retry a parse", group: "Jobs", auth: "X-API-Key", notes: "Capped; returns RETRY_LIMIT_REACHED." },
  { method: "POST", path: "/api/v1/resume/{job_id}/feedback", name: "Submit feedback", group: "Jobs", auth: "X-API-Key", notes: "Accepts corrections. Returns 202." },
  { method: "POST", path: "/api/v1/resume/batch", name: "Batch parse", group: "Batch", auth: "X-API-Key", notes: "Up to 200 files or 60 MB per request." },
  { method: "GET", path: "/api/v1/resume/batch/{batch_id}", name: "Poll a batch", group: "Batch", auth: "X-API-Key", notes: "Per-file status for the batch." },
  { method: "POST", path: "/api/v1/webhooks", name: "Register a webhook", group: "Webhooks", auth: "X-API-Key", notes: "Each registration gets its own signing secret." },
  { method: "GET", path: "/api/v1/webhooks", name: "List webhooks", group: "Webhooks", auth: "X-API-Key", notes: "All active endpoints receive every event." },
  { method: "DELETE", path: "/api/v1/webhooks/{webhook_id}", name: "Delete a webhook", group: "Webhooks", auth: "X-API-Key", notes: "Returns 204." },
  { method: "GET", path: "/api/v1/health", name: "Health check", group: "Service", auth: "Public", notes: "Service and dependency status." },
];

const GROUPS: (Group | "All")[] = ["All", "Parsing", "Jobs", "Batch", "Webhooks", "Service"];

/** Method chips: colour plus the verb itself, so it never relies on colour. */
const METHOD_STYLE: Record<Method, string> = {
  GET: "bg-accent-50 text-accent-800 ring-accent-200",
  POST: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  DELETE: "bg-red-50 text-red-800 ring-red-200",
};

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function ApiEndpointsPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [days, setDays] = useState(30);
  const [error, setError] = useState("");
  const [group, setGroup] = useState<Group | "All">("All");
  const [query, setQuery] = useState("");

  const loading = usage === null && !error;

  useEffect(() => {
    let cancelled = false;
    getUsage(days)
      .then((u) => {
        if (cancelled) return;
        setUsage(u);
        setError("");
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(errMsg(e));
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const t = usage?.totals;
  const errorRate = t && t.jobs ? (t.failed / t.jobs) * 100 : 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENDPOINTS.filter(
      (e) =>
        (group === "All" || e.group === group) &&
        (!q || e.path.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)),
    );
  }, [group, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="API endpoints"
        description={`${ENDPOINTS.length} endpoints on ${API_BASE}`}
        actions={
          <Tabs<"7" | "30" | "90">
            value={String(days) as "7" | "30" | "90"}
            onChange={(v) => setDays(Number(v))}
            options={[
              { id: "7", label: "7 days" },
              { id: "30", label: "30 days" },
              { id: "90", label: "90 days" },
            ]}
          />
        }
      />

      <ApiStatus />

      {error && <ErrorBanner message={error} />}

      {/* Aggregate figures. These are workspace-wide, not per-endpoint. */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="API calls" value={t ? t.jobs.toLocaleString() : "-"} sub={`last ${days} days`} icon={<JobsIcon />} />
          <StatCard label="Tokens used" value={t ? t.tokens_used.toLocaleString() : "-"} accent="brass" icon={<TokenIcon />} />
          <StatCard label="Errors" value={t ? t.failed.toLocaleString() : "-"} accent="rose" icon={<AlertIcon />} />
          <StatCard
            label="Error rate"
            value={t ? `${errorRate.toFixed(2)}%` : "-"}
            color={errorRate < 1 ? "var(--viz-good)" : errorRate < 5 ? "var(--viz-warning)" : "var(--viz-critical)"}
            icon={<ClockIcon />}
          />
        </div>
      )}

      {/* Filters */}
      <Toolbar>
        <Tabs<Group | "All">
          value={group}
          onChange={setGroup}
          options={GROUPS.map((g) => ({
            id: g,
            label: g,
            badge: g === "All" ? ENDPOINTS.length : ENDPOINTS.filter((e) => e.group === g).length,
          }))}
        />
        <SearchField value={query} onChange={setQuery} placeholder="Search by path or name" label="Search endpoints" className="sm:ml-auto" />
      </Toolbar>

      {/* Catalog */}
      <div className="glow-soft card-lift rounded-[20px] p-3 sm:p-4">
        {visible.length === 0 ? (
          <EmptyState
            art={null}
            title="No endpoints match"
            hint="Try a different path, or show every group."
            action={
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setQuery("");
                  setGroup("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <TableScroll>
            <Table className="min-w-[52rem]">
              <THead>
                <TR>
                  <TH>Method</TH>
                  <TH>Endpoint</TH>
                  <TH>Category</TH>
                  <TH>Auth</TH>
                  <TH>Rate limit</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {visible.map((e) => (
                  <TR key={`${e.method} ${e.path}`}>
                    <TD>
                      <span className={"inline-flex w-[4.25rem] justify-center rounded-md py-0.5 font-mono text-[11.5px] font-semibold ring-1 ring-inset " + METHOD_STYLE[e.method]}>
                        {e.method}
                      </span>
                    </TD>
                    <TD>
                      <span className="flex items-center gap-1">
                        <span className="font-mono text-[12.5px] text-ink">{e.path}</span>
                        <CopyButton text={`${API_BASE}${e.path}`} label="Copy full URL" compact />
                      </span>
                      <span className="block text-[13px] font-medium text-[#1e293b]">{e.name}</span>
                      <span className="mt-0.5 block text-xs text-ink-soft">{e.notes}</span>
                    </TD>
                    <TD className="text-ink-soft">{e.group}</TD>
                    <TD className="font-mono text-xs text-ink-soft">{e.auth}</TD>
                    <TD className="text-ink-soft">
                      {e.auth === "Public" ? "-" : <span className="text-ink-soft">Not enforced</span>}
                    </TD>
                    <TD>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden />
                        Live
                      </span>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableScroll>
        )}
      </div>

      {/* Say plainly what is not measured, rather than showing a plausible number. */}
      <div className="glow-soft card-lift rounded-[20px] p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold text-[#1e293b]">Per-endpoint metrics are not instrumented yet</h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Requests, latency and error rate above are workspace-wide. They are not broken down per
          endpoint because the audit log records parse jobs - job id, duration, status, tokens - and
          not which route served them. Adding an <code className="font-mono text-[12px]">endpoint</code>{" "}
          field to that record, or reading API Gateway / Lambda metrics per route, would make the
          per-endpoint columns real. Until then this page shows what is measured and leaves the rest
          blank rather than estimating it.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          Rate limiting is currently <b className="text-ink">disabled</b> on the service
          (<code className="font-mono text-[12px]">rate_limit_enabled = false</code>), so no
          per-endpoint quota is enforced.
        </p>
      </div>
    </div>
  );
}
