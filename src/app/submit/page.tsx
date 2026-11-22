"use client";

import React, { useState } from "react";
import { Check, CheckCircle2, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/lib/i18n";

export default function SubmitPage() {
  const { t } = useApp();
  const [selectedTier, setSelectedTier] = useState<"free" | "verified" | "sponsor">("verified");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("MCP Server");
  const [pitch, setPitch] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const tiers = [
    {
      id: "free" as const,
      title: t("Community Listing", "免费社区收录"),
      price: "$0",
      period: t("Standard queue", "标准审核队列"),
      badge: null,
      features: [
        t("Indexed in UltrAI Registry", "收录至 UltrAI 开放索引库"),
        t("Basic SEO / GEO backlink", "标准 SEO / GEO 索引曝光"),
        t("7–14 day review cycle", "7–14 天人工审核周期"),
      ],
    },
    {
      id: "verified" as const,
      title: t("Expedited Audit & Badge", "极速安全审计与认证置顶"),
      price: "$49",
      period: t("One-time fee", "一次性付费"),
      badge: t("MOST POPULAR", "高转化推荐"),
      features: [
        t("48-hour priority security grading (A+/A)", "48 小时内完成安全分级（A+/A 徽章）"),
        t("Dofollow high-authority .org link", "高权重 .org 域名 Dofollow 外链"),
        t("Featured in Weekly Dispatch newsletter", "入选每周高价值情报邮件推荐"),
      ],
    },
    {
      id: "sponsor" as const,
      title: t("Category & Benchmark Sponsor", "榜单与周刊专属赞助"),
      price: "$299",
      period: t("Per month", "按月投放"),
      badge: "B2B",
      features: [
        t("Top-of-leaderboard pinned placement", "模型评测榜 / 索引库顶部专属展示位"),
        t("Dedicated sponsor slot in 4 weekly issues", "连续 4 期深度情报周刊黄金赞助位"),
        t("Custom ROI case study teardown", "定制一篇品牌 ROI 实战测评文章"),
      ],
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          name,
          url,
          email,
          category,
          pitch,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error || t("Submission error.", "提交失败，请检查表单内容。"));
      } else {
        setStatus("success");
        setFeedback(
          t(
            `Submission #${data.id} received! We'll email ${email} within 24 hours.`,
            `已收到您的提交（编号 #${data.id}）！我们将在 24 小时内通过邮件联系 ${email}。`
          )
        );
        setName("");
        setUrl("");
        setPitch("");
      }
    } catch {
      setStatus("error");
      setFeedback(t("Network error. Please retry.", "网络异常，请重试。"));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-400">
          <Rocket className="h-3.5 w-3.5" />
          {t("GROW WITH ULTRAI.ORG", "入驻与商业合作")}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("Submit Your AI Tool, MCP Server, or Sponsor", "提交你的 AI / MCP 工具，或成为榜单赞助商")}
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t(
            "Reach high-intent developers, CTOs, and indie founders actively evaluating AI infrastructure and agent tooling.",
            "精准触达正在进行 AI 选型与算力采购的开发者、技术负责人与独立创业者。"
          )}
        </p>
      </div>

      {/* 三档变现定价卡片 */}
      <div id="sponsor" className="mt-10 grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => {
          const active = selectedTier === tier.id;
          return (
            <button
              type="button"
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`intel-card flex flex-col justify-between rounded-2xl p-6 text-left transition ${
                active ? "ring-2 ring-sky-400" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">{tier.title}</h2>
                  {tier.badge && (
                    <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-400">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-extrabold">
                    {tier.price}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    / {tier.period}
                  </span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`mt-6 rounded-xl py-2 text-center text-xs font-semibold ${
                  active
                    ? "bg-sky-500 text-white"
                    : "border border-slate-600/30 text-sky-400"
                }`}
              >
                {active ? t("Selected Plan", "已选择此方案") : t("Select Plan", "选择此方案")}
              </div>
            </button>
          );
        })}
      </div>

      {/* 提交表单 */}
      <div className="intel-card mx-auto mt-10 max-w-3xl rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          {t("Submission Details", "填写提交信息")}
        </div>

        {status === "success" ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-400">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{feedback}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 text-xs underline"
              >
                {t("Submit another item", "继续提交新项目")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {t("Project / Brand Name", "项目或品牌名称")} *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SuperMCP Server"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {t("Website or GitHub URL", "官网或 GitHub 链接")} *
                </label>
                <input
                  required
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {t("Contact Email", "联系邮箱")} *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {t("Category", "类型")}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  <option value="MCP Server">MCP Server</option>
                  <option value="Agent Skill">Agent Skill</option>
                  <option value="LLM / Inference API">LLM / Inference API</option>
                  <option value="AI Micro-SaaS">AI Micro-SaaS</option>
                  <option value="Sponsorship Inquiry">Sponsorship Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold">
                {t("Value Proposition & ROI Summary", "核心价值与实测 ROI 简介")} *
              </label>
              <textarea
                required
                rows={4}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder={t(
                  "Explain what problem it solves, pricing model, and any measurable ROI metrics...",
                  "简述解决的痛点、定价模式及可量化的提效/省钱数据..."
                )}
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-primary)",
                }}
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-rose-400">{feedback}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {status === "loading"
                ? t("Submitting...", "正在提交...")
                : t(
                    `Submit (${tiers.find((x) => x.id === selectedTier)?.title})`,
                    `确认提交（${tiers.find((x) => x.id === selectedTier)?.title}）`
                  )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
