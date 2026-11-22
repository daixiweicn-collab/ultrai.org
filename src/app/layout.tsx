import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://ultrai.org"),
  title: {
    default: "UltrAI.org — Open AI Benchmarks, MCP Registry & Monetization Intelligence",
    template: "%s | UltrAI.org",
  },
  description:
    "Independent AI model performance & pricing benchmarks, security-graded MCP server registry, interactive Token ROI calculator, and empirical AI monetization reports.",
  keywords: [
    "AI benchmarks",
    "LLM pricing comparison",
    "Token cost calculator",
    "MCP server directory",
    "AI agent registry",
    "AI monetization intelligence",
    "GEO optimization",
    "ultrai.org",
  ],
  openGraph: {
    title: "UltrAI.org — Open AI Intelligence & Benchmark Portal",
    description:
      "Compare LLM speed & pricing, discover A+ audited MCP servers, and read data-driven AI monetization teardowns.",
    url: "https://ultrai.org",
    siteName: "UltrAI.org",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-intel-grid antialiased">
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
