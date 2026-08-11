"use client";

// Blue-IQ chart primitives — dependency-free SVG + CSS.
//
// Mirrored in the other app so both read as one product. The conventions below
// are deliberate, not taste:
//   * Series colour comes from the --viz-N tokens in FIXED order and is never
//     cycled or reassigned by rank, so filtering a series never repaints the
//     survivors. The palette is validated (lightness, chroma, CVD separation,
//     contrast) — see tokens.css before changing a value.
//   * One axis. Never two y-scales on one plot; two measures → two charts.
//   * Every plot ships a hover layer (crosshair/tooltip), and ≥2 series always
//     carry a legend, so identity is never colour-alone.
//   * Text wears ink tokens, never the series colour; grid/axes stay recessive.
// ═════════════════════════════════════════════════════════════════════════════

import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

/** Categorical series colours, in fixed assignment order. */
export const VIZ = [
  "var(--viz-1)",
  "var(--viz-2)",
  "var(--viz-3)",
  "var(--viz-4)",
  "var(--viz-5)",
  "var(--viz-6)",
] as const;

/** Reserved state colours — never reused as "series 7". */
export const VIZ_STATUS = {
  good: "var(--viz-good)",
  warning: "var(--viz-warning)",
  serious: "var(--viz-serious)",
  critical: "var(--viz-critical)",
} as const;

export function seriesColor(i: number): string {
  return VIZ[i % VIZ.length];
}

function Empty({ label = "No data yet" }: { label?: string }) {
  return <div className="grid h-32 place-items-center text-sm text-ink-soft/70">{label}</div>;
}

function Frame({ title, aside, children }: { title?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      {(title || aside) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && <h3 className="font-display text-sm font-semibold tracking-tight text-ink">{title}</h3>}
          {aside}
        </div>
      )}
      {children}
    </div>
  );
}

