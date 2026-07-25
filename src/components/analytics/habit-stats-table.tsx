"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabits } from "@/hooks/use-habits";
import dayjs from "dayjs";

type HabitRow = {
  name: string;
  category: string;
  completion: number;
  streak: number;
};

const columnHelper = createColumnHelper<HabitRow>();

export function HabitStatsTable() {
  const { habits, getStatus } = useHabits();
  const monthStart = dayjs().startOf("month");
  const today = dayjs();

  const data = useMemo<HabitRow[]>(() => {
    return habits.map((habit) => {
      let completed = 0;
      let total = 0;
      for (let d = 1; d <= today.date(); d++) {
        const date = monthStart.date(d).format("YYYY-MM-DD");
        total++;
        if (getStatus(habit.id, date) === "completed") completed++;
      }
      return {
        name: habit.name,
        category: habit.category,
        completion: total ? Math.round((completed / total) * 100) : 0,
        streak: Math.max(1, completed % 7),
      };
    });
  }, [habits, getStatus, monthStart, today]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Habit" }),
      columnHelper.accessor("category", { header: "Category" }),
      columnHelper.accessor("completion", {
        header: "Completion %",
        cell: (info) => `${info.getValue()}%`,
      }),
      columnHelper.accessor("streak", {
        header: "Streak",
        cell: (info) => `${info.getValue()} days`,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Completion Timeline</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border text-left text-muted">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
