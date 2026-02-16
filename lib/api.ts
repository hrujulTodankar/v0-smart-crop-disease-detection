import type { CropType, PredictionResult } from './types';

const API_URL = '/api/predict';

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('crop', crop);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend error. Please try again.`);
    }

    const data = await response.json();
    console.log('Backend response:', data);
    
    const disease = data.disease || data.prediction || data.class || 'Unknown';
    const confidence = typeof data.confidence === 'number' ? data.confidence : (typeof data.probability === 'number' ? data.probability : 0);
    const isHealthy = data.isHealthy ?? data.is_healthy ?? (disease ? disease.toLowerCase().includes('healthy') : false);

    return { disease, confidence, isHealthy };
  } catch (error) {
    console.error('Prediction error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please check your internet connection.');
    }
    throw error;
  }
}
