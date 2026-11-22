"use client";

import React, { useMemo, useState } from "react";
import { Calculator, Copy, Check, ExternalLink, TrendingDown } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { MODEL_BENCHMARKS } from "@/data/models";
import { copyToClipboard } from "@/lib/clipboard";
import { SITE_URL } from "@/lib/site";

interface Preset {
  id: string;
  labelEn: string;
  labelZh: string;
  dailyRequests: number;
  avgInputTokens: number;
  avgOutputTokens: number;
}

const PRESETS: Preset[] = [
  {
    id: "saas-support",
    labelEn: "SaaS Support Agent",
    labelZh: "SaaS 智能客服",
    dailyRequests: 2500,
    avgInputTokens: 1800,
    avgOutputTokens: 450,
  },
  {
    id: "coding-assistant",
    labelEn: "AI Coding Workflow",
    labelZh: "研发编程助手",
    dailyRequests: 800,
    avgInputTokens: 12000,
    avgOutputTokens: 1800,
  },
  {
    id: "research-rag",
    labelEn: "Financial / PDF RAG",
    labelZh: "研报/财报长文分析",
    dailyRequests: 400,
    avgInputTokens: 35000,
    avgOutputTokens: 2500,
  },
  {
    id: "bulk-seo",
    labelEn: "Bulk Content & GEO",
    labelZh: "批量内容与多语言处理",
    dailyRequests: 5000,
    avgInputTokens: 1200,
    avgOutputTokens: 1500,
  },
];

