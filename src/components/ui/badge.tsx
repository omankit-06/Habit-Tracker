import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" && "border-border bg-background text-foreground",
        variant === "secondary" && "border-transparent bg-muted text-muted-foreground",
        variant === "success" && "border-success/30 bg-success/10 text-success",
        variant === "warning" && "border-warning/40 bg-warning/10 text-foreground",
        variant === "danger" && "border-danger/30 bg-danger/10 text-danger",
        variant === "outline" && "border-border text-muted",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
