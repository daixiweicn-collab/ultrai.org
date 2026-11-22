import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const record = {
      email,
      subscribedAt: new Date().toISOString(),
    };

    try {
      const dataDir = path.join(process.cwd(), ".data");
      await fs.mkdir(dataDir, { recursive: true });
      await fs.appendFile(
        path.join(dataDir, "subscribers.jsonl"),
        JSON.stringify(record) + "\n",
        "utf8"
      );
    } catch {
      // 在只读 Serverless 文件系统上优雅跳过本地落盘，后续可接入 Supabase / Resend
    }

    return NextResponse.json({ ok: true, email });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
