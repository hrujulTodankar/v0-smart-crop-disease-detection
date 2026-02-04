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

      {/* Connection Status */}
      <div className="glass-card rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <Wifi className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Connected</p>
              <p className="text-sm text-muted-foreground">4 sensors online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mockSensorData.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      {/* Info Card */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <WifiOff className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Demo Mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This is a preview with simulated sensor data. Connect your IoT devices to see real-time readings from your farm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
