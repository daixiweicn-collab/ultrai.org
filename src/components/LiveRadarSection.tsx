"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Flame,
  GitBranch,
  MessageSquare,
  Radio,
  Star,
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import liveFeed from "@/data/live-feed.json";

interface RadarStory {
  id: string;
  source: string;
  tag: string;
  titleEn: string;
  titleZh: string;
  url: string;
  discussionUrl: string;
  points: number;
  comments: number;
  publishedAt: string;
}

interface TrendingMcpRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  updatedAt: string;
  url: string;
  license: string;
}

export function LiveRadarSection({ compact = false }: { compact?: boolean }) {
  const { locale, t } = useApp();
  const [tab, setTab] = useState<"news" | "mcp">("news");

  const stories = (liveFeed.stories || []) as RadarStory[];
  const repos = (liveFeed.trendingMcpRepos || []) as TrendingMcpRepo[];
  const visibleStories = compact ? stories.slice(0, 6) : stories;
  const visibleRepos = compact ? repos.slice(0, 6) : repos;

  const syncedDate = liveFeed.syncedAt
    ? new Date(liveFeed.syncedAt).toLocaleString(locale === "en" ? "en-US" : "zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  if (stories.length === 0 && repos.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-rose-400 uppercase">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            LIVE AUTO-SYNC RADAR • {t("Updated", "同步于")} {syncedDate}
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {t("Real-Time AI Signals & Trending MCP Repos", "全球实时 AI 商业信号与开源 MCP 趋势")}
          </h2>
        </div>

        <div
          className="inline-flex self-start rounded-xl border p-1"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            onClick={() => setTab("news")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "news" ? "bg-sky-500 text-white" : "hover:bg-slate-500/10"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            {t(`AI News (${stories.length})`, `实时热点 (${stories.length})`)}
          </button>
          <button
            onClick={() => setTab("mcp")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === "mcp" ? "bg-emerald-500 text-white" : "hover:bg-slate-500/10"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            {t(`GitHub MCP (${repos.length})`, `热门 MCP 仓库 (${repos.length})`)}
          </button>
        </div>
      </div>

      {tab === "news" ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {visibleStories.map((story) => (
            <div
              key={story.id}
              className="intel-card flex flex-col justify-between rounded-2xl p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="rounded bg-sky-500/12 px-2 py-0.5 font-semibold text-sky-400">
                    {story.tag}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {story.source} • {story.publishedAt.slice(0, 10)}
                  </span>
                </div>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 block text-sm font-semibold leading-snug transition hover:text-sky-400"
                >
                  {locale === "en" ? story.titleEn : story.titleZh}
                </a>
              </div>

              <div
                className="mt-3 flex items-center justify-between border-t pt-2.5 font-mono text-xs"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-amber-400">▲ {story.points}</span>
                  <a
                    href={story.discussionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-sky-400"
                  >
                    <MessageSquare className="h-3 w-3" /> {story.comments}
                  </a>
                </div>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                >
                  {t("Source", "原文")} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {visibleRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="intel-card group flex flex-col justify-between rounded-2xl p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold transition group-hover:text-emerald-400">
                    {repo.fullName}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-500/12 px-2 py-0.5 font-mono text-xs font-bold text-amber-400">
                    <Star className="h-3 w-3" /> {repo.stars.toLocaleString()}
                  </span>
                </div>
                <p
                  className="mt-2 line-clamp-2 text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {repo.description}
                </p>
              </div>

              <div
                className="mt-3 flex items-center justify-between border-t pt-2.5 font-mono text-[11px]"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                <span>
                  {repo.language} • {repo.license}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  GitHub <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
