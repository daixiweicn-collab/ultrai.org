import type { Metadata } from "next";
import { IntelligenceClient } from "./IntelligenceClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Monetization Teardowns & Unit Economics Intelligence",
  description:
    "Empirical research on indie AI micro-SaaS monetization, GEO (Generative Engine Optimization), MCP business models, and cascade LLM routing cost optimization.",
  alternates: {
    canonical: "/intelligence",
  },
  openGraph: {
    title: "AI Monetization Teardowns & Unit Economics | UltrAI.org",
    description:
      "Numbers-first AI business intelligence, GEO growth playbooks, and real-time AI/MCP industry radar.",
    url: `${SITE_URL}/intelligence`,
  },
};

export default function IntelligencePage() {
  return <IntelligenceClient />;
}
