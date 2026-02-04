import type { CropType, PredictionResult } from './types';

const API_URL = 'https://crop-disease-backend-fdyh.onrender.com/predict';
const TIMEOUT_MS = 120000; // 120 seconds timeout for cold start on free tier
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Single fetch attempt with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

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

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[v0] Attempt ${attempt} of ${MAX_RETRIES}`);
    
    try {
      const response = await fetchWithTimeout(API_URL, {
        method: 'POST',
        body: formData,
      }, TIMEOUT_MS);

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
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`[v0] Attempt ${attempt} timed out after ${TIMEOUT_MS}ms`);
          lastError = new Error('Request timed out. The server may be starting up.');
        } else {
          console.error(`[v0] Attempt ${attempt} failed:`, error.message);
          lastError = error;
        }
      } else {
        lastError = new Error('An unexpected error occurred');
      }

      // Retry if we haven't exhausted attempts
      if (attempt < MAX_RETRIES) {
        console.log(`[v0] Waiting ${RETRY_DELAY_MS}ms before retry...`);
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  // All retries failed
  throw new Error(
    lastError?.message || 'Failed to analyze image after multiple attempts. Please check your connection and try again.'
  );
}

// Format disease name for better readability
function formatDiseaseName(disease: string): string {
  // Remove underscores and format
  return disease
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
