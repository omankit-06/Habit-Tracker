'use client';

import React, { useState } from 'react';
import { Database, Column } from '@/types/database';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { CellRenderer } from './cell-renderers';
import { 
  Plus, Trash2, Type, CheckSquare, Hash, Calendar, Clock, 
  ChevronDown, ListFilter, Activity, Sliders, Tag, Star, Palette, 
  Link, FileText, Mail, Phone, MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const COLUMN_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  checkbox: CheckSquare,
  number: Hash,
  date: Calendar,
  time: Clock,
  select: ChevronDown,
  multi_select: ListFilter,
  status: Activity,
  progress: Sliders,
  tag: Tag,
  rating: Star,
  color: Palette,
  url: Link,
  notes: FileText,
  email: Mail,
  phone: Phone,
};

interface SpreadsheetTableProps {
  database: Database;
  onOpenAddColumn: () => void;
}

export function SpreadsheetTable({ database, onOpenAddColumn }: SpreadsheetTableProps) {
  const { 
    addRow, 
    deleteRow, 
    deleteColumn, 
    searchQuery 
  } = useDatabaseStore();

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Filter rows based on search query
  const filteredRows = database.rows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row.values).some((val) => 
      String(val || '').toLowerCase().includes(query)
    );
  });

  // Column Resizing logic
  const handleResizeStart = (e: React.MouseEvent, col: Column) => {
    e.preventDefault();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - e.clientX;
      const newWidth = Math.max(90, (columnWidths[col.id] || col.width || 160) + delta);
      setColumnWidths((prev) => ({ ...prev, [col.id]: newWidth }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative flex-1 w-full overflow-auto bg-background selection:bg-primary/20">
      <table className="w-full border-collapse text-left select-none min-w-max">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-border/80 bg-muted/40 sticky top-0 z-10 shadow-2xs">
            {/* Sticky Row Index Header */}
            <th className="w-12 min-w-12 text-center text-[10px] font-bold text-muted-foreground uppercase py-2.5 px-2 border-r border-border/60 bg-muted/60 sticky left-0 z-20">
              #
            </th>

            {/* Column Headers */}
            {database.columns.map((col, index) => {
              const IconComp = COLUMN_ICON_MAP[col.type] || Type;
              const width = columnWidths[col.id] || col.width || 160;
              const isFirstColumn = index === 0;

              return (
                <th
                  key={col.id}
                  style={{ width: `${width}px`, minWidth: `${width}px` }}
                  className={`group relative text-xs font-semibold text-foreground py-2 px-3 border-r border-border/60 bg-muted/40 transition-colors hover:bg-muted/70 ${
                    isFirstColumn ? 'sticky left-12 z-20 bg-muted/50 border-r-2 border-border/80' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconComp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{col.name}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-background/80 text-muted-foreground">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-36">
                        <DropdownMenuItem 
                          onClick={() => deleteColumn(database.id, col.id)}
                          className="gap-2 text-xs text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Column
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Resizer Handle */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, col)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/50 group-hover:bg-border/60 transition-colors"
                  />
                </th>
              );
            })}

            {/* Add Column Header Button */}
            <th className="w-32 min-w-32 py-2 px-3 bg-muted/20 text-left">
              <button
                type="button"
                onClick={onOpenAddColumn}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> + Column
              </button>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-border/60">
          {filteredRows.length > 0 ? (
            filteredRows.map((row, rIdx) => (
              <tr key={row.id} className="group hover:bg-muted/20 transition-colors h-10">
                {/* Sticky Row Index & Menu Cell */}
                <td className="w-12 min-w-12 text-center text-xs font-medium text-muted-foreground border-r border-border/60 bg-muted/10 group-hover:bg-muted/30 sticky left-0 z-10">
                  <div className="flex items-center justify-center">
                    <span className="group-hover:hidden">{rIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteRow(database.id, row.id)}
                      className="hidden group-hover:flex p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

                {/* Data Cells */}
                {database.columns.map((col, index) => {
                  const width = columnWidths[col.id] || col.width || 160;
                  const isFirstColumn = index === 0;

                  return (
                    <td
                      key={col.id}
                      style={{ width: `${width}px`, minWidth: `${width}px` }}
                      className={`h-10 border-r border-border/60 p-0 text-xs ${
                        isFirstColumn ? 'sticky left-12 z-10 bg-background group-hover:bg-muted/30 font-medium border-r-2 border-border/80' : ''
                      }`}
                    >
                      <CellRenderer databaseId={database.id} column={col} row={row} />
                    </td>
                  );
                })}

                <td className="w-32 min-w-32 bg-transparent" />
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={database.columns.length + 2} className="py-12 text-center text-muted-foreground text-xs">
                No matching rows found. Click below to add a new task row.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bottom "+ Add Row" Action Bar */}
      <div className="p-3 border-t border-border/60 bg-muted/10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => addRow(database.id)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Row
        </button>

        <span className="text-[11px] font-medium text-muted-foreground">
          Total Rows: {database.rows.length}
        </span>
      </div>
    </div>
  );
}
