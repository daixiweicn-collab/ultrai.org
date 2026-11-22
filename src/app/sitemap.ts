import type { MetadataRoute } from "next";
import { INTELLIGENCE_REPORTS } from "@/data/intelligence";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ultrai.org";
  const staticPages = [
    "",
    "/benchmarks",
    "/calculator",
    "/registry",
    "/intelligence",
    "/submit",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const reportPages = INTELLIGENCE_REPORTS.map((r) => ({
    url: `${baseUrl}/intelligence/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...reportPages];
}
