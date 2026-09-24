// Blue-IQ UI primitives. Pure Tailwind, no external deps.
//
// Everything is built on the "glow card" from the landing page's feature row:
// a 20px card whose colour falls from the top onto a pale floor, white panels
// floating inside, and black-outlined pills. Gradients live in globals.css as
// .glow-* classes; interactive colour is the logo blue.
"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -- Brand ------------------------------------------------------------------- */

/** The logogram from public/logo.svg, drawn inline so it scales crisply. */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 41" className={cn("shrink-0", className)} aria-hidden>
      <g transform="translate(0 0.5)">
        <path
          d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 0 18.5717 0C12.8885 0 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z"
          fill="#297AFF"
        />
        <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="#34C2FF" />
        <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill="#34C2FF" />
      </g>
    </svg>
  );
}

/** Wordmark lockup: logogram + product name. */
export function Wordmark({ className, suffix }: { className?: string; suffix?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark className="h-7 w-7" />
      <span className="text-[1.05rem] font-semibold tracking-tight text-ink">
        Blue-IQ Capture
        {suffix && <span className="ml-1.5 text-sm font-normal text-ink-soft">{suffix}</span>}
      </span>
    </span>
  );
}

/** Real brand lockup. `onDark` swaps to the white-wordmark file for dark
 *  surfaces (code panels). */
