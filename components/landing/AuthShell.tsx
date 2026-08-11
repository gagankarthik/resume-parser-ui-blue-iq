import Link from "next/link";
import type { ReactNode } from "react";

// Shared shell for /login and /signup: one centred split card - context panel
// on the left, form on the right - so the auth pages belong to the same product
// as the landing page. Below lg the panel is dropped and the form becomes the
// page; the card stays centred at every size.

const POINTS: string[] = [
  "Any document in - resumes, contracts, invoices, licences",
  "Schema-validated JSON, never a blob of text",
  "A confidence score on every field, so review is targeted",
];

const BADGES = ["SOC 2 Type II", "HIPAA", "GDPR"];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--canvas)] px-4 py-8 sm:px-6">
      <div className="w-full max-w-5xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to site
        </Link>

        <div
          className="grid overflow-hidden rounded-[26px] bg-surface lg:grid-cols-2"
          style={{
            border: "1.6px solid rgba(255,255,255,.92)",
            boxShadow: "0 2px 16px rgba(24,30,45,.045), 0 24px 60px -50px rgba(10,23,51,.4)",
          }}
        >
          {/* Context panel - decorative, so it drops on small screens. */}
          <aside
            className="relative hidden flex-col p-10 lg:flex"
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

            <div className="mt-8 flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span
                  key={b}
                  className="inline-flex h-[30px] items-center rounded-full bg-white/90 px-3.5 text-[12.5px] font-medium text-[#131313] backdrop-blur-[7px]"
                  style={{ boxShadow: "0 0 0 3px rgba(0,0,0,.047)" }}
                >
                  {b}
                </span>
              ))}
            </div>
          </aside>

          {/* Form side */}
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <Link href="/" className="mb-8 flex justify-center lg:hidden" aria-label="Blue-IQ Capture home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Blue-IQ" className="h-[26px] w-auto" />
            </Link>
            <div className="mx-auto w-full max-w-sm">{children}</div>
          </div>
        </div>
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
