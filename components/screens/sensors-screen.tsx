'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SensorCard } from '@/components/sensor-card';
import { WifiOff } from 'lucide-react';

// 1. This matches the exact shape of the object coming from your Python backend
interface BackendSensorData {
  temperature: number | null;
  humidity: number | null;
  moisture: number | null;
}

// 2. We expect "sensorData" as the prop, NOT the old "sensors" array
interface SensorsScreenProps {
  sensorData?: BackendSensorData | null;
}

export function SensorsScreen({ sensorData }: SensorsScreenProps) {
  const { t } = useTranslation();

  // 3. Clean, safe check to see if we actually received data
  const hasSensors = sensorData && (
    sensorData.temperature !== null ||
    sensorData.humidity !== null ||
    sensorData.moisture !== null
  );

  // 4. Transform the flat object into the array that SensorCard expects
  const formattedSensors = hasSensors ? [
    {
      id: 'temp',
      name_key: 'Temperature',
      value: sensorData.temperature ?? 0,
      unit: '°C',
      icon: 'temperature',
      status: 'normal'
    },
    {
      id: 'hum',
      name_key: 'Humidity',
      value: sensorData.humidity ?? 0,
      unit: '%',
      icon: 'humidity',
      status: 'normal'
    },
    {
      id: 'soil',
      name_key: 'Soil Moisture',
      value: sensorData.moisture ?? 0,
      unit: '%',
      icon: 'soil',
      status: 'normal'
    }
  ] : [];

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-foreground mb-6">{t('sensors_title')}</h2>
      
      {!hasSensors ? (
        // UI when NO DATA is present
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-3xl shadow-sm">
          <WifiOff className="h-16 w-16 text-muted-foreground/60 mb-4" />
          <h3 className="text-xl font-bold text-foreground">{t('sensors_disconnected')}</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto">
            {t('sensors_check_connection')}
          </p>
        </div>
      ) : (
        // UI when DATA ARRIVES FROM BACKEND
        <div className="grid grid-cols-1 gap-4">
          {/* 5. Map over "formattedSensors", NOT the raw prop */}
          {formattedSensors.map((s: any) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>
      )}
    </div>
  );
}