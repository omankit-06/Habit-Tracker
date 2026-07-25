'use client';

import React from 'react';
import { Database } from '@/types/database';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Sun, Flame, BookOpen, Layers, Trophy, Target, Zap, Dumbbell, 
  Heart, CheckSquare, Compass, Rocket, Code, Feather, Pin, MoreVertical, 
  ArrowRight, Trash2, Table
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Sun, Flame, BookOpen, Layers, Trophy, Target, Zap, Dumbbell,
  Heart, CheckSquare, Compass, Rocket, Code, Feather
};

interface DatabaseCardProps {
  database: Database;
  onOpen: (id: string) => void;
}

export function DatabaseCard({ database, onOpen }: DatabaseCardProps) {
  const { togglePinDatabase, deleteDatabase } = useDatabaseStore();

  const IconComponent = ICON_MAP[database.icon] || Table;

  // Calculate completion % across all checkbox cells in rows
  const checkboxCols = database.columns.filter((c) => c.type === 'checkbox');
  let completedCount = 0;
  let totalCheckboxes = 0;

  database.rows.forEach((row) => {
    checkboxCols.forEach((col) => {
      totalCheckboxes += 1;
      if (row.values[col.id]) completedCount += 1;
    });
  });

  const completionRate = totalCheckboxes > 0 ? Math.round((completedCount / totalCheckboxes) * 100) : 0;

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/70 hover:border-border hover:shadow-lg transition-all duration-200">
      <div>
        {/* Card Header: Icon, Pin & Menu */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm font-bold"
            style={{ backgroundColor: database.color || '#3b82f6' }}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => togglePinDatabase(database.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                database.isPinned 
                  ? 'text-amber-500 bg-amber-500/10' 
                  : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted'
              }`}
              title={database.isPinned ? 'Unpin Database' : 'Pin to top'}
            >
              <Pin className="w-4 h-4 fill-current" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onOpen(database.id)} className="gap-2">
                  <Table className="w-4 h-4" /> Open Workspace
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => deleteDatabase(database.id)} 
                  className="gap-2 text-rose-500 focus:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h3 
            onClick={() => onOpen(database.id)}
            className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors cursor-pointer"
          >
            {database.name}
          </h3>
          {database.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {database.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic mt-1">No description added.</p>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        {/* Metrics Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-medium text-foreground">{database.rows.length} rows</span>
            <span>•</span>
            <span>{database.columns.length} columns</span>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
            {database.layout}
          </Badge>
        </div>

        {/* Completion Progress Bar */}
        {totalCheckboxes > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>Completion rate</span>
              <span className="text-foreground font-semibold">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-1.5 bg-muted" />
          </div>
        )}

        {/* Open Action */}
        <Button
          onClick={() => onOpen(database.id)}
          variant="secondary"
          size="sm"
          className="w-full justify-between font-semibold rounded-xl mt-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
        >
          <span>Open Database</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
