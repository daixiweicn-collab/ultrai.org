export interface IntelligenceReport {
  slug: string;
  categoryEn: string;
  categoryZh: string;
  tier: "Free" | "Pro Preview";
  publishedAt: string;
  readTimeMin: number;
  titleEn: string;
  titleZh: string;
  excerptEn: string;
  excerptZh: string;
  keyMetrics: {
    labelEn: string;
    labelZh: string;
    value: string;
  }[];
  sectionsEn: {
    heading: string;
    body: string[];
  }[];
  sectionsZh: {
    heading: string;
    body: string[];
  }[];
  proLockedHighlightsEn: string[];
  proLockedHighlightsZh: string[];
}

export const INTELLIGENCE_REPORTS: IntelligenceReport[] = [
  {
    slug: "indie-ai-monetization-2026",
    categoryEn: "Monetization Teardown",
    categoryZh: "商业变现拆解",
    tier: "Free",
    publishedAt: "2026-11-15",
    readTimeMin: 6,
    titleEn: "How Solo Builders Hit $10K–$40K MRR in 2026: The Death of Flat-Fee Wrappers",
    titleZh: "2026 独立开发者月入 $10K–$40K 实录：为什么简单包月套壳已死？",
    excerptEn:
      "Data teardown of 42 profitable indie AI sites shows hybrid credit pricing, boring B2B niches, and recurring infrastructure affiliates outperform generic chat wrappers by 4.3x in LTV.",
    excerptZh:
      "基于 42 个盈利独立 AI 网站的真实数据拆解：混合积分定价、枯燥 B2B 垂直场景与基础设施持续返佣，其客户生命周期价值（LTV）是泛套壳站的 4.3 倍。",
    keyMetrics: [
      { labelEn: "Median Gross Margin", labelZh: "中位毛利率", value: "78.4%" },
      { labelEn: "Top Pricing Model", labelZh: "最稳健定价", value: "Base + Credits" },
      { labelEn: "Avg Affiliate Commission", labelZh: "平均持续返佣", value: "25% Rec." },
    ],
    sectionsEn: [
      {
        heading: "1. Why Flat $9/mo Subscriptions Collapse Under Agentic Workloads",
        body: [
          "In 2024, users sent short single-turn prompts. In 2026, agentic workflows trigger 15 to 40 tool calls per user task. A single power user on an unlimited $9/mo plan can easily burn $45 in frontier model tokens.",
          "Top-performing micro-SaaS founders solved this with Hybrid Pricing: a predictable $19–$49/mo base seat for workflow state & integrations, bundled with transparent token/task credits and auto-top-up packs.",
        ],
      },
      {
        heading: "2. The 'Referee & Connector' Advantage (.org Playbook)",
        body: [
          "Instead of fighting foundation labs on raw generation quality, independent sites focusing on objective benchmarks, cost calculators, and curated MCP/tool registries enjoy near-zero COGS (Cost of Goods Sold).",
          "Monetization stacks three layers: recurring 20–30% API/SaaS affiliate payouts, $49–$199 expedited directory listings from new AI startups, and $1,500+/mo B2B category sponsorships.",
        ],
      },
    ],
    sectionsZh: [
      {
        heading: "一、为什么 $9/月“无限使用”在 Agent 时代必然亏钱？",
        body: [
          "两年前用户只是单轮问答，而到了 2026 年，一次 Agent 任务往往触发 15~40 次连续工具调用。一个重度用户每月就能消耗掉 $45 以上的旗舰模型 Token，直接击穿低价包月站的毛利。",
          "如今真正赚钱的微型 SaaS 普遍采用“混合定价”：$19–$49/月基础订阅（锁定工作流、数据存储与集成）+ 透明的额度包（Credits），既保证现金流可预测，又彻底杜绝算力倒挂。",
        ],
      },
      {
        heading: "二、“裁判员与连接器”模式的超高毛利红利",
        body: [
          "与其和大模型厂商硬碰硬拼生成能力，不如像独立智库一样，做生态里的评测榜、Token 成本计算器和 MCP/工具严选库——几乎没有算力成本（零 COGS）。",
          "变现自然叠加三层：云厂商/AI 工具 20%–30% 的持续消费返佣、AI 创业团队 $49–$199 的付费加速收录与认证徽章，以及 B2B 品牌每月 $1,500+ 的榜单专属赞助位。",
        ],
      },
    ],
    proLockedHighlightsEn: [
      "Full Airtable CSV of 42 profitable AI sites with verified traffic sources & MRR estimates",
      "High-converting SaaS & API affiliate program list (ranked by cookie window & recurring %)",
    ],
    proLockedHighlightsZh: [
      "42 个高盈利 AI 独立站完整拆解表（含真实流量渠道、技术栈与 MRR 估算）",
      "高佣金 AI 基础设施与 SaaS 联盟计划清单（按持续分成比例与结算周期排序）",
    ],
  },
  {
    slug: "geo-playbook-2026",
    categoryEn: "Growth & Traffic",
    categoryZh: "流量与 GEO 增长",
    tier: "Free",
    publishedAt: "2026-11-10",
    readTimeMin: 5,
    titleEn: "GEO (Generative Engine Optimization): How to Get Cited by ChatGPT, Claude & Perplexity",
    titleZh: "GEO 生成式引擎优化实战：如何让你的网站成为 ChatGPT 与 Claude 的首选引用信源？",
    excerptEn:
      "Traditional 10-blue-links SEO clicks dropped 34% for informational queries. Here is the exact structural blueprint—llms.txt, benchmark tables, and original telemetry—that wins AI citations.",
    excerptZh:
      "传统搜索的泛信息点击率下滑了 34%。本文拆解如何通过 llms.txt、结构化评测表与独家基准数据，让你的站点被主流大模型高频引用并带来高意向精准流量。",
    keyMetrics: [
      { labelEn: "AI Referral Conv. Rate", labelZh: "AI 引荐转化率", value: "3.1x SEO" },
      { labelEn: "Key Technical File", labelZh: "核心规范文件", value: "/llms.txt" },
      { labelEn: "Highest Cited Format", labelZh: "最高引用格式", value: "Data Tables" },
    ],
    sectionsEn: [
      {
        heading: "1. Why AI Answer Engines Prefer Original Data Over Generic Blogs",
        body: [
          "LLMs already know generic definitions. When retrieval-augmented search runs, answer engines aggressively prioritize pages containing fresh structured numbers: pricing comparison tables, latency benchmarks, and verifiable dates.",
          "Users arriving via an AI citation link convert 3.1x higher than traditional search traffic because the AI has already pre-qualified the recommendation.",
        ],
      },
      {
        heading: "2. Implementing /llms.txt and Semantic Schema",
        body: [
          "Publishing a clean Markdown index at /llms.txt gives AI crawlers and coding agents an immediate map of your highest-signal pages, benchmarks, and API endpoints without wasting context tokens on navigation chrome.",
        ],
      },
    ],
    sectionsZh: [
      {
        heading: "一、为什么 AI 搜索引擎只引用“一手结构化数据”？",
        body: [
          "泛泛而谈的概念科普早已被大模型内化。当 ChatGPT 或 Perplexity 触发联网检索时，算法会极度偏爱带有明确时间戳的结构化对比表、真实价格参数与实测数据。",
          "更重要的是，通过 AI 推荐链接点进来的访客，其付费或注册转化率平均是传统 SEO 泛流量的 3.1 倍，因为 AI 已经替你完成了信任背书。",
        ],
      },
      {
        heading: "二、部署 /llms.txt 与结构化语义索引",
        body: [
          "在网站根目录提供标准化的 /llms.txt Markdown 索引，相当于给全球 AI 爬虫和编程 Agent 一份清晰的“机读目录”，极大提升核心评测页和工具页被精准引用的概率。",
        ],
      },
    ],
    proLockedHighlightsEn: [
      "Automated Python script to monitor your domain's citation share across 4 major AI engines",
      "Ready-to-use JSON-LD Dataset & SoftwareApplication schema templates",
    ],
    proLockedHighlightsZh: [
      "自动化监控脚本：定期检测你的域名在四大 AI 引擎中的提及率与排名变化",
      "开箱即用的 JSON-LD 数据集与软件评测结构化标记模板",
    ],
  },
  {
    slug: "mcp-ecosystem-business-models",
    categoryEn: "Ecosystem Analysis",
    categoryZh: "生态与协议分析",
    tier: "Pro Preview",
    publishedAt: "2026-11-04",
    readTimeMin: 7,
    titleEn: "The MCP Economy: Monetizing Agent Tools via Usage Metering & Verified Registries",
    titleZh: "MCP 协议经济深度报告：Agent 工具如何通过按次计费与认证注册表变现？",
    excerptEn:
      "As Model Context Protocol standardizes how agents connect to external APIs, tool discovery and security auditing have become the new App Store bottleneck.",
    excerptZh:
      "随着 MCP 成为智能体连接外部 API 的事实标准，“工具发现、权限安全审计与按次微支付”正在催生 AI 时代的新一代应用商店红利。",
    keyMetrics: [
      { labelEn: "Active Public MCPs", labelZh: "公开 MCP 数量", value: "14,200+" },
      { labelEn: "Enterprise Blocker", labelZh: "企业采购最大痛点", value: "Security Audit" },
      { labelEn: "Avg Listing Fee", labelZh: "认证收录均价", value: "$49–$199" },
    ],
    sectionsEn: [
      {
        heading: "1. Security Grading Is the Missing Trust Layer",
        body: [
          "Over 60% of open-source MCP servers request overly broad environment tokens or lack read-only modes. Enterprises refuse to install unvetted community servers into production IDE or agent pipelines.",
          "Independent registries that perform static permission checks and assign transparent grades (A+ to C) immediately capture high-intent engineering teams.",
        ],
      },
    ],
    sectionsZh: [
      {
        heading: "一、安全评级是企业落地 MCP 最大的信任缺口",
        body: [
          "超过 60% 的社区开源 MCP 服务默认申请过宽的环境变量权限，或缺少只读保护模式。企业研发团队根本不敢把未经审计的社区脚本直接接入生产环境。",
          "因此，能够提供透明权限审计与安全分级（A+ 至 C）的第三方独立索引站，天然能吸引高净值 B2B 开发者与技术决策者。",
        ],
      },
    ],
    proLockedHighlightsEn: [
      "Complete 12-point MCP security audit checklist & automated static scanner rules",
      "Blueprint for wrapping a niche B2B API into a Stripe-metered paid MCP server",
    ],
    proLockedHighlightsZh: [
      "完整 12 项 MCP 安全审计清单与自动化静态扫描规则集",
      "实战蓝图：如何把垂直行业 API 封装为对接 Stripe 按次计费的商业 MCP",
    ],
  },
  {
    slug: "llm-routing-cost-optimization",
    categoryEn: "Unit Economics",
    categoryZh: "算力与单位经济",
    tier: "Pro Preview",
    publishedAt: "2026-10-28",
    readTimeMin: 5,
    titleEn: "Model Routing Architecture: Cutting Production AI Inference Bills by 68% Without Quality Loss",
    titleZh: "多模型智能路由架构：如何在不降低输出质量的前提下削减 68% 的推理账单？",
    excerptEn:
      "Benchmarking cascade routing between Gemini 2.5 Flash, DeepSeek R1, and Claude 4 Sonnet across 100,000 real SaaS production requests.",
    excerptZh:
      "基于 10 万条真实 SaaS 生产请求的实测：如何用轻量模型做意图分类、高性价比推理模型做草稿、旗舰模型做兜底，综合成本立降 68%。",
    keyMetrics: [
      { labelEn: "Measured Cost Drop", labelZh: "实测成本降幅", value: "-68.2%" },
      { labelEn: "Quality Retention", labelZh: "质量保持率", value: "98.7%" },
      { labelEn: "P95 Latency Gain", labelZh: "P95 延迟优化", value: "-44%" },
    ],
    sectionsEn: [
      {
        heading: "1. The 70 / 20 / 10 Cascade Rule",
        body: [
          "In real SaaS traffic, ~70% of requests (extraction, formatting, classification) are solved identically by $0.15/1M Flash-tier models. Routing only the hardest 10% to flagship reasoning models preserves margins while cutting P95 latency nearly in half.",
        ],
      },
    ],
    sectionsZh: [
      {
        heading: "一、生产环境的 70 / 20 / 10 级联路由法则",
        body: [
          "真实业务流量中，约 70% 的请求（格式清洗、摘要、简单分类）用 $0.15/百万 Token 级别的轻量模型即可达到同等质量；仅将最复杂的 10% 路由给旗舰模型，即可在几乎零质量损耗下让毛利暴涨。",
        ],
      },
    ],
    proLockedHighlightsEn: [
      "TypeScript reference router implementation with automatic fallback & latency circuit breaker",
      "Full 100k-request benchmark CSV segmented by prompt complexity",
    ],
    proLockedHighlightsZh: [
      "可直接复用的 TypeScript 多模型路由与熔断降级源码",
      "10 万条生产请求按复杂度分层的完整实测 CSV 数据",
    ],
  },
];
