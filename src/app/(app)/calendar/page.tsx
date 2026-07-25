"use client";

import { HabitCalendar } from "@/components/calendar/habit-calendar";
import { PageTransition } from "@/components/layout/page-transition";

export default function CalendarPage() {
  return (
    <PageTransition className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
        <p className="mt-1 text-muted">
          Select any day to review completed habits, misses, notes, and progress.
        </p>
      </div>
      <HabitCalendar />
    </PageTransition>
  );
}
