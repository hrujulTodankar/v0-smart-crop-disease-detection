'use client';

import { Clock, Search, Filter } from 'lucide-react';
import { HistoryCard, mockHistoryData } from '@/components/history-card';
import { Button } from '@/components/ui/button';

export function HistoryScreen() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Clock className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
        <p className="mt-2 text-muted-foreground">
          Your past disease analyses
        </p>
      </div>

      {/* Search and Filter */}
      <div className="glass-card flex items-center gap-3 rounded-2xl p-3 shadow-lg">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/50 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scans..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-xl">
          <Filter className="h-5 w-5" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Scans', value: '24', color: 'bg-primary/10 text-primary' },
          { label: 'Healthy', value: '18', color: 'bg-success/10 text-success' },
          { label: 'Diseased', value: '6', color: 'bg-destructive/10 text-destructive' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 text-center shadow-lg">
            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* History List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-foreground">Recent Scans</h3>
        {mockHistoryData.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty state would go here if no history */}
      {mockHistoryData.length === 0 && (
        <div className="glass-card flex flex-col items-center rounded-3xl p-8 text-center shadow-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">No scans yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your scan history will appear here
          </p>
        </div>
      )}
    </div>
  );
}
