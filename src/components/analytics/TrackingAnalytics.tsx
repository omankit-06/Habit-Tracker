import React, { useMemo } from 'react';
import { Database } from '@/types/database';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle2, CircleDashed } from 'lucide-react';

interface TrackingAnalyticsProps {
  database: Database;
}

export function TrackingAnalytics({ database }: TrackingAnalyticsProps) {
  // Compute analytics dynamically based on Checkbox or Status columns
  const analyticsData = useMemo(() => {
    let completedCount = 0;
    let pendingCount = 0;
    let missedCount = 0;

    // Identify tracking columns
    const trackingColumns = database.columns.filter(c => 
      c.type === 'checkbox' || c.type === 'status' || c.type === 'progress'
    );

    if (trackingColumns.length === 0) {
      return { completedCount, pendingCount, missedCount, hasData: false };
    }

    database.rows.forEach(row => {
      trackingColumns.forEach(col => {
        const val = row.values[col.id];
        
        if (col.type === 'checkbox') {
          if (val === true) completedCount++;
          else if (val === false) missedCount++;
          else pendingCount++; // undefined or null
        } else if (col.type === 'status') {
          const strVal = String(val || '').toLowerCase();
          if (['done', 'completed', 'yes'].includes(strVal)) completedCount++;
          else if (['todo', 'pending', ''].includes(strVal)) pendingCount++;
          else missedCount++; // e.g. missed, skipped
        } else if (col.type === 'progress') {
          const numVal = Number(val);
          if (numVal >= 100) completedCount++;
          else if (numVal > 0) pendingCount++;
          else missedCount++;
        }
      });
    });

    return { completedCount, pendingCount, missedCount, hasData: true };
  }, [database.rows, database.columns]);

  const { completedCount, pendingCount, missedCount, hasData } = analyticsData;
  const total = completedCount + pendingCount + missedCount;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#10b981' }, // Emerald
    { name: 'Pending', value: pendingCount, color: '#6366f1' }, // Indigo
    { name: 'Missed', value: missedCount, color: '#f43f5e' }, // Rose
  ].filter(d => d.value > 0);

  if (!hasData) {
    return (
      <div className="w-full flex items-center justify-center p-6 text-center text-muted-foreground bg-muted/10 border-t border-border/60">
        <Activity className="w-5 h-5 mr-3 opacity-30" />
        <p className="text-xs">Add checkbox or status columns to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background border-t border-border/60">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/20">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" /> Tracking Analytics
        </h2>
        <div className="flex gap-4 text-xs font-semibold">
          <span className="text-muted-foreground uppercase">Total Tracked: <span className="text-foreground">{total}</span></span>
          <span className="text-emerald-600 dark:text-emerald-400 uppercase">Completion: <span className="text-foreground">{completionRate}%</span></span>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between p-4 gap-6 max-w-4xl mx-auto">
        
        {/* Pie Chart */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-[200px]">
          {pieData.length > 0 ? (
            <div className="w-full h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: '1px solid var(--border)', fontSize: '11px', padding: '4px 8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-bold">{completedCount}</span>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-xs text-muted-foreground">
              No data
            </div>
          )}
        </div>

        {/* List Breakdown */}
        <div className="flex-1 space-y-2.5 min-w-[200px]">
          <div className="flex items-center justify-between text-xs p-2.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </span>
            <span className="font-bold text-foreground">{completedCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
              <CircleDashed className="w-4 h-4" /> Pending
            </span>
            <span className="font-bold text-foreground">{pendingCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
              <Activity className="w-4 h-4" /> Missed
            </span>
            <span className="font-bold text-foreground">{missedCount}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
