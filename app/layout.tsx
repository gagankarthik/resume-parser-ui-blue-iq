import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Space Grotesk display, set light: matches the Blue-IQ platform brand.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Inter for body/UI, consistent with the Blue-IQ platform.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Technical mono for keys, code, and tabular data.
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const DESCRIPTION =
  "Blue-IQ Capture turns any document - resumes, contracts, invoices, licenses - into structured, confidence-scored data. Domain-tuned, never fabricates, SOC 2 / HIPAA / GDPR aligned. Powered by the Sonar engine.";

// Site-wide SEO defaults. Individual routes override `title`/`description` and
// inherit everything else, so no page ships without OG tags, a canonical URL or
// an explicit robots directive. Private routes flip `robots` to noindex in their
// own layout (see app/dashboard/layout.tsx).
export const metadata: Metadata = {
  // Resolves canonical/OG URLs; set NEXT_PUBLIC_SITE_URL to the public domain in prod.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Blue-IQ Capture | Universal Document AI",
    template: "%s - Blue-IQ Capture",
  },
  description: DESCRIPTION,
  applicationName: "Blue-IQ Capture",
  authors: [{ name: "Ocean Blue Solutions" }],
  creator: "Ocean Blue Solutions",
  publisher: "Ocean Blue Solutions",
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Blue-IQ Capture",
    locale: "en_US",
    url: SITE_URL,
    title: "Blue-IQ Capture | Universal Document AI",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue-IQ Capture | Universal Document AI",
    description: "Any document in. Structured, scored data out. Powered by the Sonar engine.",
  },
  formatDetection: { telephone: false, address: false, email: false },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
