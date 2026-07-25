"use client";

import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useHabits } from "@/hooks/use-habits";
import { mockDailyNotes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function HabitCalendar() {
  const { habits, getStatus } = useHabits();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const month = dayjs().startOf("month");
  const startPad = month.day();
  const daysInMonth = month.daysInMonth();
  const cells = Array.from({ length: startPad + daysInMonth }, (_, i) =>
    i < startPad ? null : i - startPad + 1
  );

  const panelData = useMemo(() => {
    if (!selectedDate) return null;
    const completed = habits.filter(
      (h) => getStatus(h.id, selectedDate) === "completed"
    );
    const missed = habits.filter(
      (h) => getStatus(h.id, selectedDate) === "missed"
    );
    const note =
      mockDailyNotes.find((n) => n.date === selectedDate)?.note ??
      "No notes for this day.";
    const progress =
      mockDailyNotes.find((n) => n.date === selectedDate)?.progress ?? 0;
    return { completed, missed, note, progress };
  }, [selectedDate, habits, getStatus]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{month.format("MMMM YYYY")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cells.map((day, idx) =>
              day === null ? (
                <div key={`pad-${idx}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() =>
                    setSelectedDate(month.date(day).format("YYYY-MM-DD"))
                  }
                  className={cn(
                    "aspect-square rounded-lg border border-border bg-surface p-2 text-sm transition-colors hover:bg-background",
                    month.date(day).isSame(dayjs(), "day") && "border-accent"
                  )}
                >
                  <div className="font-medium">{day}</div>
                  <div className="mt-2 flex justify-center gap-0.5">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className={cn(
                          "h-1 w-1 rounded-full",
                          dot === 0 ? "bg-success" : dot === 1 ? "bg-danger" : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                </button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {selectedDate ? dayjs(selectedDate).format("MMMM D, YYYY") : "Day"}
            </SheetTitle>
          </SheetHeader>
          {panelData && (
            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium">Daily Progress</p>
                <div className="h-2 rounded-full bg-border">
                  <div
                    className="h-2 rounded-full bg-success transition-all"
                    style={{ width: `${panelData.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{panelData.progress}% complete</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Completed Habits</p>
                <div className="flex flex-wrap gap-2">
                  {panelData.completed.map((h) => (
                    <Badge key={h.id} variant="success">
                      {h.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Missed Habits</p>
                <div className="flex flex-wrap gap-2">
                  {panelData.missed.length ? (
                    panelData.missed.map((h) => (
                      <Badge key={h.id} variant="danger">
                        {h.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted">None</span>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Notes</p>
                <p className="text-sm text-muted">{panelData.note}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
