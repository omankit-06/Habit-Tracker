"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { HabitsProvider } from "@/hooks/use-habits";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <HabitsProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          className="hidden lg:flex"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            onMenuClick={() => setCollapsed((c) => !c)}
            showMobileMenu
          />
          <main className={cn("flex-1 p-4 md:p-6 lg:p-8")}>{children}</main>
        </div>
      </div>
    </HabitsProvider>
  );
}
