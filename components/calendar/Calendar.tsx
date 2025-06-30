'use client';

import { useState } from 'react';
import { Tournament, User } from '@/lib/startgg';
import { CalendarHeader, CalendarGrid } from '.';

interface TournamentWithPlayers {
  tournament: Tournament;
  participatingPlayers: Array<{
    slug: string;
    user: User;
  }>;
}

interface CalendarProps {
  tournaments: Tournament[];
  tournamentsWithPlayers?: TournamentWithPlayers[];
  onClose?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  dataLoaded?: boolean;
  lastLoadTime?: number;
  cacheExpiry?: number;
}

export default function Calendar({ 
  tournaments, 
  tournamentsWithPlayers, 
  onClose, 
  onRefresh, 
  isLoading,
  dataLoaded,
  lastLoadTime,
  cacheExpiry
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg border border-gray-100">
      <CalendarHeader 
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onClose={onClose}
        onRefresh={onRefresh}
        isLoading={isLoading}
        dataLoaded={dataLoaded}
        lastLoadTime={lastLoadTime}
        cacheExpiry={cacheExpiry}
      />
      <CalendarGrid 
        currentDate={currentDate}
        tournaments={tournaments}
        tournamentsWithPlayers={tournamentsWithPlayers}
      />
    </div>
  );
} 