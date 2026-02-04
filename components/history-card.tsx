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
export const mockHistoryData: ScanHistoryItem[] = [
  {
    id: '1',
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 0.94,
    isHealthy: false,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=200&fit=crop',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: '2',
    crop: 'Mango',
    disease: 'Healthy',
    confidence: 0.98,
    isHealthy: true,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    crop: 'Tomato',
    disease: 'Powdery Mildew',
    confidence: 0.87,
    isHealthy: false,
    imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=200&h=200&fit=crop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    crop: 'Mango',
    disease: 'Anthracnose',
    confidence: 0.91,
    isHealthy: false,
    imageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&h=200&fit=crop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];
