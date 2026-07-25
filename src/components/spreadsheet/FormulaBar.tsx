'use client';

import React from 'react';
import { ActiveCell } from '@/types/database';
import { Input } from '@/components/ui/input';
import { FunctionSquare, Table } from 'lucide-react';

interface FormulaBarProps {
  activeCell: ActiveCell | null;
  cellRefName: string;
  cellValue: string;
  onValueChange: (val: string) => void;
}

export function FormulaBar({ activeCell, cellRefName, cellValue, onValueChange }: FormulaBarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-background border-b border-border/80 text-xs select-none">
      {/* Name Box (e.g. A1, B2) */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/40 border border-border/70 rounded-md font-mono font-bold text-foreground min-w-[70px] justify-center shadow-2xs">
        <Table className="w-3.5 h-3.5 text-muted-foreground" />
        <span>{activeCell ? cellRefName : 'A1'}</span>
      </div>

      {/* FX Symbol Separator */}
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted/30 border border-border/60 text-muted-foreground font-semibold italic">
        <FunctionSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Formula Bar Input */}
      <div className="flex-1 relative">
        <Input
          value={cellValue}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Enter text, number, or formula (=SUM, =AVERAGE...)"
          className="h-7 text-xs font-mono bg-background border-border/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-md"
        />
      </div>
    </div>
  );
}
