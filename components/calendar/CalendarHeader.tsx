'use client';

import { ChevronLeft, ChevronRight, X, Calendar, RefreshCw } from 'lucide-react';
import CacheIndicator from './CacheIndicator';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClose?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  dataLoaded?: boolean;
  lastLoadTime?: number;
  cacheExpiry?: number;
}

export default function CalendarHeader({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth, 
  onClose,
  onRefresh,
  isLoading = false,
  dataLoaded = false,
  lastLoadTime = 0,
  cacheExpiry = 300000
}: CalendarHeaderProps) {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      {/* Logo et titre */}
      <div className="flex items-center gap-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
          style={{background: 'linear-gradient(135deg, #BE2D39 0%, #A12630 100%)'}}
        >
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            AGENDA
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 font-medium">
              TOURNOIS ESPORTS
            </p>
            <CacheIndicator 
              dataLoaded={dataLoaded}
              lastLoadTime={lastLoadTime}
              cacheExpiry={cacheExpiry}
            />
          </div>
        </div>
      </div>

      {/* Navigation mois/année */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center min-w-[200px]">
          <h2 className="text-xl font-black text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <button
          onClick={onNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bouton refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Actualiser les données"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* Bouton fermer */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
} 