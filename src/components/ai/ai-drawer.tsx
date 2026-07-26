'use client';

import React from 'react';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Brain, LineChart, 
  Bot, Lightbulb, TrendingUp, CheckCircle2 
} from 'lucide-react';

export function AiDrawer() {
  const { isAiDrawerOpen, setAiDrawerOpen } = useDatabaseStore();

  const AI_CAPABILITIES = [
    { title: 'Habit Pattern Analysis', desc: 'Identify optimal times for routines based on your completion velocity.', icon: LineChart },
    { title: 'Inconsistency & Fatigue Detection', desc: 'Alerts when streaks drop or tasks become unmanageable.', icon: Brain },
    { title: 'Streak & Completion Prediction', desc: 'Forecast weekly and monthly goal attainment probabilistically.', icon: TrendingUp },
    { title: 'Automated Routine Suggestions', desc: 'Suggest high-leverage habits personalized to your Life OS.', icon: Lightbulb },
    { title: 'Executive Summary Reports', desc: 'Generate concise weekly digest & actionable productivity summaries.', icon: CheckCircle2 },
  ];

  return (
    <Sheet open={isAiDrawerOpen} onOpenChange={setAiDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md p-6 bg-background border-l border-border shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <SheetHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-purple-600 border-purple-500/30">
                AI Ready Architecture
              </Badge>
            </div>
            <SheetTitle className="text-2xl font-bold tracking-tight">
              ✨ ASSCEND AI Copilot
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground leading-relaxed">
              Your Personal Life Operating System is architected to seamlessly integrate with local & remote LLM models.
            </SheetDescription>
          </SheetHeader>

          {/* Placeholder Banner Notice */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <Bot className="w-4 h-4 text-purple-500" />
              <span>AI features will be connected later.</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The spreadsheet data structures, column schemas, and habit timelines are fully prepared for one-click AI inference integration.
            </p>
          </div>

          {/* Vision Roadmap List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Future AI Capabilities
            </h4>

            <div className="space-y-2.5">
              {AI_CAPABILITIES.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors">
                    <div className="p-2 rounded-lg bg-muted text-foreground shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{item.title}</h5>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border/60">
          <Button 
            onClick={() => setAiDrawerOpen(false)}
            className="w-full font-semibold rounded-xl"
            variant="secondary"
          >
            Close Panel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
