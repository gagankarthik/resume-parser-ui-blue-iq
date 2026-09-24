"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CopyButton, RelativeTime, SearchField, SecretPanel, Toolbar, useConfirm } from "@/components/dashboard/kit";
import { AlertIcon, RefreshIcon, TrashIcon, WebhookIcon } from "@/components/icons";
import { HookArt } from "@/components/illustrations";
import { Button, Card, EmptyState, ErrorBanner, Input, Label, PageHeader, Skeleton, Tabs } from "@/components/ui";
import { createWebhook, deleteWebhook, listWebhooks } from "@/lib/account";
import { ApiError, type CreatedWebhook, type Webhook, type WebhookEvent } from "@/lib/types";

const EVENTS: { id: WebhookEvent; label: string; hint: string }[] = [
  { id: "parse.completed", label: "parse.completed", hint: "A single parse finished." },
  { id: "parse.failed", label: "parse.failed", hint: "A single parse failed, with its error code." },
  { id: "batch.completed", label: "batch.completed", hint: "Every file in a batch is done." },
];

type EventFilter = "all" | WebhookEvent;

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

/** Trailing slash and case in the host are not meaningful; the rest is. */
function sameEndpoint(a: string, b: string): boolean {
  const norm = (u: string) => {
    try {
      const p = new URL(u.trim());
      return `${p.protocol}//${p.host.toLowerCase()}${p.pathname.replace(/\/$/, "")}${p.search}`;
    } catch {
      return u.trim().replace(/\/$/, "");
    }
  };
  return norm(a) === norm(b);
}

/** Host shown large, path small: the host is what people scan for. */
function splitUrl(u: string): { host: string; rest: string } {
  try {
    const p = new URL(u);
    return { host: p.host, rest: `${p.pathname}${p.search}` };
  } catch {
    return { host: u, rest: "" };
  }
}

