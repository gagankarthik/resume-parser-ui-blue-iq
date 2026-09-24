import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ORG_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

// One family for display and body. Headlines are set medium with tight
// tracking, the way the landing page's feature row sets them; weight and size
// carry the hierarchy, not a second typeface.
const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono for code, keys and JSON field names only.
const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const DESCRIPTION =
  "Resume parsing API that turns resumes, licenses and certifications into structured JSON with a confidence score on every field. Never invents a value.";

// Site-wide SEO defaults. Routes override `title`, `description` and their own
// canonical; everything else is inherited. There is deliberately no canonical
// here: a root canonical is inherited by every route that forgets its own and
// declares that page a duplicate of the home page. Private routes flip
// `robots` to noindex in their own layout (see app/dashboard/layout.tsx).
// Icons come from the file conventions (favicon.ico, icon.svg, apple-icon).
export const viewport: Viewport = { themeColor: "#1a5fe6" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Resume Parsing API with Confidence Scores`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: ORG_NAME }],
  creator: ORG_NAME,
  publisher: ORG_NAME,
  category: "technology",
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
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME}: Resume Parsing API with Confidence Scores`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}: Resume Parsing API with Confidence Scores`,
    description: DESCRIPTION,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
