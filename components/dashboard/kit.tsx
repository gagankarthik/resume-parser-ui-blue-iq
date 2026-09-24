"use client";

// Dashboard building blocks shared by every page, so search, filters, copy
// feedback, confirmations and one-time secrets behave the same everywhere.

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { ArrowDownIcon, ArrowUpIcon, CheckIcon, CloseIcon, CopyIcon, SearchIcon } from "@/components/icons";
import { Button, cn } from "@/components/ui";

/* -- Toolbar ------------------------------------------------------------------ */

/** A row of filters above a list: wraps on narrow screens, one line on wide. */
export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>{children}</div>;
}

/** Search box with its icon and a clear button. `/` focuses it from anywhere on
 *  the page, the same shortcut most dashboards use. */
export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== "/" || el.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      ref.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={cn("relative w-full min-w-0 sm:w-64", className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 w-full rounded-[10px] border border-control bg-white pl-9 pr-16 text-sm text-ink outline-none transition-colors placeholder:text-[#64748b] hover:border-accent-300 focus:border-accent-500 focus:ring-[3px] focus:ring-accent-500/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            ref.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-soft hover:bg-paper hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-control bg-paper px-1.5 font-mono text-[11px] text-ink-soft sm:block">
          /
        </kbd>
      )}
    </div>
  );
}

/** Small text-less button with a visible label for screen readers. */
export function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-control bg-white text-ink-soft transition-colors hover:border-ink hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* -- Copy --------------------------------------------------------------------- */

/** Copies `text`; the icon turns into a check for a moment so the action
 *  confirms itself. The result is announced to screen readers. */
export function CopyButton({ text, label = "Copy", compact = false }: { text: string; label?: string; compact?: boolean }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard blocked - the value is still selectable */
    }
  }

  const Icon = done ? CheckIcon : CopyIcon;
  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={done ? "Copied" : label}
        title={done ? "Copied" : label}
        className={cn(
          "grid h-7 w-7 place-items-center rounded-md transition-colors",
          done ? "text-emerald-700" : "text-ink-soft hover:bg-paper hover:text-ink",
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="sr-only" aria-live="polite">
          {done ? "Copied" : ""}
        </span>
      </button>
    );
  }
  return (
    <Button variant="secondary" type="button" onClick={copy}>
      <Icon className={cn("h-4 w-4", done && "text-emerald-700")} />
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </Button>
  );
}

/* -- Time and change ------------------------------------------------------------ */

const RTF = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;

/** "3 days ago", with the exact date and time on hover. */
export function RelativeTime({ iso, className }: { iso?: string; className?: string }) {
  if (!iso) return <span className={className}>-</span>;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return <span className={className}>-</span>;
  return (
    <time dateTime={d.toISOString()} title={d.toLocaleString()} className={className}>
      {relative(d)}
    </time>
  );
}

function relative(d: Date): string {
  const secs = Math.round((d.getTime() - Date.now()) / 1000);
  const abs = Math.abs(secs);
  if (!RTF) return d.toLocaleDateString();
  if (abs < 60) return RTF.format(secs, "second");
  if (abs < 3600) return RTF.format(Math.round(secs / 60), "minute");
  if (abs < 86400) return RTF.format(Math.round(secs / 3600), "hour");
  if (abs < 86400 * 30) return RTF.format(Math.round(secs / 86400), "day");
  if (abs < 86400 * 365) return RTF.format(Math.round(secs / (86400 * 30)), "month");
  return RTF.format(Math.round(secs / (86400 * 365)), "year");
}

/** Change against the previous period. `goodWhen` says which direction is
 *  good news (fewer failures is good), or "neutral" when neither is (token
 *  spend). No previous data means no badge, not a fake "+100%". */
