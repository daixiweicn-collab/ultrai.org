import liveFeed from "@/data/live-feed.json";
import {
  FALLBACK_FREE_MODELS,
  LiveDealSignal,
  LiveFreeModel,
} from "@/data/deals";

interface LiveFeedExtended {
  syncedAt?: string;
  freeModels?: LiveFreeModel[];
  dealSignals?: LiveDealSignal[];
}

interface OpenRouterModel {
  id?: string;
  name?: string;
  context_length?: number;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
}

export interface LiveDealsPayload {
  syncedAt: string;
  source: "live-openrouter" | "daily-snapshot" | "fallback";
  freeModels: LiveFreeModel[];
  dealSignals: LiveDealSignal[];
}

function parseProvider(id: string, rawName?: string): string {
  if (rawName && rawName.includes(":")) {
    return rawName.split(":")[0].trim();
  }
  const slug = id.split("/")[0] || "Open";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function parseDisplayName(id: string, rawName?: string): string {
  if (!rawName) return id;
  return rawName.replace(/^[^:]+:\s*/, "").trim();
}

export function extractFreeModelsFromOpenRouter(
  allModels: OpenRouterModel[]
): LiveFreeModel[] {
  const seen = new Set<string>();
  const freeList: LiveFreeModel[] = [];

  for (const m of allModels) {
    if (!m?.id || seen.has(m.id)) continue;
    const prompt = parseFloat(m.pricing?.prompt ?? "1");
    const completion = parseFloat(m.pricing?.completion ?? "1");
    const isZeroCost =
      Number.isFinite(prompt) &&
      Number.isFinite(completion) &&
      prompt === 0 &&
      completion === 0;
    const isFreeSlug = m.id.endsWith(":free");

    if (!isZeroCost && !isFreeSlug) continue;
    // 排除纯路由占位 ID
    if (m.id === "openrouter/auto") continue;

    seen.add(m.id);
    freeList.push({
      id: m.id,
      name: parseDisplayName(m.id, m.name),
      provider: parseProvider(m.id, m.name),
      contextK: Math.max(4, Math.round((m.context_length || 32000) / 1000)),
      url: `https://openrouter.ai/models/${m.id}?ref=ultrai`,
    });
  }

  // 优先展示上下文大且知名厂商的免费模型
  const priorityProviders = [
    "deepseek",
    "google",
    "qwen",
    "meta",
    "mistral",
    "nvidia",
    "openai",
    "anthropic",
  ];

  freeList.sort((a, b) => {
    const pA = priorityProviders.findIndex((p) =>
      a.provider.toLowerCase().includes(p)
    );
    const pB = priorityProviders.findIndex((p) =>
      b.provider.toLowerCase().includes(p)
    );
    const rankA = pA === -1 ? 99 : pA;
    const rankB = pB === -1 ? 99 : pB;
    if (rankA !== rankB) return rankA - rankB;
    return b.contextK - a.contextK;
  });

  return freeList.slice(0, 30);
}

/**
 * 服务端优先实时拉取 OpenRouter 最新 $0 免费模型池（1 小时增量缓存 + 4 秒超时），
 * 离线或超时时无缝降级至每日自动同步快照或兜底列表，绝不阻塞页面渲染。
 */
export async function getLiveDealsData(
  options: { bypassCache?: boolean } = {}
): Promise<LiveDealsPayload> {
  const feed = liveFeed as LiveFeedExtended;
  const snapshotModels =
    Array.isArray(feed.freeModels) && feed.freeModels.length > 0
      ? feed.freeModels
      : null;
  const snapshotSignals = Array.isArray(feed.dealSignals)
    ? feed.dealSignals
    : [];

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "User-Agent": "UltrAI-Open-Intelligence-Bot/1.0 (+https://www.ultrai.org)",
        Accept: "application/json",
      },
      ...(options.bypassCache
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600 } }),
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      const all = Array.isArray(json?.data) ? (json.data as OpenRouterModel[]) : [];
      const liveFree = extractFreeModelsFromOpenRouter(all);
      if (liveFree.length > 0) {
        return {
          syncedAt: new Date().toISOString(),
          source: "live-openrouter",
          freeModels: liveFree,
          dealSignals: snapshotSignals,
        };
      }
    }
  } catch {
    // 离线或超时时优雅降级
  }

  if (snapshotModels) {
    return {
      syncedAt: feed.syncedAt || new Date().toISOString(),
      source: "daily-snapshot",
      freeModels: snapshotModels,
      dealSignals: snapshotSignals,
    };
  }

  return {
    syncedAt: feed.syncedAt || new Date().toISOString(),
    source: "fallback",
    freeModels: FALLBACK_FREE_MODELS,
    dealSignals: snapshotSignals,
  };
}
