// Blue-IQ UI primitives: cool paper, navy ink, deep-blue accent. Pure Tailwind,
// no external deps.
//
// The product platform and the UAT console keep their own copies of these
// primitives on purpose - each app stays self-contained - but they are written to
// LOOK identical. If you change a primitive's appearance here, mirror it in the
// other app so the two keep reading as one product.
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

/** Brand monogram - a document being parsed into structured lines. */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-[10px]",
        "bg-accent-700 text-[var(--surface)] shadow-sm ring-1 ring-black/10",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[60%] w-[60%]">
        <path d="M6 6.5h8M6 10h11M6 13.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.2 14.3l2.1 2.1 3.6-4" stroke="var(--color-brass-400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Wordmark lockup: monogram + name in the display grotesque. */
export function Wordmark({ className, suffix }: { className?: string; suffix?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark className="h-8 w-8" />
      <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
        Blue<span className="text-accent-700">-</span>IQ Parser
        {suffix && <span className="ml-1.5 font-sans text-sm font-normal text-ink-soft">{suffix}</span>}
      </span>
    </span>
  );
}

/** Real brand lockup (public/logo.svg) - use wherever the logo should appear. */
export function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="Blue-IQ" className={className} />;
}

/* -- Surfaces ---------------------------------------------------------------- */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04),0_8px_24px_-16px_rgba(10,23,51,0.16)] sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{children}</h2>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-soft">{description}</p>}
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
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-accent-700 text-[var(--surface)] shadow-sm hover:bg-accent-800 hover:-translate-y-px active:translate-y-0",
    secondary: "border border-line-strong bg-surface text-ink hover:border-accent-300 hover:bg-accent-50",
    danger: "bg-red-700 text-white hover:bg-red-800",
    ghost: "text-ink-soft hover:bg-black/[0.04] hover:text-ink",
  };
  return (
    <button className={cn(base, variants[variant], className)} disabled={disabled || loading} {...rest}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-line-strong bg-paper px-3.5 text-sm text-ink outline-none transition-all",
        "placeholder:text-ink-soft/55 hover:border-line-strong/80",
        "focus:border-accent-500 focus:bg-surface focus:ring-[3px] focus:ring-accent-500/15",
        className,
      )}
      {...rest}
    />
  );
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors",
        "placeholder:text-ink-soft/60 focus:border-accent-500 focus:ring-[3px] focus:ring-accent-500/15",
        className,
      )}
      {...rest}
    />
  );
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition-colors",
        "focus:border-accent-500 focus:ring-[3px] focus:ring-accent-500/15",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-ink">{children}</label>;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
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
    neutral: "bg-black/[0.05] text-ink-soft ring-line",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warning: "bg-amber-100 text-amber-800 ring-amber-200",
    danger: "bg-red-100 text-red-700 ring-red-200",
    info: "bg-accent-50 text-accent-700 ring-accent-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[0.7rem] font-medium ring-1 ring-inset",
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
    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v5M12 16h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[14rem] flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong p-6 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-ink-soft">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-black/[0.06]", className)} aria-hidden />;
}

export function BackButton({ onClick, label = "Back", className }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink",
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
    <div
      role="tablist"
      className={cn(
        "scroll-fine flex max-w-full gap-0.5 overflow-x-auto rounded-lg border border-line-strong p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              active ? "bg-accent-700 text-[var(--surface)]" : "text-ink-soft hover:bg-black/[0.04] hover:text-ink",
            )}
          >
            {o.label}
            {typeof o.badge === "number" && o.badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-semibold",
                  active ? "bg-white/20" : "bg-black/[0.06]",
                )}
              >
                {o.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* -- Data tables ---------------------------------------------------------------
   A table is the densest thing on any of these screens, so the primitives carry
   the rules rather than each page re-inventing them: the wrapper is the ONLY
   horizontally-scrolling element (the page body never scrolls sideways on
   mobile), the header is sticky, numerics are tabular and right-aligned, and
   rows are separated by hairlines rather than zebra fills. -------------------- */

/** Scroll container + frame - for a table that stands on its own. */
export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-surface", className)}>
      <div className="scroll-fine max-w-full overflow-x-auto">{children}</div>
    </div>
  );
}

/** Scroll container WITHOUT a frame - for a table already inside a <Card>, so
 *  the card supplies the only border. Bleeds to the card's edges on small
 *  screens so the scrollable region spans the full width. */
export function TableScroll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "scroll-fine -mx-5 max-w-[calc(100%+2.5rem)] overflow-x-auto px-5 sm:-mx-6 sm:max-w-[calc(100%+3rem)] sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return <table className={cn("w-full min-w-[36rem] border-collapse text-sm", className)}>{children}</table>;
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
}

export function TR({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:bg-accent-50/60",
        !onClick && "hover:bg-black/[0.015]",
        className,
      )}
    >
      {children}
    </tr>
  );
}

type CellProps = { numeric?: boolean; className?: string; children?: ReactNode };

export function TH({
  children,
  numeric,
  className,
  ...rest
}: CellProps & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "label-caps whitespace-nowrap border-b border-line px-4 py-3 text-ink-soft",
        numeric ? "text-right" : "text-left",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TD({
  children,
  numeric,
  className,
  ...rest
}: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle text-ink",
        numeric && "text-right font-mono tabular-nums",
        className,
      )}
      {...rest}
    >
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
