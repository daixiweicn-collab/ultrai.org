import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`subscribe:${ip}`, 10, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      }
    );
  }

  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        {
          code: "INVALID_EMAIL",
          error: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const record = {
      type: "subscribe",
      email,
      subscribedAt: new Date().toISOString(),
    };

    const webhookUrl =
      process.env.SUBSCRIBE_WEBHOOK_URL || process.env.SUBMISSION_WEBHOOK_URL;
    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(8000),
      });
      if (!hookRes.ok) {
        console.error("[ULTRAI_SUBSCRIBE_WEBHOOK_ERROR]", hookRes.status);
        return NextResponse.json(
          {
            code: "STORAGE_UNAVAILABLE",
            error: "Subscription service is temporarily unavailable. Please retry shortly.",
          },
          { status: 502 }
        );
      }
    }

    let persistedToDisk = false;
    try {
      const dataDir = path.join(process.cwd(), ".data");
      await fs.mkdir(dataDir, { recursive: true });
      await fs.appendFile(
        path.join(dataDir, "subscribers.jsonl"),
        JSON.stringify(record) + "\n",
        "utf8"
      );
      persistedToDisk = true;
    } catch {
      // 只读 Serverless 文件系统不支持本地落盘，走下方结构化日志留痕
    }

    console.info(
      "[ULTRAI_SUBSCRIBE]",
      JSON.stringify({
        ...record,
        persisted: webhookUrl ? "webhook" : persistedToDisk ? "disk" : "log-only",
      })
    );

    return NextResponse.json({ ok: true, email });
  } catch {
    return NextResponse.json(
      { code: "INVALID_PAYLOAD", error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
