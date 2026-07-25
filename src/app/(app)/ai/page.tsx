"use client";

import { AiCoachPanel } from "@/components/ai/ai-coach-panel";
import { PageTransition } from "@/components/layout/page-transition";

export default function AiPage() {
  return (
    <PageTransition className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Coach</h1>
        <p className="mt-1 text-muted">
          ChatGPT-style coaching interface with mock guidance and suggested prompts.
        </p>
      </div>
      <AiCoachPanel />
    </PageTransition>
  );
}
