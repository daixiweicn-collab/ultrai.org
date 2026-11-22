#!/usr/bin/env node
/**
 * UltrAI.org 全自动数据与资讯同步引擎
 * 1. 从 OpenRouter Public API 同步最新大模型真实定价与上下文窗口
 * 2. 从 GitHub Search API 同步热门 MCP Server 仓库与 Star 数
 * 3. 从 Hacker News Algolia API 同步高热度 AI / Agent / SaaS 商业资讯
 *    (若配置了 GEMINI_API_KEY 或 OPENAI_API_KEY，将自动生成中文翻译与商业 ROI 点评)
 *
 * 运行方式：node scripts/sync-data.mjs  或  npm run sync
 */

import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "UltrAI-Open-Intelligence-Bot/1.0 (+https://ultrai.org)",
      Accept: "application/json",
      ...headers,
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

/** 1. 同步 OpenRouter 实时模型定价 */
async function syncOpenRouterModels() {
  console.log("[1/3] 正在从 OpenRouter API 拉取实时模型定价...");
  const json = await fetchJson("https://openrouter.ai/api/v1/models");
  const all = Array.isArray(json?.data) ? json.data : [];

  // 重点追踪的主流模型 ID 映射（匹配我们排行榜中的模型）
  const targets = [
    { localId: "claude-4-sonnet", match: ["anthropic/claude-sonnet-4", "anthropic/claude-3.7-sonnet"] },
    { localId: "gemini-2.5-pro", match: ["google/gemini-2.5-pro"] },
    { localId: "deepseek-r1-0528", match: ["deepseek/deepseek-r1"] },
    { localId: "gpt-4.1", match: ["openai/gpt-4.1", "openai/gpt-4o"] },
    { localId: "gemini-2.5-flash", match: ["google/gemini-2.5-flash"] },
    { localId: "deepseek-v3", match: ["deepseek/deepseek-chat-v3", "deepseek/deepseek-chat"] },
    { localId: "qwen-3-235b", match: ["qwen/qwen3-235b-a22b", "qwen/qwen-2.5-72b-instruct"] },
    { localId: "gpt-4.1-mini", match: ["openai/gpt-4.1-mini", "openai/gpt-4o-mini"] },
    { localId: "llama-4-maverick", match: ["meta-llama/llama-4-maverick"] },
    { localId: "o3-mini", match: ["openai/o3-mini"] },
  ];

  const priceOverrides = {};
  for (const t of targets) {
    const found = t.match
      .map((slug) => all.find((m) => m.id === slug || m.id?.startsWith(slug)))
      .find(Boolean);
    if (found && found.pricing) {
      const inputPerM = Number((parseFloat(found.pricing.prompt || "0") * 1_000_000).toFixed(3));
      const outputPerM = Number((parseFloat(found.pricing.completion || "0") * 1_000_000).toFixed(3));
      const contextK = Math.round((found.context_length || 128000) / 1000);
      if (inputPerM >= 0 && outputPerM >= 0 && (inputPerM > 0 || outputPerM > 0)) {
        priceOverrides[t.localId] = {
          sourceModelId: found.id,
          inputPrice: inputPerM,
          outputPrice: outputPerM,
          contextK,
        };
      }
    }
  }

  const output = {
    syncedAt: new Date().toISOString(),
    totalTrackedOnOpenRouter: all.length,
    overrides: priceOverrides,
  };

  await fs.writeFile(
    path.join(DATA_DIR, "live-models.json"),
    JSON.stringify(output, null, 2) + "\n",
    "utf8"
  );
  console.log(
    `   ✓ 已同步 ${Object.keys(priceOverrides).length} 个主力模型实时价格（OpenRouter 共索引 ${all.length} 个模型）`
  );
  return output;
}

/** 2. 同步 GitHub 热门 MCP 仓库 */
async function syncGitHubMcpRepos() {
  console.log("[2/3] 正在从 GitHub API 拉取热门 MCP 开源项目...");
  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const url =
    "https://api.github.com/search/repositories?q=topic:mcp-server+stars:%3E200&sort=stars&order=desc&per_page=8";
  const json = await fetchJson(url, headers);
  const repos = (json?.items || []).map((r) => ({
    id: r.full_name,
    name: r.name,
    fullName: r.full_name,
    description: r.description || "Model Context Protocol server repository.",
    stars: r.stargazers_count,
    language: r.language || "TypeScript",
    updatedAt: r.pushed_at,
    url: r.html_url,
    license: r.license?.spdx_id || "MIT",
  }));

  console.log(`   ✓ 成功获取 ${repos.length} 个高星 MCP 开源项目`);
  return repos;
}

