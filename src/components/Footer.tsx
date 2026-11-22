"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ExternalLink } from "lucide-react";
import { useApp } from "@/lib/i18n";

export function Footer() {
  const { t } = useApp();

  return (
    <footer
      className="mt-20 border-t"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <span className="text-lg font-bold tracking-tight">
                UltrAI<span className="text-sky-400">.org</span>
              </span>
            </div>
            <p
              className="mt-3 max-w-md text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(
                "Independent AI benchmark telemetry, verified Agent/MCP security registry, and empirical monetization intelligence for builders and decision makers.",
                "独立客观的 AI 大模型评测基准、安全审计版 Agent/MCP 开放索引库，以及面向开发者与商业决策者的实战变现情报站。"
              )}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-sky-400 transition hover:border-sky-400"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                /llms.txt <ExternalLink className="h-3 w-3" />
              </a>
              <span style={{ color: "var(--text-muted)" }}>
                GEO-Ready Index • Updated Daily
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-sky-400">
              {t("Platform", "核心模块")}
            </h4>
            <ul
              className="mt-3 space-y-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                <Link href="/benchmarks" className="hover:text-sky-400">
                  {t("Model Benchmarks", "大模型独立评测榜")}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-sky-400">
                  {t("Token ROI Calculator", "Token 成本计算器")}
                </Link>
              </li>
              <li>
                <Link href="/registry" className="hover:text-sky-400">
                  {t("MCP & Agent Registry", "MCP / Agent 注册表")}
                </Link>
              </li>
              <li>
                <Link href="/intelligence" className="hover:text-sky-400">
                  {t("Monetization Reports", "商业变现深度情报")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              {t("Partnerships", "商业合作")}
            </h4>
            <ul
              className="mt-3 space-y-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                <Link href="/submit" className="hover:text-sky-400">
                  {t("Submit MCP / AI Tool", "提交你的 AI / MCP 工具")}
                </Link>
              </li>
              <li>
                <Link href="/submit#sponsor" className="hover:text-sky-400">
                  {t("Sponsor Benchmarks", "榜单与周刊赞助")}
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-sky-400">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          <p>© {new Date().getFullYear()} UltrAI.org — Open AI Intelligence Initiative.</p>
          <p>
            {t(
              "Disclosure: Some deployment links contain affiliate tracking at zero extra cost to you.",
              "透明声明：部分 API 部署链接包含联盟返佣追踪，不会增加您的任何费用，所有评测数据保持完全独立。"
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
