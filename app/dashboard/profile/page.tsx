"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { CopyButton, RelativeTime } from "@/components/dashboard/kit";
import { KeyIcon, LogoutIcon } from "@/components/icons";
import { Badge, Button, Card, ErrorBanner, PageHeader, Skeleton } from "@/components/ui";
import { getMe, logout, type Me } from "@/lib/account";
import { ApiError } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
      <dt className="text-xs font-medium text-ink-soft">{term}</dt>
      <dd className="mt-1 min-w-0 break-words text-[15px] font-medium text-ink">{children}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setMe(await getMe());
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const status = me?.company.status || "active";

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account, your organization, and this session." />

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-28 rounded-[20px]" />
          <Skeleton className="h-64 rounded-[20px]" />
        </div>
      ) : me ? (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <Card>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-black bg-white text-2xl font-semibold text-ink">
                  {(me.name || me.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-semibold text-ink">{me.name || me.company.name || me.email}</p>
                  <p className="truncate text-sm text-ink-soft">{me.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="info">{(me.company.plan || "free").replace(/^\w/, (c) => c.toUpperCase())} plan</Badge>
                  <Badge tone={status === "active" ? "success" : "warning"}>{status.replace(/^\w/, (c) => c.toUpperCase())}</Badge>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">Organization</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <Detail term="Name">{me.company.name || "-"}</Detail>
                <Detail term="Contact email">{me.email}</Detail>
                <Detail term="Account ID">
                  <span className="flex items-center gap-1">
                    <span className="min-w-0 truncate font-mono text-[13px]">{me.company.company_id}</span>
                    <CopyButton text={me.company.company_id} label="Copy account ID" compact />
                  </span>
                </Detail>
                <Detail term="Member since">
                  {me.company.created_at ? (
                    <>
                      {new Date(me.company.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                      <span className="block text-xs font-normal text-ink-soft">
                        <RelativeTime iso={me.company.created_at} />
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </Detail>
              </dl>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-600">
                  <KeyIcon />
                </span>
                <div>
                  <p className="text-2xl font-medium leading-none tabular-nums text-ink">{me.active_key_count}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    active {me.active_key_count === 1 ? "key" : "keys"} of {me.key_count}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/keys" className="mt-4 inline-block text-sm font-semibold text-accent-700 underline-offset-4 hover:underline">
                Manage API keys
              </Link>
            </Card>

            <Card>
              <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">Session</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                Sign-in is handled by AWS Cognito. Signing out ends this browser session only.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                loading={signingOut}
                onClick={async () => {
                  setSigningOut(true);
                  await logout();
                  router.push("/login");
                  router.refresh();
                }}
              >
                {!signingOut && <LogoutIcon className="h-4 w-4" />}
                Sign out
              </Button>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
