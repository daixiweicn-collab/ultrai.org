import type { Metadata } from "next";
import { CalculatorClient } from "./CalculatorClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "LLM Token Cost & ROI Calculator",
  description:
    "Interactive API token cost estimator comparing monthly and annual spend across Claude 4 Sonnet, Gemini 2.5 Flash/Pro, GPT-4.1, DeepSeek R1/V3, and Qwen3.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: {
    title: "LLM Token Cost & ROI Calculator | UltrAI.org",
    description:
      "Model monthly & annual LLM API bills with real workload presets and identify routing savings before shipping.",
    url: `${SITE_URL}/calculator`,
  },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
