'use client';

import { Clock } from 'lucide-react';
import { HistoryCard } from '@/components/history-card';
import type { ScanHistoryItem } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface HistoryScreenProps {
  history: ScanHistoryItem[];
}




export function HistoryScreen({ history }: HistoryScreenProps) {

    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center '>
          <img className='object-contain' src="/logo.png" alt="DRGR" width={50} height={40}/>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Smart Crop Disease Detection
        </h1>

      </div>

      {/* History List or Empty State */}
      {history.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">({history.length})</h3>
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
