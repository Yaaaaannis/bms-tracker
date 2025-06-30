'use client';

import { Clock, Wifi, WifiOff } from 'lucide-react';

interface CacheIndicatorProps {
  dataLoaded: boolean;
  lastLoadTime: number;
  cacheExpiry: number;
}

export default function CacheIndicator({ dataLoaded, lastLoadTime, cacheExpiry }: CacheIndicatorProps) {
  if (!dataLoaded) return null;

  const now = Date.now();
  const timeSinceLoad = now - lastLoadTime;
  const isFresh = timeSinceLoad < cacheExpiry;
  const timeRemaining = Math.max(0, cacheExpiry - timeSinceLoad);
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      {isFresh ? (
        <Wifi className="w-3 h-3 text-green-500" />
      ) : (
        <WifiOff className="w-3 h-3 text-orange-500" />
      )}
      <Clock className="w-3 h-3" />
      <span>
        Cache: {isFresh ? `${formatTime(timeRemaining)}` : 'Expiré'}
      </span>
    </div>
  );
} 