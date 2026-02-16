'use client';

import { cn } from '@/lib/utils';
import type { CropType } from '@/lib/types';

interface CropSelectorProps {
  selectedCrop: CropType;
  onCropChange: (crop: CropType) => void;
}

const crops: { id: CropType; label: string; emoji: string; color: string; disabled?: boolean }[] = [
  { id: 'Tomato', label: 'Tomato', emoji: '🍅', color: 'from-red-400 to-red-500' },
  { id: 'Mango', label: 'Mango', emoji: '🥭', color: 'from-amber-400 to-orange-500' },
];

export function CropSelector({ selectedCrop, onCropChange }: CropSelectorProps) {
  return (
    <div className="glass-card rounded-3xl p-4 shadow-xl">
      <label className="mb-3 block text-sm font-medium text-muted-foreground">
        Select Your Crop
      </label>
      <div className="grid grid-cols-2 gap-3">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => onCropChange(crop.id)}
            className={cn(
              'relative flex items-center justify-center gap-3 rounded-2xl p-4 transition-all duration-300',
              selectedCrop === crop.id
                ? `bg-gradient-to-r ${crop.color} text-white shadow-lg scale-[1.02]`
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            )}
          >
            <span className="text-2xl">{crop.emoji}</span>
            <span className="font-semibold">{crop.label}</span>
            {selectedCrop === crop.id && (
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary shadow-md">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
