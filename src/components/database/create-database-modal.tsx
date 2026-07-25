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
import { Textarea } from '@/components/ui/textarea';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { DatabaseLayout } from '@/types/database';
import { 
  Sparkles, 
  Sun, 
  Flame, 
  BookOpen, 
  Layers, 
  Trophy, 
  Target, 
  Zap, 
  Dumbbell, 
  Heart, 
  CheckSquare, 
  Compass, 
  Rocket, 
  Code, 
  Feather,
  Table as TableIcon,
  LayoutGrid,
  Clock,
  Calendar as CalendarIcon,
  Kanban,
  ArrowRight,
  Check,
  ChevronLeft
} from 'lucide-react';

const ICONS = [
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Sun', icon: Sun },
  { name: 'Flame', icon: Flame },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Layers', icon: Layers },
  { name: 'Trophy', icon: Trophy },
  { name: 'Target', icon: Target },
  { name: 'Zap', icon: Zap },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Heart', icon: Heart },
  { name: 'CheckSquare', icon: CheckSquare },
  { name: 'Compass', icon: Compass },
  { name: 'Rocket', icon: Rocket },
  { name: 'Code', icon: Code },
  { name: 'Feather', icon: Feather },
];

const COLORS = [
  { label: 'Blue', value: '#3b82f6', bgClass: 'bg-blue-500' },
  { label: 'Emerald', value: '#10b981', bgClass: 'bg-emerald-500' },
  { label: 'Amber', value: '#f59e0b', bgClass: 'bg-amber-500' },
  { label: 'Rose', value: '#f43f5e', bgClass: 'bg-rose-500' },
  { label: 'Purple', value: '#8b5cf6', bgClass: 'bg-purple-500' },
  { label: 'Indigo', value: '#6366f1', bgClass: 'bg-indigo-500' },
  { label: 'Cyan', value: '#06b6d4', bgClass: 'bg-cyan-500' },
  { label: 'Monochrome', value: '#18181b', bgClass: 'bg-zinc-900 dark:bg-zinc-100' },
];

const LAYOUTS: { id: DatabaseLayout; name: string; desc: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean }[] = [
  { id: 'table', name: 'Table View', desc: 'Spreadsheet grid with resizable columns & rows.', icon: TableIcon },
  { id: 'grid', name: 'Grid View', desc: 'Visual card representation for easy overview.', icon: LayoutGrid },
  { id: 'timeline', name: 'Timeline', desc: 'Sequential flow across time blocks.', icon: Clock },
  { id: 'calendar', name: 'Calendar View', desc: 'Month & day grid format.', icon: CalendarIcon },
  { id: 'kanban', name: 'Kanban Board', desc: 'Pipeline status cards.', icon: Kanban, disabled: true },
];

const QUICK_SUGGESTIONS = [
  'Morning Routine',
  'Daily Discipline',
  'Study Tracker',
  'Life OS',
  'My Routine',
  'Fitness Protocol'
];

export function CreateDatabaseModal() {
  const { isCreateModalOpen, setCreateModalOpen, createDatabase } = useDatabaseStore();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [color, setColor] = useState('#3b82f6');
  const [layout, setLayout] = useState<DatabaseLayout>('table');

  const handleClose = () => {
    setCreateModalOpen(false);
    setStep(1);
    setName('');
    setDescription('');
    setIcon('Sparkles');
    setColor('#3b82f6');
    setLayout('table');
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    createDatabase({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      layout
    });
    handleClose();
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-background rounded-xl border border-border shadow-2xl">
        {/* Step Indicator Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step {step} of 4
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-foreground">
                {step === 1 && 'Database Details'}
                {step === 2 && 'Choose Icon'}
                {step === 3 && 'Accent Color'}
                {step === 4 && 'Database Layout'}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-6 bg-primary' : s < step ? 'w-3 bg-primary/40' : 'w-3 bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 min-h-[340px]">
          {/* STEP 1: NAME & DESCRIPTION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Name Your Operating System Database
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Give your workspace a clean title or select one of the recommendations below.
                </DialogDescription>
              </div>

              <div className="space-y-3">
                <Label htmlFor="db-name" className="text-xs font-semibold uppercase text-muted-foreground">
                  Database Name
                </Label>
                <Input
                  id="db-name"
                  placeholder="e.g. Morning Routine, Daily Discipline, Study Tracker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 text-base font-medium rounded-lg"
                  autoFocus
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setName(sug)}
                      className="px-2.5 py-1 text-xs font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md border border-border/50 transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="db-desc" className="text-xs font-semibold uppercase text-muted-foreground">
                  Description (Optional)
                </Label>
                <Textarea
                  id="db-desc"
                  placeholder="What is the main goal of this tracking system?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none h-20 text-sm rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 2: ICON PICKER */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Select an Icon
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Represent your personal database visually across the workspace.
                </DialogDescription>
              </div>

              <div className="grid grid-cols-5 gap-3 pt-2">
                {ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = icon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setIcon(item.name)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm scale-105' 
                          : 'border-border/60 hover:border-border hover:bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      <IconComp className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium tracking-tight truncate w-full text-center">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: COLOR ACCENT */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Choose Color Theme
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Personalize the accent color for tabs, progress badges, and cards.
                </DialogDescription>
              </div>

              <div className="grid grid-cols-4 gap-3 pt-2">
                {COLORS.map((c) => {
                  const isSelected = color === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'border-primary bg-muted/60 font-semibold shadow-sm' 
                          : 'border-border/60 hover:border-border hover:bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${c.bgClass} flex items-center justify-center text-white shrink-0`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium text-foreground">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: LAYOUT SELECTOR */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Choose Default Layout
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Select your primary view style. Table View is optimized for spreadsheet building.
                </DialogDescription>
              </div>

              <div className="space-y-2.5 pt-1 max-h-[220px] overflow-y-auto pr-1">
                {LAYOUTS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = layout === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.disabled}
                      onClick={() => !item.disabled && setLayout(item.id)}
                      className={`w-full flex items-start gap-3.5 p-3 rounded-xl border text-left transition-all ${
                        item.disabled 
                          ? 'opacity-50 border-border/40 cursor-not-allowed bg-muted/10'
                          : isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border/60 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{item.name}</span>
                          {item.disabled && (
                            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              Coming Soon
                            </span>
                          )}
                          {isSelected && !item.disabled && (
                            <span className="text-xs font-semibold text-primary">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between sm:justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-1 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              size="sm"
              disabled={step === 1 && !name.trim()}
              onClick={() => setStep(step + 1)}
              className="gap-1 rounded-lg font-semibold"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              className="gap-1 rounded-lg font-bold bg-primary text-primary-foreground shadow-md hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 fill-current" /> Build Database
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
