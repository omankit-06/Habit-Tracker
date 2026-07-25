"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  return (
    <motion.div
      className={cn("fixed bottom-6 right-6 z-50", className)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={onClick}
        aria-label="Create habit"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}
