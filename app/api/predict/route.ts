import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://crop-disease-backend-fdyh.onrender.com/predict';
const TIMEOUT_MS = 120000; // 120 seconds for cold start

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file');
    const crop = formData.get('crop');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Create new FormData for the backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    if (crop) {
      backendFormData.append('crop', crop.toString());
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: backendFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[API] Backend error:', response.status, errorText);
        return NextResponse.json(
          { error: `Backend error: ${response.status}`, details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out. The server may be starting up.' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('[API] Predict error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
