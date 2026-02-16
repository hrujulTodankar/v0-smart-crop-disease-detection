import type { CropType, PredictionResult } from './types';

const API_URL = '/api/predict';

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('crop_type', crop.toLowerCase());

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please check your internet connection.');
    }
    throw error;
  }
}
