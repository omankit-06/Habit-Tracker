"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs from "dayjs";
import {
  createInitialCompletions,
  createInitialHabits,
} from "@/lib/mock-data";
import type {
  DayCompletion,
  Habit,
  HabitStatus,
} from "@/types/habit";

const STORAGE_KEY = "ascend-habits-v1";

interface HabitsState {
  habits: Habit[];
  completions: DayCompletion[];
}

interface HabitsContextValue extends HabitsState {
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void;
  toggleToday: (habitId: string) => void;
  setCellStatus: (habitId: string, date: string, status: HabitStatus) => void;
  getStatus: (habitId: string, date: string) => HabitStatus;
  todayProgress: number;
  currentStreak: number;
}

const HabitsContext = createContext<HabitsContextValue | null>(null);

function loadState(): HabitsState {
  if (typeof window === "undefined") {
    const habits = createInitialHabits();
    return { habits, completions: createInitialCompletions(habits) };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as HabitsState;
    } catch {
      /* fall through */
    }
  }
  const habits = createInitialHabits();
  return { habits, completions: createInitialCompletions(habits) };
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HabitsState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const today = dayjs().format("YYYY-MM-DD");

  const getStatus = useCallback(
    (habitId: string, date: string): HabitStatus => {
      const entry = state.completions.find(
        (c) => c.habitId === habitId && c.date === date
      );
      return entry?.status ?? "pending";
    },
    [state.completions]
  );

  const setCellStatus = useCallback(
    (habitId: string, date: string, status: HabitStatus) => {
      setState((prev) => {
        const idx = prev.completions.findIndex(
          (c) => c.habitId === habitId && c.date === date
        );
        const completions = [...prev.completions];
        if (idx >= 0) {
          completions[idx] = { ...completions[idx], status };
        } else {
          completions.push({ habitId, date, status });
        }
        return { ...prev, completions };
      });
    },
    []
  );

  const toggleToday = useCallback(
    (habitId: string) => {
      const current = getStatus(habitId, today);
      const next: HabitStatus =
        current === "completed" ? "pending" : "completed";
      setCellStatus(habitId, today, next);
    },
    [getStatus, setCellStatus, today]
  );

  const addHabit = useCallback((habit: Omit<Habit, "id" | "createdAt">) => {
    setState((prev) => {
      const id = `habit-${Date.now()}`;
      const newHabit: Habit = {
        ...habit,
        id,
        createdAt: new Date().toISOString(),
      };
      return { habits: [...prev.habits, newHabit], completions: prev.completions };
    });
  }, []);

  const todayProgress = useMemo(() => {
    const total = state.habits.length;
    if (!total) return 0;
    const done = state.habits.filter(
      (h) => getStatus(h.id, today) === "completed"
    ).length;
    return Math.round((done / total) * 100);
  }, [state.habits, getStatus, today]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      const dayComplete = state.habits.every(
        (h) => getStatus(h.id, date) === "completed"
      );
      if (dayComplete && state.habits.length > 0) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [state.habits, getStatus]);

  const value = useMemo(
    () => ({
      ...state,
      addHabit,
      toggleToday,
      setCellStatus,
      getStatus,
      todayProgress,
      currentStreak,
    }),
    [
      state,
      addHabit,
      toggleToday,
      setCellStatus,
      getStatus,
      todayProgress,
      currentStreak,
    ]
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
