import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TIERS = new Set(["free", "verified", "pro", "sponsor"]);

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`submit:${ip}`, 8, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        code: "RATE_LIMITED",
        error: "Too many submissions. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      }
    );
  }

  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const tier =
      typeof body?.tier === "string" && ALLOWED_TIERS.has(body.tier)
        ? body.tier
        : "free";
    const category =
      typeof body?.category === "string"
        ? body.category.trim().slice(0, 80)
        : "MCP Server";
    const pitch = typeof body?.pitch === "string" ? body.pitch.trim() : "";

    const urlRequired = tier !== "pro";
    if (!name || !email || !pitch || (urlRequired && !url)) {
      return NextResponse.json(
        {
          code: "MISSING_FIELDS",
          error: "All required fields must be filled.",
        },
        { status: 400 }
      );
    }

    if (name.length > 120 || pitch.length > 2000 || email.length > 254 || url.length > 500) {
      return NextResponse.json(
        {
          code: "FIELD_TOO_LONG",
          error: "One or more fields exceed the allowed length.",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        {
          code: "INVALID_EMAIL",
          error: "Please provide a valid contact email address.",
        },
        { status: 400 }
      );
    }

    if (url && !isValidHttpUrl(url)) {
      return NextResponse.json(
        {
          code: "INVALID_URL",
          error: "Website or GitHub URL must start with http:// or https://.",
        },
        { status: 400 }
      );
    }

    const id = `UAI-${Date.now().toString(36).toUpperCase()}`;
    const record = {
      type: "submission",
      id,
      tier,
      name,
      url,
      email,
      category,
      pitch,
      submittedAt: new Date().toISOString(),
    };

    // 1. 优先转发至配置的外部 Webhook（如 Supabase / Slack / Feishu / Make）
    const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL;
    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(8000),
      });
      if (!hookRes.ok) {
        console.error("[ULTRAI_SUBMISSION_WEBHOOK_ERROR]", hookRes.status, record.id);
        return NextResponse.json(
          {
            code: "STORAGE_UNAVAILABLE",
            error: "Submission service is temporarily unavailable. Please retry shortly.",
          },
          { status: 502 }
        );
      }
    }

    // 2. 尝试本地落盘（用于自托管 / 本地开发环境）
    let persistedToDisk = false;
    try {
      const dataDir = path.join(process.cwd(), ".data");
      await fs.mkdir(dataDir, { recursive: true });
      await fs.appendFile(
        path.join(dataDir, "submissions.jsonl"),
        JSON.stringify(record) + "\n",
        "utf8"
      );
      persistedToDisk = true;
    } catch {
      // 只读 Serverless 文件系统不支持本地落盘，走下方结构化日志留痕
    }

    // 3. 输出结构化生产日志，确保 Serverless 平台日志可完整检索、绝不丢单
    console.info(
      "[ULTRAI_SUBMISSION]",
      JSON.stringify({
        ...record,
        persisted: webhookUrl ? "webhook" : persistedToDisk ? "disk" : "log-only",
      })
    );

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { code: "INVALID_PAYLOAD", error: "Invalid submission payload." },
      { status: 400 }
    );
  }
}
