import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "UltrAI.org — Open AI Intelligence & Benchmark Portal",
    description:
      "Compare LLM speed & pricing, discover A+ audited MCP servers, and read data-driven AI monetization teardowns.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UltrAI.org — Open AI Benchmarks, MCP Registry & ROI Intelligence",
    description: DEFAULT_DESCRIPTION,
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('ultrai_theme');if(t==='light'){document.documentElement.classList.add('light');}var l=localStorage.getItem('ultrai_locale');if(l==='zh'){document.documentElement.lang='zh-CN';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
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
