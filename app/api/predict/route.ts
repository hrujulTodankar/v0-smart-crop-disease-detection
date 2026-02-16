import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URLS = {
  tomato: 'https://crop-disease-backend-fdyh.onrender.com/predict',
  mango: 'https://mango-backend-s6px.onrender.com/predict'
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cropType = formData.get('crop_type') as string;
    const file = formData.get('file');
    
    const backendUrl = BACKEND_URLS[cropType?.toLowerCase() as keyof typeof BACKEND_URLS] || BACKEND_URLS.tomato;
    
    const backendFormData = new FormData();
    if (file) backendFormData.append('file', file);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json({ error: errorText || 'Backend error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 500 });
  }
}