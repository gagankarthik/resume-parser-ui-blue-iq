"use client";

// The landing page's code sample: one request in three languages, and the
// response it gets back. Tabs follow the WAI-ARIA tabs pattern (arrow keys move
// between them) and the copy button copies whichever sample is showing.

import { useRef, useState, type KeyboardEvent } from "react";

export type Sample = { id: string; label: string; code: string };

export function CodeTabs({ samples, response }: { samples: Sample[]; response: string }) {
  const [active, setActive] = useState(samples[0].id);
  const [copied, setCopied] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = samples.find((s) => s.id === active) ?? samples[0];

  function onKey(e: KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + samples.length) % samples.length;
    setActive(samples[next].id);
    tabs.current[next]?.focus();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked - the code is still selectable */
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-night-line bg-[#0d1c40]">
      <div className="flex items-center justify-between gap-3 border-b border-night-line px-2 sm:px-3">
        <div role="tablist" aria-label="Language" className="flex">
          {samples.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={s.id === active}
              aria-controls="code-panel"
              tabIndex={s.id === active ? 0 : -1}
              onClick={() => setActive(s.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={
                "relative px-3 py-3 text-[13px] font-semibold transition-colors " +
                (s.id === active ? "text-white" : "text-[#8ea3cf] hover:text-white")
              }
            >
              {s.label}
              {s.id === active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-cyan-brand" aria-hidden />}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#8ea3cf] transition-colors hover:bg-white/5 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre
        id="code-panel"
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="scroll-fine overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.7] text-[#dbe6ff]"
      >
        <code>{current.code}</code>
      </pre>

      <div className="border-t border-night-line bg-night">
        <p className="flex items-center gap-2 px-5 pt-4 text-xs font-semibold text-[#8ea3cf]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
          Poll response, 200 OK
        </p>
        <pre className="scroll-fine overflow-x-auto px-5 pb-5 pt-2 font-mono text-[12.5px] leading-[1.7] text-[#dbe6ff]">
          <code>{response}</code>
        </pre>
      </div>
    </div>
  );
}
