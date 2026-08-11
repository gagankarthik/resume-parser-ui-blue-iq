import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Site-wide 404. Kept to the landing page's panel language, and it offers the
 *  three places people actually meant to be rather than a bare "go home". */
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--canvas)] px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="mb-10 inline-flex" aria-label="Blue-IQ Capture home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Blue-IQ" className="h-[26px] w-auto" />
        </Link>

        <div
          className="overflow-hidden rounded-[26px] bg-[#f7f9fc] px-8 py-14 sm:px-12"
          style={{
            border: "1.6px solid rgba(255,255,255,.92)",
            boxShadow: "0 2px 16px rgba(24,30,45,.045)",
          }}
        >
          <p className="font-mono text-[13px] tracking-[0.14em] text-ink-soft/70">404</p>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            This page does not exist.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            The link may be out of date, or the address has a typo in it. Nothing has broken.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
            >
              Back to home
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Read the docs
            </Link>
          </div>

          <p className="mt-7 text-sm text-ink-soft">
            Signed in?{" "}
            <Link href="/dashboard" className="font-medium text-accent-700 hover:underline">
              Go to your dashboard
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