export default function WebhooksPage() {
  const [hooks, setHooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>(["parse.completed", "parse.failed"]);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<CreatedWebhook | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EventFilter>("all");
  const [confirm, dialog] = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setHooks(await listWebhooks());
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggle(ev: WebhookEvent) {
    setEvents((prev) => (prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]));
  }

  // Registering the same URL twice mints a second, independent secret. Both
  // registrations then receive every event, each signed with its own secret, so the
  // one you have configured verifies half the deliveries and rejects the rest - and
  // a rejected delivery is never retried. Warn before it happens rather than leaving
  // it to be diagnosed from logs weeks later.
  const duplicate = url.trim() ? hooks.find((h) => sameEndpoint(h.url, url)) : undefined;

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || events.length === 0) return;
    if (duplicate) {
      const ok = await confirm({
        title: "This URL is already registered",
        body: (
          <>
            Adding it again creates a <b className="text-ink">second</b> registration with its own signing secret. Both
            receive every event, and the secret you already hold verifies only one of them; the other&apos;s deliveries
            are rejected and dropped. Delete the existing registration instead, unless you really want two.
          </>
        ),
        confirm: "Add a second registration",
        tone: "danger",
      });
      if (!ok) return;
    }
    setCreating(true);
    setError("");
    setCreated(null);
    try {
      setCreated(await createWebhook(url.trim(), events));
      setUrl("");
      await load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(h: Webhook) {
    const ok = await confirm({
      title: "Delete this webhook?",
      body: (
        <>
          <span className="break-all font-mono text-[13px] text-ink">{h.url}</span> stops receiving events immediately. Anything
          still in flight is not redelivered.
        </>
      ),
      confirm: "Delete webhook",
      tone: "danger",
    });
    if (!ok) return;
    setBusy(h.webhook_id);
    try {
      await deleteWebhook(h.webhook_id);
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  const counts = useMemo(() => {
    const c: Record<EventFilter, number> = { all: hooks.length, "parse.completed": 0, "parse.failed": 0, "batch.completed": 0 };
    for (const h of hooks) for (const ev of h.events) c[ev] += 1;
    return c;
  }, [hooks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hooks
      .filter((h) => filter === "all" || h.events.includes(filter))
      .filter((h) => !q || h.url.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [hooks, query, filter]);

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title="Webhooks"
        description="Get parse results pushed to your server instead of polling. Every delivery is signed with HMAC-SHA256."
      />

      {error && <ErrorBanner message={error} />}

      {created && (
        <SecretPanel
          title="Copy the signing secret now"
          value={created.hmac_secret}
          hint={
            <>
              Verify each delivery with HMAC-SHA256 over <code className="font-mono text-[13px] text-ink">{"{timestamp}.{raw body}"}</code>.
              The secret belongs to this registration and is never shown again.
            </>
          }
          onDismiss={() => setCreated(null)}
        />
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        {/* Register */}
        <Card className="xl:sticky xl:top-6">
          <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">Add an endpoint</h2>
          <p className="mt-1 text-sm text-ink-soft">Public HTTPS URLs only. Pick at least one event.</p>
          <form onSubmit={onCreate} className="mt-5 space-y-5">
            <div>
              <Label>Endpoint URL</Label>
              <Input type="url" value={url} placeholder="https://your-app.com/hooks/capture" onChange={(e) => setUrl(e.target.value)} required />
              {duplicate && (
                <p className="mt-2 flex gap-2 rounded-lg bg-mark-soft px-3 py-2 text-sm text-mark-ink ring-1 ring-[#e8c65a]">
                  <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  Already registered. A second registration gets its own secret, and yours would verify only one of them.
                </p>
              )}
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-[#1e293b]">Events</legend>
              <div className="space-y-2">
                {EVENTS.map((ev) => {
                  const on = events.includes(ev.id);
                  return (
                    <label
                      key={ev.id}
                      className={
                        "flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors " +
                        (on ? "border-accent-500 ring-1 ring-accent-500" : "border-control hover:border-ink")
                      }
                    >
                      <input type="checkbox" checked={on} onChange={() => toggle(ev.id)} className="mt-0.5 h-4 w-4 accent-accent-600" />
                      <span>
                        <code className="block font-mono text-[13px] font-medium text-ink">{ev.label}</code>
                        <span className="block text-xs text-ink-soft">{ev.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <Button type="submit" className="w-full" loading={creating} disabled={!url.trim() || events.length === 0}>
              Add webhook
            </Button>
          </form>
        </Card>

        {/* Registered */}
        <Card className="min-w-0">
          <Toolbar className="mb-4">
            <Tabs<EventFilter>
              value={filter}
              onChange={setFilter}
              options={[
                { id: "all", label: "All", badge: counts.all },
                ...EVENTS.map((ev) => ({ id: ev.id as EventFilter, label: ev.label, badge: counts[ev.id] })),
              ]}
            />
            <SearchField value={query} onChange={setQuery} placeholder="Search by URL" label="Search webhooks" className="sm:ml-auto" />
          </Toolbar>

          {loading && hooks.length === 0 ? (
            <div className="space-y-2" aria-busy="true">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : hooks.length === 0 ? (
            <EmptyState art={<HookArt />} title="No webhooks yet" hint="Add an endpoint and results arrive on your server as soon as each parse finishes." />
          ) : visible.length === 0 ? (
            <EmptyState
              art={null}
              title="No webhooks match"
              hint="Try another URL or show every event."
              action={
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {visible.map((h) => {
                const { host, rest } = splitUrl(h.url);
                const active = h.status !== "inactive" && h.status !== "disabled";
                return (
                  <li key={h.webhook_id} className="panel-lift rounded-xl bg-white p-4 ring-1 ring-black/[0.04]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-600">
                        <WebhookIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="truncate text-[15px] font-semibold text-ink">{host}</p>
                          <CopyButton text={h.url} label="Copy URL" compact />
                        </div>
                        {rest && <p className="truncate font-mono text-xs text-ink-soft">{rest}</p>}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          {h.events.map((ev) => (
                            <span key={ev} className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-[11.5px] text-ink ring-1 ring-inset ring-control">
                              {ev}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                          <span className="inline-flex items-center gap-1.5">
                            <span className={"h-2 w-2 rounded-full " + (active ? "bg-emerald-600" : "bg-ink-soft")} aria-hidden />
                            {active ? "Receiving events" : h.status}
                          </span>
                          <span>
                            Added <RelativeTime iso={h.created_at} />
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-red-700 hover:bg-red-50 hover:text-red-800"
                        loading={busy === h.webhook_id}
                        onClick={() => onDelete(h)}
                        type="button"
                        aria-label={`Delete webhook ${h.url}`}
                      >
                        {busy !== h.webhook_id && <TrashIcon className="h-4 w-4" />}
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {hooks.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
              <span>
                Showing {visible.length} of {hooks.length}
              </span>
              <button type="button" onClick={load} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold hover:bg-white hover:text-ink">
                <RefreshIcon className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
