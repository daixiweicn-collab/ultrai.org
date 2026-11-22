import type { Metadata } from "next";
import { getLiveDealsData } from "@/lib/live-deals";
import { FreeTokensClient } from "./FreeTokensClient";
import { SITE_URL } from "@/lib/site";

// 每小时增量更新 OpenRouter 最新免费模型池
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Free AI API Tokens, Credits & LLM Promo Tracker",
  description:
    "Live tracker of free LLM API tiers (no credit card required), auto-synced $0/1M OpenRouter models, China-direct free quotas, off-peak discounts, and up to $350K cloud AI startup grants.",
  keywords: [
    "free AI API tokens",
    "free LLM API",
    "OpenRouter free models",
    "free Gemini API",
    "free Groq API",
    "AI startup credits",
    "DeepSeek off-peak discount",
    "免费大模型 API",
    "免费 AI Token",
  ],
  alternates: {
    canonical: "/free-tokens",
  },
  openGraph: {
    title: "Free AI API Tokens, Credits & Live LLM Promos | UltrAI.org",
    description:
      "Daily-updated guide to $0/1M open models, zero-card free API keys, off-peak discounts, and $350K+ cloud AI startup credits.",
    url: `${SITE_URL}/free-tokens`,
  },
};

export default async function FreeTokensPage() {
  const initialLive = await getLiveDealsData();
  return <FreeTokensClient initialLive={initialLive} />;
}
