import Link from "next/link";

import { Logo } from "@/components/ui";

// Full-width footer. Anchors point only at sections that
// exist on the landing page, prefixed with "/" so they work from /docs too.
type Col = { heading: string; links: { label: string; href: string }[] };

const COLUMNS: Col[] = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Why Capture", href: "/#why" },
      { label: "Security", href: "/#security" },
      { label: "Book a demo", href: "https://blue-iq.ai/contact" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API reference", href: "/docs" },
      { label: "Quickstart", href: "/docs#quickstart" },
      { label: "Webhooks", href: "/docs#webhooks" },
      { label: "Errors", href: "/docs#errors" },
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

function FooterLink({ href, label }: { href: string; label: string }) {
  const cls = "text-[14.5px] text-[#64748b] transition-colors hover:text-[#0f172a]";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1100px] px-5 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            <Logo className="h-[26px] w-auto" />
            <p className="mt-5 text-[14.5px] leading-relaxed text-[#64748b]">
              Any document in. Structured, schema-validated, confidence-scored data out. Built for the
              paperwork that runs your business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-sm font-semibold text-[#0f172a]">{col.heading}</p>
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

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-[13.5px] text-[#64748b] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Blue-IQ. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Legal">
            <a href="https://blue-iq.ai/privacy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#0f172a]">
              Privacy
            </a>
            <a href="https://blue-iq.ai/terms" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#0f172a]">
              Terms
            </a>
            <Link href="/#security" className="transition-colors hover:text-[#0f172a]">
              Security
            </Link>
            <Link href="/docs" className="transition-colors hover:text-[#0f172a]">
              API docs
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
