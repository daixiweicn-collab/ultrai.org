export type RegistryCategory =
  | "dev"
  | "data"
  | "browser"
  | "growth"
  | "knowledge";

export type SecurityGrade = "A+" | "A" | "B";

export interface RegistryItem {
  id: string;
  name: string;
  type: "MCP Server" | "Agent Skill" | "Workflow";
  category: RegistryCategory;
  grade: SecurityGrade;
  verified: boolean;
  stars: string;
  weeklyInstalls: string;
  pricing: "Open Source" | "Freemium" | "Paid";
  summaryEn: string;
  summaryZh: string;
  roiNoteEn: string;
  roiNoteZh: string;
  installCmd: string;
  mcpConfigSnippet: string;
  url: string;
  featured?: boolean;
}

export const REGISTRY_ITEMS: RegistryItem[] = [
  {
    id: "playwright-mcp",
    name: "Playwright Browser MCP",
    type: "MCP Server",
    category: "browser",
    grade: "A+",
    verified: true,
    stars: "18.4k",
    weeklyInstalls: "64k",
    pricing: "Open Source",
    summaryEn:
      "Deterministic accessibility-tree browser automation for AI agents without brittle pixel scraping.",
    summaryZh:
      "基于无障碍 DOM 树的确定性浏览器自动化 MCP，彻底告别脆弱的像素点击脚本。",
    roiNoteEn: "Cuts E2E QA & web scraping maintenance time by ~75%.",
    roiNoteZh: "降低 75% 端到端测试与竞品网页采集维护成本。",
    installCmd: "npx @playwright/mcp@latest",
    mcpConfigSnippet: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}`,
    url: "https://github.com/microsoft/playwright-mcp",
    featured: true,
  },
  {
    id: "supabase-mcp",
    name: "Supabase Ops & SQL MCP",
    type: "MCP Server",
    category: "dev",
    grade: "A+",
    verified: true,
    stars: "12.9k",
    weeklyInstalls: "48k",
    pricing: "Freemium",
    summaryEn:
      "Connect AI coding agents directly to schema migrations, read-only SQL analytics, and edge function logs.",
    summaryZh:
      "让 AI 编程助手直连数据库迁移、只读 SQL 报表查询与边缘函数日志排错。",
    roiNoteEn: "Accelerates indie SaaS MVP backend shipping by 3x.",
    roiNoteZh: "独立开发者 Micro-SaaS 后端交付提速 3 倍。",
    installCmd: "npx -y @supabase/mcp-server-supabase@latest",
    mcpConfigSnippet: `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--read-only"]
    }
  }
}`,
    url: "https://supabase.com/?ref=ultrai",
    featured: true,
  },
  {
    id: "firecrawl-mcp",
    name: "Firecrawl Web-to-Markdown MCP",
    type: "MCP Server",
    category: "data",
    grade: "A+",
    verified: true,
    stars: "31.2k",
    weeklyInstalls: "82k",
    pricing: "Freemium",
    summaryEn:
      "Turn any JS-rendered website into clean LLM-ready Markdown & structured JSON for market intelligence.",
    summaryZh:
      "将任意动态渲染网页转为干净的 LLM 专用 Markdown 与结构化 JSON，情报采集利器。",
    roiNoteEn: "Reduces token waste by 60% vs raw HTML ingestion.",
    roiNoteZh: "相比直接喂入 HTML 减少 60% Token 浪费。",
    installCmd: "npx -y firecrawl-mcp",
    mcpConfigSnippet: `{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "fc-YOUR_KEY" }
    }
  }
}`,
    url: "https://www.firecrawl.dev/?ref=ultrai",
    featured: true,
  },
  {
    id: "stripe-agent-toolkit",
    name: "Stripe Agent Billing MCP",
    type: "MCP Server",
    category: "growth",
    grade: "A+",
    verified: true,
    stars: "9.6k",
    weeklyInstalls: "29k",
    pricing: "Open Source",
    summaryEn:
      "Enable autonomous agents to generate payment links, inspect MRR churn, and issue metered invoices.",
    summaryZh:
      "授权智能体自动生成收款链接、分析 MRR 流失数据并按用量开具账单。",
    roiNoteEn: "Automates SaaS billing ops & usage-based metering.",
    roiNoteZh: "全自动打通 AI 按量计费与 SaaS 财务对账。",
    installCmd: "npx -y @stripe/mcp --tools=all",
    mcpConfigSnippet: `{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=paymentLinks.create,invoices.list"]
    }
  }
}`,
    url: "https://stripe.com/docs/agents",
    featured: true,
  },
  {
    id: "cloudflare-workers-mcp",
    name: "Cloudflare Workers & D1 MCP",
    type: "MCP Server",
    category: "dev",
    grade: "A+",
    verified: true,
    stars: "11.4k",
    weeklyInstalls: "37k",
    pricing: "Freemium",
    summaryEn:
      "Deploy serverless workers, inspect KV/R2 storage, and query observability traces from your agent.",
    summaryZh:
      "直接通过智能体部署边缘 Workers、管理 KV/R2 存储并排查线上性能追踪。",
    roiNoteEn: "Zero-ops global edge hosting under $5/mo for micro-SaaS.",
    roiNoteZh: "微型 SaaS 全球边缘部署运维成本压低至每月 $5 以内。",
    installCmd: "npx mcp-remote https://observability.mcp.cloudflare.com/sse",
    mcpConfigSnippet: `{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["mcp-remote", "https://observability.mcp.cloudflare.com/sse"]
    }
  }
}`,
    url: "https://developers.cloudflare.com/",
  },
  {
    id: "tavily-research-mcp",
    name: "Tavily Real-Time Search MCP",
    type: "MCP Server",
    category: "knowledge",
    grade: "A",
    verified: true,
    stars: "7.8k",
    weeklyInstalls: "41k",
    pricing: "Freemium",
    summaryEn:
      "Search API built specifically for RAG & AI agents with citation scoring and domain filtering.",
    summaryZh:
      "专为 RAG 与智能体设计的实时搜索 MCP，自带信源权重打分与域名过滤。",
    roiNoteEn: "Cuts hallucination rates on current-events queries by 68%.",
    roiNoteZh: "时效性情报检索幻觉率降低 68%。",
    installCmd: "npx -y tavily-mcp@latest",
    mcpConfigSnippet: `{
  "mcpServers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp@latest"],
      "env": { "TAVILY_API_KEY": "tvly-YOUR_KEY" }
    }
  }
}`,
    url: "https://tavily.com/?ref=ultrai",
  },
  {
    id: "geo-audit-skill",
    name: "GEO Visibility Audit Skill",
    type: "Agent Skill",
    category: "growth",
    grade: "A",
    verified: true,
    stars: "4.2k",
    weeklyInstalls: "15k",
    pricing: "Open Source",
    summaryEn:
      "Evaluates brand citation share across ChatGPT, Perplexity, and Claude plus generates llms.txt.",
    summaryZh:
      "自动化检测品牌在 ChatGPT/Perplexity/Claude 中的引用占比，并生成合规 llms.txt。",
    roiNoteEn: "Essential playbook for capturing 2026 AI search traffic.",
    roiNoteZh: "2026 年抢占 AI 搜索推荐流量的必备增长技能包。",
    installCmd: "npx ultrai-skills add geo-visibility-audit",
    mcpConfigSnippet: `# Agent Skill Manifest (SKILL.md)
