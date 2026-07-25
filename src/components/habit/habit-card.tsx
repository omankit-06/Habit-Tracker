"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCheckbox } from "@/components/habit/animated-checkbox";
import { getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Habit, HabitStatus } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  status: HabitStatus;
  progress?: number;
  onToggle?: () => void;
}

export function HabitCard({ habit, status, progress = 0, onToggle }: HabitCardProps) {
  const Icon = getLucideIcon(habit.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-colors",
          status === "completed" && "border-success/30 bg-success/[0.03]"
        )}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <AnimatedCheckbox status={status} onClick={onToggle} />
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{habit.name}</p>
              <Badge variant="outline">{habit.category}</Badge>
              <Badge
                variant={
                  habit.priority === "high"
                    ? "danger"
                    : habit.priority === "medium"
                      ? "warning"
                      : "default"
                }
              >
                {habit.priority}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {habit.targetTime}
              </span>
              <span>{progress}% progress</span>
            </div>
          </div>
          <Badge
            variant={
              status === "completed"
                ? "success"
                : status === "missed"
                  ? "danger"
                  : "default"
            }
          >
            {status}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}
