"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileBarChart2,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import { MODEL_BENCHMARKS, getBlendedPrice } from "@/data/models";
import { REGISTRY_ITEMS } from "@/data/registry";
import { INTELLIGENCE_REPORTS } from "@/data/intelligence";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { LiveRadarSection } from "@/components/LiveRadarSection";

export default function HomePage() {
  const { locale, t } = useApp();
  const topModels = MODEL_BENCHMARKS.filter((m) => m.featured).slice(0, 5);
  const topRegistry = REGISTRY_ITEMS.filter((r) => r.featured).slice(0, 4);
  const latestReports = INTELLIGENCE_REPORTS.slice(0, 3);

  const pulseMetrics = [
    {
      label: t("Models Tracked", "追踪主流模型"),
      value: "48+",
      delta: t("Updated Daily", "每日自动同步"),
      icon: Activity,
      color: "text-sky-400",
    },
    {
      label: t("Audited MCP & Skills", "安全审计 MCP/技能"),
      value: "120+",
      delta: t("Permission Graded", "权限分级评估"),
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      label: t("Best Value Inference", "当前性价比之王"),
      value: "$0.26 / 1M",
      delta: "Gemini 2.5 Flash",
      icon: Zap,
      color: "text-amber-400",
    },
    {
      label: t("Avg Routing Savings", "智能路由实测省钱"),
      value: "-68.2%",
      delta: t("Verified Telemetry", "10万次生产实测"),
      icon: TrendingUp,
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero 区域 */}
      <section
        className="relative overflow-hidden rounded-3xl border px-6 py-12 sm:px-12 sm:py-16"
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "radial-gradient(circle at 20% 0%, rgba(56,189,248,0.14), transparent 45%), radial-gradient(circle at 85% 20%, rgba(129,140,248,0.12), transparent 40%), var(--bg-secondary)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 font-mono text-xs font-medium text-sky-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {t(
              "ULTRAI.ORG • INDEPENDENT AI TELEMETRY & INTELLIGENCE",
              "ULTRAI.ORG • 独立 AI 基准评测与商业变现情报院"
            )}
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("Data-Driven Clarity for ", "用一手数据与独立基准，")}
            <span className="text-gradient-brand">
              {t("Profitable AI Decisions", "看清 AI 商业变现与选型")}
            </span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "Compare real-world LLM speed & token economics, deploy security-graded MCP servers, and read empirical monetization teardowns built for indie founders & engineering teams.",
              "横向对比全球大模型真实吞吐与 Token 成本，一键复制安全审计版 MCP/Agent 配置，阅读面向独立开发者与企业决策者的硬核 AI 变现拆解报告。"
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
            >
              <Activity className="h-4 w-4" />
              {t("Explore Model Benchmarks", "查看模型独立评测榜")}
            </Link>
            <Link
              href="/calculator"
              className="intel-card inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Calculator className="h-4 w-4 text-emerald-400" />
              {t("Calculate Token ROI", "测算 API Token 成本")}
            </Link>
            <Link
              href="/registry"
              className="intel-card inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <Compass className="h-4 w-4 text-amber-400" />
              {t("MCP Registry", "MCP 开放索引")}
            </Link>
          </div>
        </div>

        {/* 生态脉冲指标条 */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pulseMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="intel-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {m.label}
                  </span>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
                <div className="mt-2 font-mono text-2xl font-bold tracking-tight">
                  {m.value}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {m.delta}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 模块一：Top 模型评测速览 */}
      <section className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold tracking-wider text-sky-400 uppercase">
              01 / LIVE TELEMETRY
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("Frontier Model Value & Speed Index", "主流大模型性价比与吞吐速览")}
            </h2>
          </div>
          <Link
            href="/benchmarks"
            className="inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:underline"
          >
            {t("Full interactive leaderboard", "查看完整交互榜单")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="intel-card mt-5 overflow-hidden rounded-2xl">
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
                  <th className="px-5 py-3.5">{t("Model", "模型")}</th>
                  <th className="px-4 py-3.5">{t("Quality", "智能指数")}</th>
                  <th className="px-4 py-3.5">{t("Speed", "吞吐速度")}</th>
                  <th className="px-4 py-3.5">{t("Blended $/1M", "综合单价")}</th>
                  <th className="px-4 py-3.5">{t("Value Score", "性价比分")}</th>
                  <th className="px-5 py-3.5 text-right">{t("Deploy", "快速接入")}</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {topModels.map((model) => (
                  <tr
                    key={model.id}
                    className="transition-colors hover:bg-sky-500/5"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{model.name}</span>
                        {model.openWeights && (
                          <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
                            OPEN
                          </span>
                        )}
                      </div>
                      <div
                        className="mt-0.5 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {model.provider} •{" "}
                        {locale === "en" ? model.bestForEn : model.bestForZh}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono font-semibold text-sky-400">
                      {model.qualityIndex.toFixed(1)}
                    </td>
                    <td className="px-4 py-4 font-mono">
                      {model.tokensPerSec}{" "}
                      <span className="text-xs text-slate-500">t/s</span>
                    </td>
                    <td className="px-4 py-4 font-mono">
                      ${getBlendedPrice(model).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-700/40">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                            style={{ width: `${model.valueScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {model.valueScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={model.affiliateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium text-sky-400 transition hover:border-sky-400 hover:bg-sky-500/10"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        API <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 模块二：Agent / MCP 安全审计索引 */}
      <section className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              02 / VERIFIED ECOSYSTEM
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("Audited MCP Servers & Agent Skills", "严选安全审计 MCP 与 Agent 技能库")}
            </h2>
          </div>
          <Link
            href="/registry"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:underline"
          >
            {t("Browse all indexed tools", "浏览全部开放索引")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {topRegistry.map((item) => (
            <div key={item.id} className="intel-card flex flex-col justify-between rounded-2xl p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.verified && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <div
                      className="mt-1 flex items-center gap-2 font-mono text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>★ {item.stars}</span>
                      <span>•</span>
                      <span>{item.weeklyInstalls}/wk</span>
                    </div>
                  </div>
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400">
                    {t("Grade", "安全评级")} {item.grade}
                  </span>
                </div>

                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {locale === "en" ? item.summaryEn : item.summaryZh}
                </p>

                <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2 text-xs text-sky-400">
                  <strong>ROI:</strong>{" "}
                  {locale === "en" ? item.roiNoteEn : item.roiNoteZh}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                <code className="truncate rounded bg-slate-900/60 px-2 py-1 font-mono text-[11px] text-slate-300">
                  {item.installCmd}
                </code>
                <Link
                  href="/registry"
                  className="shrink-0 text-xs font-semibold text-sky-400 hover:underline"
                >
                  {t("Config →", "查看配置 →")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 模块三：AI 商业变现与 ROI 情报 */}
      <section className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              03 / MONETIZATION INTELLIGENCE
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("Latest AI Business & ROI Teardowns", "最新 AI 商业变现与实战情报")}
            </h2>
          </div>
          <Link
            href="/intelligence"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:underline"
          >
            {t("Read all research reports", "阅读全部深度研报")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {latestReports.map((report) => (
            <Link
              key={report.slug}
              href={`/intelligence/${report.slug}`}
              className="intel-card group flex flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-indigo-400">
                    {locale === "en" ? report.categoryEn : report.categoryZh}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      report.tier === "Free"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {report.tier}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold leading-snug transition-colors group-hover:text-sky-400">
                  {locale === "en" ? report.titleEn : report.titleZh}
                </h3>

                <p
                  className="mt-2.5 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {locale === "en" ? report.excerptEn : report.excerptZh}
                </p>
              </div>

              <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="grid grid-cols-3 gap-2">
                  {report.keyMetrics.map((km) => (
                    <div key={km.labelEn}>
                      <div className="font-mono text-xs font-bold text-sky-400">
                        {km.value}
                      </div>
                      <div
                        className="truncate text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {locale === "en" ? km.labelEn : km.labelZh}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-400">
                  <span className="inline-flex items-center gap-1">
                    <FileBarChart2 className="h-3.5 w-3.5" />
                    {report.readTimeMin} {t("min read", "分钟阅读")}
                  </span>
                  <span className="transition-transform group-hover:translate-x-1">
                    {t("Read Report →", "阅读全文 →")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 实时自动同步 AI 资讯与 GitHub MCP 脉冲 */}
      <LiveRadarSection compact />

      {/* 底部 Newsletter 转化条 */}
      <div className="mt-16">
        <NewsletterBanner />
      </div>
    </div>
  );
}
