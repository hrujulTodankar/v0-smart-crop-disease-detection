import { createClient } from '@/lib/supabase/client';
import type { ScanHistory, CropType, PredictionResult } from './types';

export async function saveScanHistory(
  crop: CropType,
  result: PredictionResult,
  imageUrl?: string
): Promise<ScanHistory | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('scan_history')
    .insert({
      crop: crop.toLowerCase(),
      disease: result.disease,
      confidence: result.confidence,
      is_healthy: result.isHealthy,
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[v0] Error saving scan history:', error);
    return null;
  }

  return {
    id: data.id,
    crop: data.crop as CropType,
    disease: data.disease,
    confidence: data.confidence,
    isHealthy: data.is_healthy,
    imageUrl: data.image_url,
    date: new Date(data.created_at),
  };
}

export async function getScanHistory(limit = 50): Promise<ScanHistory[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('scan_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[v0] Error fetching scan history:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    crop: (item.crop.charAt(0).toUpperCase() + item.crop.slice(1)) as CropType,
    disease: item.disease,
    confidence: Number(item.confidence),
    isHealthy: item.is_healthy,
    imageUrl: item.image_url,
    date: new Date(item.created_at),
  }));
}

export async function deleteScanHistory(id: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('scan_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[v0] Error deleting scan history:', error);
    return false;
  }

  return true;
}
