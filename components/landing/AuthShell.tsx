import Link from "next/link";
import type { ReactNode } from "react";

import { LicenseCard, ResumeSheet } from "@/components/realistic";
import { Logo } from "@/components/ui";

// Shared shell for /login and /signup: a split with the context panel on a
// glow (the falling gradient of the landing page cards) and the form on white. Below lg the panel drops entirely and
// the form becomes the whole page.

const POINTS: string[] = [
  "Structured JSON from resumes, licenses, contracts and invoices",
  "A confidence score on every field, so review is targeted",
  "Null where the page is silent. Nothing invented.",
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    // On desktop the shell is exactly one screen tall: the panel never pushes
    // the page into a scroll, and the form column scrolls on its own if a long
    // state (errors, the verify step) ever needs more room than a short laptop
    // screen has. The drawing shrinks on short screens and drops on very short
    // ones, so the headline and points always fit.
    <div className="grid min-h-dvh bg-surface lg:h-dvh lg:grid-cols-[1.05fr_1fr] lg:overflow-hidden">
      <aside className="glow-brand relative m-3 hidden min-h-0 flex-col overflow-hidden rounded-[24px] p-10 lg:flex xl:p-14 [@media(max-height:720px)]:p-8">
        <Link href="/" aria-label="Blue-IQ Capture home" className="w-fit shrink-0">
          <Logo className="h-[26px] w-auto" />
        </Link>

        <div className="my-auto min-h-0 py-6">
          <div
            className="relative h-[330px] w-[380px] [zoom:0.9] xl:[zoom:1] [@media(max-height:860px)]:[zoom:0.72] [@media(max-height:700px)]:hidden"
            aria-hidden
          >
            <ResumeSheet marked className="absolute left-0 top-0 [zoom:0.82]" style={{ transform: "rotate(-4deg)" }} />
            <LicenseCard className="absolute bottom-2 right-0" style={{ transform: "rotate(5deg)" }} />
          </div>
          <h2 className="mt-8 max-w-md text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#0f172a] [@media(max-height:700px)]:mt-0">
            Any document in. Every field scored.
          </h2>
          <ul className="mt-6 max-w-md space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#334155]">
                <svg viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0" fill="none" aria-hidden>
                  <path d="M4.5 10.3l3.3 3.3L15.5 6" stroke="#1a5fe6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="shrink-0 text-[13px] text-[#334155]">&copy; {new Date().getFullYear()} Blue-IQ</p>
      </aside>

      <div className="flex min-h-0 flex-col overflow-y-auto px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-[#f4f8f9] hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to site
          </Link>
          <Link href="/" className="lg:hidden" aria-label="Blue-IQ Capture home">
            <Logo className="h-[22px] w-auto" />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[25rem] flex-1 flex-col justify-center py-8">{children}</div>
      </div>
    </div>
  );
}

/** Heading pair for an auth form - keeps both pages phrased the same way. */
export function AuthHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#0f172a]">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{sub}</p>
    </div>
  );
}
