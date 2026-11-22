"use client";

import React from "react";
import Link from "next/link";
import { FileBarChart2, Lock, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { INTELLIGENCE_REPORTS } from "@/data/intelligence";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { LiveRadarSection } from "@/components/LiveRadarSection";

export default function IntelligencePage() {
  const { locale, t } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-semibold text-indigo-400">
          <FileBarChart2 className="h-3.5 w-3.5" />
          {t("EMPIRICAL AI BUSINESS RESEARCH", "实战派 AI 商业变现与 ROI 研报")}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("Monetization Teardowns & Unit Economics", "AI 商业变现拆解与算力经济情报")}
        </h1>
        <p
          className="mt-2 max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t(
            "Deep, numbers-first analyses of how indie developers and B2B teams turn AI models, GEO search, and MCP ecosystems into durable revenue.",
            "用真实数据拆解独立开发者与 B2B 团队如何通过大模型路由、GEO 搜索优化与 MCP 生态构建高毛利现金流。"
          )}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {INTELLIGENCE_REPORTS.map((report) => (
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
                <div className="flex items-center gap-2">
                  <span style={{ color: "var(--text-muted)" }}>
                    {report.publishedAt}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                      report.tier === "Free"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {report.tier !== "Free" && <Lock className="h-2.5 w-2.5" />}
                    {report.tier}
                  </span>
                </div>
              </div>

              <h2 className="mt-3 text-xl font-bold leading-snug transition-colors group-hover:text-sky-400">
                {locale === "en" ? report.titleEn : report.titleZh}
              </h2>

              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {locale === "en" ? report.excerptEn : report.excerptZh}
              </p>
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="grid grid-cols-3 gap-3">
                {report.keyMetrics.map((m) => (
                  <div
                    key={m.labelEn}
                    className="rounded-xl border px-3 py-2"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <div className="font-mono text-sm font-bold text-sky-400">
                      {m.value}
                    </div>
                    <div
                      className="truncate text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {locale === "en" ? m.labelEn : m.labelZh}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-400">
                <span>
                  {report.readTimeMin} {t("min read", "分钟深度阅读")}
                </span>
                <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
                  {t("Open Full Report", "阅读完整研报")}{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <LiveRadarSection />

      <div className="mt-14">
        <NewsletterBanner />
      </div>
    </div>
  );
}
