import type { Metadata } from "next";
import { BenchmarksClient } from "./BenchmarksClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "LLM Performance, Speed & Pricing Benchmarks",
  description:
    "Compare frontier closed and open-weights LLM quality index, coding scores, token throughput (tokens/s), TTFT latency, and blended API pricing per 1M tokens.",
  alternates: {
    canonical: "/benchmarks",
  },
  openGraph: {
    title: "LLM Performance, Speed & Pricing Benchmarks | UltrAI.org",
    description:
      "Independent side-by-side LLM leaderboard covering intelligence quality, coding scores, output speed, and blended API token costs.",
    url: `${SITE_URL}/benchmarks`,
  },
};

export default function BenchmarksPage() {
  return <BenchmarksClient />;
}
