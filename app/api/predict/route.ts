import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const cropType = formData.get('crop_type') as string;

    if (!file) {
      return NextResponse.json({ error: 'image missing' }, { status: 400 });
    }

    // Mock prediction logic - replace with actual ML model
    const diseases = {
      tomato: ['Healthy', 'Early Blight', 'Late Blight', 'Leaf Mold', 'Septoria Leaf Spot'],
      mango: ['Healthy', 'Anthracnose', 'Bacterial Canker', 'Cutting Weevil', 'Die Back']
    };

    const cropDiseases = diseases[cropType?.toLowerCase() as keyof typeof diseases] || diseases.tomato;
    const randomDisease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
    const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
    const isHealthy = randomDisease === 'Healthy';

    return NextResponse.json({
      confidence: Math.round(confidence * 100 * 100) / 100,
      precautions: isHealthy 
        ? ["Crop is healthy", "Maintain proper irrigation", "Regular monitoring recommended"]
        : [`Treatment needed for ${randomDisease}`, "Apply appropriate fungicide", "Monitor plant closely"],
      prediction: isHealthy ? "healthy" : randomDisease.toLowerCase().replace(/\s+/g, '_'),
      risk: ["Sensor data not available"],
      sensor: {
        humidity: null,
        moisture: null,
        temperature: null
      }
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}