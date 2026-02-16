export type CropType = 'Tomato' | 'Mango';

export interface PredictionResult {
  confidence: number;
  precautions: string[];
  prediction: string;
  risk: string[];
  sensor: {
    humidity: number | null;
    moisture: number | null;
    temperature: number | null;
  };
}

export interface ScanHistoryItem {
  id: string;
  crop: CropType;
  disease: string;
  confidence: number;
  isHealthy: boolean;
  imageUrl: string;
  timestamp: Date;
}

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: 'temperature' | 'humidity' | 'soil';
  status: 'normal' | 'warning' | 'critical';
}

export const TREATMENT_MAP: Record<string, string> = {
  // Tomato diseases
  'Late Blight': 'Apply copper-based fungicide immediately. Remove affected leaves and ensure proper air circulation. Avoid overhead watering.',
  'Early Blight': 'Use chlorothalonil or copper fungicide. Remove lower affected leaves and mulch around plants to prevent soil splash.',
  'Septoria Leaf Spot': 'Apply fungicide containing chlorothalonil. Remove infected leaves and avoid working with wet plants.',
  'Bacterial Spot': 'Apply copper-based bactericide. Remove infected plant parts and practice crop rotation.',
  'Target Spot': 'Use fungicides containing azoxystrobin or chlorothalonil. Improve air circulation and avoid overhead irrigation.',
  'Tomato Yellow Leaf Curl Virus': 'Remove infected plants immediately. Control whitefly population with insecticides or yellow sticky traps.',
  'Tomato Mosaic Virus': 'Remove and destroy infected plants. Disinfect tools and wash hands before handling healthy plants.',
  'Spider Mites': 'Apply miticides or neem oil spray. Increase humidity and use predatory mites for biological control.',
  'Leaf Mold': 'Improve ventilation and reduce humidity. Apply fungicides containing chlorothalonil or copper.',
  
  // Mango diseases
  'Powdery Mildew': 'Apply sulfur-based fungicide or potassium bicarbonate spray. Ensure good air circulation around trees.',
  'Anthracnose': 'Use copper fungicide before and after flowering. Prune affected branches and remove fallen debris.',
  'Bacterial Canker': 'Apply copper bactericide. Prune infected branches at least 6 inches below visible symptoms.',
  'Sooty Mold': 'Control insect pests (aphids, mealybugs) that produce honeydew. Wash leaves with soapy water.',
  'Mango Malformation': 'Prune and destroy affected panicles. Apply fungicides during flowering season.',
  'Die Back': 'Prune affected branches and apply copper-based fungicide. Ensure proper nutrition and water management.',
  'Red Rust': 'Apply copper oxychloride spray. Remove severely affected leaves and improve tree nutrition.',
  
  // Healthy
  'Healthy': 'Your plant is healthy! Continue with regular care: proper watering, adequate sunlight, and balanced fertilization.',
  'healthy': 'Your plant is healthy! Continue with regular care: proper watering, adequate sunlight, and balanced fertilization.',
};

export function getTreatment(disease: string): string {
  // Check for exact match first
  if (TREATMENT_MAP[disease]) {
    return TREATMENT_MAP[disease];
  }
  
  // Check for partial match (case-insensitive)
  const lowerDisease = disease.toLowerCase();
  for (const [key, value] of Object.entries(TREATMENT_MAP)) {
    if (lowerDisease.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerDisease)) {
      return value;
    }
  }
  
  // Default treatment
  return 'Consult with a local agricultural expert for specific treatment recommendations. Consider taking the plant sample to your nearest agricultural extension office.';
}
