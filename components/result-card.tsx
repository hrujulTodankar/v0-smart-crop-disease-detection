'use client';

import { cn } from '@/lib/utils';
import type { PredictionResult, CropType } from '@/lib/types';
import { CheckCircle2, AlertTriangle, Leaf, Percent, Pill, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
  result: PredictionResult;
  crop: CropType;
  imageUrl: string;
  onScanAgain: () => void;
}

export function ResultCard({ result, crop, imageUrl, onScanAgain }: ResultCardProps) {
  const isHealthy = result.prediction === 'healthy';
  const disease = isHealthy ? 'Healthy' : result.prediction.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const confidencePercent = result.confidence;

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
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {crop === 'Tomato' ? '🍅' : '🥭'}
            </span>
            <span className="text-sm font-medium text-white/90">{crop} Analysis</span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className={cn(
          'glass-card rounded-3xl p-6 shadow-xl',
          isHealthy
            ? 'ring-2 ring-success/30 bg-success/5'
            : 'ring-2 ring-destructive/30 bg-destructive/5'
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl',
              isHealthy
                ? 'bg-success text-success-foreground'
                : 'bg-destructive text-destructive-foreground'
            )}
          >
            {isHealthy ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
          </div>
          <div className="flex-1">
            <div
              className={cn(
                'mb-1 inline-block rounded-full px-3 py-1 text-xs font-semibold',
                isHealthy
                  ? 'bg-success/20 text-success'
                  : 'bg-destructive/20 text-destructive'
              )}
            >
              {isHealthy ? 'Healthy Plant' : 'Disease Detected'}
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {disease}
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
          <div>
            <h3 className="font-semibold text-foreground">Confidence Level</h3>
            <p className="text-sm text-muted-foreground">AI prediction accuracy</p>
          </div>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-secondary">
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
        <p className="mt-2 text-right text-lg font-bold text-foreground">
          {confidencePercent}%
        </p>
      </div>

      {/* Precautions */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Precautions</h3>
            <p className="text-sm text-muted-foreground">Recommended actions</p>
          </div>
        </div>
        <div className="space-y-2">
          {result.precautions.map((precaution, index) => (
            <div key={index} className="rounded-2xl bg-secondary/50 p-3">
              <p className="text-sm leading-relaxed text-foreground">
                {precaution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">Potential risks</p>
          </div>
        </div>
        <div className="space-y-2">
          {result.risk.map((riskItem, index) => (
            <div key={index} className="rounded-2xl bg-orange-50/50 p-3">
              <p className="text-sm leading-relaxed text-foreground">
                {riskItem}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Data */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Leaf className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Sensor Data</h3>
            <p className="text-sm text-muted-foreground">Environmental conditions</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-secondary/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="text-sm font-semibold text-foreground">
              {result.sensor.temperature ?? 'N/A'}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-semibold text-foreground">
              {result.sensor.humidity ?? 'N/A'}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Moisture</p>
            <p className="text-sm font-semibold text-foreground">
              {result.sensor.moisture ?? 'N/A'}
            </p>
          </div>
        </div>
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
