'use client';

import { cn } from '@/lib/utils';
import type { PredictionResult, CropType } from '@/lib/types';
import { getTreatment } from '@/lib/types';
import { CheckCircle2, AlertTriangle, Percent, Pill, RefreshCw, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
  result: PredictionResult;
  crop: CropType;
  imageUrl: string;
  onScanAgain: () => void;
}

export function ResultCard({ result, crop, imageUrl, onScanAgain }: ResultCardProps) {
  const treatment = getTreatment(result.disease);
  const confidencePercent = Math.round(result.confidence * 100);
  const timestamp = new Date().toLocaleString();

  const handleShare = async () => {
    const shareData = {
      title: 'Crop Disease Detection Result',
      text: `${crop} Analysis: ${result.disease} (${confidencePercent}% confidence)\n\nTreatment: ${treatment}`,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('[v0] Share cancelled or failed:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Image */}
      <div className="relative overflow-hidden rounded-3xl glass-card shadow-xl">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Analyzed leaf"
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {crop === 'Tomato' ? '🍅' : '🥭'}
              </span>
              <span className="text-sm font-medium text-white/90">{crop} Analysis</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs text-white/80">
              <Clock className="h-3 w-3" />
              <span>Just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className={cn(
          'glass-card rounded-3xl p-6 shadow-xl',
          result.isHealthy
            ? 'ring-2 ring-success/30 bg-success/5'
            : 'ring-2 ring-destructive/30 bg-destructive/5'
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl',
              result.isHealthy
                ? 'bg-success text-success-foreground'
                : 'bg-destructive text-destructive-foreground'
            )}
          >
            {result.isHealthy ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
          </div>
          <div className="flex-1">
            <div
              className={cn(
                'mb-1 inline-block rounded-full px-3 py-1 text-xs font-semibold',
                result.isHealthy
                  ? 'bg-success/20 text-success'
                  : 'bg-destructive/20 text-destructive'
              )}
            >
              {result.isHealthy ? 'Healthy Plant' : 'Disease Detected'}
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {result.disease}
            </h2>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Percent className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Confidence Level</h3>
            <p className="text-sm text-muted-foreground">AI prediction accuracy</p>
          </div>
          <span className={cn(
            'text-2xl font-bold',
            confidencePercent >= 80 ? 'text-success' : 
            confidencePercent >= 50 ? 'text-warning' : 'text-destructive'
          )}>
            {confidencePercent}%
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              confidencePercent >= 80
                ? 'bg-success'
                : confidencePercent >= 50
                ? 'bg-warning'
                : 'bg-destructive'
            )}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* Treatment */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Treatment Recommendation</h3>
            <p className="text-sm text-muted-foreground">Expert guidance for your crop</p>
          </div>
        </div>
        <div className="rounded-2xl bg-secondary/50 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            {treatment}
          </p>
        </div>
      </div>

      {/* Scan Details */}
      <div className="glass-card rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Scanned: {timestamp}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onScanAgain}
          className="h-14 flex-1 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Scan Another Leaf
        </Button>
      </div>
    </div>
  );
}
