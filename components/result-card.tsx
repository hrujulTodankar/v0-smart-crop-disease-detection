'use client';

import type { PredictionResult, CropType } from '@/lib/types';
import { RefreshCw, CheckCircle2, AlertTriangle, Percent, Shield, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: PredictionResult;
  crop: CropType;
  imageUrl: string;
  onScanAgain: () => void;
}

export function ResultCard({ result, crop, imageUrl, onScanAgain }: ResultCardProps) {
  const isHealthy = result.prediction === 'healthy';
  const disease = isHealthy ? 'Healthy' : result.prediction.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

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

      {/* Prediction Result */}
      <div className={cn(
        'glass-card rounded-3xl p-6 shadow-xl',
        isHealthy ? 'ring-2 ring-green-500/30 bg-green-50/50' : 'ring-2 ring-red-500/30 bg-red-50/50'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl',
            isHealthy ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          )}>
            {isHealthy ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
          </div>
          <div className="flex-1">
            <div className={cn(
              'mb-1 inline-block rounded-full px-3 py-1 text-xs font-semibold',
              isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}>
              {isHealthy ? 'Healthy Plant' : 'Disease Detected'}
            </div>
            <h2 className="text-xl font-bold text-foreground">{disease}</h2>
          </div>
        </div>
      </div>

      {/* Confidence Level */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Percent className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Confidence Level</h3>
            <p className="text-sm text-muted-foreground">AI prediction accuracy</p>
          </div>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              result.confidence >= 80 ? 'bg-green-500' : result.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
        <p className="mt-2 text-right text-lg font-bold text-foreground">{result.confidence}%</p>
      </div>

      {/* Precautions */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <Shield className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Precautions</h3>
            <p className="text-sm text-muted-foreground">Recommended actions</p>
          </div>
        </div>
        <div className="space-y-3">
          {result.precautions.map((precaution, index) => (
            <div key={index} className="flex items-start gap-3 rounded-2xl bg-green-50/50 p-4">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed text-foreground">{precaution}</p>
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
        <div className="space-y-3">
          {result.risk.map((riskItem, index) => (
            <div key={index} className="flex items-start gap-3 rounded-2xl bg-orange-50/50 p-4">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                ⚠
              </div>
              <p className="text-sm leading-relaxed text-foreground">{riskItem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Data */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Thermometer className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Environmental Data</h3>
            <p className="text-sm text-muted-foreground">Sensor readings</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-purple-50/50 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {result.sensor.temperature ?? '--'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Temperature</p>
            {result.sensor.temperature && <p className="text-xs text-purple-600">°C</p>}
          </div>
          <div className="rounded-2xl bg-blue-50/50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {result.sensor.humidity ?? '--'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Humidity</p>
            {result.sensor.humidity && <p className="text-xs text-blue-600">%</p>}
          </div>
          <div className="rounded-2xl bg-green-50/50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {result.sensor.moisture ?? '--'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Moisture</p>
            {result.sensor.moisture && <p className="text-xs text-green-600">%</p>}
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
};
