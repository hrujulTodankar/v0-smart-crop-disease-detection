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

export function SensorCard({ sensor }: SensorCardProps) {
  const { t } = useTranslation();
  const Icon = iconMap[sensor.icon as keyof typeof iconMap];
  
  // Dynamic color logic based on status
  const colorMap: any = {
    normal: 'bg-green-500/10 text-green-600',
    warning: 'bg-yellow-500/10 text-yellow-600',
    critical: 'bg-red-500/10 text-red-600',
  };

  return (
    <div className={cn('glass-card rounded-3xl p-5 shadow-xl transition-all', colorMap[sensor.status])}>
      <div className="flex items-start justify-between">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50')}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full px-2 py-1 text-xs font-semibold capitalize bg-white/50">
          {t(sensor.status)}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm opacity-80">{t(sensor.name_key)}</p>
        <p className="mt-1 text-3xl font-bold">
          {sensor.value}
          <span className="ml-1 text-lg font-normal opacity-70">{sensor.unit}</span>
        </p>
      </div>
    </div>
  );
}