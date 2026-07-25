'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageTransition } from '@/components/layout/page-transition';
import { 
  Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, 
  Plus 
} from 'lucide-react';

export default function MonthPage() {
  const { databases, activeDatabaseId, setActiveDatabase, toggleCheckboxCell, setCreateModalOpen } = useDatabaseStore();
  const [currentDate, setCurrentDate] = useState(dayjs());

  const activeDatabase = databases.find((db) => db.id === activeDatabaseId) || databases[0];

  const daysInMonth = currentDate.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (databases.length === 0 || !activeDatabase) {
    return (
      <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
          <CalendarIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">No Active Spreadsheet</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create a database to automatically generate a 31-day habit tracking matrix from your rows.
        </p>
        <Button onClick={() => setCreateModalOpen(true)} className="font-semibold gap-1.5">
          <Plus className="w-4 h-4" /> Create Database
        </Button>
      </PageTransition>
    );
  }

  // Extract first column (task title) and checkbox columns from active database
  const firstCol = activeDatabase.columns[0];
  const checkboxCol = activeDatabase.columns.find((c) => c.type === 'checkbox') || activeDatabase.columns[1];

  return (
    <PageTransition className="mx-auto max-w-[1600px] space-y-6">
      {/* Header & Database Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Auto-Generated Tracker</span>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              Synced with {activeDatabase.name}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Monthly Tracker — {currentDate.format('MMMM YYYY')}
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Database Switcher */}
          <select
            value={activeDatabase.id}
            onChange={(e) => setActiveDatabase(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-lg bg-card border border-border/80 text-foreground focus:outline-none"
          >
            {databases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.name} ({db.rows.length} rows)
              </option>
            ))}
          </select>

          <div className="flex items-center border border-border/80 rounded-lg overflow-hidden bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none text-muted-foreground"
              onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-xs font-bold text-foreground">
              {currentDate.format('MMM YYYY')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none text-muted-foreground"
              onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic 31-Day Matrix Grid */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
        <table className="w-full border-collapse text-left select-none min-w-max">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="py-3 px-4 text-xs font-bold text-foreground w-64 min-w-64 sticky left-0 z-20 bg-muted/60 border-r border-border/60">
                Task / Routine Row ({activeDatabase.rows.length})
              </th>

              {daysArray.map((day) => {
                const dateObj = currentDate.date(day);
                const isToday = dayjs().isSame(dateObj, 'day');
                const isWeekend = dateObj.day() === 0 || dateObj.day() === 6;

                return (
                  <th
                    key={day}
                    className={`py-2.5 px-1.5 text-center text-[10px] font-bold w-10 min-w-10 border-r border-border/40 ${
                      isToday ? 'bg-primary/10 text-primary font-black' : isWeekend ? 'bg-muted/30 text-muted-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <div>{dateObj.format('dd')[0]}</div>
                    <div className="text-xs font-extrabold mt-0.5">{day}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {activeDatabase.rows.map((row) => {
              const taskTitle = String(row.values[firstCol?.id] || 'Untitled Task');
              
              return (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                  {/* Sticky Task Name Column */}
                  <td className="py-3 px-4 text-xs font-semibold text-foreground w-64 min-w-64 sticky left-0 z-10 bg-card group-hover:bg-muted/20 border-r border-border/60 truncate">
                    {taskTitle}
                  </td>

                  {/* Day Checkboxes */}
                  {daysArray.map((day) => {
                    const dayKey = `day_${currentDate.format('YYYY_MM')}_${day}`;
                    const isChecked = Boolean(row.values[dayKey] ?? (day === dayjs().date() ? row.values[checkboxCol?.id] : false));

                    return (
                      <td key={day} className="p-1 text-center border-r border-border/40 w-10 min-w-10">
                        <button
                          type="button"
                          onClick={() => toggleCheckboxCell(activeDatabase.id, row.id, dayKey)}
                          className={`w-5 h-5 mx-auto rounded flex items-center justify-center transition-all duration-150 transform active:scale-90 ${
                            isChecked 
                              ? 'bg-emerald-500 text-white shadow-xs scale-105' 
                              : 'border border-zinc-300 dark:border-zinc-700 bg-background hover:border-zinc-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageTransition>
  );
}
