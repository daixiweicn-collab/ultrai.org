"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Flame,
  Gift,
  Globe2,
  MessageSquare,
  Radio,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import {
  AI_DEALS,
  DealCategory,
  LiveDealSignal,
  LiveFreeModel,
} from "@/data/deals";
import type { LiveDealsPayload } from "@/lib/live-deals";
import { copyToClipboard } from "@/lib/clipboard";
import { NewsletterBanner } from "@/components/NewsletterBanner";

function formatUtcDateTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

export function FreeTokensClient({
  initialLive,
}: {
  initialLive: LiveDealsPayload;
}) {
  const { locale, t } = useApp();

  // 实时免费模型与优惠信号状态（支持点击“立即刷新”动态更新）
  const [liveModels, setLiveModels] = useState<LiveFreeModel[]>(
    initialLive.freeModels
  );
  const [dealSignals, setDealSignals] = useState<LiveDealSignal[]>(
    initialLive.dealSignals
  );
  const [syncedAt, setSyncedAt] = useState<string>(initialLive.syncedAt);
  const [dataSource, setDataSource] = useState<LiveDealsPayload["source"]>(
    initialLive.source
  );
  const [refreshing, setRefreshing] = useState(false);

  // 优惠渠道筛选状态
  const [dealQuery, setDealQuery] = useState("");
  const [category, setCategory] = useState<"all" | DealCategory>("all");
  const [noCardOnly, setNoCardOnly] = useState(false);

  // 实时 $0 模型池筛选状态
  const [modelQuery, setModelQuery] = useState("");
  const [showAllModels, setShowAllModels] = useState(false);

  // 复制状态
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const noCardCount = useMemo(
    () => AI_DEALS.filter((d) => d.noCreditCard).length,
    []
  );

  const categories: { key: "all" | DealCategory; label: string }[] = [
    { key: "all", label: t("All Channels", "全部渠道") },
    { key: "free-tier", label: t("Daily Free APIs", "每日免费 API") },
    { key: "cn-friendly", label: t("CN Direct Free", "国内直连免代理") },
    { key: "startup-credits", label: t("Startup Grants", "云厂商创业赠金") },
    { key: "promo-discount", label: t("Discounts & Cache", "错峰折扣与缓存") },
  ];

  const filteredDeals = useMemo(() => {
    return AI_DEALS.filter((deal) => {
      if (category !== "all" && deal.category !== category) return false;
      if (noCardOnly && !deal.noCreditCard) return false;
      if (dealQuery.trim()) {
        const q = dealQuery.trim().toLowerCase();
        return (
          deal.provider.toLowerCase().includes(q) ||
          deal.titleEn.toLowerCase().includes(q) ||
          deal.titleZh.toLowerCase().includes(q) ||
          deal.freeQuotaEn.toLowerCase().includes(q) ||
          deal.freeQuotaZh.toLowerCase().includes(q) ||
          deal.modelsCovered.some((m) => m.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [category, noCardOnly, dealQuery]);

  const filteredFreeModels = useMemo(() => {
    if (!modelQuery.trim()) return liveModels;
    const q = modelQuery.trim().toLowerCase();
    return liveModels.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q)
    );
  }, [liveModels, modelQuery]);

  const visibleFreeModels = showAllModels
    ? filteredFreeModels
    : filteredFreeModels.slice(0, 9);

  async function handleCopy(key: string, text: string) {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 1800);
    }
  }

  async function handleRefreshLivePool() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/live-deals");
      if (res.ok) {
        const data = (await res.json()) as LiveDealsPayload;
        if (Array.isArray(data.freeModels) && data.freeModels.length > 0) {
          setLiveModels(data.freeModels);
        }
        if (Array.isArray(data.dealSignals)) {
          setDealSignals(data.dealSignals);
        }
        if (data.syncedAt) setSyncedAt(data.syncedAt);
        if (data.source) setDataSource(data.source);
      }
    } catch {
      // 网络波动时保留现有数据
    } finally {
      setRefreshing(false);
    }
  }

  function buildCurlSnippet(modelId: string): string {
    return `curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${modelId}","messages":[{"role":"user","content":"Hello!"}]}'`;
  }

  function formatCategoryBadge(cat: DealCategory) {
    switch (cat) {
      case "free-tier":
        return {
          label: t("Free API Tier", "免费 API 层"),
          cls: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400",
        };
      case "cn-friendly":
        return {
          label: t("CN Direct", "国内直连"),
          cls: "border-sky-500/35 bg-sky-500/10 text-sky-400",
        };
      case "startup-credits":
        return {
          label: t("Startup Grant", "创业赠金"),
          cls: "border-indigo-500/35 bg-indigo-500/10 text-indigo-400",
        };
      case "promo-discount":
        return {
          label: t("Promo / Off-Peak", "折扣 / 错峰"),
          cls: "border-amber-500/35 bg-amber-500/10 text-amber-400",
        };
    }
  }

  const resetDealFilters = () => {
    setDealQuery("");
    setCategory("all");
    setNoCardOnly(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero 与顶部动态状态条 */}
      <section
        className="relative overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-12"
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "radial-gradient(circle at 15% 0%, rgba(52,211,153,0.16), transparent 45%), radial-gradient(circle at 85% 20%, rgba(56,189,248,0.14), transparent 42%), var(--bg-secondary)",
        }}
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-xs font-semibold text-emerald-400">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {t("LIVE FREE TOKEN & PROMO TRACKER", "全网免费 AI Token 与厂商优惠实时雷达")}
              <span className="opacity-70">•</span>
              <span>
                {t("Synced", "同步于")} {formatUtcDateTime(syncedAt)}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              {t("Free AI API Tokens, ", "全网免费 AI Token 渠道与")}
              <span className="text-gradient-brand">
                {t("Credits & Live Promos", "厂商优惠实时追踪")}
              </span>
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(
                "Stop overpaying while prototyping. Browse verified zero-card free API tiers, auto-synced $0/1M OpenRouter models, China-direct free quotas, and up to $350K in official cloud startup grants.",
                "拒绝为测试和原型开发白花冤枉钱。这里每日自动同步全网 $0 免费模型接口，并持续核验免绑卡免费 API 额度、国内直连免费渠道与最高 $350K 云厂商创业赠金。"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefreshLivePool}
              disabled={refreshing}
              className="intel-card inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:border-emerald-400/50 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing
                ? t("Refreshing...", "刷新实时池中...")
                : t("Refresh Live $0 Pool", "刷新实时免费模型池")}
            </button>
            <Link
              href="/submit?plan=free#sponsor"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:brightness-110"
            >
              <Gift className="h-3.5 w-3.5" />
              {t("Submit a Free Deal", "投稿新优惠 / 免费渠道")}
            </Link>
          </div>
        </div>

        {/* 4 项实时脉冲统计 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="intel-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-secondary)" }}>
                {t("Verified Channels", "已核验免费/优惠渠道")}
              </span>
              <Gift className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold">
              {AI_DEALS.length}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {t("Official APIs & Grants", "全部为官方直连渠道")}
            </div>
          </div>

          <div className="intel-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-secondary)" }}>
                {t("No Credit Card Needed", "免绑信用卡直领")}
              </span>
              <CreditCard className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-sky-400">
              {noCardCount}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {t("Instant API Key Access", "注册即用，零扣费风险")}
            </div>
          </div>

          <div className="intel-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-secondary)" }}>
                {t("Live $0/1M Models", "实时 $0 免费 API 模型")}
              </span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
              {liveModels.length}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {dataSource === "live-openrouter"
                ? t("Live from OpenRouter API", "刚从 OpenRouter 实时拉取")
                : t("Auto-synced via OpenRouter", "每日自动同步 OpenRouter")}
            </div>
          </div>

          <div className="intel-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-secondary)" }}>
                {t("Max Startup Credits", "最高创业扶持赠金")}
              </span>
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-indigo-400">
              $350K+
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {t("Azure / GCP / AWS Programs", "微软 / 谷歌 / AWS 官方计划")}
            </div>
          </div>
        </div>
      </section>

      {/* 模块一：实时自动更新的 OpenRouter $0 免费模型池 */}
      <section className="mt-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              {t("01 / AUTO-SYNCED ZERO-COST ENDPOINTS", "01 / 每日自动更新 $0 免费模型池")}
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("Live $0 / 1M Token Models (OpenRouter :free)", "实时可调用 $0 免费大模型列表")}
            </h2>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(
                "Automatically refreshed hourly & daily from OpenRouter's live catalog. Click Copy cURL to test any model in 10 seconds.",
                "每小时增量校验 + 每日定时同步 OpenRouter 免费模型池，支持一键复制模型 ID 或完整 cURL 测试命令。"
              )}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              placeholder={t("Filter free models (e.g. DeepSeek)...", "筛选免费模型（如 DeepSeek、Qwen）...")}
              className="w-full rounded-xl border py-2 pr-4 pl-10 text-xs outline-none focus:border-emerald-400"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-secondary)",
              }}
            />
          </div>
        </div>

        {filteredFreeModels.length === 0 ? (
          <div className="intel-card mt-5 rounded-2xl px-6 py-10 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(
                `No live free models matched "${modelQuery.trim()}".`,
                `未找到与 “${modelQuery.trim()}” 匹配的免费模型。`
              )}
            </p>
            <button
              type="button"
              onClick={() => setModelQuery("")}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("Clear Search", "清空搜索")}
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleFreeModels.map((m) => (
                <div
                  key={m.id}
                  className="intel-card flex min-w-0 flex-col justify-between rounded-2xl p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-[11px] text-sky-400">
                          {m.provider}
                        </span>
                        <h3 className="mt-0.5 text-sm font-bold leading-snug break-words">
                          {m.name}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-md border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400">
                        $0 / 1M
                      </span>
                    </div>

                    <div className="mt-2.5 flex min-w-0 items-center justify-between gap-2 rounded-lg bg-[#0a0e17] px-2.5 py-1.5 font-mono text-[11px] text-slate-300">
                      <code className="min-w-0 flex-1 truncate">{m.id}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(`id-${m.id}`, m.id)}
                        className="shrink-0 cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                        title={t("Copy model ID", "复制模型 ID")}
                        aria-label={t("Copy model ID", "复制模型 ID")}
                      >
                        {copiedId === `id-${m.id}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    className="mt-3 flex items-center justify-between border-t pt-2.5 font-mono text-[11px]"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>
                      {t("Context", "上下文")}:{" "}
                      {m.contextK >= 1000
                        ? `${(m.contextK / 1000).toFixed(1)}M`
                        : `${m.contextK}K`}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(`curl-${m.id}`, buildCurlSnippet(m.id))
                        }
                        className="inline-flex cursor-pointer items-center gap-1 font-semibold text-emerald-400 hover:underline"
                      >
                        <Terminal className="h-3 w-3" />
                        {copiedId === `curl-${m.id}`
                          ? t("Copied!", "已复制")
                          : t("Copy cURL", "复制 cURL")}
                      </button>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                      >
                        {t("Open", "查看")} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFreeModels.length > 9 && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllModels(!showAllModels)}
                  className="intel-card inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-sky-400 hover:border-sky-400/50"
                >
                  {showAllModels
                    ? t("Collapse Model List", "收起部分免费模型")
                    : t(
                        `Show All ${filteredFreeModels.length} Live Free Models`,
                        `展开全部 ${filteredFreeModels.length} 款实时免费模型`
                      )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 模块二：全网 AI 厂商免费额度、国内直连、创业扶持与折扣矩阵 */}
      <section className="mt-16">
        <div>
          <div className="font-mono text-xs font-semibold tracking-wider text-sky-400 uppercase">
            {t("02 / VERIFIED PROVIDER PATHS & CREDITS", "02 / 各大 AI 厂商免费额度与优惠渠道全汇总")}
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {t("Free Tiers, CN Direct Quotas, Startup Grants & Discounts", "免费 API 层、国内直连额度、创业赠金与官方折扣")}
          </h2>
        </div>

        {/* 筛选工具栏 */}
        <div className="mt-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dealQuery}
                onChange={(e) => setDealQuery(e.target.value)}
                placeholder={t(
                  "Search provider, model, or perk (e.g. Gemini, Groq, Azure)...",
                  "搜索厂商、模型或关键词（如 Gemini、硅基流动、Azure）..."
                )}
                className="w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none focus:border-sky-400"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setNoCardOnly(!noCardOnly)}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition ${
                noCardOnly
                  ? "border-emerald-400 bg-emerald-500/15 text-emerald-400"
                  : "hover:border-emerald-400/50"
              }`}
              style={
                noCardOnly
                  ? undefined
                  : {
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              <CreditCard className="h-3.5 w-3.5" />
              {t("No Credit Card Only", "仅看免绑卡")}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                type="button"
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  category === c.key
                    ? "border-sky-400 bg-sky-500/15 text-sky-400"
                    : "hover:border-sky-400/40"
                }`}
                style={
                  category === c.key
                    ? undefined
                    : {
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 优惠渠道卡片列表 */}
        {filteredDeals.length === 0 ? (
          <div className="intel-card mt-6 rounded-2xl px-6 py-14 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(
                "No free token channels matched your current filters.",
                "当前筛选条件下未找到匹配的免费 Token 或优惠渠道。"
              )}
            </p>
            <button
              type="button"
              onClick={resetDealFilters}
              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("Reset Filters", "重置筛选条件")}
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {filteredDeals.map((deal) => {
              const badge = formatCategoryBadge(deal.category);
              return (
                <div
                  key={deal.id}
                  className="intel-card flex min-w-0 flex-col justify-between rounded-2xl p-6"
                >
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-sky-400">
                            {deal.provider}
                          </span>
                          {deal.noCreditCard && (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                              {t("No Card", "免绑卡")}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1.5 text-lg font-bold leading-snug break-words">
                          {locale === "en" ? deal.titleEn : deal.titleZh}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* 免费额度高亮条 */}
                    <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3.5 py-2.5 text-xs font-semibold text-emerald-400">
                      <span className="mr-1.5">🎁</span>
                      {locale === "en" ? deal.freeQuotaEn : deal.freeQuotaZh}
                    </div>

                    {/* 支持模型标签 */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {deal.modelsCovered.map((model) => (
                        <span
                          key={model}
                          className="rounded-md bg-slate-500/12 px-2 py-0.5 font-mono text-[11px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {model}
                        </span>
                      ))}
                    </div>

                    {/* 领取路径与注意事项 */}
                    <div
                      className="mt-3.5 space-y-1.5 text-xs leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <p>
                        <strong style={{ color: "var(--text-primary)" }}>
                          {t("How to claim:", "领取方式：")}
                        </strong>{" "}
                        {locale === "en" ? deal.howToClaimEn : deal.howToClaimZh}
                      </p>
                      <p style={{ color: "var(--text-muted)" }}>
                        <strong>{t("Note:", "注意：")}</strong>{" "}
                        {locale === "en" ? deal.caveatEn : deal.caveatZh}
                      </p>
                    </div>

                    {/* 可选 OpenAI 兼容 Endpoint 一键复制 */}
                    {deal.quickCmd && (
                      <div className="mt-3.5 flex min-w-0 items-center justify-between gap-2 rounded-xl bg-[#0a0e17] px-3 py-2 text-[11px] text-slate-300">
                        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                          <Terminal className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                          <code className="min-w-0 flex-1 truncate font-mono">
                            {deal.quickCmd}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(`ep-${deal.id}`, deal.quickCmd!)}
                          className="shrink-0 cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                          title={t("Copy Base URL", "复制接口 Base URL")}
                          aria-label={t("Copy Base URL", "复制接口 Base URL")}
                        >
                          {copiedId === `ep-${deal.id}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="mt-5 flex items-center justify-between gap-2 border-t pt-3.5 text-xs"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Globe2 className="h-3.5 w-3.5" />
                      {locale === "en" ? deal.regionEn : deal.regionZh}
                    </span>
                    <a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-sky-500/12 px-3 py-1.5 font-semibold text-sky-400 transition hover:bg-sky-500 hover:text-white"
                    >
                      {t("Claim / Open Portal", "前往官方领取")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 模块三：社区最新免费额度与 API 降价雷达（由每日自动同步填充） */}
      {dealSignals.length > 0 && (
        <section className="mt-16">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-amber-400 uppercase">
              <Flame className="h-3.5 w-3.5" />
              {t("03 / COMMUNITY DEAL & PRICE-DROP RADAR", "03 / 社区最新免费额度与降价情报雷达")}
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("Fresh API Price Cuts & Free-Tier Discussions", "全网最新大模型降价与免费额度讨论")}
            </h2>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {dealSignals.map((sig) => (
              <div
                key={sig.id}
                className="intel-card flex min-w-0 flex-col justify-between rounded-2xl p-4"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="rounded bg-amber-500/12 px-2 py-0.5 font-semibold text-amber-400">
                      {t("Deal / Price Signal", "优惠与降价信号")}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {sig.source} • {sig.publishedAt.slice(0, 10)}
                    </span>
                  </div>
                  <a
                    href={sig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 block text-sm font-semibold leading-snug transition hover:text-sky-400"
                  >
                    {locale === "en" ? sig.titleEn : sig.titleZh}
                  </a>
                </div>

                <div
                  className="mt-3 flex items-center justify-between border-t pt-2.5 font-mono text-xs"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400">▲ {sig.points}</span>
                    {sig.discussionUrl && sig.comments > 0 && (
                      <a
                        href={sig.discussionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-sky-400"
                      >
                        <MessageSquare className="h-3 w-3" /> {sig.comments}
                      </a>
                    )}
                  </div>
                  <a
                    href={sig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                  >
                    {t("Source", "查看原文")} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 底部 UGC 提示与 Newsletter 订阅转化 */}
      <section
        className="intel-card mt-16 flex flex-col justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center"
      >
        <div>
          <h3 className="text-base font-bold">
            {t(
              "Spotted a new AI promo, free API tier, or expired credit?",
              "发现了新的 AI 厂商限时优惠、免费额度，或某条渠道已过期？"
            )}
          </h3>
          <p
            className="mt-1 text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "Share it with the community and we'll verify & list it within 24 hours—or subscribe below for weekly price-drop alerts.",
              "欢迎提交给我们，核验后 24 小时内上线更新；也可以订阅下方周报，第一时间收到各家大模型降价与免费额度通知。"
            )}
          </p>
        </div>
        <Link
          href="/submit?plan=free#sponsor"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
        >
          <Gift className="h-4 w-4" />
          {t("Submit Deal / Report Update", "投稿新渠道 / 反馈变动")}
        </Link>
      </section>

      <div className="mt-10">
        <NewsletterBanner />
      </div>
    </div>
  );
}
