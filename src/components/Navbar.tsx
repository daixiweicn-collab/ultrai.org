"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Calculator,
  Compass,
  FileBarChart2,
  Globe,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useApp } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { locale, toggleLocale, theme, toggleTheme, t } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      href: "/benchmarks",
      label: t("Benchmarks", "模型评测榜"),
      icon: Activity,
    },
    {
      href: "/calculator",
      label: t("ROI Calculator", "成本计算器"),
      icon: Calculator,
    },
    {
      href: "/registry",
      label: t("MCP Registry", "MCP 索引库"),
      icon: Compass,
    },
    {
      href: "/intelligence",
      label: t("Intelligence", "商业情报"),
      icon: FileBarChart2,
    },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor:
          theme === "dark" ? "rgba(7, 9, 14, 0.82)" : "rgba(248, 250, 252, 0.86)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 品牌 Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-sky-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#07090e]">
              <Sparkles className="h-4 w-4 text-sky-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight">
                UltrAI<span className="text-sky-400">.org</span>
              </span>
              <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-400 sm:inline-block">
                {t("OPEN", "开放")}
              </span>
            </div>
            <span
              className="text-[10px] font-medium tracking-wider uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              {t("Open AI Intelligence", "独立 AI 商业情报院")}
            </span>
          </div>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              Boolean(pathname && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-500/12 text-sky-400"
                    : "hover:bg-slate-500/10"
                }`}
                style={active ? undefined : { color: "var(--text-secondary)" }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors hover:border-sky-400/50"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
            title={t("Switch to Chinese", "切换为英文")}
          >
            <Globe className="h-3.5 w-3.5 text-sky-400" />
            {locale === "en" ? "中文" : "EN"}
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:border-sky-400/50"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>

          <Link
            href="/submit"
            className="hidden rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-sky-500/20 transition hover:brightness-110 sm:inline-flex"
          >
            {t("Submit / Sponsor", "提交 / 赞助")}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border md:hidden"
            style={{ borderColor: "var(--border-subtle)" }}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div
          className="border-t px-4 py-3 md:hidden"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-500/10"
                >
                  <Icon className="h-4 w-4 text-sky-400" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              {t("Submit Tool / Sponsor", "提交工具 / 品牌赞助")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
