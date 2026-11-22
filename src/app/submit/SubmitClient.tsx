"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, CheckCircle2, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/lib/i18n";

type TierId = "free" | "verified" | "pro" | "sponsor";

type SubmitErrorCode =
  | "MISSING_FIELDS"
  | "FIELD_TOO_LONG"
  | "INVALID_EMAIL"
  | "INVALID_URL"
  | "RATE_LIMITED"
  | "STORAGE_UNAVAILABLE"
  | "NETWORK"
  | "GENERIC"
  | null;

const VALID_PLANS = new Set<TierId>(["free", "verified", "pro", "sponsor"]);

export function SubmitClient() {
  const { t } = useApp();
  const searchParams = useSearchParams();
  const planParam = (searchParams?.get("plan") as TierId | null) ?? null;

  const [selectedTier, setSelectedTier] = useState<TierId>(() => {
    if (planParam && VALID_PLANS.has(planParam)) return planParam;
    return "verified";
  });
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(() => {
    if (planParam === "pro") return "Pro Membership Waitlist";
    if (planParam === "sponsor") return "Sponsorship Inquiry";
    return "MCP Server";
  });
  const [pitch, setPitch] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<SubmitErrorCode>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{
    id: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (planParam && VALID_PLANS.has(planParam)) {
      setSelectedTier(planParam);
      if (planParam === "pro") setCategory("Pro Membership Waitlist");
      else if (planParam === "sponsor") setCategory("Sponsorship Inquiry");
    } else if (
      typeof window !== "undefined" &&
      window.location.hash === "#sponsor"
    ) {
      setSelectedTier("sponsor");
      setCategory("Sponsorship Inquiry");
    }
  }, [planParam]);

  const handleSelectTier = (tierId: TierId) => {
    setSelectedTier(tierId);
    if (tierId === "pro") setCategory("Pro Membership Waitlist");
    else if (tierId === "sponsor") setCategory("Sponsorship Inquiry");
    else if (
      category === "Pro Membership Waitlist" ||
      category === "Sponsorship Inquiry"
    ) {
      setCategory("MCP Server");
    }
  };

  const isProTier = selectedTier === "pro";

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
      id: "pro" as const,
      title: t("UltrAI Pro Membership", "UltrAI Pro 会员候补"),
      price: "$99",
      period: t("Per year (Founding rate)", "每年（创始锁定价）"),
      badge: "PRO",
      features: [
        t("Full CSV datasets & 100k-req benchmarks", "解锁全部 CSV 实测数据与 10 万条基准表"),
        t("Reference router & GEO scanner scripts", "获取多模型路由源码与 GEO 监控脚本"),
        t("Priority access to new monetization teardowns", "第一时间解锁最新深度变现拆解报告"),
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

  const categoryOptions = [
    { value: "MCP Server", label: t("MCP Server", "MCP 服务器") },
    { value: "Agent Skill", label: t("Agent Skill", "Agent 技能包") },
    { value: "LLM / Inference API", label: t("LLM / Inference API", "大模型 / 推理 API") },
    { value: "AI Micro-SaaS", label: t("AI Micro-SaaS", "AI 微型 SaaS") },
    {
      value: "Pro Membership Waitlist",
      label: t("Pro Membership Waitlist ($99/yr)", "Pro 会员预约（$99/年）"),
    },
    {
      value: "Sponsorship Inquiry",
      label: t("Sponsorship Inquiry", "榜单与周刊品牌赞助"),
    },
  ];

  function getErrorMessage(code: SubmitErrorCode): string {
    switch (code) {
      case "MISSING_FIELDS":
        return t("Please fill in all required fields.", "请完整填写所有必填项。");
      case "FIELD_TOO_LONG":
        return t(
          "One or more fields exceed the allowed character limit.",
          "部分输入内容超出长度限制，请精简后重试。"
        );
      case "INVALID_EMAIL":
        return t(
          "Please provide a valid contact email address.",
          "请输入有效的联系邮箱地址。"
        );
      case "INVALID_URL":
        return t(
          "Website or GitHub URL must start with http:// or https://.",
          "官网或 GitHub 链接必须以 http:// 或 https:// 开头。"
        );
      case "RATE_LIMITED":
        return t(
          "Too many submissions. Please try again in a few minutes.",
          "提交过于频繁，请几分钟后再试。"
        );
      case "STORAGE_UNAVAILABLE":
        return t(
          "Submission service is temporarily unavailable. Please retry shortly.",
          "提交服务暂时不可用，请稍后重试。"
        );
      case "NETWORK":
        return t("Network error. Please retry.", "网络异常，请重试。");
      default:
        return t("Submission failed. Please check your input.", "提交失败，请检查表单内容。");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorCode(null);
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
        setErrorCode((data.code as SubmitErrorCode) || "GENERIC");
      } else {
        setStatus("success");
        setSubmittedInfo({ id: data.id, email: email.trim() });
        setName("");
        setUrl("");
        setPitch("");
      }
    } catch {
      setStatus("error");
      setErrorCode("NETWORK");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-400">
          <Rocket className="h-3.5 w-3.5" />
          {t("GROW WITH ULTRAI.ORG", "入驻、Pro 会员与商业合作")}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t(
            "Submit Your AI Tool, Join Pro, or Sponsor",
            "提交你的 AI / MCP 工具、预约 Pro 会员或成为赞助商"
          )}
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

      {/* 四档方案定价卡片 */}
      <div
        id="sponsor"
        className="mt-10 grid scroll-mt-24 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {tiers.map((tier) => {
          const active = selectedTier === tier.id;
          return (
            <button
              type="button"
              key={tier.id}
              onClick={() => handleSelectTier(tier.id)}
              className={`intel-card flex flex-col justify-between rounded-2xl p-6 text-left transition ${
                active ? "ring-2 ring-sky-400" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold leading-snug">{tier.title}</h2>
                  {tier.badge && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        tier.id === "pro"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-sky-500/15 text-sky-400"
                      }`}
                    >
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
          {isProTier
            ? t("Pro Waitlist Registration", "填写 Pro 会员预约信息")
            : t("Submission Details", "填写提交信息")}
        </div>

        {status === "success" && submittedInfo ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-400">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">
                {t(
                  `Submission #${submittedInfo.id} received! We'll email ${submittedInfo.email} within 24 hours.`,
                  `已收到您的提交（编号 #${submittedInfo.id}）！我们将在 24 小时内通过邮件联系 ${submittedInfo.email}。`
                )}
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setSubmittedInfo(null);
                }}
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
                  {isProTier
                    ? t("Your Name or Team", "您的姓名或团队名称")
                    : t("Project / Brand Name", "项目或品牌名称")}{" "}
                  *
                </label>
                <input
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    isProTier
                      ? t("e.g. Alex Chen / Indie Studio", "例如：陈明 / 独立研发团队")
                      : "e.g. SuperMCP Server"
                  }
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  {isProTier
                    ? t("Website or GitHub (Optional)", "个人官网或 GitHub（选填）")
                    : t("Website or GitHub URL", "官网或 GitHub 链接")}{" "}
                  {!isProTier && "*"}
                </label>
                <input
                  required={!isProTier}
                  type="url"
                  maxLength={500}
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
                  maxLength={254}
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
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold">
                {isProTier
                  ? t("Datasets or Topics You Care Most About", "您最关注的数据集或研报方向")
                  : t("Value Proposition & ROI Summary", "核心价值与实测 ROI 简介")}{" "}
                *
              </label>
              <textarea
                required
                rows={4}
                maxLength={2000}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder={
                  isProTier
                    ? t(
                        "Tell us which CSV datasets, routing templates, or AI monetization teardowns you want prioritized...",
                        "告诉我们您最希望优先获取的 CSV 实测数据、多模型路由源码或行业变现拆解..."
                      )
                    : t(
                        "Explain what problem it solves, pricing model, and any measurable ROI metrics...",
                        "简述解决的痛点、定价模式及可量化的提效/省钱数据..."
                      )
                }
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-sky-400"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-primary)",
                }}
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-rose-400">{getErrorMessage(errorCode)}</p>
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
