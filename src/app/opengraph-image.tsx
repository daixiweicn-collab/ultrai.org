import { ImageResponse } from "next/og";

export const alt =
  "UltrAI.org — Open AI Benchmarks, MCP Registry & Monetization Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(circle at 18% 12%, #0c2c44 0%, #07090e 52%, #111428 100%)",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            U
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
              UltrAI.org
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#34d399",
                border: "1px solid rgba(52,211,153,0.4)",
                background: "rgba(52,211,153,0.12)",
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              OPEN TELEMETRY
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Open AI Benchmarks, MCP Registry & Monetization Intelligence
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#94a3b8",
              lineHeight: 1.45,
              maxWidth: 920,
            }}
          >
            Compare LLM speed & token economics, discover security-graded MCP
            servers, and calculate real API ROI before you ship.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(148,163,184,0.22)",
            paddingTop: 24,
            fontSize: 20,
            color: "#38bdf8",
          }}
        >
          <span>Benchmarks • Token ROI Calculator • MCP Registry • Intelligence</span>
          <span style={{ color: "#94a3b8" }}>www.ultrai.org</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
