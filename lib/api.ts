import type { CropType, PredictionResult } from './types';

const API_URL = 'https://crop-disease-backend-fdyh.onrender.com/predict';
const TIMEOUT_MS = 60000; // 60 seconds timeout for cold start on free tier

export async function predictDisease(
  image: File,
  crop: CropType
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('crop', crop.toLowerCase());

  console.log('[v0] Sending prediction request to:', API_URL);
  console.log('[v0] File name:', image.name, 'Size:', image.size, 'Type:', image.type);
  console.log('[v0] Crop type:', crop);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    console.log('[v0] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[v0] API Error:', errorText);
      throw new Error(`Prediction failed: ${response.status} - ${errorText || response.statusText}`);
    }

    const data = await response.json();
    console.log('[v0] API Response:', JSON.stringify(data, null, 2));
    
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
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[v0] Request timeout after', TIMEOUT_MS, 'ms');
        throw new Error('Request timed out. The server may be starting up - please try again in a moment.');
      }
      console.error('[v0] Fetch Error:', error.message);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    
    console.error('[v0] Unknown Error:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

// Format disease name for better readability
function formatDiseaseName(disease: string): string {
  // Remove underscores and format
  return disease
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
