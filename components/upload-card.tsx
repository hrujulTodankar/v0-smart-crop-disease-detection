'use client';

import React from "react"

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Camera, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadCardProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClearImage: () => void;
}

export function UploadCard({ onImageSelect, selectedImage, onClearImage }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (file: File) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageSelect(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (selectedImage) {
    return (
      <div className="relative overflow-hidden rounded-3xl glass-card shadow-xl">
        <img
          src={selectedImage || "/placeholder.svg"}
          alt="Selected leaf"
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Button
          onClick={onClearImage}
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-10 w-10 rounded-full shadow-lg"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Remove image</span>
        </Button>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
          <ImageIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Leaf image ready for analysis</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'glass-card rounded-3xl p-8 transition-all duration-300 shadow-xl',
        isDragging && 'ring-2 ring-primary ring-offset-2 scale-[1.02]'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Camera className="h-4 w-4" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Upload Leaf Image
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Take a photo or select from gallery
          </p>
        </div>
        
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="flex-1 h-14 rounded-2xl text-base font-semibold"
          >
            <Upload className="mr-2 h-5 w-5" />
            Browse Files
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Supports JPG, PNG, HEIC formats
        </p>
      </div>
    </div>
  );
}
