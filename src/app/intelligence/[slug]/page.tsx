import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INTELLIGENCE_REPORTS } from "@/data/intelligence";
import { IntelligenceDetailClient } from "./IntelligenceDetailClient";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return INTELLIGENCE_REPORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = INTELLIGENCE_REPORTS.find((r) => r.slug === slug);

  if (!report) {
    return {
      title: "Report Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: report.titleEn,
    description: report.excerptEn,
    alternates: {
      canonical: `/intelligence/${report.slug}`,
    },
    openGraph: {
      title: `${report.titleEn} | UltrAI.org`,
      description: report.excerptEn,
      type: "article",
      publishedTime: report.publishedAt,
      url: `${SITE_URL}/intelligence/${report.slug}`,
    },
  };
}

export default async function IntelligenceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = INTELLIGENCE_REPORTS.find((r) => r.slug === slug);

  if (!report) {
    notFound();
  }

  return <IntelligenceDetailClient report={report} />;
}
