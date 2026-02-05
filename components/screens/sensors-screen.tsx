'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, Wifi, WifiOff, RefreshCw, MapPin, AlertCircle } from 'lucide-react';
import { SensorCard, soilMoistureSensor } from '@/components/sensor-card';
import { useWeather } from '@/hooks/use-weather';
import { Button } from '@/components/ui/button';

export function SensorsScreen() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { sensorData, isLoading, isError, error, refresh, weatherData } = useWeather(
    location?.lat,
    location?.lon
  );

  // Get user's location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
        },
        () => {
          // Use default location (India) if geolocation fails
          setLocationError('Using default location. Enable location for local weather.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Update last updated time when data changes
  useEffect(() => {
    if (weatherData && !isLoading) {
      setLastUpdated(new Date());
    }
  }, [weatherData, isLoading]);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // Combine real weather data with mock soil moisture
  const allSensorData = [...sensorData, soilMoistureSensor];

  const sensorCount = isError ? 1 : allSensorData.length;
  const isConnected = !isError && sensorData.length > 0;

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
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isConnected ? 'bg-success/10' : 'bg-destructive/10'}`}>
              {isConnected ? (
                <Wifi className="h-5 w-5 text-success" />
              ) : (
                <WifiOff className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </p>
              <p className="text-sm text-muted-foreground">
                {sensorCount} sensor{sensorCount !== 1 ? 's' : ''} {isConnected ? 'online' : 'available'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <div className="flex items-center gap-2">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'animate-pulse bg-success' : 'bg-destructive'}`} />
              )}
              <span className="text-xs text-muted-foreground">
                {isLoading ? 'Updating' : 'Live'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Info */}
      {(location || locationError) && (
        <div className="glass-card rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            {location ? (
              <span className="text-muted-foreground">
                Weather data for {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
              </span>
            ) : (
              <span className="text-warning">{locationError}</span>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="glass-card rounded-2xl border border-destructive/20 bg-destructive/5 p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Failed to load weather data</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {error?.message || 'Please check your connection and try again.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-3 bg-transparent"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Grid */}
      <div className="grid gap-4">
        {isLoading && sensorData.length === 0 ? (
          // Loading skeletons
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card rounded-3xl p-5 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="mt-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-9 w-24 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </>
        ) : (
          allSensorData.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} isLoading={isLoading} />
          ))
        )}
      </div>

      {/* Refresh Button */}
      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={isLoading}
        className="w-full bg-transparent"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Updating...' : 'Refresh Data'}
      </Button>

      {/* Info Card */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live Weather Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Temperature and humidity are fetched in real-time from weather services. 
              Data refreshes automatically every 60 seconds. Soil moisture requires physical IoT sensors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
