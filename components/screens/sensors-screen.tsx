'use client';

import { Activity, Wifi, WifiOff } from 'lucide-react';
import { SensorCard, mockSensorData } from '@/components/sensor-card';

export function SensorsScreen() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Activity className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">IoT Sensors</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time farm monitoring
        </p>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mockSensorData.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      
    </div>
  );
}
