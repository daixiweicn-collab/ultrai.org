"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/lib/i18n";

type ErrorCode =
  | "INVALID_EMAIL"
  | "RATE_LIMITED"
  | "STORAGE_UNAVAILABLE"
  | "NETWORK"
  | "GENERIC"
  | null;

export function NewsletterBanner() {
  const { t } = useApp();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<ErrorCode>(null);

  function getErrorMessage(code: ErrorCode): string {
    switch (code) {
      case "INVALID_EMAIL":
        return t("Please provide a valid email address.", "请输入有效的电子邮箱地址。");
      case "RATE_LIMITED":
        return t(
          "Too many requests. Please try again in a few minutes.",
          "请求过于频繁，请几分钟后再试。"
        );
      case "STORAGE_UNAVAILABLE":
        return t(
          "Subscription service is temporarily busy. Please retry shortly.",
          "订阅服务暂时繁忙，请稍后重试。"
        );
      case "NETWORK":
        return t("Network error. Please retry.", "网络异常，请重试。");
      default:
        return t("Subscription failed. Please retry.", "订阅失败，请稍后重试。");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorCode(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorCode((data.code as ErrorCode) || "GENERIC");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setErrorCode("NETWORK");
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-emerald-500/10 p-6 sm:p-10">
      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            {t("UltrAI Weekly Dispatch", "UltrAI 每周高价值情报")}
          </div>
          <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {t(
              "Zero hype. Pure AI unit economics & verified money-making playbooks.",
              "拒绝焦虑新闻，只发经过实测的 AI 变现拆解与算力情报。"
            )}
          </h3>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "Join builders & founders receiving weekly LLM price-drop alerts, A+ audited MCP servers, and MRR teardowns.",
              "每周一送达：大模型 API 降价/速度异动、A+ 安全审计 MCP 工具推荐与海外独立站 MRR 盈利拆解。"
            )}
          </p>
        </div>

        <div className="w-full max-w-md">
          {status === "success" ? (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>
                {t(
                  "You're in! Weekly AI ROI & benchmark telemetry is on its way.",
                  "订阅成功！每周一发送精选 AI 商业变现情报与模型性价比异动。"
                )}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("founder@company.com", "输入您的常用邮箱")}
                  className="w-full rounded-xl border py-3 pr-4 pl-10 text-sm outline-none transition focus:border-sky-400"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                {status === "loading"
                  ? t("Joining...", "提交中...")
                  : t("Subscribe Free", "免费订阅")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-rose-400">{getErrorMessage(errorCode)}</p>
          )}
          <p
            className="mt-2.5 text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            {t(
              "1 issue / week. Unsubscribe anytime. Instant access to our Model ROI sheet.",
              "每周仅发 1 封，随时退订。订阅即解锁《2026 模型性价比速查表》。"
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
