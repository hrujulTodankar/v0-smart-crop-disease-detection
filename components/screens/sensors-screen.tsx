'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SensorCard } from '@/components/sensor-card';
import { WifiOff, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SensorsScreen() {
  const { t } = useTranslation();
  const [sensors, setSensors] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Logic to fetch sensor data
  useEffect(() => {
    const fetchSensors = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to your sensor backend
        const response = await fetch('/api/sensors'); 
        if (!response.ok) throw new Error('Disconnected');
        
        const data = await response.json();
        setSensors(data);
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensors();
  }, []);

  if (isLoading) return <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t('sensors_title')}</h2>
      
      {!isConnected ? (
        // UI when DISCONNECTED
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-3xl">
          <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">{t('sensors_disconnected')}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t('sensors_check_connection')}</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            {t('retry')}
          </Button>
        </div>
      ) : (
        // UI when CONNECTED
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensors.map((s: any) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>
      )}
    </div>
  );
}