export type HabitCategory =
  | "Morning"
  | "Fitness"
  | "Study"
  | "Work"
  | "Meditation"
  | "Reading"
  | "Coding"
  | "Health"
  | "Personal Growth"
  | "Sleep"
  | "Custom";

export type HabitPriority = "low" | "medium" | "high";

export type HabitStatus = "completed" | "missed" | "pending";

export type RepeatPattern = "daily" | "weekdays" | "weekends" | "custom";

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  icon: string;
  color: string;
  targetTime: string;
  repeat: RepeatPattern;
  reminder: string;
  priority: HabitPriority;
  notes: string;
  createdAt: string;
}

export interface DayCompletion {
  date: string;
  habitId: string;
  status: HabitStatus;
}

export interface DailyNote {
  date: string;
  note: string;
  progress: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export const HABIT_CATEGORIES: HabitCategory[] = [
  "Morning",
  "Fitness",
  "Study",
  "Work",
  "Meditation",
  "Reading",
  "Coding",
  "Health",
  "Personal Growth",
  "Sleep",
  "Custom",
];
