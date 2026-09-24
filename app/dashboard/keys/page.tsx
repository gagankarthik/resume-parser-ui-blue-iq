"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CopyButton, RelativeTime, SearchField, SecretPanel, Toolbar, useConfirm } from "@/components/dashboard/kit";
import { DownloadIcon, KeyIcon, PlusIcon, RefreshIcon } from "@/components/icons";
import { KeyArt } from "@/components/illustrations";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Select,
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
import { createKey, listKeys, revokeKey } from "@/lib/account";
import { API_BASE, AUTH_HEADER, PARSE_ENDPOINT } from "@/lib/config";
import { ApiError, type ApiKeyInfo, type IssuedKey } from "@/lib/types";

type StatusFilter = "all" | "active" | "revoked";
type Sort = "newest" | "oldest";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

/** Quote a CSV field only when it contains a comma, quote, or newline. */
function csvField(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Download the issued key + integration details as a .csv file. */
function downloadKeyCsv(key: IssuedKey): void {
  const rows: [string, string][] = [
    ["name", "value"],
    ["api_key", key.api_key],
    ["base_url", API_BASE],
    ["auth_header", AUTH_HEADER],
    ["parse_endpoint", PARSE_ENDPOINT],
    ["created_at", key.created_at],
  ];
  const csv = rows.map((r) => r.map(csvField).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `blue-iq-api-key-${key.key_prefix.replace(/[^a-zA-Z0-9]/g, "")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [busyHash, setBusyHash] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [confirm, dialog] = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setKeys(await listKeys());
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate() {
    setCreating(true);
    setError("");
    setIssued(null);
    try {
      setIssued(await createKey());
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setCreating(false);
    }
  }

  async function onRevoke(k: ApiKeyInfo) {
    const ok = await confirm({
      title: `Revoke ${k.key_prefix}?`,
      body: (
        <>
          Requests signed with this key start failing with <code className="font-mono text-[13px] text-ink">REVOKED_API_KEY</code>{" "}
          straight away. This cannot be undone; you would issue a new key instead.
        </>
      ),
      confirm: "Revoke key",
      tone: "danger",
    });
    if (!ok) return;
    setBusyHash(k.key_hash);
    try {
      await revokeKey(k.key_hash);
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusyHash(null);
    }
  }

  const counts = useMemo(
    () => ({
      all: keys.length,
      active: keys.filter((k) => k.status === "active").length,
      revoked: keys.filter((k) => k.status !== "active").length,
    }),
    [keys],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return keys
      .filter((k) => status === "all" || (status === "active" ? k.status === "active" : k.status !== "active"))
      .filter((k) => !q || k.key_prefix.toLowerCase().includes(q))
      .sort((a, b) => {
        const d = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sort === "newest" ? -d : d;
      });
  }, [keys, query, status, sort]);

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title="API keys"
        description="Keys authenticate every request to the parsing API. Each one is shown in full only once, when you create it."
        actions={
          <Button onClick={onCreate} loading={creating} type="button">
            {!creating && <PlusIcon className="h-4 w-4" />}
            Create key
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      {issued && (
        <SecretPanel
          title="Copy your new key now"
          value={issued.api_key}
          hint="This is the only time the full key is shown. The CSV bundles it with the base URL, auth header and parse endpoint, ready for your config."
          onDismiss={() => setIssued(null)}
          actions={
            <Button variant="secondary" type="button" onClick={() => downloadKeyCsv(issued)}>
              <DownloadIcon className="h-4 w-4" />
              CSV
            </Button>
          }
        />
      )}

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="min-w-0">
          <Toolbar className="mb-4">
            <Tabs<StatusFilter>
              value={status}
              onChange={setStatus}
              options={[
                { id: "all", label: "All", badge: counts.all },
                { id: "active", label: "Active", badge: counts.active },
                { id: "revoked", label: "Revoked", badge: counts.revoked },
              ]}
            />
            <div className="flex gap-2 sm:ml-auto">
              <SearchField value={query} onChange={setQuery} placeholder="Search by prefix" label="Search keys" />
              <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort keys">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </Select>
            </div>
          </Toolbar>

          {loading && keys.length === 0 ? (
            <div className="space-y-2" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <EmptyState
              art={<KeyArt />}
              title="No API keys yet"
              hint="Create a key to start sending documents. Copy it straight away; it is not shown again."
              action={
                <Button onClick={onCreate} loading={creating} type="button">
                  Create your first key
                </Button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              art={null}
              title="No keys match"
              hint="Try another prefix, or show all statuses."
              action={
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <TableScroll>
              <Table className="min-w-[30rem]">
                <THead>
                  <TR>
                    <TH>Key</TH>
                    <TH>Status</TH>
                    <TH>Created</TH>
                    <TH className="text-right">
                      <span className="sr-only">Actions</span>
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {visible.map((k) => {
                    const active = k.status === "active";
                    return (
                      <TR key={k.key_hash}>
                        <TD>
                          <div className="flex items-center gap-3">
                            <span
                              className={
                                "grid h-9 w-9 shrink-0 place-items-center rounded-full " +
                                (active ? "bg-accent-50 text-accent-600" : "bg-paper text-ink-soft")
                              }
                            >
                              <KeyIcon className="h-[18px] w-[18px]" />
                            </span>
                            <span className={"font-mono text-[13px] " + (active ? "text-ink" : "text-ink-soft line-through decoration-line-strong")}>
                              {k.key_prefix}
                            </span>
                            <CopyButton text={k.key_prefix} label="Copy prefix" compact />
                          </div>
                        </TD>
                        <TD>
                          <span className="inline-flex items-center gap-2 text-sm">
                            <span className={"h-2 w-2 rounded-full " + (active ? "bg-emerald-600" : "bg-red-600")} aria-hidden />
                            {active ? "Active" : "Revoked"}
                          </span>
                        </TD>
                        <TD className="text-ink-soft">
                          <RelativeTime iso={k.created_at} />
                        </TD>
                        <TD className="text-right">
                          {active && (
                            <Button
                              variant="ghost"
                              className="text-red-700 hover:bg-red-50 hover:text-red-800"
                              loading={busyHash === k.key_hash}
                              onClick={() => onRevoke(k)}
                              type="button"
                            >
                              Revoke
                            </Button>
                          )}
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </TableScroll>
          )}

          {keys.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
              <span>
                Showing {visible.length} of {keys.length} {keys.length === 1 ? "key" : "keys"}
              </span>
              <button type="button" onClick={load} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold hover:bg-white/70 hover:text-ink">
                <RefreshIcon className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">Use a key</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Send it in the <code className="font-mono text-[13px] text-ink">{AUTH_HEADER}</code> header, from your server only.
          </p>
          <pre className="scroll-fine mt-4 overflow-x-auto rounded-xl bg-[#0d1c40] p-4 font-mono text-[12px] leading-[1.7] text-[#dbe6ff]">
            {`curl -X POST \\
  "${API_BASE}${PARSE_ENDPOINT}" \\
  -H "${AUTH_HEADER}: rp_live_..." \\
  -F "file=@resume.pdf"`}
          </pre>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>One key per environment makes a leak cheap to contain.</li>
            <li>Revoking takes effect on the next request.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
