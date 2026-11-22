import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistryClient } from "./RegistryClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security-Graded MCP Servers & Agent Skills Registry",
  description:
    "Browse audited Model Context Protocol (MCP) servers and agent skills with A+/A security grades, verified production ROI, and copy-paste mcp_config.json snippets.",
  alternates: {
    canonical: "/registry",
  },
  openGraph: {
    title: "Security-Graded MCP Servers & Agent Skills Registry | UltrAI.org",
    description:
      "Permission-audited MCP servers and AI agent skills with one-click install commands and JSON configs.",
    url: `${SITE_URL}/registry`,
  },
};

export default function RegistryPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10" />}>
      <RegistryClient />
    </Suspense>
  );
}
