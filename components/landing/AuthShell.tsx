import Link from "next/link";
import type { ReactNode } from "react";

// Shared shell for /login and /signup: a full-bleed split - context panel on
// the left, form on the right, each filling half the viewport. Below lg the
// panel is dropped entirely and the form becomes the whole page.

const POINTS: string[] = [
  "Any document in - resumes, contracts, invoices, licences",
  "Schema-validated JSON, never a blob of text",
  "A confidence score on every field, so review is targeted",
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-2">
      {/* Context panel - decorative, so it drops on small screens. */}
      <aside
            className="relative hidden flex-col p-12 lg:flex"
            style={{
              background:
                "radial-gradient(60% 70% at 12% 8%, rgba(249,217,233,.9) 0%, rgba(249,217,233,0) 60%), " +
                "radial-gradient(70% 80% at 88% 100%, rgba(207,205,234,.9) 0%, rgba(207,205,234,0) 62%), " +
                "linear-gradient(150deg, #eaf0c6 0%, #f0f4b8 36%, #e6eaf0 70%, #e2e0f1 100%)",
        }}
          >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Blue-IQ" className="h-[26px] w-auto" />

        <h2 className="mt-auto pt-10 font-display text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#15201a]">
              Any document in.
          <br />
          <span className="text-[#15201a]/60">Structured, scored data out.</span>
        </h2>

        <ul className="mt-6 space-y-3">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-[#1e2a1b]/80">
                  <svg viewBox="0 0 24 24" className="mt-[3px] h-4 w-4 shrink-0" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".75" />
                    <path d="M8 12.3l2.6 2.6L16 9.5" stroke="#5f8b3e" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
            </li>
              ))}
        </ul>

      </aside>

      {/* Form side. The back control lives here so it is reachable on mobile,
          where the context panel is not rendered at all. */}
      <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10">
        <Link
          href="/"
          className="absolute left-4 top-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:left-8"
        >
      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
          Back to site
        </Link>

        <Link href="/" className="mb-8 flex justify-center lg:hidden" aria-label="Blue-IQ Capture home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Blue-IQ" className="h-[26px] w-auto" />
        </Link>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

/** Heading pair for an auth form - keeps both pages phrased the same way. */
export function AuthHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{sub}</p>
    </div>
  );
}