/** Legend — always rendered for ≥2 series. */
export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((s) => (
        <li key={s.label} className="flex items-center gap-1.5 text-xs text-ink-soft">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} aria-hidden />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/* ── Stat tile ─────────────────────────────────────────────────────────────── */

/** Named accents kept for call-site convenience — each resolves to a validated
 *  token, so no page hardcodes a hex. `color` overrides when a series colour is
 *  needed instead (e.g. a tile that matches a line on a chart below it). */
const ACCENTS: Record<string, string> = {
  accent: VIZ[0],
  brass: VIZ[1],
  cyan: VIZ[2],
  rose: VIZ[3],
  violet: VIZ[4],
  green: VIZ[5],
  amber: VIZ_STATUS.warning,
  ink: "var(--ink-soft)",
};

export function StatCard({
  label,
  value,
  sub,
  accent = "accent",
  color,
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: keyof typeof ACCENTS | (string & {});
  color?: string;
  icon?: ReactNode;
}) {
  const resolved = color ?? ACCENTS[accent] ?? VIZ[0];
  return (
    <div className="group rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)] transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_18px_40px_-30px_rgba(10,23,51,0.4)]">
      <div className="flex items-center justify-between gap-2">
        <div className="label-caps flex items-center gap-2 text-ink-soft">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: resolved }} aria-hidden />
          {label}
        </div>
        {icon && (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: `color-mix(in oklab, ${resolved} 10%, transparent)`, color: resolved, boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${resolved} 18%, transparent)` }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-soft">{sub}</div>}
    </div>
  );
}

/* ── Sparkline ─────────────────────────────────────────────────────────────── */

export function Sparkline({ data, color = VIZ[0], className = "h-8 w-24" }: { data: number[]; color?: string; className?: string }) {
  if (data.length < 2) return <span className={className} />;
  const W = 100;
  const H = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${((i / (data.length - 1)) * W).toFixed(1)} ${(H - ((v - min) / span) * H).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ── Time series ───────────────────────────────────────────────────────────── */

export interface Point {
  date: string;
  value: number;
}

/** Single-series area chart with crosshair + tooltip. No legend: the title names it. */
export function AreaChart({ data, label, color = VIZ[0], format }: { data: Point[]; label: string; color?: string; format?: (n: number) => string }) {
  const gid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const fmt = format ?? ((n: number) => n.toLocaleString());

  const W = 640;
  const H = 200;
  const PAD = 8;
  const n = data.length;
  const max = Math.max(1, ...data.map((d) => d.value));
  const x = (i: number) => (n <= 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (n - 1));
  const y = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const area = n ? `${line} L ${x(n - 1).toFixed(1)} ${H - PAD} L ${x(0).toFixed(1)} ${H - PAD} Z` : "";

  function onMove(e: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  }

  return (
    <Frame
      title={label}
      aside={
        hover !== null && data[hover] ? (
          <span className="font-mono text-xs text-ink-soft">
            {data[hover].date} · <b className="text-ink">{fmt(data[hover].value)}</b>
          </span>
        ) : null
      }
    >
      {n === 0 ? (
        <Empty />
      ) : (
        <div ref={wrapRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#g-${gid})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {hover !== null && (
              <>
                <line x1={x(hover)} y1={PAD} x2={x(hover)} y2={H - PAD} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" vectorEffect="non-scaling-stroke" />
                <circle cx={x(hover)} cy={y(data[hover].value)} r="4.5" fill={color} stroke="var(--surface)" strokeWidth="2" />
              </>
            )}
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-soft/70">
            <span>{data[0]?.date}</span>
            <span>{data[n - 1]?.date}</span>
          </div>
        </div>
      )}
    </Frame>
  );
}

export interface Series {
  label: string;
  points: Point[];
}

/** Multi-series line chart — one y-axis, legend always present, shared crosshair. */
export function LineChart({ series, label, format }: { series: Series[]; label: string; format?: (n: number) => string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const fmt = format ?? ((n: number) => n.toLocaleString());

  const W = 640;
  const H = 200;
  const PAD = 8;
  const n = Math.max(0, ...series.map((s) => s.points.length));
  const max = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.value)));
  const x = (i: number) => (n <= 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (n - 1));
  const y = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);

  function onMove(e: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  }

  const axis = series[0]?.points ?? [];

  return (
    <Frame
      title={label}
      aside={hover !== null && axis[hover] ? <span className="font-mono text-xs text-ink-soft">{axis[hover].date}</span> : null}
    >
      {n === 0 ? (
        <Empty />
      ) : (
        <>
          <div ref={wrapRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full overflow-visible" preserveAspectRatio="none">
              {/* Recessive gridlines. */}
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - 2 * PAD)} y2={PAD + f * (H - 2 * PAD)} stroke="var(--viz-grid)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              ))}
              {series.map((s, si) => (
                <path
                  key={s.label}
                  d={s.points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ")}
                  fill="none"
                  stroke={seriesColor(si)}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {hover !== null && (
                <>
                  <line x1={x(hover)} y1={PAD} x2={x(hover)} y2={H - PAD} stroke="var(--viz-axis)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" vectorEffect="non-scaling-stroke" />
                  {series.map((s, si) =>
                    s.points[hover] ? (
                      <circle key={s.label} cx={x(hover)} cy={y(s.points[hover].value)} r="4.5" fill={seriesColor(si)} stroke="var(--surface)" strokeWidth="2" />
                    ) : null,
                  )}
                </>
              )}
            </svg>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-soft/70">
              <span>{axis[0]?.date}</span>
              <span>{axis[axis.length - 1]?.date}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <Legend items={series.map((s, i) => ({ label: s.label, color: seriesColor(i) }))} />
            {hover !== null && (
              <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-ink-soft">
                {series.map((s) =>
                  s.points[hover] ? (
                    <li key={s.label}>
                      <span className="text-ink-soft">{s.label}</span>{" "}
                      <b className="tabular-nums text-ink">{fmt(s.points[hover].value)}</b>
                    </li>
                  ) : null,
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </Frame>
  );
}

/** Vertical time bars with per-bar hover. Rounded data-ends, 2px surface gaps. */
export function BarChart({ data, label, color = VIZ[0], format }: { data: Point[]; label: string; color?: string; format?: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const fmt = format ?? ((n: number) => n.toLocaleString());
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <Frame
      title={label}
      aside={
        hover !== null && data[hover] ? (
          <span className="font-mono text-xs text-ink-soft">
            {data[hover].date} · <b className="text-ink">{fmt(data[hover].value)}</b>
          </span>
        ) : null
      }
    >
      {data.length === 0 ? (
        <Empty />
      ) : (
        <>
          <div className="flex h-44 items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
            {data.map((d, i) => (
              <button
                key={`${d.date}-${i}`}
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                aria-label={`${d.date}: ${fmt(d.value)}`}
                className="group relative flex h-full flex-1 items-end rounded-t-[4px] outline-none"
              >
                <span
                  className="w-full rounded-t-[4px] transition-opacity"
                  style={{
                    height: `${Math.max(2, (d.value / max) * 100)}%`,
                    background: color,
                    opacity: hover === null || hover === i ? 1 : 0.35,
                  }}
                />
              </button>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-soft/70">
            <span>{data[0]?.date}</span>
            <span>{data[data.length - 1]?.date}</span>
          </div>
        </>
      )}
    </Frame>
  );
}

/* ── Share / identity ──────────────────────────────────────────────────────── */

/** Interactive donut — hover a segment or legend row to focus it. */
export function Donut({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; color?: string }[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);

  const r = 54;
  const C = 2 * Math.PI * r;
  const arcs = segments.map((s, i) => {
    const frac = total ? s.value / total : 0;
    const start = segments.slice(0, i).reduce((sum, p) => sum + (total ? p.value / total : 0) * C, 0);
    return { ...s, color: s.color ?? seriesColor(i), dash: frac * C, start, frac };
  });

  const focused = active !== null ? arcs[active] : null;
  const centerValue = focused ? focused.value : total;
  const centerLabel = focused ? `${Math.round(focused.frac * 100)}%` : "total";

  return (
    <Frame title={title}>
      {total === 0 ? (
        <Empty />
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-32 w-32 shrink-0">
            <svg viewBox="0 0 132 132" className="h-32 w-32 -rotate-90">
              <circle cx="66" cy="66" r={r} fill="none" stroke="var(--viz-grid)" strokeWidth="15" />
              {arcs.map((a, i) => (
                <circle
                  key={a.label}
                  cx="66"
                  cy="66"
                  r={r}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={active === i ? 18 : 15}
                  strokeDasharray={`${Math.max(0, a.dash - 2)} ${C - Math.max(0, a.dash - 2)}`}
                  strokeDashoffset={C - a.start}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                  opacity={active === null || active === i ? 1 : 0.3}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full text-center">
              <div>
                <div className="font-display text-xl font-semibold tabular-nums text-ink">{centerValue.toLocaleString()}</div>
                <div className="label-caps text-ink-soft/70">{centerLabel}</div>
              </div>
            </div>
          </div>
          <ul className="w-full flex-1 space-y-1.5 text-sm">
            {arcs.map((s, i) => (
              <li
                key={s.label}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cnLocal("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors", active === i && "bg-black/[0.04]")}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm transition-transform" style={{ background: s.color, transform: active === i ? "scale(1.25)" : undefined }} aria-hidden />
                <span className="truncate text-ink-soft">{s.label}</span>
                <span className="ml-auto font-mono font-medium tabular-nums text-ink">{s.value.toLocaleString()}</span>
                <span className="w-9 shrink-0 text-right font-mono text-xs text-ink-soft/70">{Math.round(s.frac * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Frame>
  );
}

/** Ranked horizontal bars — hover a row to reveal its share. */
export function BarList({ title, items, color = VIZ[0] }: { title: string; items: { label: string; value: number }[]; color?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);

  return (
    <Frame title={title}>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <ul className="space-y-3">
          {items.map((i, idx) => {
            const pct = total ? Math.round((i.value / total) * 100) : 0;
            const on = active === idx;
            return (
              <li
                key={i.label}
                onMouseEnter={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
                className="cursor-default rounded-lg px-1 py-0.5 transition-colors"
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-mono text-ink-soft">{i.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-soft/70 transition-opacity" style={{ opacity: on ? 1 : 0 }}>
                      {pct}%
                    </span>
                    <span className="font-mono font-medium tabular-nums text-ink">{i.value.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full transition-[width,opacity] duration-300"
                    style={{ width: `${(i.value / max) * 100}%`, background: color, opacity: on ? 1 : 0.75 }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Frame>
  );
}

// Local copy of `cn` so this module stays importable on its own.
function cnLocal(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
