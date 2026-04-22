'use client';

import { cn } from '@/lib/utils';
import type { SensorData } from '@/lib/types';
import { Thermometer, Droplets, Sprout } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SensorCardProps {
  sensor: SensorData;
}

const iconMap: any = {
  temperature: Thermometer,
  humidity: Droplets,
  soil: Sprout,
};

// Advanced color mapping with gradients, text colors, and bar colors
const colorTheme: any = {
  normal: {
    wrapper: 'bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-500/20',
    iconBg: 'bg-green-500/20 text-green-700',
    badge: 'bg-green-100 text-green-700 border border-green-200/50',
    bar: 'bg-gradient-to-r from-green-400 to-emerald-500',
    glow: 'bg-green-400/20',
  },
  warning: {
    wrapper: 'bg-gradient-to-br from-yellow-500/5 to-orange-500/10 border-yellow-500/20',
    iconBg: 'bg-yellow-500/20 text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200/50',
    bar: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    glow: 'bg-yellow-400/20',
  },
  critical: {
    wrapper: 'bg-gradient-to-br from-red-500/5 to-rose-500/10 border-red-500/20',
    iconBg: 'bg-red-500/20 text-red-700',
    badge: 'bg-red-100 text-red-800 border border-red-200/50',
    bar: 'bg-gradient-to-r from-red-400 to-rose-500',
    glow: 'bg-red-400/20',
  },
};

export function SensorCard({ sensor }: SensorCardProps) {
  const { t } = useTranslation();
  const Icon = iconMap[sensor.icon as keyof typeof iconMap];
  const theme = colorTheme[sensor.status] || colorTheme.normal;

  // Calculate width for the decorative progress bar
  const getProgressWidth = () => {
    if (sensor.icon === 'temperature') {
      // Assuming max normal temp is around 50C for the visual bar
      return Math.min(100, Math.max(0, (sensor.value / 50) * 100));
    }
    // Humidity and Soil are already percentages (0-100)
    return Math.min(100, Math.max(0, sensor.value));
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md glass-card',
        theme.wrapper
      )}
    >
      {/* Decorative blurry glow in the top right corner */}
      <div 
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-all", 
          theme.glow
        )} 
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm backdrop-blur-md', theme.iconBg)}>
          <Icon className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <span className={cn('rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm', theme.badge)}>
          {t(sensor.status)}
        </span>
      </div>

      <div className="relative z-10 mt-6">
        <p className="text-sm font-medium text-muted-foreground/80">{t(sensor.name_key)}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <h3 className="text-4xl font-black tracking-tight text-foreground drop-shadow-sm">
            {sensor.value}
          </h3>
          <span className="text-lg font-bold text-muted-foreground/70">
            {sensor.unit}
          </span>
        </div>
      </div>

      {/* Decorative Progress Bar */}
      <div className="relative z-10 mt-5 h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10 shadow-inner">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", theme.bar)} 
          style={{ width: `${getProgressWidth()}%` }} 
        />
      </div>
    </div>
  );
}