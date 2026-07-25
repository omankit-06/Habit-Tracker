'use client';

import React from 'react';
import { useDatabaseStore } from '@/lib/store/useDatabaseStore';
import { PageTransition } from '@/components/layout/page-transition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  BarChart3, Plus, Flame, Target, CheckCircle2, 
  Layers 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AnalyticsPage() {
  const { databases, setCreateModalOpen } = useDatabaseStore();

  // Aggregate metrics across databases
  const totalDatabases = databases.length;
  let totalRows = 0;
  let completedCheckboxes = 0;
  let totalCheckboxes = 0;

  databases.forEach((db) => {
    totalRows += db.rows.length;

    const checkboxCols = db.columns.filter((c) => c.type === 'checkbox');
    db.rows.forEach((row) => {
      checkboxCols.forEach((col) => {
        totalCheckboxes += 1;
        if (row.values[col.id]) completedCheckboxes += 1;
      });
    });
  });

  const hasData = totalDatabases > 0 && totalRows > 0;
  const overallRate = totalCheckboxes > 0 ? Math.round((completedCheckboxes / totalCheckboxes) * 100) : 0;

  // Chart data from databases
  const chartData = databases.map((db) => {
    const cbCols = db.columns.filter((c) => c.type === 'checkbox');
    let dbDone = 0;
    let dbTotal = 0;
    db.rows.forEach((r) => {
      cbCols.forEach((c) => {
        dbTotal += 1;
        if (r.values[c.id]) dbDone += 1;
      });
    });

    return {
      name: db.name.length > 14 ? `${db.name.slice(0, 12)}...` : db.name,
      completion: dbTotal > 0 ? Math.round((dbDone / dbTotal) * 100) : 100,
      tasks: db.rows.length
    };
  });

  if (!hasData) {
    return (
      <PageTransition className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
          <BarChart3 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">No Analytics Available Yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Analytics & performance insights automatically trigger once you build databases and complete tasks.
        </p>
        <Button onClick={() => setCreateModalOpen(true)} className="font-semibold gap-1.5">
          <Plus className="w-4 h-4" /> Create Database
        </Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Operating System Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time metrics computed directly across your custom databases.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Databases" value={totalDatabases} icon={Layers} />
        <StatCard title="Total Tasks & Rows" value={totalRows} icon={Target} />
        <StatCard title="Overall Completion" value={`${overallRate}%`} icon={CheckCircle2} trend="+12%" />
        <StatCard title="Completed Cells" value={completedCheckboxes} icon={Flame} />
      </div>

      {/* Database Performance Comparison Chart */}
      <Card className="rounded-2xl border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold">Database Completion Velocity</CardTitle>
            <p className="text-xs text-muted-foreground">Completion % across your tracking databases</p>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
            Live Metrics
          </Badge>
        </CardHeader>
        <CardContent className="h-[280px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)', 
                  borderRadius: '12px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="completion" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
