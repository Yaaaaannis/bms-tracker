'use client';

import { Calendar, Clock } from 'lucide-react';

export type FilterType = 'upcoming' | 'past';

interface EventFiltersProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  upcomingCount?: number;
  pastCount?: number;
}

export default function EventFilters({ 
  selectedFilter, 
  onFilterChange, 
  upcomingCount = 0, 
  pastCount = 0 
}: EventFiltersProps) {
  const filters = [
    {
      id: 'upcoming' as FilterType,
      label: 'PROCHAINS',
      icon: Calendar,
      count: upcomingCount,
      color: 'blue'
    },
    {
      id: 'past' as FilterType,
      label: 'PASSÉS',
      icon: Clock,
      count: pastCount,
      color: 'gray'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">FILTRER LES ÉVÉNEMENTS</h3>
          <p className="text-sm sm:text-base text-gray-500 font-medium">Choisissez le type d&apos;événements à afficher</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                group relative p-4 sm:p-6 rounded-xl font-bold transition-all duration-300 border-2
                ${isSelected 
                  ? filter.color === 'blue' 
                    ? 'text-white shadow-lg transform scale-105' 
                    : 'bg-gray-600 text-white border-gray-600 shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-md'
                }
              `}
              style={isSelected && filter.color === 'blue' ? {backgroundColor: '#BE2D39', borderColor: '#BE2D39'} : {}}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors
                  ${isSelected 
                    ? 'bg-white/20' 
                    : filter.color === 'blue' 
                      ? 'group-hover:opacity-80' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}
                style={!isSelected && filter.color === 'blue' ? {backgroundColor: '#FEF1F2'} : {}}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isSelected 
                      ? 'text-white'
                      : filter.color === 'blue' 
                        ? '' 
                        : 'text-gray-600'
                  }`} style={!isSelected && filter.color === 'blue' ? {color: '#BE2D39'} : {}} />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="text-base sm:text-lg font-black tracking-tight">
                    {filter.label}
                  </div>
                  {filter.count > 0 && (
                    <div className={`
                      inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold mt-1 sm:mt-2
                      ${isSelected 
                        ? 'bg-white/20 text-white'
                        : filter.color === 'blue'
                          ? ''
                          : 'bg-gray-100 text-gray-700'
                      }
                    `}
                      style={!isSelected && filter.color === 'blue' ? {backgroundColor: '#FEF1F2', color: '#BE2D39'} : {}}
                    >
                      {filter.count} événements
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 