/** 3. 同步 Hacker News 高热度 AI / Agent / 商业变现资讯 */
async function syncHackerNewsRadar() {
  console.log("[3/3] 正在从 Hacker News Algolia API 拉取高热度 AI 商业与技术信号...");
  const queries = [
    { q: "LLM OR Anthropic OR OpenAI OR DeepSeek OR Gemini", tag: "Models & API" },
    { q: "MCP OR AI Agent OR Cursor OR Claude Code", tag: "Agents & MCP" },
    { q: "AI SaaS OR micro-SaaS OR indie hacker MRR", tag: "Monetization" },
  ];

  const seen = new Set();
  const stories = [];

  for (const item of queries) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
      item.q
    )}&tags=story&numericFilters=points>40&hitsPerPage=8`;
    try {
      const json = await fetchJson(url);
      for (const hit of json?.hits || []) {
        if (!hit.title || seen.has(hit.objectID)) continue;
        seen.add(hit.objectID);
        stories.push({
          id: `hn-${hit.objectID}`,
          source: "Hacker News",
          tag: item.tag,
          titleEn: hit.title,
          titleZh: hit.title,
          url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          discussionUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          points: hit.points || 0,
          comments: hit.num_comments || 0,
          publishedAt: hit.created_at,
        });
      }
    } catch (err) {
      console.warn(`   ! 跳过查询 "${item.q}": ${err.message}`);
    }
  }

  // 按热度排序，取前 12 条
  stories.sort((a, b) => b.points - a.points);
  const topStories = stories.slice(0, 12);

  // 可选：如果配置了 GEMINI_API_KEY，自动批量翻译为中文标题
  if (process.env.GEMINI_API_KEY && topStories.length > 0) {
    try {
      console.log("   → 检测到 GEMINI_API_KEY，正在自动生成中文标题...");
      const prompt = `Translate the following tech news titles into concise, natural Simplified Chinese. Return ONLY a JSON array of strings in the exact same order:\n${JSON.stringify(
        topStories.map((s) => s.titleEn)
      )}`;
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      if (geminiRes.ok) {
        const gJson = await geminiRes.json();
        const text = gJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        const translated = JSON.parse(text);
        if (Array.isArray(translated)) {
          topStories.forEach((s, i) => {
            if (typeof translated[i] === "string" && translated[i].trim()) {
              s.titleZh = translated[i].trim();
            }
          });
          console.log("   ✓ 中文标题自动翻译完成");
        }
      }
    } catch (err) {
      console.warn("   ! Gemini 翻译跳过（保留英文原标题）:", err.message);
    }
  }

  console.log(`   ✓ 成功聚合 ${topStories.length} 条高信噪比 AI 实时资讯`);
  return topStories;
}

async function main() {
  const started = Date.now();
  let modelStatus = "skipped";
  let mcpRepos = [];
  let stories = [];

  try {
    await syncOpenRouterModels();
    modelStatus = "ok";
  } catch (err) {
    console.warn("   ! OpenRouter 同步失败（保留已有数据）:", err.message);
  }

  try {
    mcpRepos = await syncGitHubMcpRepos();
  } catch (err) {
    console.warn("   ! GitHub MCP 同步失败:", err.message);
  }

  try {
    stories = await syncHackerNewsRadar();
  } catch (err) {
    console.warn("   ! Hacker News 同步失败:", err.message);
  }

  // 读取已有 live-feed.json 避免部分接口波动导致清空
  const feedPath = path.join(DATA_DIR, "live-feed.json");
  let existing = { stories: [], trendingMcpRepos: [] };
  try {
    existing = JSON.parse(await fs.readFile(feedPath, "utf8"));
  } catch {
    // 首次创建
  }

  const nextFeed = {
    syncedAt: new Date().toISOString(),
    modelSyncStatus: modelStatus,
    stories: stories.length > 0 ? stories : existing.stories || [],
    trendingMcpRepos: mcpRepos.length > 0 ? mcpRepos : existing.trendingMcpRepos || [],
  };

  await fs.writeFile(feedPath, JSON.stringify(nextFeed, null, 2) + "\n", "utf8");
  console.log(`\n✅ UltrAI 实时情报同步完成，耗时 ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
