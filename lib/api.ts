import type { CropType, PredictionResult } from './types';

const API_URL = '/api/predict';

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  if (crop === 'Mango') {
    throw new Error('Mango disease detection is coming soon. Please select Tomato.');
  }

  try {
    const formData = new FormData();
    formData.append('file', image);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend error. Please try again.`);
    }

    const data = await response.json();
    
    const disease = data.disease || data.prediction || data.class || 'Unknown';
    const confidence = data.confidence ?? data.probability ?? 0;
    const isHealthy = data.isHealthy ?? data.is_healthy ?? 
      disease.toLowerCase().includes('healthy');

    return { disease, confidence, isHealthy };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please check your internet connection.');
    }
    throw error;
  }
}
