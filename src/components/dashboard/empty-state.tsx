'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { Plus, Sparkles, Database as DatabaseIcon, LayoutGrid, CheckSquare, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function EmptyState() {
  const { setCreateModalOpen } = useDatabaseStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 text-center"
    >
      {/* Visual Decorative Graphic */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-30 blur-xl group-hover:opacity-60 transition duration-500" />
        
        <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-background border border-border/80 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center text-background shadow-md">
              <DatabaseIcon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-foreground">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-foreground">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="max-w-md space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Create Your Personal Routine Database
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Start from a blank slate and build your own daily routine exactly the way you want.
        </p>
      </div>

      {/* Primary & Secondary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xs sm:max-w-none">
        <Button
          size="lg"
          onClick={() => setCreateModalOpen(true)}
          className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold text-base bg-foreground text-background hover:opacity-90 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 mr-1.5 stroke-[2.5]" /> Create Blank Database
        </Button>
      </div>

      {/* Feature Badges */}
      <div className="mt-14 pt-8 border-t border-border/40 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> Full Spreadsheet Workspace
        </span>
        <span className="flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5" /> Custom Columns & Field Types
        </span>
        <span className="flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" /> Personal Life Operating System
        </span>
      </div>
    </motion.div>
  );
}
