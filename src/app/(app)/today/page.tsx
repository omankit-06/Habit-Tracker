'use client';

import React from 'react';
import dayjs from 'dayjs';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { PageTransition } from '@/components/layout/page-transition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CellRenderer } from '@/components/spreadsheet/cell-renderers';
import { CheckSquare, Plus } from 'lucide-react';

export default function TodayPage() {
  const { databases, setCreateModalOpen, toggleCheckboxCell } = useDatabaseStore();

  if (databases.length === 0) {
    return (
      <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
          <CheckSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">No Operating System Setup</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create your custom tracking database to populate your daily execution list.
        </p>
        <Button onClick={() => setCreateModalOpen(true)} className="font-semibold gap-1.5">
          <Plus className="w-4 h-4" /> Create Database
        </Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Today&apos;s Protocol</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dayjs().format('dddd, MMMM D, YYYY')} — Synced across all active databases.
        </p>
      </div>

      {/* Routine Cards per Database */}
      <div className="space-y-6">
        {databases.map((db) => {
          const firstCol = db.columns[0];
          const checkboxCol = db.columns.find((c) => c.type === 'checkbox') || db.columns[1];

          return (
            <div key={db.id} className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: db.color || '#3b82f6' }}
                  />
                  <h3 className="text-lg font-bold text-foreground">{db.name}</h3>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {db.rows.length} Tasks
                </Badge>
              </div>

              <div className="divide-y divide-border/50 border-t border-border/40">
                {db.rows.map((row) => {
                  const taskTitle = String(row.values[firstCol?.id] || 'Untitled Item');
                  const isChecked = Boolean(row.values[checkboxCol?.id]);

                  return (
                    <div 
                      key={row.id} 
                      className="flex items-center justify-between py-3 hover:bg-muted/30 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {checkboxCol ? (
                          <div className="w-6 h-6">
                            <CellRenderer databaseId={db.id} column={checkboxCol} row={row} />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleCheckboxCell(db.id, row.id, firstCol.id)}
                            className="w-5 h-5 rounded border border-border flex items-center justify-center"
                          />
                        )}
                        <span className={`text-sm font-medium ${isChecked ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>
                          {taskTitle}
                        </span>
                      </div>

                      {/* Display secondary info if exists */}
                      {db.columns[2] && (
                        <div className="text-xs text-muted-foreground">
                          {String(row.values[db.columns[2].id] || '')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
