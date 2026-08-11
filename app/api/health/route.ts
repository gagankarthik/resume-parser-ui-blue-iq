// Proxies the parser's health check so the dashboard can show live service
// status. Server-side so the backend URL and any credentials stay off the
// client, and no-store so the browser never shows a cached "ok" for a service
// that has since gone down.
import { API_BASE } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  try {
    const res = await fetch(`${API_BASE}/api/v1/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => null);
    return Response.json(
      { reachable: res.ok, http: res.status, rttMs: Date.now() - started, ...(body ?? {}) },
      { status: 200 },
    );
  } catch (e) {
    // A failure here IS the answer - report it as down rather than 500ing.
    return Response.json(
      {
        reachable: false,
        rttMs: Date.now() - started,
        status: "unreachable",
        error: e instanceof Error ? e.message : "unreachable",
      },
      { status: 200 },
    );
  }
}
