import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const tier = typeof body?.tier === "string" ? body.tier : "free";
    const category = typeof body?.category === "string" ? body.category : "MCP Server";
    const pitch = typeof body?.pitch === "string" ? body.pitch.trim() : "";

    if (!name || !url || !email || !pitch) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const id = `UAI-${Date.now().toString(36).toUpperCase()}`;
    const record = {
      id,
      tier,
      name,
      url,
      email,
      category,
      pitch,
      submittedAt: new Date().toISOString(),
    };

    try {
      const dataDir = path.join(process.cwd(), ".data");
      await fs.mkdir(dataDir, { recursive: true });
      await fs.appendFile(
        path.join(dataDir, "submissions.jsonl"),
        JSON.stringify(record) + "\n",
        "utf8"
      );
    } catch {
      // 在只读 Serverless 环境优雅降级，上线后可替换为 Supabase / Webhook
    }

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Invalid submission payload." }, { status: 400 });
  }
}
