"use client";

// Top navigation. Deliberately flat: the previous mega-menus advertised
// sections that no longer exist and buried four real destinations behind two
// hover panels. Four links, two actions, one mobile sheet.

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS: { label: string; href: string }[] = [
  { label: "How it works", href: "#how" },
  { label: "Why Capture", href: "#why" },
  { label: "Security", href: "#security" },
  { label: "Docs", href: "/docs" },
];

function NavLink({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className?: string }) {
  const cls = className ?? "rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink";
  return href.startsWith("/") ? (
    <Link href={href} onClick={onClick} className={cls}>
      {label}
    </Link>
  ) : (
    <a href={href} onClick={onClick} className={cls}>
      {label}
    </a>
  );
}

export function SiteNav({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 bg-[var(--canvas)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center justify-between px-6 md:px-12 lg:px-16">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Blue-IQ Capture home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Blue-IQ" className="h-[22px] w-auto sm:h-[26px]" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.label} {...l} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {authed ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-black/[0.04] lg:hidden"
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden>
            {open ? (
              <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="animate-menu border-t border-line/70 bg-[var(--canvas)] px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.label}
                {...l}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3.5 text-base font-semibold text-ink"
              />
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-2.5">
            {authed ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-accent-700 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-accent-700 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-line-strong bg-surface px-4 py-3 text-center text-sm font-semibold text-ink"
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
