'use client';

import useSWR from 'swr';
import type { SensorData } from '@/lib/types';

interface WeatherData {
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  location: string;
  timestamp: string;
}

interface WeatherError {
  error: string;
}

const fetcher = async (url: string): Promise<WeatherData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch weather data');
  }
  return res.json();
};

function getTemperatureStatus(temp: number): 'normal' | 'warning' | 'critical' {
  if (temp < 10 || temp > 40) return 'critical';
  if (temp < 15 || temp > 35) return 'warning';
  return 'normal';
}

function getHumidityStatus(humidity: number): 'normal' | 'warning' | 'critical' {
  if (humidity < 20 || humidity > 90) return 'critical';
  if (humidity < 30 || humidity > 80) return 'warning';
  return 'normal';
}

export function useWeather(lat?: number, lon?: number) {
  const params = new URLSearchParams();
  if (lat !== undefined) params.set('lat', lat.toString());
  if (lon !== undefined) params.set('lon', lon.toString());
  
  const queryString = params.toString();
  const url = `/api/weather${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<WeatherData, Error>(
    url,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: true,
      dedupingInterval: 30000, // Dedupe requests within 30 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Transform weather data to sensor format
  const sensorData: SensorData[] = data
    ? [
        {
          id: 'temp-1',
          name: 'Temperature',
          value: data.temperature,
          unit: '°C',
          icon: 'temperature',
          status: getTemperatureStatus(data.temperature),
        },
        {
          id: 'humidity-1',
          name: 'Humidity',
          value: data.humidity,
          unit: '%',
          icon: 'humidity',
          status: getHumidityStatus(data.humidity),
        },
        {
          id: 'temp-2',
          name: 'Feels Like',
          value: data.apparentTemperature,
          unit: '°C',
          icon: 'temperature',
          status: getTemperatureStatus(data.apparentTemperature),
        },
      ]
    : [];

  return {
    weatherData: data,
    sensorData,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