export function Delta({
  current,
  previous,
  goodWhen = "up",
  suffix = "vs previous period",
}: {
  current: number;
  previous: number | null | undefined;
  goodWhen?: "up" | "down" | "neutral";
  suffix?: string;
}) {
  if (previous === null || previous === undefined || previous === 0) {
    return <span className="text-xs text-ink-soft">No earlier data to compare</span>;
  }
  const pct = ((current - previous) / previous) * 100;
  const flat = Math.abs(pct) < 0.5;
  const up = pct > 0;
  const good = flat || goodWhen === "neutral" ? null : (up && goodWhen === "up") || (!up && goodWhen === "down");
  const Icon = up ? ArrowUpIcon : ArrowDownIcon;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
          good === null && "bg-white text-ink ring-1 ring-inset ring-line-strong",
          good === true && "bg-emerald-50 text-emerald-800",
          good === false && "bg-red-50 text-red-800",
        )}
      >
        {!flat && <Icon className="h-3 w-3" />}
        {flat ? "No change" : `${Math.abs(pct).toFixed(pct > -10 && pct < 10 ? 1 : 0)}%`}
      </span>
      <span className="text-ink-soft">{suffix}</span>
    </span>
  );
}

/* -- One-time secrets ----------------------------------------------------------- */

/** A value shown exactly once (an API key, a signing secret): what it is, the
 *  value itself, how to keep it, and a way out. */
export function SecretPanel({
  title,
  value,
  hint,
  onDismiss,
  actions,
}: {
  title: string;
  value: string;
  hint: ReactNode;
  onDismiss: () => void;
  actions?: ReactNode;
}) {
  return (
    <section role="status" className="card-lift overflow-hidden rounded-[20px] border border-[#e8c65a] bg-mark-soft p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[1.05rem] font-semibold text-[#1e293b]">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#334155]">{hint}</p>
        </div>
        <button type="button" onClick={onDismiss} className="shrink-0 rounded-md px-2 py-1 text-sm font-semibold text-[#334155] hover:bg-white hover:text-[#1e293b]">
          Done
        </button>
      </div>
      <div className="panel-lift mt-4 flex flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row sm:items-center">
        <code className="scroll-fine min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-1 font-mono text-sm text-ink">{value}</code>
        <div className="flex shrink-0 gap-2">
          <CopyButton text={value} />
          {actions}
        </div>
      </div>
    </section>
  );
}

/* -- Confirm dialog -------------------------------------------------------------- */

type ConfirmOptions = { title: string; body: ReactNode; confirm: string; tone?: "danger" | "primary" };

/** An in-app confirmation instead of window.confirm: it can say what will
 *  happen in full sentences, it matches the product, and it is a real modal
 *  (native <dialog>: focus is trapped, Escape cancels, the page is inert).
 *
 *  const [confirm, dialog] = useConfirm();
 *  if (await confirm({ title, body, confirm: "Revoke key", tone: "danger" })) ...
 *  ...render {dialog} once in the page. */
export function useConfirm(): [(o: ConfirmOptions) => Promise<boolean>, ReactNode] {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const ask = useCallback((o: ConfirmOptions) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = useCallback((v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setOpts(null);
  }, []);

  return [ask, <ConfirmDialog key="confirm" opts={opts} onSettle={settle} />];
}

function ConfirmDialog({ opts, onSettle }: { opts: ConfirmOptions | null; onSettle: (v: boolean) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (opts && !d.open) d.showModal();
    if (!opts && d.open) d.close();
  }, [opts]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onSettle(false);
      }}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (e.target === ref.current) onSettle(false);
      }}
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-[20px] bg-transparent p-0 backdrop:bg-[#0f172a]/40 backdrop:backdrop-blur-[2px]"
    >
      {opts && (
        <div className="glow-soft rounded-[20px] p-6 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)]">
          <h2 id={titleId} className="text-[1.15rem] font-semibold text-[#1e293b]">
            {opts.title}
          </h2>
          <div className="mt-2 text-[15px] leading-relaxed text-ink-soft">{opts.body}</div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={() => onSettle(false)} autoFocus>
              Cancel
            </Button>
            <Button variant={opts.tone === "danger" ? "danger" : "primary"} type="button" onClick={() => onSettle(true)}>
              {opts.confirm}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
