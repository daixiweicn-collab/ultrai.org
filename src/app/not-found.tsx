"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Compass, FileQuestion, Gift } from "lucide-react";
import { useApp } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useApp();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <div className="intel-card w-full rounded-3xl p-8 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-400">
          <FileQuestion className="h-7 w-7" />
        </div>
        <div className="mt-5 font-mono text-xs font-semibold tracking-widest text-sky-400 uppercase">
          ERROR 404 • NOT FOUND
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("Page Not Found", "未找到该页面")}
        </h1>
        <p
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t(
            "The link you followed may be outdated or the report slug does not exist. Explore our live benchmarks or MCP registry below.",
            "您访问的链接可能已失效，或该报告路径不存在。您可以返回首页，或直接浏览实时模型评测榜与 MCP 索引库。"
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Back to Home", "返回首页")}
          </Link>
          <Link
            href="/free-tokens"
            className="intel-card inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold hover:text-emerald-400"
          >
            <Gift className="h-4 w-4 text-emerald-400" />
            {t("Free Tokens", "免费 Token")}
          </Link>
          <Link
            href="/benchmarks"
            className="intel-card inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold hover:text-sky-400"
          >
            <Activity className="h-4 w-4 text-sky-400" />
            {t("Model Benchmarks", "模型评测榜")}
          </Link>
          <Link
            href="/registry"
            className="intel-card inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold hover:text-emerald-400"
          >
            <Compass className="h-4 w-4 text-emerald-400" />
            {t("MCP Registry", "MCP 索引库")}
          </Link>
        </div>
      </div>
    </div>
  );
}
