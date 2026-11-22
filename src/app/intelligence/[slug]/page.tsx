"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { INTELLIGENCE_REPORTS } from "@/data/intelligence";
import { NewsletterBanner } from "@/components/NewsletterBanner";

export default function IntelligenceDetailPage() {
  const params = useParams<{ slug: string }>();
  const { locale, t } = useApp();
  const report = INTELLIGENCE_REPORTS.find((r) => r.slug === params?.slug);

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          {t("Report Not Found", "未找到该情报报告")}
        </h1>
        <Link
          href="/intelligence"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Back to Intelligence", "返回情报库")}
        </Link>
      </div>
    );
  }

  const sections = locale === "en" ? report.sectionsEn : report.sectionsZh;
  const lockedItems =
    locale === "en" ? report.proLockedHighlightsEn : report.proLockedHighlightsZh;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/intelligence"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("All Intelligence Reports", "返回全部深度情报")}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="rounded-full bg-indigo-500/15 px-3 py-1 font-semibold text-indigo-400">
            {locale === "en" ? report.categoryEn : report.categoryZh}
          </span>
          <span style={{ color: "var(--text-muted)" }}>{report.publishedAt}</span>
          <span style={{ color: "var(--text-muted)" }}>
            • {report.readTimeMin} {t("min read", "分钟")}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {locale === "en" ? report.titleEn : report.titleZh}
        </h1>

        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {locale === "en" ? report.excerptEn : report.excerptZh}
        </p>

        {/* 核心指标卡片 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {report.keyMetrics.map((m) => (
            <div key={m.labelEn} className="intel-card rounded-2xl p-4">
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {locale === "en" ? m.labelEn : m.labelZh}
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-sky-400">
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* 正文内容 */}
      <div className="mt-10 space-y-8">
        {sections.map((sec) => (
          <section key={sec.heading} className="intel-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight">{sec.heading}</h2>
            <div
              className="mt-4 space-y-4 text-sm leading-7 sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              {sec.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Pro 会员数据/源码解锁预告卡片 */}
      <div className="mt-8 rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-sky-500/10 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-400 uppercase">
          <Lock className="h-4 w-4" />
          {t("UltrAI Pro Dataset & Playbook", "UltrAI Pro 完整数据集与源码包")}
        </div>
        <h3 className="mt-2 text-xl font-bold">
          {t(
            "Unlock the raw CSV telemetry & implementation templates",
            "解锁本报告完整 CSV 实测数据与开箱即用代码模板"
          )}
        </h3>
        <ul className="mt-4 space-y-2.5 text-sm">
          {lockedItems.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span style={{ color: "var(--text-secondary)" }}>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/submit#sponsor"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            {t("Join Pro Waitlist ($99/yr)", "预约 Pro 会员（$99/年）")}
          </Link>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t(
              "Founding member rate locked for early subscribers.",
              "早期订阅用户享创始会员永久锁定价。"
            )}
          </span>
        </div>
      </div>

      <div className="mt-12">
        <NewsletterBanner />
      </div>
    </article>
  );
}
