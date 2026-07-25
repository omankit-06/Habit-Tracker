"use client";

import dayjs from "dayjs";
import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/ui/states";
import { mockChatThreads, suggestedPrompts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const mockReplies: Record<string, string> = {
  default:
    "You missed Gym for 3 consecutive days. Your discipline score increased by 7%. You completed Reading every day this week. Today's priority should be Coding.",
};

export function AiCoachPanel() {
  const [threads, setThreads] = useState(mockChatThreads);
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [input, setInput] = useState("");

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeThread) return;
    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user" as const,
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: "assistant" as const,
      content: mockReplies.default,
      timestamp: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: [...t.messages, userMsg, assistantMsg],
            }
          : t
      )
    );
    setInput("");
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[280px_1fr]">
      <Card className="hidden overflow-hidden lg:flex lg:flex-col">
        <CardHeader>
          <CardTitle className="text-base">Conversations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 overflow-y-auto p-4 pt-0">
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                activeId === thread.id
                  ? "border-accent bg-accent text-white"
                  : "border-border hover:bg-background"
              )}
            >
              <p className="font-medium">{thread.title}</p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  activeId === thread.id ? "text-white/80" : "text-muted"
                )}
              >
                {dayjs(thread.updatedAt).format("MMM D, h:mm A")}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">{activeThread?.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {activeThread?.messages.map((msg) => (
              <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
            ))}
          </div>
          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI coach..."
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
