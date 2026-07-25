'use client';

import React from 'react';
import { Sheet } from '@/types/database';
import { Plus, Table2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSelectSheet: (id: string) => void;
  onAddSheet: () => void;
}

export function SheetTabs({ sheets, activeSheetId, onSelectSheet, onAddSheet }: SheetTabsProps) {
  const defaultSheets: Sheet[] = sheets && sheets.length > 0 ? sheets : [
    { id: 'sheet_1', name: 'Sheet 1', columns: [], rows: [] },
    { id: 'sheet_habits', name: 'Monthly Habits', columns: [], rows: [] },
    { id: 'sheet_summary', name: 'Summary', columns: [], rows: [] },
  ];

  return (
    <div className="flex items-center justify-between px-3 bg-muted/40 border-t border-border/80 text-xs select-none h-9">
      {/* Left: Sheet Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
        {defaultSheets.map((s) => {
          const isActive = s.id === activeSheetId || (activeSheetId === '' && s.id === 'sheet_1');
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSheet(s.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded-t-lg font-medium text-xs border-t border-x transition-all shrink-0 ${
                isActive
                  ? 'bg-background text-emerald-600 dark:text-emerald-400 border-border font-bold shadow-xs'
                  : 'bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>{s.name}</span>
            </button>
          );
        })}

        <Button
          variant="ghost"
          size="icon"
          onClick={onAddSheet}
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 shrink-0"
          title="Add Sheet"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Right: Quick Status */}
      <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-emerald-500" /> Excel Engine Ready
        </span>
      </div>
    </div>
  );
}
