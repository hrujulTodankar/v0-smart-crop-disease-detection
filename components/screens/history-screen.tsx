'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock, Search, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { HistoryCard } from '@/components/history-card';
import { Button } from '@/components/ui/button';
import { getScanHistory } from '@/lib/history';
import type { ScanHistory } from '@/lib/types';

export function HistoryScreen() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHealthy, setFilterHealthy] = useState<boolean | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    const data = await getScanHistory();
    setHistory(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter and search history
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.crop.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterHealthy === null || item.isHealthy === filterHealthy;
      
      return matchesSearch && matchesFilter;
    });
  }, [history, searchQuery, filterHealthy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = history.length;
    const healthy = history.filter(item => item.isHealthy).length;
    const diseased = total - healthy;
    return { total, healthy, diseased };
  }, [history]);

  const handleFilterToggle = () => {
    if (filterHealthy === null) {
      setFilterHealthy(true); // Show only healthy
    } else if (filterHealthy === true) {
      setFilterHealthy(false); // Show only diseased
    } else {
      setFilterHealthy(null); // Show all
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Clock className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
        <p className="mt-2 text-muted-foreground">
          Your past disease analyses
        </p>
      </div>

      {/* Search and Filter */}
      <div className="glass-card flex items-center gap-3 rounded-2xl p-3 shadow-lg">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/50 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Button 
          variant={filterHealthy !== null ? "default" : "secondary"} 
          size="icon" 
          className="h-12 w-12 rounded-xl"
          onClick={handleFilterToggle}
          title={filterHealthy === null ? 'Show all' : filterHealthy ? 'Showing healthy' : 'Showing diseased'}
        >
          <Filter className="h-5 w-5" />
          <span className="sr-only">Filter</span>
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-12 w-12 rounded-xl"
          onClick={fetchHistory}
          disabled={isLoading}
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      {/* Filter indicator */}
      {filterHealthy !== null && (
        <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2 text-sm">
          <span className="text-primary">
            Showing: {filterHealthy ? 'Healthy plants only' : 'Diseased plants only'}
          </span>
          <button 
            onClick={() => setFilterHealthy(null)}
            className="text-primary underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Scans</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl font-bold text-success">{stats.healthy}</p>
          <p className="text-xs text-muted-foreground">Healthy</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl font-bold text-destructive">{stats.diseased}</p>
          <p className="text-xs text-muted-foreground">Diseased</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* History List */}
      {!isLoading && filteredHistory.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">
            Recent Scans {searchQuery && `(${filteredHistory.length} results)`}
          </h3>
          {filteredHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredHistory.length === 0 && (
        <div className="glass-card flex flex-col items-center rounded-3xl p-8 text-center shadow-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">
            {history.length === 0 ? 'No scans yet' : 'No matching scans'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {history.length === 0 
              ? 'Your scan history will appear here after analyzing a leaf'
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      )}
    </div>
  );
}
