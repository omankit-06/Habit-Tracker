'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Database, Column, ActiveCell, CellStyle } from '@/types/database';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { CellRenderer } from './cell-renderers';
import { FormulaBar } from './FormulaBar';
import { ExcelToolbar } from './ExcelToolbar';
import { SheetTabs } from './SheetTabs';
import { StatusBar } from './StatusBar';
import { AddColumnModal } from './add-column-modal';
import { TrackingAnalytics } from '@/components/analytics/TrackingAnalytics';
import { Plus, Trash2, MoreHorizontal, Type, CheckSquare, Hash, Calendar, Clock, ChevronDown, ListFilter, Activity, Sliders, Tag, Star, Palette, Link, FileText, Mail, Phone, PieChart, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

// Convert column index to Excel column letters (0 -> A, 1 -> B, 25 -> Z, 26 -> AA)
function getExcelColumnLetter(index: number): string {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

interface SpreadsheetViewProps {
  database: Database;
}

export function SpreadsheetView({ database }: SpreadsheetViewProps) {
  const { 
    addRow, 
    deleteRow, 
    deleteColumn, 
    addColumn,
    updateColumn,
    updateCell, 
    searchQuery,
    updateDatabase,
  } = useDatabaseStore();

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [activeCell, setActiveCell] = useState<ActiveCell | null>({
    rowIndex: 0,
    colIndex: 0,
    rowId: database.rows[0]?.id || '',
    columnId: database.columns[0]?.id || '',
  });
  const [activeSheetId, setActiveSheetId] = useState<string>(database.activeSheetId || 'sheet_1');
  const [zoom, setZoom] = useState<number>(100);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter rows based on search query
  const filteredRows = database.rows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row.values).some((val) => 
      String(val || '').toLowerCase().includes(query)
    );
  });

  const activeRow = filteredRows[activeCell?.rowIndex ?? 0];
  const activeCol = database.columns[activeCell?.colIndex ?? 0];
  const currentCellValue = activeRow && activeCol ? String(activeRow.values[activeCol.id] ?? '') : '';
  const cellRefName = activeCell ? `${getExcelColumnLetter(activeCell.colIndex)}${activeCell.rowIndex + 1}` : 'A1';

  // Handle Arrow Key Keyboard Navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!activeCell) return;
    const maxRow = filteredRows.length - 1;
    const maxCol = database.columns.length - 1;

    let { rowIndex, colIndex } = activeCell;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      rowIndex = Math.max(0, rowIndex - 1);
    } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      rowIndex = Math.min(maxRow, rowIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      colIndex = Math.max(0, colIndex - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
      e.preventDefault();
      colIndex = Math.min(maxCol, colIndex + 1);
    } else return;

    const targetRow = filteredRows[rowIndex];
    const targetCol = database.columns[colIndex];
    if (targetRow && targetCol) {
      setActiveCell({
        rowIndex,
        colIndex,
        rowId: targetRow.id,
        columnId: targetCol.id,
      });
    }
  }, [activeCell, filteredRows, database.columns]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [handleKeyDown]);

  // Column Resizing logic
  const handleResizeStart = (e: React.MouseEvent, col: Column) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialWidth = columnWidths[col.id] || col.width || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(80, initialWidth + delta);
      setColumnWidths((prev) => ({ ...prev, [col.id]: newWidth }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleCellFormulaChange = (newVal: string) => {
    if (!activeCell || !activeRow || !activeCol) return;
    updateCell(database.id, activeRow.id, activeCol.id, newVal);
  };

  const handleAddSheet = () => {
    const sheets = database.sheets || [
      { id: 'sheet_1', name: 'Sheet 1', columns: database.columns, rows: database.rows }
    ];
    const newSheet = {
      id: `sheet_${Date.now()}`,
      name: `Sheet ${sheets.length + 1}`,
      columns: database.columns,
      rows: database.rows,
    };
    updateDatabase(database.id, { sheets: [...sheets, newSheet], activeSheetId: newSheet.id });
    setActiveSheetId(newSheet.id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] w-full overflow-hidden bg-background select-none">
      {/* 1. Ribbon Excel Toolbar */}
      <ExcelToolbar
        database={database}
        onOpenAddColumn={() => setIsAddColumnOpen(true)}
      />

      {/* 2. Excel Formula Bar */}
      <FormulaBar
        activeCell={activeCell}
        cellRefName={cellRefName}
        cellValue={currentCellValue}
        onValueChange={handleCellFormulaChange}
      />

      {/* 3. Excel Spreadsheet Main Table Container */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full overflow-auto bg-background selection:bg-emerald-500/20"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
      >
        <table className="w-full border-collapse text-left select-none min-w-max border-spacing-0">
          <thead>
            <tr className="border-b border-border bg-zinc-100 dark:bg-zinc-900 sticky top-0 z-20 shadow-xs">
              {/* Row Index Select-All Header Cell */}
              <th className="w-12 min-w-12 text-center text-[10px] font-bold text-muted-foreground uppercase py-2 px-1 border-r border-border bg-zinc-200 dark:bg-zinc-800 sticky left-0 z-30">
                <div className="w-2.5 h-2.5 mx-auto bg-muted-foreground/40 rounded-xs" />
              </th>

              {/* Excel Column Headers (A, B, C...) + Custom Column Names */}
              {database.columns.map((col, index) => {
                const IconComp = COLUMN_ICON_MAP[col.type] || Type;
                const width = columnWidths[col.id] || col.width || 150;
                const letter = getExcelColumnLetter(index);
                const isColumnActive = activeCell?.colIndex === index;

                return (
                  <th
                    key={col.id}
                    style={{ width: `${width}px`, minWidth: `${width}px` }}
                    className={`group relative text-xs font-semibold py-1.5 px-2.5 border-r border-border bg-zinc-100 dark:bg-zinc-900 transition-colors ${
                      isColumnActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      {/* Excel Letter Code (A, B, C...) */}
                      <span className="text-[10px] font-bold font-mono uppercase text-muted-foreground/80 tracking-wider">
                        {letter}
                      </span>
                      
                      <div className="flex items-center justify-between w-full gap-1">
                        <div 
                          className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
                          onDoubleClick={() => {
                            setEditingColId(col.id);
                            setEditingColName(col.name);
                          }}
                          title="Double-click to rename column"
                        >
                          <IconComp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          {editingColId === col.id ? (
                            <input
                              type="text"
                              value={editingColName}
                              onChange={(e) => setEditingColName(e.target.value)}
                              onBlur={() => {
                                if (editingColName.trim()) {
                                  updateColumn(database.id, col.id, { name: editingColName.trim() });
                                }
                                setEditingColId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (editingColName.trim()) {
                                    updateColumn(database.id, col.id, { name: editingColName.trim() });
                                  }
                                  setEditingColId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingColId(null);
                                }
                              }}
                              autoFocus
                              className="w-full bg-background border border-emerald-500 rounded px-1 text-xs focus:outline-none"
                            />
                          ) : (
                            <span className="truncate text-xs font-semibold hover:underline decoration-dashed decoration-muted-foreground">
                              {col.name}
                            </span>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-background/80 text-muted-foreground">
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuItem 
                              onClick={() => {
                                setEditingColId(col.id);
                                setEditingColName(col.name);
                              }}
                              className="gap-2 text-xs"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Rename Column
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />

                            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                              Column Type
                            </div>

                            <DropdownMenuItem 
                              onClick={() => updateColumn(database.id, col.id, { 
                                type: 'checkbox', 
                                name: col.name.startsWith('Column') ? 'Completed' : col.name 
                              })}
                              className={`gap-2 text-xs ${col.type === 'checkbox' ? 'font-bold text-emerald-500' : ''}`}
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Checkbox (Done/Undone)
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => updateColumn(database.id, col.id, { type: 'text' })}
                              className={`gap-2 text-xs ${col.type === 'text' ? 'font-bold' : ''}`}
                            >
                              <Type className="w-3.5 h-3.5" /> Text
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => updateColumn(database.id, col.id, { type: 'status' })}
                              className={`gap-2 text-xs ${col.type === 'status' ? 'font-bold text-blue-500' : ''}`}
                            >
                              <Activity className="w-3.5 h-3.5 text-blue-500" /> Status Pill
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => updateColumn(database.id, col.id, { type: 'rating' })}
                              className={`gap-2 text-xs ${col.type === 'rating' ? 'font-bold text-amber-500' : ''}`}
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500" /> Star Rating
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem 
                              onClick={() => deleteColumn(database.id, col.id)}
                              className="gap-2 text-xs text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Column
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Resizer Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, col)}
                      className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-emerald-500 group-hover:bg-border/60 transition-colors"
                    />
                  </th>
                );
              })}

              {/* Add Column Button Header */}
              <th className="w-48 min-w-48 py-2 px-3 bg-zinc-100 dark:bg-zinc-900 text-left border-r border-border">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextLetter = getExcelColumnLetter(database.columns.length);
                      addColumn(database.id, {
                        name: `Column ${nextLetter}`,
                        type: 'text',
                        width: 150
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    title="Add Text Column"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Column
                  </button>

                  <span className="text-border">|</span>

                  <button
                    type="button"
                    onClick={() => {
                      addColumn(database.id, {
                        name: 'Completed',
                        type: 'checkbox',
                        width: 110
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                    title="Add Checkbox Column"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> + Checkbox
                  </button>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rIdx) => {
                const isRowActive = activeCell?.rowIndex === rIdx;

                return (
                  <tr key={row.id} className="group hover:bg-muted/20 transition-colors h-9">
                    {/* Excel Row Index Number (1, 2, 3...) */}
                    <td className={`w-12 min-w-12 text-center text-xs font-mono font-semibold border-r border-b border-border sticky left-0 z-10 ${
                      isRowActive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-zinc-100 dark:bg-zinc-900 text-muted-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800'
                    }`}>
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
                    {database.columns.map((col, cIdx) => {
                      const width = columnWidths[col.id] || col.width || 150;
                      const isSelected = activeCell?.rowIndex === rIdx && activeCell?.colIndex === cIdx;

                      return (
                        <td
                          key={col.id}
                          onClick={() => setActiveCell({ rowIndex: rIdx, colIndex: cIdx, rowId: row.id, columnId: col.id })}
                          style={{ width: `${width}px`, minWidth: `${width}px` }}
                          className={`relative h-9 border-r border-b border-border p-0 text-xs transition-all ${
                            isSelected 
                              ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-500/10 z-10' 
                              : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <CellRenderer databaseId={database.id} column={col} row={row} />

                          {/* Excel Fill Handle Dot */}
                          {isSelected && (
                            <div className="absolute right-[-3px] bottom-[-3px] w-2 h-2 bg-emerald-600 border border-white dark:border-zinc-900 rounded-2xs cursor-crosshair z-20" />
                          )}
                        </td>
                      );
                    })}

                    <td className="w-32 min-w-32 bg-transparent" />
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={database.columns.length + 2} className="py-12 text-center text-muted-foreground text-xs">
                  No matching rows found. Click below to add a new row.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bottom "+ Add Row" Button */}
        <div className="p-2.5 border-t border-border/60 bg-muted/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => addRow(database.id)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Row
          </button>

          <span className="text-[11px] font-mono font-medium text-muted-foreground">
            Total Rows: {database.rows.length}
          </span>
        </div>
      </div>

      {/* 4. Bottom Sheet Tabs */}
      <SheetTabs
        sheets={database.sheets || [{ id: 'sheet_1', name: 'Sheet 1', columns: database.columns, rows: database.rows }]}
        activeSheetId={activeSheetId}
        onSelectSheet={setActiveSheetId}
        onAddSheet={handleAddSheet}
      />

      {/* 5. Bottom Excel Status Bar */}
      <StatusBar
        activeCell={activeCell}
        totalRows={database.rows.length}
        totalCols={database.columns.length}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* 6. Analytics Bottom Panel */}
      <div className="flex-shrink-0 border-t border-border/80">
        <TrackingAnalytics database={database} />
      </div>

      {/* Add Column Modal */}
      <AddColumnModal
        databaseId={database.id}
        open={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
      />
    </div>
  );
}
