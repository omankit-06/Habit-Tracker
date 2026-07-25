"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import { AnimatedCheckbox } from "@/components/habit/animated-checkbox";
import { useHabits } from "@/hooks/use-habits";
import { cn } from "@/lib/utils";
import type { HabitStatus } from "@/types/habit";

export function MonthlyHabitGrid() {
  const { habits, getStatus, setCellStatus } = useHabits();
  const month = dayjs().startOf("month");
  const daysInMonth = month.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = dayjs();

  const cycleStatus = (current: HabitStatus): HabitStatus => {
    if (current === "pending") return "completed";
    if (current === "completed") return "missed";
    return "pending";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="sticky left-0 z-20 min-w-[180px] border-r border-border bg-background px-4 py-3 text-left font-medium">
                Habit
              </th>
              {days.map((day) => {
                const date = month.date(day);
                const isToday = date.isSame(today, "day");
                return (
                  <th
                    key={day}
                    className={cn(
                      "min-w-[40px] px-1 py-3 text-center font-medium text-muted",
                      isToday && "bg-accent/5 text-foreground"
                    )}
                  >
                    {day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, rowIndex) => (
              <motion.tr
                key={habit.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.03 }}
                className="border-b border-border last:border-0"
              >
                <td className="sticky left-0 z-10 border-r border-border bg-surface px-4 py-3 font-medium">
                  {habit.name}
                </td>
                {days.map((day) => {
                  const dateStr = month.date(day).format("YYYY-MM-DD");
                  const status = getStatus(habit.id, dateStr);
                  const isFuture = month.date(day).isAfter(today, "day");
                  return (
                    <td
                      key={dateStr}
                      className={cn(
                        "px-1 py-2 text-center",
                        month.date(day).isSame(today, "day") && "bg-accent/[0.03]"
                      )}
                    >
                      {!isFuture ? (
                        <div className="flex justify-center">
                          <AnimatedCheckbox
                            size="sm"
                            status={status}
                            onClick={() =>
                              setCellStatus(habit.id, dateStr, cycleStatus(status))
                            }
                          />
                        </div>
                      ) : (
                        <span className="inline-block h-4 w-4 rounded-md bg-border/40" />
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
