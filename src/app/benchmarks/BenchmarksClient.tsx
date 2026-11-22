"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  RotateCcw,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import {
  MODEL_BENCHMARKS,
  LIVE_MODELS_META,
  getBlendedPrice,
} from "@/data/models";

type SortKey =
  | "valueScore"
  | "qualityIndex"
  | "codingScore"
  | "tokensPerSec"
  | "blendedPrice";

export function BenchmarksClient() {
  const { locale, t } = useApp();
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "open" | "closed">("all");
  const [sortBy, setSortBy] = useState<SortKey>("valueScore");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(key === "blendedPrice");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setFilterMode("all");
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    return sortAsc ? (
      <ArrowUp className="h-3 w-3 text-sky-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-sky-400" />
    );
  };

  const getAriaSort = (
    key: SortKey
  ): "ascending" | "descending" | "none" => {
    if (sortBy !== key) return "none";
    return sortAsc ? "ascending" : "descending";
  };

  const filteredModels = useMemo(() => {
    return MODEL_BENCHMARKS.filter((m) => {
      if (filterMode === "open" && !m.openWeights) return false;
      if (filterMode === "closed" && m.openWeights) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.bestForEn.toLowerCase().includes(q) ||
          m.bestForZh.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      const valA = sortBy === "blendedPrice" ? getBlendedPrice(a) : a[sortBy];
      const valB = sortBy === "blendedPrice" ? getBlendedPrice(b) : b[sortBy];
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [query, filterMode, sortBy, sortAsc]);

  const maxSpeed = Math.max(...MODEL_BENCHMARKS.map((m) => m.tokensPerSec));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* 页头 */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            {LIVE_MODELS_META.totalTrackedOnOpenRouter > 0
              ? t(
                  `LIVE SYNCED • ${LIVE_MODELS_META.totalTrackedOnOpenRouter} MODELS INDEXED VIA OPENROUTER`,
                  `实时同步 • 已接入 OpenRouter ${LIVE_MODELS_META.totalTrackedOnOpenRouter} 款模型定价`
                )
              : t("INDEPENDENT TELEMETRY • Q4 2026", "独立第三方评测基准 • 2026 Q4")}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("LLM Performance, Speed & Pricing Index", "全球大模型性能、吞吐与成本评测榜")}
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "Objective side-by-side comparison across intelligence quality, coding reliability, token throughput (t/s), and blended API cost (3:1 input/output ratio).",
              "客观对比主流闭源与开源权重模型的综合智能指数、编程执行分、真实吞吐速度（Tokens/s）及 3:1 加权 API 综合成本。"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-400">
          <Zap className="h-4 w-4 shrink-0" />
          <span>
            {t(
              "Tip: Click any column header to sort by price, speed, or ROI.",
              "提示：点击下方任意表头即可按价格、速度或性价比实时排序。"
            )}
          </span>
        </div>
      </div>

      {/* 视觉化吞吐与质量对比条形图 */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="intel-card rounded-2xl p-5">
          <h2 className="text-sm font-bold">
            {t("Top 5 by Output Speed (tokens / sec)", "输出吞吐速度 Top 5（tokens / 秒）")}
          </h2>
          <div className="mt-4 space-y-3">
            {[...MODEL_BENCHMARKS]
              .sort((a, b) => b.tokensPerSec - a.tokensPerSec)
              .slice(0, 5)
              .map((m) => (
                <div key={m.id}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">
                      {m.name}{" "}
                      <span style={{ color: "var(--text-muted)" }}>({m.provider})</span>
                    </span>
                    <span className="font-mono font-semibold text-sky-400">
                      {m.tokensPerSec} t/s
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
                      style={{ width: `${(m.tokensPerSec / maxSpeed) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="intel-card rounded-2xl p-5">
          <h2 className="text-sm font-bold">
            {t("Top 5 by ROI Value Score (Quality / Cost)", "综合性价比得分 Top 5（智能 / 成本比）")}
          </h2>
          <div className="mt-4 space-y-3">
            {[...MODEL_BENCHMARKS]
              .sort((a, b) => b.valueScore - a.valueScore)
              .slice(0, 5)
              .map((m) => (
                <div key={m.id}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">
                      {m.name}{" "}
                      <span style={{ color: "var(--text-muted)" }}>
                        (${getBlendedPrice(m).toFixed(2)}/1M)
                      </span>
                    </span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {m.valueScore} / 100
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
                      style={{ width: `${m.valueScore}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 搜索与筛选工具栏 */}
      <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Search model, provider, or use case...",
              "搜索模型名称、厂商或应用场景..."
            )}
            className="w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none focus:border-sky-400"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-secondary)",
            }}
          />
        </div>

        <div
          className="flex items-center gap-1.5 rounded-xl border p-1"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {(
            [
              ["all", t("All Models", "全部模型")],
              ["open", t("Open Weights", "开源权重")],
              ["closed", t("Proprietary", "闭源 API")],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterMode(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterMode === key
                  ? "bg-sky-500 text-white"
                  : "hover:bg-slate-500/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 完整交互数据表 */}
      <div className="intel-card mt-4 overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr
                className="border-b font-mono text-xs uppercase"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                <th className="px-5 py-3.5">{t("Model & Best Use", "模型与最佳场景")}</th>
                <th className="px-3 py-3.5" aria-sort={getAriaSort("qualityIndex")}>
                  <button
                    onClick={() => handleSort("qualityIndex")}
                    className={`inline-flex items-center gap-1 transition hover:text-sky-400 ${
                      sortBy === "qualityIndex" ? "text-sky-400" : ""
                    }`}
                  >
                    {t("Quality", "智能")} {renderSortIcon("qualityIndex")}
                  </button>
                </th>
                <th className="px-3 py-3.5" aria-sort={getAriaSort("codingScore")}>
                  <button
                    onClick={() => handleSort("codingScore")}
                    className={`inline-flex items-center gap-1 transition hover:text-sky-400 ${
                      sortBy === "codingScore" ? "text-sky-400" : ""
                    }`}
                  >
                    {t("Coding", "编程")} {renderSortIcon("codingScore")}
                  </button>
                </th>
                <th className="px-3 py-3.5" aria-sort={getAriaSort("tokensPerSec")}>
                  <button
                    onClick={() => handleSort("tokensPerSec")}
                    className={`inline-flex items-center gap-1 transition hover:text-sky-400 ${
                      sortBy === "tokensPerSec" ? "text-sky-400" : ""
                    }`}
                  >
                    {t("Speed", "速度")} {renderSortIcon("tokensPerSec")}
                  </button>
                </th>
                <th className="px-3 py-3.5" aria-sort={getAriaSort("blendedPrice")}>
                  <button
                    onClick={() => handleSort("blendedPrice")}
                    className={`inline-flex items-center gap-1 transition hover:text-sky-400 ${
                      sortBy === "blendedPrice" ? "text-sky-400" : ""
                    }`}
                  >
                    {t("Blended $/1M", "综合价")} {renderSortIcon("blendedPrice")}
                  </button>
                </th>
                <th className="px-3 py-3.5">{t("Context", "上下文")}</th>
                <th className="px-3 py-3.5" aria-sort={getAriaSort("valueScore")}>
                  <button
                    onClick={() => handleSort("valueScore")}
                    className={`inline-flex items-center gap-1 transition hover:text-sky-400 ${
                      sortBy === "valueScore" ? "text-sky-400" : ""
                    }`}
                  >
                    {t("Value", "性价比")} {renderSortIcon("valueScore")}
                  </button>
                </th>
                <th className="px-5 py-3.5 text-right">{t("Deploy", "接入")}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {filteredModels.map((m, idx) => (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-sky-500/5"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold">{m.name}</span>
                        {m.openWeights && (
                          <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
                            {t("OPEN", "开源")}
                          </span>
                        )}
                      </div>
                      <div
                        className="mt-0.5 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {m.provider} • {locale === "en" ? m.bestForEn : m.bestForZh}
                      </div>
                    </td>
                    <td className="px-3 py-4 font-mono font-semibold text-sky-400">
                      {m.qualityIndex.toFixed(1)}
                    </td>
                    <td className="px-3 py-4 font-mono">{m.codingScore.toFixed(1)}</td>
                    <td className="px-3 py-4 font-mono">
                      {m.tokensPerSec} <span className="text-xs text-slate-500">t/s</span>
                      <div className="text-[10px] text-slate-500">TTFT {m.ttftSec}s</div>
                    </td>
                    <td className="px-3 py-4 font-mono">
                      <div className="font-semibold">
                        ${getBlendedPrice(m).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ${m.inputPrice} / ${m.outputPrice}
                      </div>
                    </td>
                    <td className="px-3 py-4 font-mono text-xs">
                      {m.contextK >= 1000 ? `${m.contextK / 1000}M` : `${m.contextK}K`}
                    </td>
                    <td className="px-3 py-4 font-mono font-bold text-emerald-400">
                      {m.valueScore}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={m.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-sky-400 transition hover:border-sky-400 hover:bg-sky-500/10"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        {t("Use API", "获取 API")} <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {filteredModels.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(
                `No models matched "${query.trim() || filterMode}".`,
                `未找到与 “${query.trim() || filterMode}” 匹配的模型。`
              )}
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("Reset Filters", "重置筛选条件")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
