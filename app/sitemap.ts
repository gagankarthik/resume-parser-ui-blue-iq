import type { MetadataRoute } from "next";

// Only genuinely public, indexable routes belong here. Everything under
// /dashboard is authenticated and marked noindex, so listing it would just feed
// crawlers URLs that redirect to /login.
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/signup", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, base).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}
