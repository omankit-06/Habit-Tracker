'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { ColumnType } from '@/types/database';
import { 
  Type, CheckSquare, Hash, Calendar, Clock, ChevronDown, ListFilter, 
  Activity, Sliders, Tag as TagIcon, Star, Palette, Link, FileText, Mail, Phone, Plus
} from 'lucide-react';

const COLUMN_TYPES: { id: ColumnType; name: string; icon: React.ComponentType<{ className?: string }>; category: string }[] = [
  { id: 'text', name: 'Text / Name', icon: Type, category: 'Basic' },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, category: 'Basic' },
  { id: 'select', name: 'Select Dropdown', icon: ChevronDown, category: 'Basic' },
  { id: 'multi_select', name: 'Multi Select', icon: ListFilter, category: 'Basic' },
  { id: 'status', name: 'Status Pill', icon: Activity, category: 'Workflow' },
  { id: 'progress', name: 'Progress Bar', icon: Sliders, category: 'Workflow' },
  { id: 'tag', name: 'Tag Badge', icon: TagIcon, category: 'Workflow' },
  { id: 'rating', name: 'Rating (1-5)', icon: Star, category: 'Workflow' },
  { id: 'number', name: 'Number', icon: Hash, category: 'Data' },
  { id: 'date', name: 'Date', icon: Calendar, category: 'Data' },
  { id: 'time', name: 'Time', icon: Clock, category: 'Data' },
  { id: 'color', name: 'Color Theme', icon: Palette, category: 'Data' },
  { id: 'url', name: 'Website URL', icon: Link, category: 'Advanced' },
  { id: 'notes', name: 'Notes & Paragraph', icon: FileText, category: 'Advanced' },
  { id: 'email', name: 'Email Address', icon: Mail, category: 'Advanced' },
  { id: 'phone', name: 'Phone Number', icon: Phone, category: 'Advanced' },
];

interface AddColumnModalProps {
  databaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddColumnModal({ databaseId, open, onOpenChange }: AddColumnModalProps) {
  const { addColumn } = useDatabaseStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<ColumnType>('text');

  const handleAdd = () => {
    if (!name.trim()) return;
    addColumn(databaseId, {
      name: name.trim(),
      type,
      width: type === 'checkbox' ? 100 : type === 'progress' ? 150 : 180,
    });
    setName('');
    setType('text');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-background rounded-2xl border border-border shadow-2xl">
        <div className="space-y-1">
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Column</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure column title and select the data type representation.
          </DialogDescription>
        </div>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Column Title</Label>
            <Input 
              placeholder="e.g. Priority, Mood, Time Spent, Target Date"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-sm rounded-lg"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Select Column Type</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {COLUMN_TYPES.map((ct) => {
                const IconComp = ct.icon;
                const isSelected = type === ct.id;
                return (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => setType(ct.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-primary font-medium shadow-xs' 
                        : 'border-border/60 hover:border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="text-xs truncate">{ct.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            size="sm" 
            disabled={!name.trim()} 
            onClick={handleAdd}
            className="gap-1 font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
