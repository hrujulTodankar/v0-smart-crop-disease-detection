'use client';

import { cn } from '@/lib/utils';
import type { ScanHistoryItem } from '@/lib/types';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

interface HistoryCardProps {
  item: ScanHistoryItem;
  onClick?: () => void;
}

export function HistoryCard({ item, onClick }: HistoryCardProps) {
  const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <button
      onClick={onClick}
      className="glass-card w-full rounded-2xl p-4 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl text-left"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={`${item.crop} scan`}
            className="h-full w-full object-cover"
          />
          <div
            className={cn(
              'absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full',
              item.isHealthy ? 'bg-success' : 'bg-destructive'
            )}
          >
            {item.isHealthy ? (
              <CheckCircle2 className="h-4 w-4 text-white" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">
              {item.crop === 'Tomato' ? '🍅' : '🥭'}
            </span>
            <h3 className="truncate font-semibold text-foreground">
              {item.disease}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.round(item.confidence * 100)}% confidence
          </p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
        
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
      </div>
    </button>
  );
}

// Mock history data for the history screen
export const mockHistoryData: ScanHistoryItem[] = [];
