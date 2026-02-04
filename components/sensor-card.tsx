'use client';

import { cn } from '@/lib/utils';
import type { SensorData } from '@/lib/types';
import { Thermometer, Droplets, Sprout } from 'lucide-react';

interface SensorCardProps {
  sensor: SensorData;
  isLoading?: boolean;
}

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  soil: Sprout,
};

const colorMap = {
  normal: {
    bg: 'bg-success/10',
    icon: 'bg-success text-success-foreground',
    badge: 'bg-success/20 text-success',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'bg-warning text-warning-foreground',
    badge: 'bg-warning/20 text-warning',
  },
  critical: {
    bg: 'bg-destructive/10',
    icon: 'bg-destructive text-destructive-foreground',
    badge: 'bg-destructive/20 text-destructive',
  },
};

export function SensorCard({ sensor, isLoading }: SensorCardProps) {
  const Icon = iconMap[sensor.icon];
  const colors = colorMap[sensor.status];

  return (
    <div className={cn('glass-card rounded-3xl p-5 shadow-xl transition-all hover:scale-[1.02]', colors.bg)}>
      <div className="flex items-start justify-between">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', colors.icon)}>
          <Icon className="h-6 w-6" />
        </div>
        <span className={cn('rounded-full px-2 py-1 text-xs font-semibold capitalize', colors.badge)}>
          {sensor.status}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{sensor.name}</p>
        {isLoading ? (
          <div className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-muted" />
        ) : (
          <p className="mt-1 text-3xl font-bold text-foreground">
            {sensor.value}
            <span className="ml-1 text-lg font-normal text-muted-foreground">{sensor.unit}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// Soil moisture remains mock data as it requires physical IoT sensors
export const soilMoistureSensor: SensorData = {
  id: 'soil-1',
  name: 'Soil Moisture',
  value: 42,
  unit: '%',
  icon: 'soil',
  status: 'warning',
};
