'use client';

import React, { useState } from 'react';
import { Database } from '@/types/database';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { Button } from '@/components/ui/button';
import { 
  Undo2, Redo2, Save, Search, Sparkles, Plus, 
  Loader2, Wand2, CheckSquare
} from 'lucide-react';

interface ExcelToolbarProps {
  database: Database;
  onOpenAddColumn: () => void;
}

export function ExcelToolbar({ database, onOpenAddColumn }: ExcelToolbarProps) {
  const { 
    addRow, 
    addColumn,
    searchQuery, 
    setSearchQuery, 
    setAiDrawerOpen,
    undo,
    redo,
    past,
    future,
    autoStructureColumns
  } = useDatabaseStore();

  const [isAutoStructuring, setIsAutoStructuring] = useState(false);

  const handleExportCSV = () => {
    const headers = database.columns.map((c) => c.name).join(',');
    const rows = database.rows.map((r) => {
      return database.columns.map((c) => {
        const val = r.values[c.id];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${database.name.toLowerCase().replace(/\s+/g, '_')}_excel.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAutoStructure = async () => {
    setIsAutoStructuring(true);
    try {
      const response = await fetch('/api/ai/schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columns: database.columns,
          rows: database.rows,
        }),
      });
      
      const data = await response.json();
      if (data.success && data.columns) {
        autoStructureColumns(database.id, data.columns);
      }
    } catch (error) {
      console.error('Failed to auto structure:', error);
    } finally {
      setIsAutoStructuring(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs overflow-x-auto scrollbar-none shrink-0">
      {/* Ribbon Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* History: Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={past.length === 0}
            className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={future.length === 0}
            className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleExportCSV}
            className="h-7 w-7 text-zinc-400 hover:text-white"
            title="Save / Export CSV"
          >
            <Save className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-28 sm:w-44">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 h-7 text-[11px] rounded-md bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Right Controls: AI & Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* AI Auto-Structure Button */}
        <Button
          onClick={handleAutoStructure}
          disabled={isAutoStructuring}
          size="sm"
          className="h-7 px-2.5 gap-1.5 text-[11px] font-bold rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:opacity-90 transition-opacity"
        >
          {isAutoStructuring ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 fill-current" />
          )}
          <span className="hidden sm:inline">AI Auto-Structure</span>
        </Button>

        {/* ✨ AI Assistant */}
        <Button
          onClick={() => setAiDrawerOpen(true)}
          size="sm"
          className="h-7 px-2.5 gap-1.5 text-[11px] font-bold rounded-md bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hover:opacity-90"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">✨ AI Copilot</span>
        </Button>

        {/* Add Row & Column */}
        <Button
          onClick={() => addRow(database.id)}
          size="sm"
          className="h-7 px-2 gap-1 text-[11px] font-bold rounded-md bg-zinc-800 hover:bg-zinc-700 text-white shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> <span className="hidden sm:inline">+ Row</span>
        </Button>

        <Button
          onClick={() => addColumn(database.id, { name: 'Completed', type: 'checkbox', width: 110 })}
          size="sm"
          className="h-7 px-2.5 gap-1 text-[11px] font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
          title="Add Checkbox Column"
        >
          <CheckSquare className="w-3.5 h-3.5" /> <span className="hidden sm:inline">+ Checkbox</span>
        </Button>

        <Button
          onClick={onOpenAddColumn}
          variant="outline"
          size="sm"
          className="h-7 px-2 gap-1 text-[11px] font-semibold rounded-md border-zinc-800 text-zinc-300 hover:bg-zinc-800"
        >
          <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">+ Col</span>
        </Button>
      </div>
    </div>
  );
}
