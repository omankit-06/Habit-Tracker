'use client';

import React from 'react';
import { ActiveCell } from '@/types/database';
import { ZoomIn, ZoomOut, Calculator } from 'lucide-react';

interface StatusBarProps {
  activeCell: ActiveCell | null;
  totalRows: number;
  totalCols: number;
  zoom: number;
  onZoomChange: (val: number) => void;
}

export function StatusBar({ activeCell, totalRows, totalCols, zoom, onZoomChange }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1 bg-card border-t border-border/80 text-[11px] text-muted-foreground select-none h-7">
      {/* Left: Mode Status */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">READY</span>
        <span>Rows: {totalRows}</span>
        <span>Cols: {totalCols}</span>
      </div>

      {/* Center: Selected Stats Placeholder */}
      <div className="hidden lg:flex items-center gap-4 font-mono font-medium">
        <span className="flex items-center gap-1">
          <Calculator className="w-3 h-3 text-muted-foreground" /> COUNT: {activeCell ? 1 : 0}
        </span>
        <span>SUM: 0</span>
        <span>AVERAGE: 0</span>
      </div>

      {/* Right: Zoom Controller */}
      <div className="flex items-center gap-2">
        <button 
          type="button" 
          onClick={() => onZoomChange(Math.max(50, zoom - 10))}
          className="hover:text-foreground p-0.5 rounded"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="w-9 text-center font-semibold font-mono">{zoom}%</span>
        <button 
          type="button" 
          onClick={() => onZoomChange(Math.min(150, zoom + 10))}
          className="hover:text-foreground p-0.5 rounded"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
