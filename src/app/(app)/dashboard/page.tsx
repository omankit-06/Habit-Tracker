'use client';

import React, { useState } from 'react';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { EmptyState } from '@/components/dashboard/empty-state';
import { DatabaseCard } from '@/components/dashboard/database-card';
import { SpreadsheetView } from '@/components/spreadsheet/spreadsheet-view';
import { CreateDatabaseModal } from '@/components/database/create-database-modal';
import { AiDrawer } from '@/components/ai/ai-drawer';
import { Button } from '@/components/ui/button';
import { 
  Plus, LayoutGrid, Pin, RotateCcw
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    databases, 
    activeDatabaseId, 
    setActiveDatabase, 
    setCreateModalOpen,
    clearAllData,
    updateDatabase,
  } = useDatabaseStore();

  const [viewMode, setViewMode] = useState<'workspace' | 'overview'>('workspace');
  const [editingDbId, setEditingDbId] = useState<string | null>(null);
  const [editingDbName, setEditingDbName] = useState<string>('');

  // Ensure active database exists
  const activeDatabase = databases.find((db) => db.id === activeDatabaseId) || databases[0];

  // If no databases exist, render a clean container with CreateDatabaseModal
  if (!activeDatabase) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">No Active Spreadsheet</h2>
        <p className="text-xs text-muted-foreground mb-4">Click below to create your blank routine spreadsheet.</p>
        <Button onClick={() => setCreateModalOpen(true)}>+ New Blank Spreadsheet</Button>
        <CreateDatabaseModal />
        <AiDrawer />
      </div>
    );
  }

  // 2. DASHBOARD WITH DATABASES
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      {/* Top Workspace Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-card border-b border-border/80 sticky top-0 z-20">
        {/* Left: Active Databases Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          <Button
            variant={viewMode === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('overview')}
            className="h-8 px-3 text-xs font-semibold rounded-lg gap-1.5 shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Overview ({databases.length})
          </Button>

          <div className="h-4 w-px bg-border/60 mx-1 shrink-0" />

          {/* Database Tabs */}
          {databases.map((db) => {
            const isActive = activeDatabase?.id === db.id && viewMode === 'workspace';
            return (
              <div
                key={db.id}
                onClick={() => {
                  setActiveDatabase(db.id);
                  setViewMode('workspace');
                }}
                onDoubleClick={() => {
                  setEditingDbId(db.id);
                  setEditingDbName(db.name);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-background text-foreground border-border shadow-xs font-semibold'
                    : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
                title="Double-click to rename sheet"
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: db.color || '#3b82f6' }}
                />
                {editingDbId === db.id ? (
                  <input
                    type="text"
                    value={editingDbName}
                    onChange={(e) => setEditingDbName(e.target.value)}
                    onBlur={() => {
                      if (editingDbName.trim()) {
                        updateDatabase(db.id, { name: editingDbName.trim() });
                      }
                      setEditingDbId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editingDbName.trim()) {
                          updateDatabase(db.id, { name: editingDbName.trim() });
                        }
                        setEditingDbId(null);
                      } else if (e.key === 'Escape') {
                        setEditingDbId(null);
                      }
                    }}
                    autoFocus
                    className="bg-background border border-emerald-500 rounded px-1 text-xs focus:outline-none max-w-[140px]"
                  />
                ) : (
                  <span className="truncate max-w-[140px]">{db.name}</span>
                )}
                {db.isPinned && <Pin className="w-3 h-3 text-amber-500 fill-current shrink-0" />}
              </div>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-8 px-2.5 text-xs font-semibold rounded-lg gap-1 border-dashed shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> New Database
          </Button>
        </div>

        {/* Right Action: Dev Reset / Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllData}
            className="h-8 px-2 text-[11px] text-muted-foreground hover:text-rose-500"
            title="Reset workspace to pure empty state"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Clear All (Empty State)
          </Button>
        </div>
      </div>

      {/* Main Workspace View */}
      {viewMode === 'workspace' && activeDatabase ? (
        <SpreadsheetView database={activeDatabase} />
      ) : (
        /* Workspace Overview Cards */
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Personal Operating System
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your custom tracking databases, habits, routines, and life modules.
              </p>
            </div>

            <Button
              onClick={() => setCreateModalOpen(true)}
              size="sm"
              className="h-10 px-4 font-bold rounded-xl gap-1.5 shadow-md bg-foreground text-background"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Create Database
            </Button>
          </div>

          {/* Database Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {databases.map((db) => (
              <DatabaseCard
                key={db.id}
                database={db}
                onOpen={(id) => {
                  setActiveDatabase(id);
                  setViewMode('workspace');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <CreateDatabaseModal />
      <AiDrawer />
    </div>
  );
}
