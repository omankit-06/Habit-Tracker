import dayjs from "dayjs";
import type {
  ChatThread,
  DailyNote,
  DayCompletion,
  Habit,
} from "@/types/habit";

const habitSeeds: Omit<Habit, "id" | "createdAt">[] = [
  {
    name: "Wake Up Early",
    description: "Rise at 5:30 AM with intention.",
    category: "Morning",
    icon: "Sunrise",
    color: "#111111",
    targetTime: "05:30",
    repeat: "daily",
    reminder: "05:25",
    priority: "high",
    notes: "No snooze.",
  },
  {
    name: "Gym",
    description: "Strength training session.",
    category: "Fitness",
    icon: "Dumbbell",
    color: "#111111",
    targetTime: "07:00",
    repeat: "weekdays",
    reminder: "06:45",
    priority: "high",
    notes: "Push / Pull / Legs rotation.",
  },
  {
    name: "Meditation",
    description: "10 minutes of mindfulness.",
    category: "Meditation",
    icon: "Brain",
    color: "#111111",
    targetTime: "06:00",
    repeat: "daily",
    reminder: "06:00",
    priority: "medium",
    notes: "Breath focus.",
  },
  {
    name: "Reading",
    description: "Read 20 pages daily.",
    category: "Reading",
    icon: "BookOpen",
    color: "#111111",
    targetTime: "21:00",
    repeat: "daily",
    reminder: "20:45",
    priority: "medium",
    notes: "Non-fiction focus.",
  },
  {
    name: "Coding",
    description: "Deep work on side projects.",
    category: "Coding",
    icon: "Code2",
    color: "#111111",
    targetTime: "20:00",
    repeat: "daily",
    reminder: "19:45",
    priority: "high",
    notes: "ASCEND frontend.",
  },
  {
    name: "Drink Water",
    description: "3L hydration goal.",
    category: "Health",
    icon: "Droplets",
    color: "#111111",
    targetTime: "12:00",
    repeat: "daily",
    reminder: "09:00",
    priority: "medium",
    notes: "Track in bottle.",
  },
  {
    name: "No Porn",
    description: "Maintain discipline streak.",
    category: "Personal Growth",
    icon: "Shield",
    color: "#111111",
    targetTime: "23:59",
    repeat: "daily",
    reminder: "22:00",
    priority: "high",
    notes: "Evening accountability.",
  },
  {
    name: "Healthy Diet",
    description: "Whole foods, no junk.",
    category: "Health",
    icon: "Utensils",
    color: "#111111",
    targetTime: "19:00",
    repeat: "daily",
    reminder: "18:30",
    priority: "medium",
    notes: "Meal prep Sundays.",
  },
  {
    name: "Deep Work",
    description: "90-minute focused block.",
    category: "Work",
    icon: "Target",
    color: "#111111",
    targetTime: "10:00",
    repeat: "weekdays",
    reminder: "09:55",
    priority: "high",
    notes: "Notifications off.",
  },
  {
    name: "Sleep Before 11 PM",
    description: "Consistent sleep schedule.",
    category: "Sleep",
    icon: "Moon",
    color: "#111111",
    targetTime: "22:45",
    repeat: "daily",
    reminder: "22:30",
    priority: "high",
    notes: "Wind down routine.",
  },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateCompletions(habits: Habit[], month: dayjs.Dayjs): DayCompletion[] {
  const completions: DayCompletion[] = [];
  const daysInMonth = month.daysInMonth();
  const today = dayjs();

  habits.forEach((habit, habitIndex) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const date = month.date(day);
      if (date.isAfter(today, "day")) continue;

      const seed = habitIndex * 100 + day;
      const roll = seededRandom(seed);
      let status: DayCompletion["status"] = "pending";

      if (habit.name === "Gym" && day >= 22 && day <= 24) {
        status = "missed";
      } else if (roll > 0.82) {
        status = "missed";
      } else if (roll > 0.08) {
        status = "completed";
      }

      if (date.isSame(today, "day")) {
        status = roll > 0.5 ? "pending" : "completed";
      }

      completions.push({
        date: date.format("YYYY-MM-DD"),
        habitId: habit.id,
        status,
      });
    }
  });

  return completions;
}

export function createInitialHabits(): Habit[] {
  return habitSeeds.map((seed, index) => ({
    ...seed,
    id: `habit-${index + 1}`,
    createdAt: dayjs().subtract(30, "day").toISOString(),
  }));
}

export function createInitialCompletions(habits: Habit[]): DayCompletion[] {
  const month = dayjs().startOf("month");
  return generateCompletions(habits, month);
}

export const MOTIVATIONAL_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Small daily improvements lead to stunning long-term results.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Consistency beats intensity when building lasting habits.",
];

export const mockDailyNotes: DailyNote[] = Array.from({ length: 12 }).map(
  (_, i) => {
    const date = dayjs().subtract(i, "day");
    return {
      date: date.format("YYYY-MM-DD"),
      note:
        i === 0
          ? "Strong morning. Gym skipped — prioritize tomorrow."
          : "Steady progress across core habits.",
      progress: 65 + (i % 4) * 7,
    };
  }
);

export const mockChatThreads: ChatThread[] = [
  {
    id: "thread-1",
    title: "Weekly discipline review",
    updatedAt: dayjs().subtract(1, "hour").toISOString(),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How did I perform this week?",
        timestamp: dayjs().subtract(2, "hour").toISOString(),
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "You completed Reading every day this week. Your discipline score increased by 7%. Gym was missed for 3 consecutive days — consider scheduling a lighter recovery session to rebuild momentum.",
        timestamp: dayjs().subtract(1, "hour").toISOString(),
      },
    ],
  },
  {
    id: "thread-2",
    title: "Today's priorities",
    updatedAt: dayjs().subtract(1, "day").toISOString(),
    messages: [
      {
        id: "m3",
        role: "user",
        content: "What should I focus on today?",
        timestamp: dayjs().subtract(1, "day").toISOString(),
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Today's priority should be Coding. You have pending deep work and an open streak on Wake Up Early. Protect a 90-minute block before noon.",
        timestamp: dayjs().subtract(1, "day").add(5, "minute").toISOString(),
      },
    ],
  },
];

export const suggestedPrompts = [
  "Summarize my week",
  "What habits need attention?",
  "Plan tomorrow's routine",
  "Why did my streak break?",
];

export const analyticsWeeklyData = [
  { day: "Mon", completed: 8, missed: 2 },
  { day: "Tue", completed: 9, missed: 1 },
  { day: "Wed", completed: 7, missed: 3 },
  { day: "Thu", completed: 9, missed: 1 },
  { day: "Fri", completed: 8, missed: 2 },
  { day: "Sat", completed: 6, missed: 4 },
  { day: "Sun", completed: 7, missed: 3 },
];

export const analyticsMonthlyTrend = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  rate: 55 + Math.round(Math.sin(i / 4) * 15 + (i % 5) * 2),
}));

export const habitDistribution = [
  { name: "Fitness", value: 18 },
  { name: "Health", value: 22 },
  { name: "Work", value: 15 },
  { name: "Personal Growth", value: 12 },
  { name: "Sleep", value: 10 },
  { name: "Other", value: 23 },
];

export const upcomingTasks = [
  { id: "t1", title: "Review monthly tracker", time: "Today, 6:00 PM" },
  { id: "t2", title: "Plan next week habits", time: "Tomorrow, 9:00 AM" },
  { id: "t3", title: "Export analytics snapshot", time: "Sunday" },
];
