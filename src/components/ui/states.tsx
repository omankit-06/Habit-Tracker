"use client";

import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-center">
      <p className="text-sm text-danger">{message}</p>
    </div>
  );
}

export function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
        role === "user"
          ? "ml-auto bg-accent text-white"
          : "mr-auto border border-border bg-surface"
      )}
    >
      {content}
    </div>
  );
}
