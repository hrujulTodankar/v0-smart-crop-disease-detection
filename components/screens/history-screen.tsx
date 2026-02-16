'use client';

import { Clock } from 'lucide-react';
import { HistoryCard } from '@/components/history-card';
import type { ScanHistoryItem } from '@/lib/types';

interface HistoryScreenProps {
  history: ScanHistoryItem[];
}

export function HistoryScreen({ history }: HistoryScreenProps) {
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

      {/* History List or Empty State */}
      {history.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">Recent Scans ({history.length})</h3>
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center rounded-3xl p-8 text-center shadow-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">No scans yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your scan history will appear here after you analyze some images
          </p>
        </div>
      )}
    </div>
  );
}
