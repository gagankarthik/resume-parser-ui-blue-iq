import type { Metadata } from "next";

// `app/login/page.tsx` is a client component and cannot export metadata itself,
// so the route's SEO lives here. Sign-in is noindex: it has no content worth
// ranking and a crawler that lands on it sees nothing but a form.
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Blue-IQ Capture account to manage API keys, webhooks and usage.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
