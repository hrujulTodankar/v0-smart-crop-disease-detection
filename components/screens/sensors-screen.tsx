'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SensorCard } from '@/components/sensor-card';
import { WifiOff } from 'lucide-react';
import type { SensorData } from '@/lib/types';

interface SensorsScreenProps {
  sensors?: SensorData[] | null;
}

export function SensorsScreen({ sensors }: SensorsScreenProps) {
  const { t } = useTranslation();

  // Check if we have sensor data passed down from the backend
  const hasSensors = sensors && sensors.length > 0;

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-foreground mb-6">{t('sensors_title')}</h2>
      
      {!hasSensors ? (
        // UI when NO DATA is present (Just like your screenshot!)
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-3xl shadow-sm">
          <WifiOff className="h-16 w-16 text-muted-foreground/60 mb-4" />
          <h3 className="text-xl font-bold text-foreground">{t('sensors_disconnected')}</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto">
            {t('sensors_check_connection')}
          </p>
          {/* Note: I removed the retry button, because they just need to scan a leaf on the Home screen now */}
        </div>
      ) : (
        // UI when DATA ARRIVES FROM BACKEND
        <div className="grid grid-cols-1 gap-4">
          {sensors.map((s) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>
      )}
    </div>
  );
}