name: geo-visibility-audit
triggers: ["audit brand AI visibility", "generate llms.txt"]
outputs: ["citation_matrix.json", "public/llms.txt"]`,
    url: "https://ultrai.org/intelligence/geo-playbook-2026",
  },
  {
    id: "sec-edgar-quant-mcp",
    name: "SEC Filing & Earnings Quant MCP",
    type: "Workflow",
    category: "data",
    grade: "B",
    verified: false,
    stars: "5.1k",
    weeklyInstalls: "12k",
    pricing: "Open Source",
    summaryEn:
      "Automated 10-K / 10-Q extraction pipeline converting financial tables into comparable JSON metrics.",
    summaryZh:
      "自动解析美股 10-K/10-Q 财报表格并转化为可横向对比的 JSON 指标流。",
    roiNoteEn: "Saves equity analysts 6+ hours per earnings season.",
    roiNoteZh: "财报季为每位投研分析师节省 6 小时以上人工摘录。",
    installCmd: "uvx sec-edgar-mcp --user-agent 'UltrAI research@ultrai.org'",
    mcpConfigSnippet: `{
  "mcpServers": {
    "sec-edgar": {
      "command": "uvx",
      "args": ["sec-edgar-mcp"]
    }
  }
}`,
    url: "https://github.com/ultrai-org/sec-edgar-mcp",
  },
];
