import Link from "next/link";

import { ContractSheet, StickyNote } from "@/components/realistic";
import { Logo } from "@/components/ui";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Site-wide 404, in the product's own terms: the page came back null. It
 *  offers the places people actually meant to go rather than a bare "go home". */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-white px-5 py-6">
      <Link href="/" className="w-fit" aria-label="Blue-IQ Capture home">
        <Logo className="h-[24px] w-auto" />
      </Link>

      <div className="glow-lilac card-lift mx-auto my-auto w-full max-w-lg rounded-[20px] px-6 py-12 text-center sm:px-10">
        <div className="relative mx-auto h-[190px] w-[240px]" aria-hidden>
          <ContractSheet className="absolute left-[34px] top-0 [zoom:0.5]" style={{ transform: "rotate(-5deg)" }} />
          <StickyNote className="absolute right-0 top-[50px]" style={{ transform: "rotate(6deg)" }}>
            page:
            <br />
            null
          </StickyNote>
        </div>
        <p className="mt-6 font-mono text-sm font-semibold text-ink-soft">404</p>
        <h1 className="mt-2 text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#0f172a] sm:text-[2.4rem]">
          This page came back null.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
          The link may be out of date, or the address has a typo in it. Nothing has broken.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-[12px] bg-accent-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
          >
            Go to the home page
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-black bg-white px-5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#f4f8f9]"
          >
            Read the docs
          </Link>
        </div>

        <p className="mt-7 text-sm text-ink-soft">
          Signed in?{" "}
          <Link href="/dashboard" className="font-semibold text-accent-700 underline-offset-4 hover:underline">
            Go to your dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
