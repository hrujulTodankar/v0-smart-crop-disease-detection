'use client';

import type { PredictionResult, CropType } from '@/lib/types';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
  result: PredictionResult;
  crop: CropType;
  imageUrl: string;
  onScanAgain: () => void;
}

export function ResultCard({ result, crop, imageUrl, onScanAgain }: ResultCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header with Image */}
      <div className="relative overflow-hidden rounded-3xl glass-card shadow-xl">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Analyzed leaf"
          className="h-48 w-full object-cover"
        />
      </div>

      {/* Raw Backend Response */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <pre className="text-sm text-foreground whitespace-pre-wrap overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>

      {/* Action Button */}
      <Button
        onClick={onScanAgain}
        className="h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
      >
        <RefreshCw className="mr-2 h-5 w-5" />
        Scan Another Leaf
      </Button>
    </div>
  );
}
