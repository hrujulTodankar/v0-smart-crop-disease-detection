'use client';

import { cn } from '@/lib/utils';
import { Home, Leaf, Activity, Clock } from 'lucide-react';

export type TabType = 'home' | 'results' | 'sensors' | 'history';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasResults?: boolean;
}

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'results' as const, label: 'Results', icon: Leaf },
  { id: 'sensors' as const, label: 'Sensors', icon: Activity },
  { id: 'history' as const, label: 'History', icon: Clock },
];

export function BottomNav({ activeTab, onTabChange, hasResults }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-card/90 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.id === 'results' && !hasResults;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 transition-all duration-300',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isDisabled && 'cursor-not-allowed opacity-40'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
