import type { CropType, PredictionResult } from './types';

// Use our own API route as a proxy to avoid CORS issues
const API_URL = '/api/predict';

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('crop', crop.toLowerCase());

  console.log('[v0] Sending prediction request via proxy');
  console.log('[v0] File name:', image.name, 'Size:', image.size, 'Type:', image.type);
  console.log('[v0] Crop type:', crop);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  console.log('[v0] Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('[v0] API Error:', errorData);
    throw new Error(errorData.error || `Prediction failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('[v0] API Response:', JSON.stringify(data, null, 2));
  
  // Check if there's an error in the response
  if (data.error) {
    throw new Error(data.error);
  }
  
  // Parse the API response - handle multiple possible response formats
  const disease = data.disease || data.prediction || data.class || data.label || data.result || 'Unknown';
  
  // Handle confidence - could be 0-1 or 0-100
  let confidence = data.confidence || data.probability || data.score || 0;
  if (confidence > 1) {
    confidence = confidence / 100; // Convert percentage to decimal
  }
  
  // Determine if healthy - check various possible field names and values
  const diseaseLower = disease.toLowerCase();
  const healthyFromName = 
    diseaseLower.includes('healthy') ||
    diseaseLower === 'healthy' ||
    diseaseLower.includes('no disease') ||
    diseaseLower.includes('normal');
  const isHealthy = data.isHealthy ?? data.is_healthy ?? data.healthy ?? healthyFromName;

  const result: PredictionResult = {
    disease: formatDiseaseName(disease),
    confidence,
    isHealthy,
  };
  
  console.log('[v0] Parsed result:', result);
  return result;
}

// Format disease name for better readability
function formatDiseaseName(disease: string): string {
  // Remove underscores and format
  return disease
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
