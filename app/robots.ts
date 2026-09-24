import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL;

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
