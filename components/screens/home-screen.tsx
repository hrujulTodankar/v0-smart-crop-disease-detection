'use client';

import { Leaf, Sparkles } from 'lucide-react';
import { UploadCard } from '@/components/upload-card';
import { CropSelector } from '@/components/crop-selector';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader';
import type { CropType } from '@/lib/types';

interface HomeScreenProps {
  selectedCrop: CropType;
  onCropChange: (crop: CropType) => void;
  selectedImage: string | null;
  selectedFile: File | null;
  onImageSelect: (file: File, preview: string) => void;
  onClearImage: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function HomeScreen({
  selectedCrop,
  onCropChange,
  selectedImage,
  onImageSelect,
  onClearImage,
  onAnalyze,
  isAnalyzing,
}: HomeScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Leaf className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Smart Crop Disease Detection
        </h1>
        <p className="mt-2 text-muted-foreground">
          AI-powered diagnosis for healthier crops
        </p>
      </div>

      {/* Crop Selector */}
      <CropSelector selectedCrop={selectedCrop} onCropChange={onCropChange} />

      {/* Upload Card */}
      <UploadCard
        onImageSelect={onImageSelect}
        selectedImage={selectedImage}
        onClearImage={onClearImage}
      />

      {/* Analyze Button */}
      {selectedImage && (
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="h-16 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/30"
        >
          {isAnalyzing ? (
            <>
              <Loader size="sm" className="mr-3" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Leaf
            </>
          )}
        </Button>
      )}

      {/* Info Section */}
      <div className="glass-card rounded-3xl p-6 shadow-xl">
        <h3 className="mb-3 font-semibold text-foreground">How it works</h3>
        <ul className="space-y-3">
          {[
            { step: '1', text: 'Select your crop type (Tomato or Mango)' },
            { step: '2', text: 'Upload or capture a clear leaf image' },
            { step: '3', text: 'Get instant AI-powered disease diagnosis' },
            { step: '4', text: 'Receive treatment recommendations' },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
