import type { CropType, PredictionResult } from './types';

const API_URL = 'https://crop-disease-backend-fdyh.onrender.com/predict';

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('crop', crop);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Parse the API response
  // The API returns: disease name, confidence percentage, and whether the plant is healthy
  return {
    disease: data.disease || data.prediction || data.class || 'Unknown',
    confidence: data.confidence || data.probability || 0,
    isHealthy: data.isHealthy ?? data.is_healthy ?? 
      (data.disease?.toLowerCase().includes('healthy') || 
       data.prediction?.toLowerCase().includes('healthy') ||
       data.class?.toLowerCase().includes('healthy')) ?? false,
  };
}
