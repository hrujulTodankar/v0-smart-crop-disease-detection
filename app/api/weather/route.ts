import { NextResponse } from 'next/server';

export interface WeatherData {
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  location: string;
  timestamp: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '20.5937'; // Default: India (central)
    const lon = searchParams.get('lon') || '78.9629';

    // Using Open-Meteo API (free, no API key required)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=auto`,
      { 
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      humidity: Math.round(data.current.relative_humidity_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature * 10) / 10,
      location: `${lat}, ${lon}`,
      timestamp: data.current.time,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
