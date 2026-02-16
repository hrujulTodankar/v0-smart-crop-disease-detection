'use client';

import { useState, useCallback } from 'react';
import { BottomNav, type TabType } from '@/components/bottom-nav';
import { HomeScreen } from '@/components/screens/home-screen';
import { ResultsScreen } from '@/components/screens/results-screen';
import { SensorsScreen } from '@/components/screens/sensors-screen';
import { HistoryScreen } from '@/components/screens/history-screen';
import { FullPageLoader } from '@/components/loader';
import { predictDisease } from '@/lib/api';
import type { CropType, PredictionResult, ScanHistoryItem } from '@/lib/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Tomato');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setError(null);
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedFile(null);
    setSelectedImage(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await predictDisease(selectedFile, selectedCrop);
      setPredictionResult(result);
      
      // Add to scan history
      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        crop: selectedCrop,
        disease: result.prediction === 'healthy' ? 'Healthy' : result.prediction.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        confidence: result.confidence / 100,
        isHealthy: result.prediction === 'healthy',
        imageUrl: selectedImage!,
        timestamp: new Date(),
      };
      setScanHistory(prev => [historyItem, ...prev]);
      
      setActiveTab('results');
    } catch (err) {
      console.error('[v0] Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, selectedCrop]);

  const handleScanAgain = useCallback(() => {
    setPredictionResult(null);
    setSelectedFile(null);
    setSelectedImage(null);
    setActiveTab('home');
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <main className="gradient-bg min-h-screen pb-24">
      {isAnalyzing && <FullPageLoader />}
      
      <div className="mx-auto max-w-lg px-4 py-6">
        {activeTab === 'home' && (
          <HomeScreen
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            selectedImage={selectedImage}
            selectedFile={selectedFile}
            onImageSelect={handleImageSelect}
            onClearImage={handleClearImage}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {activeTab === 'results' && predictionResult && selectedImage && (
          <ResultsScreen
            result={predictionResult}
            crop={selectedCrop}
            imageUrl={selectedImage}
            onScanAgain={handleScanAgain}
          />
        )}
        
        {activeTab === 'sensors' && <SensorsScreen />}
        
        {activeTab === 'history' && <HistoryScreen history={scanHistory} />}
        
        {/* Error Display */}
        {error && (
          <div className="mt-4 glass-card rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 shadow-lg">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-muted-foreground underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasResults={!!predictionResult}
      />
    </main>
  );
}
