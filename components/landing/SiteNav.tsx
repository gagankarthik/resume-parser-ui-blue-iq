"use client";

// Top navigation: five links, two actions, one mobile sheet. At the top of the
// page it is transparent over the hero (which runs up underneath it), with
// light text, so nav and hero read as one surface; once the page scrolls it turns white with a
// hairline and dark text. `solid` is also true while the mobile sheet is open.

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui";

const LINKS: { label: string; href: string }[] = [
  { label: "How it works", href: "/#how" },
  { label: "Why Capture", href: "/#why" },
  { label: "Developers", href: "/#developers" },
  { label: "Security", href: "/#security" },
  { label: "Docs", href: "/docs" },
];

export function SiteNav({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet, and make Escape close it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={
        "sticky top-0 z-50 border-b transition-colors " +
        (solid ? "border-line bg-white/[0.97] backdrop-blur-md" : "border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-6 px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Blue-IQ Capture home">
          <Logo onDark={!solid} className="h-[24px] w-auto sm:h-[26px]" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={
                "rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors " +
                (solid ? "text-[#475569] hover:bg-[#f4f8f9] hover:text-[#0f172a]" : "text-[#c3d3f3] hover:bg-white/10 hover:text-white")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {authed ? (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-[10px] bg-accent-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={
                  "inline-flex h-10 items-center rounded-[10px] border px-4 text-sm font-semibold transition-colors " +
                  (solid ? "border-black bg-white text-[#0f172a] hover:bg-[#f4f8f9]" : "border-white/40 text-white hover:border-white hover:bg-white/10")
                }
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center rounded-[10px] bg-accent-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
              >
                Get an API key
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className={
            "grid h-10 w-10 place-items-center rounded-full border lg:hidden " +
            (solid ? "border-black bg-white text-ink" : "border-white/40 text-white")
          }
        >
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" aria-hidden>
            {open ? (
              <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="animate-menu h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white px-5 pb-8 pt-2 lg:hidden">
          <nav className="flex flex-col" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-lg font-medium tracking-[-0.01em] text-[#0f172a]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            {authed ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-[12px] bg-accent-600 px-4 py-3.5 text-center text-[15px] font-semibold text-white">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-[12px] bg-accent-600 px-4 py-3.5 text-center text-[15px] font-semibold text-white">
                  Get an API key
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-[12px] border border-black bg-white px-4 py-3.5 text-center text-[15px] font-semibold text-[#0f172a]"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
