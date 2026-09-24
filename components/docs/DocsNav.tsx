"use client";

// Docs navigation. On lg+ a sticky table of contents that marks the section
// being read; below lg a horizontal strip of the same links, since a sidebar
// has no room there. One IntersectionObserver drives both.

import { useEffect, useState } from "react";

export type DocSection = { id: string; label: string };

function useActiveSection(sections: DocSection[]): string {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A section counts as "being read" while its heading is in the top third.
      { rootMargin: "-80px 0px -66% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return active;
}

export function DocsToc({ sections }: { sections: DocSection[] }) {
  const active = useActiveSection(sections);
  return (
    <nav className="sticky top-24 text-sm" aria-label="On this page">
      <p className="mb-3 px-3 text-xs font-semibold text-ink-soft">On this page</p>
      <ol className="space-y-0.5 border-l border-line">
        {sections.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={
                  "-ml-px flex items-center gap-2.5 border-l-2 py-1.5 pl-3 pr-2 transition-colors " +
                  (on ? "border-accent-600 font-semibold text-ink" : "border-transparent text-ink-soft hover:text-ink")
                }
              >
                <span className={"w-5 font-mono text-[11px] tabular-nums " + (on ? "text-accent-700" : "text-ink-soft")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function DocsStrip({ sections }: { sections: DocSection[] }) {
  const active = useActiveSection(sections);
  return (
    <nav aria-label="On this page" className="scroll-fine -mx-4 flex gap-1 overflow-x-auto px-4 py-2 sm:-mx-6 sm:px-6">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={
            "shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors " +
            (s.id === active ? "bg-ink text-white" : "text-ink-soft hover:bg-accent-50 hover:text-ink")
          }
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

/** A code block with a copy button. The language label is optional. */
export function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked - the text is still selectable */
    }
  }
  return (
    <div className="overflow-hidden rounded-xl border border-night-line bg-night">
      <div className="flex items-center justify-between border-b border-night-line px-4 py-1.5">
        <span className="text-xs font-semibold text-[#8ea3cf]">{lang ?? guessLang(children)}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-xs font-semibold text-[#8ea3cf] transition-colors hover:bg-white/5 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="scroll-fine overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#dbe6ff]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function guessLang(code: string): string {
  const t = code.trimStart();
  if (t.startsWith("curl") || t.startsWith("# 1.")) return "Shell";
  if (t.startsWith("{")) return "JSON";
  if (t.startsWith("//")) return "JavaScript";
  if (t.startsWith("# Python") || t.startsWith("import ")) return "Python";
  if (t.startsWith("X-")) return "Header";
  return "Code";
}
