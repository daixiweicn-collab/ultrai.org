"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Compass,
  Copy,
  ExternalLink,
  RotateCcw,
  Search,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import { REGISTRY_ITEMS, RegistryCategory, RegistryItem } from "@/data/registry";
import { copyToClipboard } from "@/lib/clipboard";

export function RegistryClient() {
  const { locale, t } = useApp();
  const searchParams = useSearchParams();
  const targetItemParam = searchParams?.get("item") ?? null;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | RegistryCategory>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(targetItemParam);

  useEffect(() => {
    if (targetItemParam && REGISTRY_ITEMS.some((i) => i.id === targetItemParam)) {
      setExpandedId(targetItemParam);
      const el = document.getElementById(targetItemParam);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [targetItemParam]);

  const categories: { key: "all" | RegistryCategory; label: string }[] = [
    { key: "all", label: t("All", "全部") },
    { key: "dev", label: t("Dev & Cloud", "研发运维") },
    { key: "data", label: t("Data & Finance", "数据与金融") },
    { key: "browser", label: t("Browser Ops", "浏览器自动化") },
    { key: "growth", label: t("Growth & Billing", "增长与收款") },
    { key: "knowledge", label: t("Search & RAG", "搜索与知识") },
  ];

  function formatType(type: RegistryItem["type"]) {
    if (locale === "en") return type;
    if (type === "MCP Server") return "MCP 服务";
    if (type === "Agent Skill") return "Agent 技能";
    return "工作流";
  }

  function formatPricing(pricing: RegistryItem["pricing"]) {
    if (locale === "en") return pricing;
    if (pricing === "Open Source") return "开源免费";
    if (pricing === "Freemium") return "免费增值";
    return "付费";
  }

  const items = useMemo(() => {
    return REGISTRY_ITEMS.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.summaryEn.toLowerCase().includes(q) ||
          item.summaryZh.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, category]);

  async function handleCopy(id: string, text: string) {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  }

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
            <Compass className="h-3.5 w-3.5" />
            {t("OPEN AGENT ECOSYSTEM REGISTRY", "开放 Agent / MCP 安全索引库")}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("Security-Graded MCP Servers & Agent Skills", "安全评级版 MCP 服务器与 Agent 技能库")}
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "Every listing is audited for permission scope, read-only safety, and real production ROI—with one-click config snippets.",
              "每一项收录均经过权限最小化检查与生产环境 ROI 实测，支持一键复制 MCP 配置或安装命令。"
            )}
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:brightness-110"
        >
          <ShieldCheck className="h-4 w-4" />
          {t("Submit Your MCP / Get Audited", "提交你的 MCP / 申请认证徽章")}
        </Link>
      </div>

      {/* 筛选条 */}
      <div className="mt-8 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Search MCP servers, skills, workflows...",
              "搜索 MCP、技能包或业务场景..."
            )}
            className="w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none focus:border-sky-400"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-secondary)",
            }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
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

      {/* 索引卡片列表 */}
      {items.length === 0 ? (
        <div className="intel-card mt-6 rounded-2xl px-6 py-14 text-center">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              `No MCP servers or skills matched "${query.trim() || category}".`,
              `未找到与 “${query.trim() || category}” 匹配的 MCP 服务或技能。`
            )}
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("Reset Filters", "重置筛选条件")}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const configFileName = item.configFileName || "mcp_config.json";
            const isJsonConfig = configFileName.endsWith(".json");
            const isInternalUrl = item.url.startsWith("/");
            const isHighlighted = targetItemParam === item.id;

            return (
              <div
                id={item.id}
                key={item.id}
                className={`intel-card flex scroll-mt-24 flex-col justify-between rounded-2xl p-6 ${
                  isHighlighted ? "ring-2 ring-sky-400/70" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold">{item.name}</h2>
                        {item.verified && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                      <div
                        className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span className="rounded bg-slate-500/15 px-1.5 py-0.5">
                          {formatType(item.type)}
                        </span>
                        <span>★ {item.stars}</span>
                        <span>
                          • {item.weeklyInstalls}/{t("wk", "周")}
                        </span>
                        <span>• {formatPricing(item.pricing)}</span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
                        item.grade === "A+"
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-400"
                          : item.grade === "A"
                          ? "border-sky-500/35 bg-sky-500/10 text-sky-400"
                          : "border-amber-500/35 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {t("Grade", "安全")} {item.grade}
                    </span>
                  </div>

                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {locale === "en" ? item.summaryEn : item.summaryZh}
                  </p>

                  <div className="mt-3 rounded-xl border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-xs text-sky-400">
                    <strong>{t("Verified ROI:", "实测价值：")}</strong>{" "}
                    {locale === "en" ? item.roiNoteEn : item.roiNoteZh}
                  </div>

                  {/* 一键复制命令行 */}
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-[#0a0e17] px-3.5 py-2.5 text-xs text-slate-200">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Terminal className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <code className="truncate font-mono">{item.installCmd}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(item.id + "-cmd", item.installCmd)}
                      className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title={t("Copy command", "复制命令")}
                      aria-label={t("Copy command", "复制命令")}
                    >
                      {copiedId === item.id + "-cmd" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 rounded-xl border border-slate-700/60 bg-[#0a0e17] p-3.5">
                      <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
                        <span>{configFileName}</span>
                        <button
                          onClick={() =>
                            handleCopy(item.id + "-cfg", item.mcpConfigSnippet)
                          }
                          className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                        >
                          {copiedId === item.id + "-cfg"
                            ? t("Copied!", "已复制")
                            : isJsonConfig
                            ? t("Copy JSON", "复制 JSON")
                            : t("Copy Manifest", "复制清单")}
                        </button>
                      </div>
                      <pre className="overflow-x-auto font-mono text-xs text-emerald-300">
                        {item.mcpConfigSnippet}
                      </pre>
                    </div>
                  )}
                </div>

                <div
                  className="mt-5 flex items-center justify-between border-t pt-3.5 text-xs"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="font-semibold text-sky-400 hover:underline"
                  >
                    {isExpanded
                      ? isJsonConfig
                        ? t("Hide JSON Config", "收起 JSON 配置")
                        : t("Hide Skill Manifest", "收起技能清单")
                      : isJsonConfig
                      ? t("View MCP JSON Config", "展开 MCP JSON 配置")
                      : t("View Skill Manifest", "展开技能清单")}
                  </button>
                  {isInternalUrl ? (
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1 font-medium hover:text-sky-400"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t("Read Playbook", "查看实战指南")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium hover:text-sky-400"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t("Docs / Website", "官方文档")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
