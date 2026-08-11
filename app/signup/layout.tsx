import type { Metadata } from "next";

// `app/signup/page.tsx` is a client component and cannot export metadata itself.
// Unlike /login this one stays indexable — it is a genuine entry point people
// search for, so it carries a real description and canonical URL.
export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Blue-IQ Capture account and get an API key in minutes. Turn resumes, contracts, invoices and licenses into structured, confidence-scored data.",
  alternates: { canonical: "/signup" },
  openGraph: {
    title: "Create an account · Blue-IQ Capture",
    description:
      "Get an API key in minutes and start turning documents into structured, confidence-scored data.",
    url: "/signup",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
