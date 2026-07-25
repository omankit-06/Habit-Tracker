"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitStatus } from "@/types/habit";

interface AnimatedCheckboxProps {
  status: HabitStatus;
  onClick?: () => void;
  size?: "sm" | "md";
  className?: string;
}

export function AnimatedCheckbox({
  status,
  onClick,
  size = "md",
  className,
}: AnimatedCheckboxProps) {
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20",
        dim,
        status === "completed" && "border-success bg-success text-white",
        status === "missed" && "border-danger bg-danger/10",
        status === "pending" && "border-border bg-surface hover:border-muted",
        className
      )}
      aria-pressed={status === "completed"}
      aria-label={
        status === "completed"
          ? "Completed"
          : status === "missed"
            ? "Missed"
            : "Pending"
      }
    >
      {status === "completed" && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
        </motion.span>
      )}
      {status === "missed" && (
        <span className={cn("rounded-full bg-danger", size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2")} />
      )}
    </motion.button>
  );
}
