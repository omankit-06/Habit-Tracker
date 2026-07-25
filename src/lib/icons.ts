import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Circle } from "lucide-react";

export function getLucideIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Circle;
}
