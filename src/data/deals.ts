export type DealCategory =
  | "free-tier"
  | "cn-friendly"
  | "startup-credits"
  | "promo-discount";

export interface AiDeal {
  id: string;
  provider: string;
  titleEn: string;
  titleZh: string;
  category: DealCategory;
  freeQuotaEn: string;
  freeQuotaZh: string;
  noCreditCard: boolean;
  regionEn: string;
  regionZh: string;
  modelsCovered: string[];
  howToClaimEn: string;
  howToClaimZh: string;
  caveatEn: string;
  caveatZh: string;
  url: string;
  quickCmd?: string;
  featured?: boolean;
}

export interface LiveFreeModel {
  id: string;
  name: string;
  provider: string;
  contextK: number;
  url: string;
}

export interface LiveDealSignal {
  id: string;
  source: string;
  titleEn: string;
  titleZh: string;
  url: string;
  discussionUrl: string;
  points: number;
  comments: number;
  publishedAt: string;
}

export const AI_DEALS: AiDeal[] = [
  {
    id: "google-ai-studio",
    provider: "Google",
    titleEn: "Google AI Studio — Free Gemini API Tier",
    titleZh: "Google AI Studio — 免费 Gemini API 开发者层",
    category: "free-tier",
    freeQuotaEn: "Free RPM / RPD across Gemini Flash & Pro",
    freeQuotaZh: "Gemini Flash / Pro 每日免费调用额度（高并发）",
    noCreditCard: true,
    regionEn: "Global (Proxy needed in CN)",
    regionZh: "全球可用（国内需代理）",
    modelsCovered: ["Gemini 2.5 Flash", "Gemini 2.5 Pro", "Gemini Flash-Lite"],
    howToClaimEn:
      "Sign in with a Google account in AI Studio and click 'Get API key'—zero billing setup required.",
    howToClaimZh:
      "使用 Google 账号登录 AI Studio，点击「Get API key」即可直接生成密钥，无需绑定信用卡。",
    caveatEn:
      "Free tier prompts may be used to improve Google products; upgrade to Pay-as-you-go for zero-data-retention.",
    caveatZh:
      "免费层提示词可能用于产品改进；如处理企业隐私数据建议切换付费层。",
    url: "https://aistudio.google.com/apikey",
    quickCmd: "https://generativelanguage.googleapis.com/v1beta/openai/",
    featured: true,
  },
  {
    id: "openrouter-free-pool",
    provider: "OpenRouter",
    titleEn: "OpenRouter :free Route — Multi-Model Zero-Cost Pool",
    titleZh: "OpenRouter `:free` 免费模型池（统一 OpenAI 接口）",
    category: "free-tier",
    freeQuotaEn: "$0 / 1M tokens on 20+ open-weights models",
    freeQuotaZh: "20+ 款开源大模型 $0 / 1M Token 免费调用",
    noCreditCard: true,
    regionEn: "Global",
    regionZh: "全球可用",
    modelsCovered: ["DeepSeek R1/V3 :free", "Qwen3 :free", "Llama 4 :free", "Gemma 3 :free"],
    howToClaimEn:
      "Create an OpenRouter key and append ':free' to any eligible model ID from the live pool above.",
    howToClaimZh:
      "注册 OpenRouter 获取 API Key，在上方实时免费池挑选模型（后缀带 `:free`）即可零成本调用。",
    caveatEn:
      "Rate-limited per minute & per day (higher daily cap after adding $10+ account credits).",
    caveatZh:
      "免费路由存在每分钟及每日请求次数上限（账户充值 $10 以上可大幅提升免费日上限）。",
    url: "https://openrouter.ai/models?max_price=0",
    quickCmd: "https://openrouter.ai/api/v1",
    featured: true,
  },
  {
    id: "groq-free-tier",
    provider: "Groq",
    titleEn: "Groq Cloud — Ultra-Fast Free Inference Tier",
    titleZh: "Groq Cloud — 超高速 LPU 免费开发者层",
    category: "free-tier",
    freeQuotaEn: "Daily free token pool (300–800 t/s speed)",
    freeQuotaZh: "每日重置免费 Token 池（300–800 t/s 极速推理）",
    noCreditCard: true,
    regionEn: "Global",
    regionZh: "全球可用",
    modelsCovered: ["Llama 4 Scout/Maverick", "Qwen3", "DeepSeek Distill", "Whisper v3"],
    howToClaimEn:
      "Sign up at Groq Console with GitHub or Google and generate an OpenAI-compatible API key immediately.",
    howToClaimZh:
      "使用 GitHub 或 Google 登录 Groq Console，免绑卡立即创建兼容 OpenAI SDK 的高速 API Key。",
    caveatEn:
      "Strict tokens-per-minute (TPM) and requests-per-day limits suited for prototypes & low-volume agents.",
    caveatZh:
      "单分钟 TPM 与每日请求数有限额，非常适合原型开发、个人工作流与语音转写。",
    url: "https://console.groq.com/keys",
    quickCmd: "https://api.groq.com/openai/v1",
    featured: true,
  },
  {
    id: "github-models",
    provider: "GitHub",
    titleEn: "GitHub Models — Free Playground & Prototyping API",
    titleZh: "GitHub Models — 凭 GitHub 账号免费调主流闭源/开源模型",
    category: "free-tier",
    freeQuotaEn: "Free daily requests with Personal Access Token",
    freeQuotaZh: "免费每日推理额度（支持 GPT / DeepSeek / Llama 等）",
    noCreditCard: true,
    regionEn: "Global",
    regionZh: "全球可用",
    modelsCovered: ["GPT-4.1 / Mini", "DeepSeek R1", "Llama 4", "Mistral Large"],
    howToClaimEn:
      "Open GitHub Marketplace → Models, generate a fine-grained PAT with `models:read`, and call the Azure/GitHub endpoint.",
    howToClaimZh:
      "前往 GitHub Models 页面，创建带 `models:read` 权限的 PAT 即可免费体验多款旗舰模型。",
    caveatEn:
      "Rate-limited by GitHub account tier (Free / Pro / Copilot); strictly for prototyping before production.",
    caveatZh:
      "每日次数与上下文长度按 GitHub 账号等级限流，定位为开发与测试环境。",
    url: "https://github.com/marketplace/models",
    quickCmd: "https://models.github.ai/inference",
    featured: true,
  },
  {
    id: "cerebras-free",
    provider: "Cerebras",
    titleEn: "Cerebras Inference — 1M Free Tokens / Day",
    titleZh: "Cerebras Cloud — 每日 100 万免费极速 Tokens",
    category: "free-tier",
    freeQuotaEn: "Up to 1,000,000 tokens/day @ 1,500+ t/s",
    freeQuotaZh: "每日最高 100 万免费 Tokens（1,500+ t/s 超高速）",
    noCreditCard: true,
    regionEn: "Global",
    regionZh: "全球可用",
    modelsCovered: ["Llama 3.3 70B", "Qwen3 32B/235B", "Llama 4"],
    howToClaimEn:
      "Register on Cerebras Cloud with email/GitHub to unlock instant free-tier API keys.",
    howToClaimZh:
      "使用邮箱或 GitHub 注册 Cerebras Cloud，免绑卡即领每日百万级高速推理免费额度。",
    caveatEn:
      "Per-minute token caps apply; ideal for low-latency coding autocomplete & multi-step agent loops.",
    caveatZh:
      "存在每分钟频率限制，极适合需要毫秒级响应的 Agent 路由与代码补全。",
    url: "https://cloud.cerebras.ai/",
    quickCmd: "https://api.cerebras.ai/v1",
  },
  {
    id: "mistral-experiment",
    provider: "Mistral AI",
    titleEn: "Mistral La Plateforme — Experiment Free Plan",
    titleZh: "Mistral AI — Experiment 免费实验计划（含 Codestral）",
    category: "free-tier",
    freeQuotaEn: "Free API tier + dedicated free Codestral endpoint",
    freeQuotaZh: "免费 API 额度 + 独立免费编程模型 Codestral 端点",
    noCreditCard: true,
    regionEn: "Global",
    regionZh: "全球可用",
    modelsCovered: ["Mistral Small", "Mistral Large", "Codestral", "Pixtral"],
    howToClaimEn:
      "Create a Mistral Console workspace, verify phone number, and select the Experiment (Free) plan.",
    howToClaimZh:
      "注册 Mistral Console 并完成手机号验证，选择 Experiment 免费套餐即可开通密钥。",
    caveatEn:
      "Requires opting into data usage on the Experiment tier; rate limits apply per second.",
    caveatZh:
      "Experiment 免费计划需同意数据用于模型训练，存在每秒 QPS 限制。",
    url: "https://console.mistral.ai/",
    quickCmd: "https://api.mistral.ai/v1",
  },
  {
    id: "cloudflare-workers-ai",
    provider: "Cloudflare",
    titleEn: "Cloudflare Workers AI — 10,000 Free Neurons / Day",
    titleZh: "Cloudflare Workers AI — 每日 10,000 免费 Neurons 边缘推理",
    category: "free-tier",
    freeQuotaEn: "10,000 Neurons/day forever free (edge global)",
    freeQuotaZh: "永久每日 10,000 Neurons 免费额度（全球边缘节点）",
    noCreditCard: true,
    regionEn: "Global Edge",
    regionZh: "全球边缘直连",
    modelsCovered: ["Llama 3.3 / 4", "Qwen2.5 / Qwen3", "BGE Embeddings", "Whisper"],
    howToClaimEn:
      "Sign up for a free Cloudflare account and call Workers AI via REST API or Workers binding.",
    howToClaimZh:
      "注册免费 Cloudflare 账号，直接通过 REST API 或 Workers 绑定调用开源文本、向量与语音模型。",
    caveatEn:
      "Best for lightweight classification, embeddings, and small-model RAG; heavy models consume Neurons faster.",
    caveatZh:
      "非常适合做 Embedding 向量化、意图分类与轻量 RAG，超大参数模型消耗 Neurons 较快。",
    url: "https://developers.cloudflare.com/workers-ai/",
  },
  {
    id: "siliconflow-cn",
    provider: "SiliconFlow (硅基流动)",
    titleEn: "SiliconFlow — Signup Credits + Permanent Free Open Models",
    titleZh: "硅基流动 SiliconFlow — 新人赠金 + 多款开源模型永久免费",
    category: "cn-friendly",
    freeQuotaEn: "Free signup balance + $0/1M on selected 7B–9B models",
    freeQuotaZh: "新用户注册即送免费体验金 + Qwen/GLM 等精选开源模型永久免费",
    noCreditCard: true,
    regionEn: "China Direct + Global",
    regionZh: "国内高速直连，免代理",
    modelsCovered: ["Qwen2.5 / Qwen3 (Free)", "DeepSeek V3/R1", "GLM-4-9B (Free)"],
    howToClaimEn:
      "Register on SiliconCloud with phone/email to claim starter credits and call free-tagged models immediately.",
    howToClaimZh:
      "手机号注册硅基流动控制台即可领取新人额度，并可直接调用标注「免费」的开源模型及向量模型。",
    caveatEn:
      "Free models have RPM/TPM caps; flagship DeepSeek/Qwen-Max models draw from starter or paid balance.",
    caveatZh:
      "免费小参数模型有并发限制，旗舰满血模型消耗赠送额度或充值余额。",
    url: "https://cloud.siliconflow.cn/",
    quickCmd: "https://api.siliconflow.cn/v1",
    featured: true,
  },
  {
    id: "zhipu-bigmodel-cn",
    provider: "Zhipu AI (智谱清言)",
    titleEn: "Zhipu BigModel — Permanent Free Flash Models & Starter Pack",
    titleZh: "智谱开放平台 BigModel — GLM-4-Flash 永久免费调用",
    category: "cn-friendly",
    freeQuotaEn: "GLM-4-Flash & CogView/Embedding free tiers",
    freeQuotaZh: "GLM-4-Flash 等多款轻量模型免费调用 + 新人赠送资源包",
    noCreditCard: true,
    regionEn: "China Direct + Global",
    regionZh: "国内直连，实名即用",
    modelsCovered: ["GLM-4-Flash (Free)", "GLM-4V-Flash", "GLM-4-Plus"],
    howToClaimEn:
      "Sign in to open.bigmodel.cn, complete account verification, and generate an OpenAI-compatible API key.",
    howToClaimZh:
      "登录智谱开放平台完成基础认证并创建 API Key，即可在个人项目与 Agent 中免费调用 Flash 系列模型。",
    caveatEn:
      "Free Flash models enforce concurrency limits suitable for indie apps and automation workflows.",
    caveatZh:
      "免费模型有并发数限制，适合个人助手、内容清洗与中小流量业务。",
    url: "https://open.bigmodel.cn/",
    quickCmd: "https://open.bigmodel.cn/api/paas/v4/",
  },
  {
    id: "aliyun-bailian-cn",
    provider: "Alibaba Cloud (阿里云百炼)",
    titleEn: "Alibaba Cloud Model Studio — 1M Free Tokens per New Model",
    titleZh: "阿里云百炼 — 百余款模型新开通各送 100 万免费 Tokens",
    category: "cn-friendly",
    freeQuotaEn: "1,000,000 free tokens per eligible Qwen/DeepSeek model",
    freeQuotaZh: "开通即享每款主流模型 100 万免费 Tokens（覆盖 Qwen/DeepSeek）",
    noCreditCard: true,
    regionEn: "China Direct + Singapore",
    regionZh: "国内与海外节点均支持",
    modelsCovered: ["Qwen3 / Qwen-Max", "DeepSeek R1/V3", "Wan / Paraformer"],
    howToClaimEn:
      "Activate Alibaba Cloud Bailian (Model Studio) and claim per-model free trial quotas valid for 90–180 days.",
    howToClaimZh:
      "登录阿里云百炼平台开通服务，每个支持的模型均可领取百万级免费试用额度（通常有效期 90–180 天）。",
    caveatEn:
      "Free quota is per-model and time-limited after activation; monitor expiration in console.",
    caveatZh:
      "免费额度按单模型独立计算且有有效期，建议在控制台开启额度用尽停服防超额扣费。",
    url: "https://bailian.console.aliyun.com/",
    quickCmd: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  {
    id: "volcengine-ark-cn",
    provider: "Volcengine (火山方舟)",
    titleEn: "Volcengine Ark — 500K Free Tokens per Model + Collaboration Plan",
    titleZh: "字节火山方舟 — 单模型 50 万免费额度 + 协作计划每日免费 Token",
    category: "cn-friendly",
    freeQuotaEn: "500K free tokens per model (Doubao / DeepSeek)",
    freeQuotaZh: "每个模型赠送 50 万免费推理额度（豆包 / DeepSeek 满血版）",
    noCreditCard: true,
    regionEn: "China Direct",
    regionZh: "国内高稳定性直连",
    modelsCovered: ["Doubao 1.5 Pro", "DeepSeek R1/V3", "Doubao Vision"],
    howToClaimEn:
      "Sign up on Volcengine Ark Console, activate model endpoints, and use the built-in free quota per model.",
    howToClaimZh:
      "注册火山引擎进入火山方舟控制台，开通对应模型推理接入点即可使用每个模型自带的免费额度。",
    caveatEn:
      "Disable pay-as-you-go overflow or set budget alerts if you strictly want zero-spend usage.",
    caveatZh:
      "如仅需免费体验，建议在控制台勾选「免费额度用完即停」避免产生账单。",
    url: "https://console.volcengine.com/ark",
    quickCmd: "https://ark.cn-beijing.volces.com/api/v3",
  },
  {
    id: "ms-founders-hub",
    provider: "Microsoft Azure",
    titleEn: "Microsoft for Startups Founders Hub — Up to $150K Credits",
    titleZh: "微软创业扶持 Founders Hub — 最高 $150,000 Azure & OpenAI 额度",
    category: "startup-credits",
    freeQuotaEn: "$1,000–$150,000 Azure credits usable on Azure OpenAI",
    freeQuotaZh: "入门 $1,000 起，最高 $150,000 算力赠金（可直抵 Azure OpenAI）",
    noCreditCard: true,
    regionEn: "Global (Idea-stage welcome)",
    regionZh: "全球创业团队/独立开发者均可申请（无需融资）",
    modelsCovered: ["GPT-4.1 / o3", "DeepSeek on Azure", "GitHub Enterprise"],
    howToClaimEn:
      "Apply online with LinkedIn & a short product description—no prior VC funding required for Tier 1 ($1K–$5K).",
    howToClaimZh:
      "使用 LinkedIn 与项目简介即可在线申请，无需机构融资即可获批初级额度并逐步升级解锁。",
    caveatEn:
      "Must be building a software product/SaaS; credits expire after 12 months if unused.",
    caveatZh:
      "需为真实软件/AI 产品创业项目，获批额度通常有 12 个月有效期。",
    url: "https://www.microsoft.com/en-us/startups",
    featured: true,
  },
  {
    id: "gcp-startups-ai",
    provider: "Google Cloud",
    titleEn: "Google for Startups Cloud Program — Up to $350K AI Track",
    titleZh: "Google Cloud 创业扶持 AI 专项 — 最高 $350,000 Vertex AI 赠金",
    category: "startup-credits",
    freeQuotaEn: "$2,000 (Start) to $350,000 (Funded AI startups)",
    freeQuotaZh: "早期项目 $2,000 起，AI 融资初创最高 $350,000（支持 Gemini & Claude）",
    noCreditCard: false,
    regionEn: "Global",
    regionZh: "全球初创公司",
    modelsCovered: ["Vertex AI Gemini 2.5", "Claude on Vertex", "Cloud Run / GPU"],
    howToClaimEn:
      "Submit your company domain & pitch via the Google for Startups portal; approved credits apply to Vertex AI APIs.",
    howToClaimZh:
      "通过企业邮箱域名在 Google for Startups 官网提交申请，获批赠金可直接抵扣 Vertex AI 上的 Gemini 与 Claude 调用费。",
    caveatEn:
      "Requires a valid company domain and GCP billing profile; highest tier requires verified institutional funding.",
    caveatZh:
      "需自有公司域名与 GCP 结算账号；高额档位需提供融资证明。",
    url: "https://cloud.google.com/startup",
  },
  {
    id: "aws-activate",
    provider: "Amazon AWS",
    titleEn: "AWS Activate — Up to $100K Credits for Bedrock (Claude / Llama)",
    titleZh: "AWS Activate 创业计划 — 最高 $100,000 Bedrock 算力赠金",
    category: "startup-credits",
    freeQuotaEn: "$1,000 (Founders) to $100,000 (Portfolio) AWS credits",
    freeQuotaZh: "自申请 $1,000 起，合作孵化器最高 $100,000（可抵扣 Claude API）",
    noCreditCard: false,
    regionEn: "Global",
    regionZh: "全球初创团队",
    modelsCovered: ["Claude 4 Sonnet/Opus", "Llama 4", "Amazon Nova"],
    howToClaimEn:
      "Apply via AWS Activate Founders (self-funded) or with an accelerator Org ID to fund Amazon Bedrock inference.",
    howToClaimZh:
      "自筹团队可直接申请 AWS Activate Founders 档，通过孵化器/VC 推荐码可申请更高额度用于 Amazon Bedrock 调 Claude。",
    caveatEn:
      "AWS account requires billing verification; Bedrock third-party model eligibility varies by credit program.",
    caveatZh:
      "需完成 AWS 账单验证，部分特殊赠金对 Bedrock 第三方模型抵扣规则请以控制台账单页为准。",
    url: "https://aws.amazon.com/activate/",
  },
  {
    id: "deepseek-offpeak-cache",
    provider: "DeepSeek",
    titleEn: "DeepSeek API — Off-Peak 50%–75% Discount + Context Caching",
    titleZh: "DeepSeek 官方 API — 夜间错峰 2.5–5 折 + 上下文缓存 1 折",
    category: "promo-discount",
    freeQuotaEn: "50%–75% off during UTC 16:30–00:30 + 90% cache savings",
    freeQuotaZh: "北京时间 00:30–08:30 错峰低至 2.5 折，缓存命中省 90%",
    noCreditCard: true,
    regionEn: "China Direct + Global",
    regionZh: "国内直连，支持微信/支付宝充值",
    modelsCovered: ["DeepSeek-V3 (chat)", "DeepSeek-R1 (reasoner)"],
    howToClaimEn:
      "Schedule batch summarization, SEO generation, or eval jobs during UTC 16:30–00:30 for automatic off-peak pricing.",
    howToClaimZh:
      "无需领券：将批量文档清洗、离线评测与定时生成任务安排在北京时间 00:30–08:30 执行即可自动享受错峰折上折。",
    caveatEn:
      "Discount windows and percentages are governed by DeepSeek's live pricing page; check before heavy batch runs.",
    caveatZh:
      "错峰时段与具体折扣比例以 DeepSeek 官方计费页实时公告为准。",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    quickCmd: "https://api.deepseek.com/v1",
    featured: true,
  },
  {
    id: "prompt-cache-batch-50",
    provider: "OpenAI & Anthropic",
    titleEn: "Official Batch API (50% Off) & Prompt Caching (Up to 90% Off)",
    titleZh: "OpenAI / Anthropic 官方省钱通道：Batch 批处理 5 折 + 缓存立省 90%",
    category: "promo-discount",
    freeQuotaEn: "Flat 50% off async jobs + 75%–90% off cached input tokens",
    freeQuotaZh: "24 小时异步批处理直接半价，长系统提示词缓存最高省 90%",
    noCreditCard: false,
    regionEn: "Global",
    regionZh: "全球可用",
    modelsCovered: ["Claude 4 Sonnet", "GPT-4.1", "o3-mini"],
    howToClaimEn:
      "Enable ephemeral prompt caching for long system prompts/docs and route non-realtime workloads to `/v1/batches`.",
    howToClaimZh:
      "在 Agent 长上下文与 RAG 场景开启 Prompt Caching，并将非实时批处理任务切至官方 Batch API，立省一半以上账单。",
    caveatEn:
      "Batch API completes within 24 hours (not for live chat); caching requires prefix stability.",
    caveatZh:
      "Batch API 为 24 小时内异步返回，不适用于实时对话；缓存需保持前缀提示词稳定。",
    url: "https://platform.openai.com/docs/guides/batch",
  },
];

/** 当实时 OpenRouter API 超时或未同步时的兜底免费模型列表 */
export const FALLBACK_FREE_MODELS: LiveFreeModel[] = [
  {
    id: "deepseek/deepseek-r1-0528:free",
    name: "DeepSeek R1 0528 (free)",
    provider: "DeepSeek",
    contextK: 164,
    url: "https://openrouter.ai/models/deepseek/deepseek-r1-0528:free?ref=ultrai",
  },
  {
    id: "qwen/qwen3-235b-a22b:free",
    name: "Qwen3 235B A22B (free)",
    provider: "Qwen",
    contextK: 131,
    url: "https://openrouter.ai/models/qwen/qwen3-235b-a22b:free?ref=ultrai",
  },
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick (free)",
    provider: "Meta",
    contextK: 256,
    url: "https://openrouter.ai/models/meta-llama/llama-4-maverick:free?ref=ultrai",
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B IT (free)",
    provider: "Google",
    contextK: 96,
    url: "https://openrouter.ai/models/google/gemma-3-27b-it:free?ref=ultrai",
  },
  {
    id: "mistralai/mistral-small-3.1-24b-instruct:free",
    name: "Mistral Small 3.1 24B (free)",
    provider: "Mistral",
    contextK: 128,
    url: "https://openrouter.ai/models/mistralai/mistral-small-3.1-24b-instruct:free?ref=ultrai",
  },
  {
    id: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
    name: "Nemotron Ultra 253B (free)",
    provider: "NVIDIA",
    contextK: 131,
    url: "https://openrouter.ai/models/nvidia/llama-3.1-nemotron-ultra-253b-v1:free?ref=ultrai",
  },
];
