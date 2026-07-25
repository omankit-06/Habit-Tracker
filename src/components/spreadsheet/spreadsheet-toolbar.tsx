'use client';

import React from 'react';
import { Database } from '@/types/database';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Plus, SlidersHorizontal, ArrowUpDown, Sparkles, 
  Download, Upload, Settings as SettingsIcon, Trash2, Undo2, Redo2,
  Sun, Moon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface SpreadsheetToolbarProps {
  database: Database;
  onOpenAddColumn: () => void;
}

export function SpreadsheetToolbar({ database, onOpenAddColumn }: SpreadsheetToolbarProps) {
  const { 
    addRow, 
    searchQuery, 
    setSearchQuery, 
    setAiDrawerOpen,
    deleteDatabase,
    undo,
    redo,
    past,
    future
  } = useDatabaseStore();

  const { theme, setTheme } = useTheme();

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
    link.setAttribute('download', `${database.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-background/95 backdrop-blur-xs border-b border-border/80">
      {/* Left Group: Search & Views & History */}
      <div className="flex items-center gap-2 flex-1 min-w-[300px]">
        {/* Undo / Redo buttons */}
        <div className="flex items-center gap-0.5 mr-1 border-r border-border/60 pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={past.length === 0}
            className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={future.length === 0}
            className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks, rows, values..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-xs rounded-lg bg-muted/30 focus:bg-background border-border/60"
          />
        </div>

        <Button variant="outline" size="sm" className="h-8 px-2.5 gap-1.5 text-xs rounded-lg text-muted-foreground border-border/60">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filter</span>
        </Button>

        <Button variant="outline" size="sm" className="h-8 px-2.5 gap-1.5 text-xs rounded-lg text-muted-foreground border-border/60">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sort</span>
        </Button>
      </div>

      {/* Right Group: Action Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-8 w-8 rounded-lg border-border/70 text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>

        {/* ✨ AI Assistant Button */}
        <Button
          onClick={() => setAiDrawerOpen(true)}
          size="sm"
          className="h-8 px-3 gap-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xs hover:opacity-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>✨ AI Assistant</span>
        </Button>

        {/* New Row Button */}
        <Button
          onClick={() => addRow(database.id)}
          size="sm"
          className="h-8 px-3 gap-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:opacity-90 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Row</span>
        </Button>

        {/* Add Column Button */}
        <Button
          onClick={onOpenAddColumn}
          variant="outline"
          size="sm"
          className="h-8 px-3 gap-1.5 text-xs rounded-lg font-medium border-border/70"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Column</span>
        </Button>

        {/* Dropdown Options (Import/Export/Delete) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/70">
              <SettingsIcon className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={handleExportCSV} className="gap-2 text-xs">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Import CSV feature: Ready for upload')} className="gap-2 text-xs">
              <Upload className="w-3.5 h-3.5" /> Import Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteDatabase(database.id)} className="gap-2 text-xs text-rose-500">
              <Trash2 className="w-3.5 h-3.5" /> Delete Database
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