export function CalculatorClient() {
  const { locale, t } = useApp();
  const [dailyRequests, setDailyRequests] = useState(2500);
  const [avgInputTokens, setAvgInputTokens] = useState(2000);
  const [avgOutputTokens, setAvgOutputTokens] = useState(600);
  const [copied, setCopied] = useState(false);

  const monthlyInputM = (dailyRequests * 30 * avgInputTokens) / 1_000_000;
  const monthlyOutputM = (dailyRequests * 30 * avgOutputTokens) / 1_000_000;

  const estimates = useMemo(() => {
    const raw = MODEL_BENCHMARKS.map((m) => {
      const monthlyCost =
        monthlyInputM * m.inputPrice + monthlyOutputM * m.outputPrice;
      return {
        ...m,
        monthlyCost,
        annualCost: monthlyCost * 12,
      };
    }).sort((a, b) => a.monthlyCost - b.monthlyCost);

    const maxCost = raw[raw.length - 1]?.monthlyCost || 1;
    return raw.map((item) => ({
      ...item,
      savingsPct: Math.max(0, Math.round((1 - item.monthlyCost / maxCost) * 100)),
    }));
  }, [monthlyInputM, monthlyOutputM]);

  const cheapest = estimates[0];
  const mostExpensive = estimates[estimates.length - 1];
  const maxAnnualSavings = Math.max(
    0,
    (mostExpensive?.annualCost || 0) - (cheapest?.annualCost || 0)
  );

  async function copySummary() {
    const text =
      locale === "en"
        ? `UltrAI.org Token ROI Estimate (${dailyRequests}/day, ${avgInputTokens} in / ${avgOutputTokens} out):\n- Lowest Cost: ${cheapest.name} @ $${cheapest.monthlyCost.toFixed(2)}/mo ($${cheapest.annualCost.toFixed(0)}/yr)\n- Frontier Max: ${mostExpensive.name} @ $${mostExpensive.monthlyCost.toFixed(2)}/mo ($${mostExpensive.annualCost.toFixed(0)}/yr)\n- Potential Annual Savings: $${maxAnnualSavings.toFixed(0)}/yr\nRun yours at ${SITE_URL}/calculator`
        : `UltrAI.org 大模型 Token 成本测算（每日 ${dailyRequests} 次请求，单次输入 ${avgInputTokens} / 输出 ${avgOutputTokens} Tokens）：\n- 最低成本：${cheapest.name} 约 $${cheapest.monthlyCost.toFixed(2)}/月（$${cheapest.annualCost.toFixed(0)}/年）\n- 最高基准：${mostExpensive.name} 约 $${mostExpensive.monthlyCost.toFixed(2)}/月（$${mostExpensive.annualCost.toFixed(0)}/年）\n- 最大年度省钱空间：$${maxAnnualSavings.toFixed(0)}/年\n在线测算：${SITE_URL}/calculator`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
            <Calculator className="h-3.5 w-3.5" />
            {t("INTERACTIVE UNIT ECONOMICS TOOL", "交互式 AI 算力账单测算器")}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("LLM Token Cost & ROI Calculator", "大模型 Token 成本与省钱对比计算器")}
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "Model your exact monthly & annual API spend before launching your AI SaaS or enterprise agent workflow.",
              "在上线 AI 产品或企业 Agent 工作流之前，精准测算不同大模型 API 的月度与年度账单，避免毛利倒挂。"
            )}
          </p>
        </div>

        <button
          onClick={copySummary}
          className="intel-card inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-xs font-semibold text-sky-400"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied
            ? t("Copied Estimate!", "已复制测算报告")
            : t("Copy Shareable Summary", "一键复制对比摘要")}
        </button>
      </div>

      {/* 场景预设按钮 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const isSelected =
            dailyRequests === p.dailyRequests &&
            avgInputTokens === p.avgInputTokens &&
            avgOutputTokens === p.avgOutputTokens;
          return (
            <button
              key={p.id}
              onClick={() => {
                setDailyRequests(p.dailyRequests);
                setAvgInputTokens(p.avgInputTokens);
                setAvgOutputTokens(p.avgOutputTokens);
              }}
              className={`intel-card rounded-xl px-3.5 py-2 text-xs font-medium transition hover:text-sky-400 ${
                isSelected ? "ring-1 ring-sky-400 text-sky-400" : ""
              }`}
            >
              {t(p.labelEn, p.labelZh)}
            </button>
          );
        })}
      </div>

      {/* 控制面板 + 核心汇总卡片 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="intel-card space-y-6 rounded-2xl p-6 lg:col-span-5">
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>{t("Daily Requests", "每日 API 调用次数")}</span>
              <span className="font-mono font-bold text-sky-400">
                {dailyRequests.toLocaleString("en-US")} / {t("day", "天")}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={20000}
              step={100}
              value={dailyRequests}
              onChange={(e) => setDailyRequests(Number(e.target.value))}
              className="mt-2 w-full accent-sky-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>{t("Avg Input Tokens / Req", "单次平均输入 Tokens")}</span>
              <span className="font-mono font-bold text-sky-400">
                {avgInputTokens.toLocaleString("en-US")}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={50000}
              step={200}
              value={avgInputTokens}
              onChange={(e) => setAvgInputTokens(Number(e.target.value))}
              className="mt-2 w-full accent-sky-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>{t("Avg Output Tokens / Req", "单次平均输出 Tokens")}</span>
              <span className="font-mono font-bold text-sky-400">
                {avgOutputTokens.toLocaleString("en-US")}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={8000}
              step={50}
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
              className="mt-2 w-full accent-sky-400"
            />
          </div>

          <div
            className="rounded-xl border p-4 font-mono text-xs"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>
                {t("Monthly Input Volume", "月度总输入量")}
              </span>
              <span>{monthlyInputM.toFixed(1)}M tokens</span>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>
                {t("Monthly Output Volume", "月度总输出量")}
              </span>
              <span>{monthlyOutputM.toFixed(1)}M tokens</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <TrendingDown className="h-4 w-4" />
              {t("Max Annual Routing Opportunity", "模型路由最大年度省钱空间")}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-extrabold text-emerald-400">
              ${maxAnnualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })} /{" "}
              {t("yr", "年")}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {t(
                `Comparing ${cheapest.name} vs ${mostExpensive.name} at your workload.`,
                `当前业务量下，对比 ${cheapest.name} 与 ${mostExpensive.name} 的年度账单差额。`
              )}
            </p>
          </div>
        </div>

        {/* 实时账单对比结果表 */}
        <div className="intel-card overflow-hidden rounded-2xl lg:col-span-7">
          <div
            className="border-b px-5 py-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <h2 className="text-sm font-bold">
              {t(
                "Estimated Monthly & Annual Spend by Model",
                "各主流模型实时月度 / 年度预估账单（从低到高）"
              )}
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {estimates.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 px-5 py-3.5 transition hover:bg-sky-500/5 sm:flex-row sm:items-center"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold">{item.name}</span>
                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 font-mono text-[10px] text-sky-400">
                      {t(`Q:${item.qualityIndex}`, `智能:${item.qualityIndex}`)}
                    </span>
                    {idx === 0 && (
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                        {t("LOWEST", "最低成本")}
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.provider} • {item.tokensPerSec} t/s
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right font-mono">
                    <div className="text-base font-bold">
                      $
                      {item.monthlyCost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-xs font-normal text-slate-500">
                        /{t("mo", "月")}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[11px]">
                      <span style={{ color: "var(--text-muted)" }}>
                        $
                        {item.annualCost.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        /{t("yr", "年")}
                      </span>
                      <span className="text-emerald-400">
                        {item.savingsPct > 0
                          ? t(`Save ${item.savingsPct}%`, `省 ${item.savingsPct}%`)
                          : t("Baseline max", "最高基准")}
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-sky-400 hover:border-sky-400"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    API <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
