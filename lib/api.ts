import type { CropType, PredictionResult } from './types';

const API_URL = '/api/predict';

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('crop_type', crop.toLowerCase());

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Backend may be starting up or CORS issue.');
    }
    if (error instanceof Error && error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}
