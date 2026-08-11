import Link from "next/link";

// Full-width footer. Anchors point only at sections that still exist - the
// platform/foundation and "what it reads" sections were removed, so links to
// them are gone rather than left to scroll nowhere.
type Col = { heading: string; links: { label: string; href: string }[] };

const COLUMNS: Col[] = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Why Capture", href: "#why" },
      { label: "Trust & security", href: "#security" },
      { label: "Book a demo", href: "#demo" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API documentation", href: "/docs" },
      { label: "Quickstart", href: "/docs#quickstart" },
      { label: "Webhooks", href: "/docs#webhooks" },
      { label: "Error handling", href: "/docs#errors" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Blue-IQ", href: "https://blue-iq.ai/about" },
      { label: "Our products", href: "https://blue-iq.ai/products" },
      { label: "Contact sales", href: "https://blue-iq.ai/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create an account", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

const BADGES = ["SOC 2 Type II", "HIPAA", "GDPR"];

function FooterLink({ href, label }: { href: string; label: string }) {
  const cls = "text-[14.5px] text-ink-soft transition-colors hover:text-accent-700";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cls}
    >
      {label}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Blue-IQ" className="h-[26px] w-auto" />
            <p className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">
              Any document in. Structured, schema-validated, confidence-scored data out. Built for
              the paperwork that runs your business.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {BADGES.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                  <svg className="h-3.5 w-3.5 text-accent-700" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft/60">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink href={l.href} label={l.label} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 sm:flex-row">
          <p className="text-[13.5px] text-ink-soft">
            (c) {new Date().getFullYear()} Blue-IQ. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-ink-soft">
            <a href="https://blue-iq.ai/privacy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Privacy</a>
            <a href="https://blue-iq.ai/terms" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Terms</a>
            <a href="#security" className="transition-colors hover:text-ink">Security</a>
            <Link href="/docs" className="transition-colors hover:text-ink">API docs</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
