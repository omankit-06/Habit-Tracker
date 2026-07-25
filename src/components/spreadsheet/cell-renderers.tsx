'use client';

import React, { useState } from 'react';
import { Column, Row } from '@/types/database';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { Check, Star, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface CellRendererProps {
  databaseId: string;
  column: Column;
  row: Row;
}

export function CellRenderer({ databaseId, column, row }: CellRendererProps) {
  const { updateCell, toggleCheckboxCell } = useDatabaseStore();
  const value = row.values[column.id];

  const [isEditing, setIsEditing] = useState(false);
  const [localVal, setLocalVal] = useState<string>(String(value ?? ''));

  // 1. CHECKBOX EXPERIENCE: Satisfying green fill, Framer Motion small bounce & checkmark
  if (column.type === 'checkbox') {
    const checked = Boolean(value);
    return (
      <div className="flex items-center justify-center w-full h-full py-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleCheckboxCell(databaseId, row.id, column.id)}
          className={`relative w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
            checked 
              ? 'bg-emerald-500 text-white shadow-sm border-emerald-500' 
              : 'border-2 border-zinc-300 dark:border-zinc-700 bg-background hover:border-zinc-400 dark:hover:border-zinc-500'
          }`}
          title={checked ? 'Mark Incomplete' : 'Mark Complete'}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </motion.button>
      </div>
    );
  }

  // 2. RATING (1-5 Stars)
  if (column.type === 'rating') {
    const currentRating = typeof value === 'number' ? value : 0;
    return (
      <div className="flex items-center gap-1 w-full h-full px-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateCell(databaseId, row.id, column.id, star)}
            className="p-0.5"
          >
            <Star 
              className={`w-3.5 h-3.5 ${
                star <= currentRating 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'text-zinc-300 dark:text-zinc-700'
              }`} 
            />
          </motion.button>
        ))}
      </div>
    );
  }

  // 3. PROGRESS BAR
  if (column.type === 'progress') {
    const numericProgress = typeof value === 'number' ? Math.min(100, Math.max(0, value)) : 0;
    return (
      <div 
        onClick={() => {
          const next = numericProgress >= 100 ? 0 : numericProgress + 25;
          updateCell(databaseId, row.id, column.id, next);
        }}
        className="flex items-center gap-2.5 w-full h-full px-2.5 cursor-pointer group"
        title="Click to advance progress +25%"
      >
        <Progress value={numericProgress} className="h-2 flex-1 bg-muted" />
        <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground w-7 text-right">
          {numericProgress}%
        </span>
      </div>
    );
  }

  // 4. STATUS PILL
  if (column.type === 'status') {
    const statusVal = String(value || 'To Do');
    const getStatusStyle = (s: string) => {
      const lower = s.toLowerCase();
      if (lower.includes('urgent') || lower.includes('high')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      if (lower.includes('progress') || lower.includes('medium')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      if (lower.includes('done') || lower.includes('completed')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      return 'bg-muted text-muted-foreground border-border/50';
    };

    const STATUS_CYCLE = ['To Do', 'In Progress', 'Done', 'High', 'Urgent'];

    const handleCycleStatus = () => {
      const currentIndex = STATUS_CYCLE.indexOf(statusVal);
      const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
      updateCell(databaseId, row.id, column.id, nextStatus);
    };

    return (
      <div className="flex items-center w-full h-full px-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCycleStatus}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${getStatusStyle(statusVal)}`}
        >
          {statusVal}
        </motion.button>
      </div>
    );
  }

  // 5. TAG / SELECT PILLS
  if (column.type === 'select' || column.type === 'tag') {
    const tagVal = String(value || '');
    return (
      <div className="flex items-center w-full h-full px-2">
        {tagVal ? (
          <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5 rounded-md">
            {tagVal}
          </Badge>
        ) : (
          <input
            type="text"
            placeholder="Add tag..."
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
            onBlur={() => updateCell(databaseId, row.id, column.id, localVal)}
            className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none"
          />
        )}
      </div>
    );
  }

  // 6. URL LINK
  if (column.type === 'url') {
    const urlStr = String(value || '');
    return (
      <div className="flex items-center gap-1.5 w-full h-full px-2.5">
        <input
          type="text"
          placeholder="https://..."
          value={isEditing ? localVal : urlStr}
          onChange={(e) => setLocalVal(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => {
            setIsEditing(false);
            updateCell(databaseId, row.id, column.id, localVal);
          }}
          className="w-full bg-transparent text-xs text-primary focus:outline-none truncate"
        />
        {urlStr && !isEditing && (
          <a href={urlStr.startsWith('http') ? urlStr : `https://${urlStr}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  // DEFAULT / TEXT / NUMBER / TIME / DATE INLINE EDIT INPUT
  return (
    <div className="w-full h-full flex items-center px-2.5">
      <input
        type={column.type === 'number' ? 'number' : column.type === 'time' ? 'time' : column.type === 'date' ? 'date' : 'text'}
        value={isEditing ? localVal : String(value ?? '')}
        onChange={(e) => setLocalVal(e.target.value)}
        onFocus={() => {
          setIsEditing(true);
          setLocalVal(String(value ?? ''));
        }}
        onBlur={() => {
          setIsEditing(false);
          updateCell(databaseId, row.id, column.id, localVal);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsEditing(false);
            updateCell(databaseId, row.id, column.id, localVal);
          }
        }}
        placeholder=""
        className="w-full bg-transparent text-xs text-foreground focus:outline-none focus:bg-emerald-500/10 px-1 py-0.5 rounded transition-colors"
      />
    </div>
  );
}
