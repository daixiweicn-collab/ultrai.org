import liveModelsData from "./live-models.json";

export interface ModelBenchmark {
  id: string;
  name: string;
  provider: string;
  openWeights: boolean;
  /** 综合智能质量指数 (0-100) */
  qualityIndex: number;
  /** 代码与 Agent 执行分 (0-100) */
  codingScore: number;
  /** 吞吐速度 (tokens/sec) */
  tokensPerSec: number;
  /** 首字延迟 (seconds) */
  ttftSec: number;
  /** 输入价格 ($ per 1M tokens) */
  inputPrice: number;
  /** 输出价格 ($ per 1M tokens) */
  outputPrice: number;
  /** 上下文窗口 (K tokens) */
  contextK: number;
  /** 性价比综合得分 (0-100) */
  valueScore: number;
  /** 推荐应用场景标签 */
  bestForEn: string;
  bestForZh: string;
  /** API 部署/返佣链接（上线后替换为您的真实 Affiliate ID） */
  affiliateUrl: string;
  featured?: boolean;
  /** 是否已被 OpenRouter 实时价格覆盖 */
  liveSynced?: boolean;
}

type OverrideEntry = {
  sourceModelId: string;
  inputPrice: number;
  outputPrice: number;
  contextK: number;
};

const overrides = (liveModelsData.overrides || {}) as Record<string, OverrideEntry>;

export const LIVE_MODELS_META = {
  syncedAt: liveModelsData.syncedAt,
  totalTrackedOnOpenRouter: liveModelsData.totalTrackedOnOpenRouter || 0,
  liveCount: Object.keys(overrides).length,
};

