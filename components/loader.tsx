'use client';

import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-4 border-primary/20 border-t-primary animate-spin',
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            'absolute inset-0 rounded-full border-4 border-transparent border-r-primary/40 animate-spin',
            sizeClasses[size]
          )}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function FullPageLoader({ text = 'Analyzing your leaf...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 shadow-xl text-center max-w-xs">
        <Loader size="lg" />
        <p className="mt-4 text-base font-medium text-foreground">{text}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Our AI is examining the leaf patterns and comparing against known diseases.
        </p>
        <p className="mt-3 text-xs text-muted-foreground/70">
          This may take a moment on first load
        </p>
      </div>
    </div>
  );
}
