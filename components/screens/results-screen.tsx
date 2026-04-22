'use client';

import { ResultCard } from '@/components/result-card';
import type { PredictionResult, CropType } from '@/lib/types';
import { useTranslation } from 'react-i18next';

interface ResultsScreenProps {
  result: PredictionResult;
  crop: CropType;
  imageUrl: string;
  onScanAgain: () => void;
}



export function ResultsScreen({ result, crop, imageUrl, onScanAgain }: ResultsScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('Analysis_Result')}</h1>
        <p className="mt-1 text-muted-foreground">
          {t("System diagnosis complete")}
        </p>
      </div>
      
      <ResultCard
        result={result}
        crop={crop}
        imageUrl={imageUrl}
        onScanAgain={onScanAgain}
      />
    </div>
  );
}