export function Logo({ className = "h-7 w-auto", onDark = false }: { className?: string; onDark?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={onDark ? "/logo-on-dark.svg" : "/logo.svg"} alt="Blue-IQ" className={className} />;
}

/* -- Surfaces ---------------------------------------------------------------- */

export type Glow = "amber" | "pink" | "lilac" | "lime" | "peach" | "sky" | "brand" | "soft" | "none";

/** Working card. Defaults to the quiet glow so forms and tables stay calm;
 *  pass a named glow for a card that should announce itself. */
export function Card({ children, className, glow = "soft" }: { children: ReactNode; className?: string; glow?: Glow }) {
  return <div className={cn("card-lift rounded-[20px] p-5 sm:p-6", `glow-${glow}`, className)}>{children}</div>;
}

/** The feature-row card: fixed height, a drawing or panel floating in the
 *  upper part, title (and optional body) pinned to the bottom. */
export function GlowCard({
  glow,
  title,
  body,
  children,
  className,
  height = "h-[340px]",
}: {
  glow: Glow;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  className?: string;
  height?: string;
}) {
  return (
    <article className={cn("card-lift relative flex flex-col justify-end overflow-hidden rounded-[20px] text-left", `glow-${glow}`, height, className)}>
      {children}
      <div className="relative z-[2] p-6">
        <h3 className="text-[1.05rem] font-semibold text-[#1e293b]">{title}</h3>
        {body && <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#334155]">{body}</p>}
      </div>
    </article>
  );
}

/** White panel floating inside a glow card. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("panel-lift rounded-xl bg-white p-4", className)}>{children}</div>;
}

/** Black-outlined pill, as on the feature row ("Review low scores"). `mark`
 *  fills it with the highlighter for a field that needs a person. */
export function Pill({ children, className, mark = false }: { children: ReactNode; className?: string; mark?: boolean }) {
  return (
    <span
      className={cn(
        "pill-lift inline-flex items-center gap-1.5 whitespace-nowrap rounded-[20px] border border-black px-3.5 py-[5px] text-[0.75rem] font-semibold text-[#1e293b]",
        mark ? "bg-mark" : "bg-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">{children}</h2>
      {hint && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{hint}</p>}
    </div>
  );
}

/** Page header: title, optional description, optional right-hand actions. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[1.9rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.1rem]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* -- Controls ---------------------------------------------------------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800",
    secondary: "border border-control bg-white text-ink hover:border-ink hover:bg-paper",
    danger: "bg-red-700 text-white hover:bg-red-800",
    ghost: "text-ink-soft hover:bg-white/70 hover:text-ink",
  };
  return (
    <button className={cn(base, variants[variant], className)} disabled={disabled || loading} {...rest}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

// Width is NOT part of the shared field style: inputs fill their row, but a
// select should size to its options. Putting w-full here let it override the
// select's w-auto and stretch dropdowns across toolbars.
const FIELD =
  "rounded-[10px] border border-control bg-white text-sm text-ink outline-none transition-colors placeholder:text-[#64748b] hover:border-accent-300 focus:border-accent-500 focus:ring-[3px] focus:ring-accent-500/15";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD, "h-11 w-full px-3.5", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(FIELD, "w-full px-3.5 py-2.5", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(FIELD, "h-10 shrink-0 px-3", className)} {...rest}>
      {children}
    </select>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-[#1e293b]">{children}</label>;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      aria-hidden
    />
  );
}

/* -- Status ------------------------------------------------------------------ */

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white text-ink-soft ring-control",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warning: "bg-mark-soft text-mark-ink ring-[#f1d58a]",
    danger: "bg-red-50 text-red-800 ring-red-200",
    info: "bg-accent-50 text-accent-800 ring-accent-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Job/run state as a labelled dot - state is never carried by colour alone. */
export function StatusDot({ state }: { state: "completed" | "partial" | "failed" | "processing" | "queued" }) {
  const map: Record<string, { tone: string; label: string }> = {
    completed: { tone: "bg-[var(--viz-good)]", label: "Completed" },
    partial: { tone: "bg-[var(--viz-warning)]", label: "Partial" },
    failed: { tone: "bg-[var(--viz-critical)]", label: "Failed" },
    processing: { tone: "bg-[var(--viz-1)]", label: "Processing" },
    queued: { tone: "bg-ink-soft/50", label: "Queued" },
  };
  const s = map[state] ?? map.queued;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", s.tone)} aria-hidden />
      {s.label}
    </span>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="panel-lift flex items-start gap-2.5 rounded-xl bg-white px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 8v5M12 16h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

/** Empty state on a glow card. Shows the empty-tray drawing unless the caller
 *  passes its own `art`, or `art={null}` for none. */
export function EmptyState({
  title,
  hint,
  action,
  className,
  art,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
  art?: ReactNode;
}) {
  return (
    <div className={cn("glow-soft flex min-h-[14rem] flex-col items-center justify-center rounded-[20px] p-6 text-center sm:p-8", className)}>
      {art === undefined ? <EmptyTrayArt /> : art}
      <p className="mt-4 text-base font-semibold text-[#1e293b]">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm leading-relaxed text-[#334155]">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** A document tray with one blank sheet: "nothing here yet". */
function EmptyTrayArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-16 w-auto" fill="none" aria-hidden>
      <rect x="34" y="6" width="52" height="46" rx="5" fill="#fff" />
      <path d="M44 18h24M44 26h32M44 34h18" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 44h24l6 10h32l6-10h24v24a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V44Z" fill="#fff" stroke="#0f172a" strokeOpacity=".7" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[14px] bg-[#d8e0eb]", className)} aria-hidden />;
}

export function BackButton({ onClick, label = "Back", className }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink",
        className,
      )}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; badge?: number }[];
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("scroll-fine panel-lift flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-white p-1", className)}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              active ? "bg-[#0f172a] text-white" : "text-ink-soft hover:text-ink",
            )}
          >
            {o.label}
            {typeof o.badge === "number" && o.badge > 0 && (
              <span className={cn("rounded-full px-1.5 text-[10px] font-semibold", active ? "bg-white/20" : "bg-paper")}>{o.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* -- Data tables ---------------------------------------------------------------
   Tables sit on a white panel floating in their card. The wrapper is the ONLY
   horizontally-scrolling element (the page body never scrolls sideways on
   mobile), the header is sticky, numerics are tabular and right-aligned, and
   rows are separated by hairlines rather than zebra fills. */

/** Scroll container + white panel - for a table that stands on its own. */
export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("panel-lift overflow-hidden rounded-[14px] bg-white ring-1 ring-black/[0.04]", className)}>
      <div className="scroll-fine max-w-full overflow-x-auto">{children}</div>
    </div>
  );
}

/** The same white panel, for a table already inside a <Card>. */
export function TableScroll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("scroll-fine panel-lift max-w-full overflow-x-auto rounded-[14px] bg-white ring-1 ring-black/[0.04]", className)}>
      {children}
    </div>
  );
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return <table className={cn("w-full min-w-[36rem] border-collapse text-sm", className)}>{children}</table>;
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="sticky top-0 z-10 bg-white">{children}</thead>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
}

export function TR({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn("transition-colors", onClick && "cursor-pointer hover:bg-accent-50/70", !onClick && "hover:bg-paper/70", className)}
    >
      {children}
    </tr>
  );
}

type CellProps = { numeric?: boolean; className?: string; children?: ReactNode };

export function TH({ children, numeric, className, ...rest }: CellProps & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-line px-4 py-2.5 text-xs font-semibold text-ink-soft",
        numeric ? "text-right" : "text-left",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TD({ children, numeric, className, ...rest }: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 align-middle text-ink", numeric && "text-right font-mono tabular-nums", className)} {...rest}>
      {children}
    </td>
  );
}

/** Full-width state row (empty / loading) spanning every column. */
export function TStateRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-0">
        {children}
      </td>
    </tr>
  );
}
