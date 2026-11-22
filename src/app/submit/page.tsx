import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SubmitClient } from "./SubmitClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit AI Tool, Join Pro Waitlist or Sponsor",
  description:
    "Submit your MCP server or AI tool for security auditing, join the UltrAI Pro dataset waitlist ($99/yr), or sponsor UltrAI.org benchmarks and weekly dispatches.",
  alternates: {
    canonical: "/submit",
  },
  openGraph: {
    title: "Submit AI Tool, Join Pro Waitlist or Sponsor | UltrAI.org",
    description:
      "Community listing, 48-hour expedited security audit, UltrAI Pro founding waitlist, and B2B benchmark sponsorships.",
    url: `${SITE_URL}/submit`,
  },
};

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10" />}>
      <SubmitClient />
    </Suspense>
  );
}
