"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHabits } from "@/hooks/use-habits";
import { HABIT_CATEGORIES, type HabitCategory } from "@/types/habit";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  category: z.string(),
  icon: z.string().default("Circle"),
  color: z.string().default("#111111"),
  targetTime: z.string(),
  repeat: z.enum(["daily", "weekdays", "weekends", "custom"]),
  reminder: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHabitModal({ open, onOpenChange }: CreateHabitModalProps) {
  const { addHabit } = useHabits();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      category: "Custom",
      icon: "Circle",
      color: "#111111",
      targetTime: "09:00",
      repeat: "daily",
      reminder: "08:45",
      priority: "medium",
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addHabit({
      ...values,
      category: values.category as HabitCategory,
      description: values.description ?? "",
      reminder: values.reminder ?? "",
      notes: values.notes ?? "",
    });
    form.reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(v) => form.setValue("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {HABIT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" placeholder="Lucide icon name" {...form.register("icon")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" type="color" {...form.register("color")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetTime">Target Time</Label>
              <Input id="targetTime" type="time" {...form.register("targetTime")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Repeat</Label>
              <Select
                value={form.watch("repeat")}
                onValueChange={(v) =>
                  form.setValue("repeat", v as FormValues["repeat"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder</Label>
              <Input id="reminder" type="time" {...form.register("reminder")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={form.watch("priority")}
              onValueChange={(v) =>
                form.setValue("priority", v as FormValues["priority"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