const BASE_MODELS: ModelBenchmark[] = [
  {
    id: "claude-4-sonnet",
    name: "Claude 4 Sonnet",
    provider: "Anthropic",
    openWeights: false,
    qualityIndex: 94.8,
    codingScore: 96.4,
    tokensPerSec: 88,
    ttftSec: 0.72,
    inputPrice: 3.0,
    outputPrice: 15.0,
    contextK: 200,
    valueScore: 89,
    bestForEn: "Production Coding & Autonomous Agents",
    bestForZh: "生产级编程与自主 Agent",
    affiliateUrl: "https://openrouter.ai/models/anthropic/claude-sonnet-4?ref=ultrai",
    featured: true,
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    openWeights: false,
    qualityIndex: 95.2,
    codingScore: 95.1,
    tokensPerSec: 112,
    ttftSec: 0.65,
    inputPrice: 1.25,
    outputPrice: 10.0,
    contextK: 1000,
    valueScore: 95,
    bestForEn: "Long-Context Analysis & Multimodal RAG",
    bestForZh: "超长上下文研报与多模态 RAG",
    affiliateUrl: "https://openrouter.ai/models/google/gemini-2.5-pro?ref=ultrai",
    featured: true,
  },
  {
    id: "deepseek-r1-0528",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    openWeights: true,
    qualityIndex: 92.6,
    codingScore: 93.2,
    tokensPerSec: 64,
    ttftSec: 0.95,
    inputPrice: 0.55,
    outputPrice: 2.19,
    contextK: 128,
    valueScore: 98,
    bestForEn: "High-ROI Reasoning & Math Workflows",
    bestForZh: "极致性价比推理与量化分析",
    affiliateUrl: "https://openrouter.ai/models/deepseek/deepseek-r1?ref=ultrai",
    featured: true,
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    openWeights: false,
    qualityIndex: 93.4,
    codingScore: 94.0,
    tokensPerSec: 105,
    ttftSec: 0.54,
    inputPrice: 2.0,
    outputPrice: 8.0,
    contextK: 1000,
    valueScore: 91,
    bestForEn: "Structured Extraction & Tool Calling",
    bestForZh: "结构化数据抽取与稳定函数调用",
    affiliateUrl: "https://openrouter.ai/models/openai/gpt-4.1?ref=ultrai",
    featured: true,
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    openWeights: false,
    qualityIndex: 88.9,
    codingScore: 87.5,
    tokensPerSec: 215,
    ttftSec: 0.28,
    inputPrice: 0.15,
    outputPrice: 0.6,
    contextK: 1000,
    valueScore: 99,
    bestForEn: "High-Volume Agents & Real-Time UI",
    bestForZh: "超高并发 Agent 与实时低延迟应用",
    affiliateUrl: "https://openrouter.ai/models/google/gemini-2.5-flash?ref=ultrai",
    featured: true,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    openWeights: true,
    qualityIndex: 89.4,
    codingScore: 90.1,
    tokensPerSec: 78,
    ttftSec: 0.61,
    inputPrice: 0.27,
    outputPrice: 1.1,
    contextK: 128,
    valueScore: 97,
    bestForEn: "Cost-Effective Bulk Content & Translation",
    bestForZh: "低成本批量内容与多语言处理",
    affiliateUrl: "https://openrouter.ai/models/deepseek/deepseek-chat-v3?ref=ultrai",
  },
  {
    id: "qwen-3-235b",
    name: "Qwen3 235B MoE",
    provider: "Alibaba",
    openWeights: true,
    qualityIndex: 91.5,
    codingScore: 91.8,
    tokensPerSec: 94,
    ttftSec: 0.49,
    inputPrice: 0.4,
    outputPrice: 1.6,
    contextK: 128,
    valueScore: 96,
    bestForEn: "Bilingual Enterprise & Private Deployment",
    bestForZh: "中英双语企业私有化部署首选",
    affiliateUrl: "https://openrouter.ai/models/qwen/qwen3-235b-a22b?ref=ultrai",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    provider: "OpenAI",
    openWeights: false,
    qualityIndex: 87.2,
    codingScore: 86.8,
    tokensPerSec: 168,
    ttftSec: 0.34,
    inputPrice: 0.4,
    outputPrice: 1.6,
    contextK: 1000,
    valueScore: 93,
    bestForEn: "Customer Support & SaaS Classification",
    bestForZh: "SaaS 客服工单与文本分类路由",
    affiliateUrl: "https://openrouter.ai/models/openai/gpt-4.1-mini?ref=ultrai",
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "Meta",
    openWeights: true,
    qualityIndex: 88.1,
    codingScore: 86.2,
    tokensPerSec: 185,
    ttftSec: 0.31,
    inputPrice: 0.22,
    outputPrice: 0.85,
    contextK: 1000,
    valueScore: 94,
    bestForEn: "Self-Hosted Inference & Fine-Tuning",
    bestForZh: "自托管推理集群与垂直领域微调",
    affiliateUrl: "https://openrouter.ai/models/meta-llama/llama-4-maverick?ref=ultrai",
  },
  {
    id: "o3-mini",
    name: "OpenAI o3-mini",
    provider: "OpenAI",
    openWeights: false,
    qualityIndex: 91.0,
    codingScore: 92.5,
    tokensPerSec: 126,
    ttftSec: 0.88,
    inputPrice: 1.1,
    outputPrice: 4.4,
    contextK: 200,
    valueScore: 90,
    bestForEn: "Algorithmic Reasoning & STEM Audit",
    bestForZh: "算法逻辑验证与数理推理审计",
    affiliateUrl: "https://openrouter.ai/models/openai/o3-mini?ref=ultrai",
  },
];

export const MODEL_BENCHMARKS: ModelBenchmark[] = BASE_MODELS.map((m) => {
  const ov = overrides[m.id];
  if (!ov) return m;
  return {
    ...m,
    inputPrice: ov.inputPrice,
    outputPrice: ov.outputPrice,
    contextK: ov.contextK || m.contextK,
    liveSynced: true,
  };
});

/** 计算加权综合单价 (假设 3:1 输入输出比例，单位 $/1M tokens) */
export function getBlendedPrice(m: ModelBenchmark): number {
  return Number(((m.inputPrice * 3 + m.outputPrice) / 4).toFixed(2));
}
