"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Note: Based on your screenshot, this should likely be '@/components/ui/crop-selector'
import { CropSelector } from '@/components/crop-selector'; 
import type { CropType } from '@/lib/types';

const LeafAnalyzer = () => {
  const { t, i18n } = useTranslation();

  // 1. Fixed State: Using the exact CropType to match your selector
  const [crop, setCrop] = useState<CropType>('Tomato');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Fixed URLs: Keys now perfectly match the 'Tomato' | 'Mango' state
  const API_URLS: Record<string, string> = {
    Tomato: "https://crop-disease-backend-fdyh.onrender.com/predict",
    Mango: "https://mango-backend-s6px.onrender.com/predict"
  };

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Safely fetches the correct URL based on the 'Tomato' or 'Mango' state
      const response = await fetch(API_URLS[crop], {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      
      {/* Language Switcher */}
      <div className="flex justify-end mb-4">
        <select
          onChange={changeLanguage}
          defaultValue={i18n.language}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 cursor-pointer outline-none"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="mr">मराठी (Marathi)</option>
        </select>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {t('app_title')}
      </h2>

      {/* 3. Fixed UI: Using your custom component instead of inline buttons */}
      <div className="mb-6">
        <CropSelector 
          selectedCrop={crop} 
          onCropChange={(newCrop) => {
            setCrop(newCrop);
            setResult(null); // Clear previous results when swapping crops
            setError(null);
          }} 
        />
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 text-center hover:bg-gray-50 transition-colors">
        <p className="mb-4 text-sm text-gray-500 font-medium">
          {t('upload_instruction')}
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
        />

        {previewUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={previewUrl}
              alt="Leaf Preview"
              className="max-h-48 rounded-lg object-contain shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
          !selectedFile || loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? t('analyzing') : t('analyze_button')}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      {/* Results Area */}
      {result && (
        <div className="mt-6 p-5 bg-green-50 rounded-lg border border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-green-800 mb-3 border-b border-green-200 pb-2">
            {t('diagnosis_complete')}
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold">{t('disease_detected')}</span>{' '}
              <span className="font-bold text-red-600 ml-1">{t(result.disease)}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">{t('confidence')}</span>{' '}
              <span className="font-bold text-green-700 ml-1">{result.confidence_percentage}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafAnalyzer;