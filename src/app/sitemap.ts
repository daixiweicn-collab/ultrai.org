import type { MetadataRoute } from "next";
import { INTELLIGENCE_REPORTS } from "@/data/intelligence";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/benchmarks",
    "/calculator",
    "/registry",
    "/intelligence",
    "/submit",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const reportPages = INTELLIGENCE_REPORTS.map((r) => ({
    url: `${SITE_URL}/intelligence/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...reportPages];
}
