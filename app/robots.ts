import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Authenticated and machine-only surfaces. These are already noindex via
        // metadata; disallowing them too keeps crawl budget on the public pages.
        disallow: ["/dashboard", "/dashboard/", "/api/", "/login"],
      },
    ],
    sitemap: new URL("/sitemap.xml", base).toString(),
    host: base,
  };
}
