// The public origin of this site, used for canonical URLs, Open Graph URLs,
// the sitemap, robots.txt and structured data. One definition, so those can
// never disagree with each other.
//
// Set NEXT_PUBLIC_SITE_URL in the deployment environment (the Amplify console
// forwards NEXT_PUBLIC_* vars into .env.production, see amplify.yml). Without
// it every canonical and sitemap URL would point at localhost, which tells
// search engines the real pages are duplicates of a host they cannot reach.

const FALLBACK = "http://localhost:3000";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK).replace(/\/+$/, "");

if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "[seo] NEXT_PUBLIC_SITE_URL is not set: canonical URLs, the sitemap and robots.txt will point at " +
      FALLBACK +
      ". Set it to the public origin (e.g. https://your-domain) before deploying.",
  );
}

export const SITE_NAME = "Blue-IQ Capture";
export const ORG_NAME = "Ocean Blue Solutions";
