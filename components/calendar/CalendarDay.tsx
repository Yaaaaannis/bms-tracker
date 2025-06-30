'use client';

import { useState } from 'react';
import { Tournament, User } from '@/lib/startgg';
import EventTooltip from './EventTooltip';

interface TournamentWithPlayers {
  tournament: Tournament;
  participatingPlayers: Array<{
    slug: string;
    user: User;
  }>;
}

interface CalendarDayProps {
  date: Date;
  tournaments: Tournament[];
  tournamentPlayersMap?: Map<string, TournamentWithPlayers>;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function CalendarDay({ 
  date, 
  tournaments, 
  tournamentPlayersMap,
  isCurrentMonth, 
  isToday 
}: CalendarDayProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const dayNumber = date.getDate();
  const hasTournaments = tournaments.length > 0;

  return (
    <div className="relative">
      <div
        className={`
          min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all duration-200
          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
          ${isToday ? 'ring-2 ring-offset-2' : 'border-gray-200'}
          ${hasTournaments ? 'hover:shadow-md' : 'hover:bg-gray-50'}
        `}
        style={{
          '--tw-ring-color': isToday ? '#BE2D39' : undefined
        } as React.CSSProperties}
        onMouseEnter={() => hasTournaments && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Numéro du jour */}
        <div className="flex items-center justify-between mb-1">
          <span 
            className={`
              text-sm font-bold
              ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
              ${isToday ? 'text-white' : ''}
            `}
          >
            {isToday && (
              <span 
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                style={{backgroundColor: '#BE2D39'}}
              >
                {dayNumber}
              </span>
            )}
            {!isToday && dayNumber}
          </span>
          
          {/* Indicateur de tournois */}
          {hasTournaments && (
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{backgroundColor: '#BE2D39'}}
              />
              {tournaments.length > 1 && (
                <span 
                  className="text-xs font-bold px-1 rounded text-white"
                  style={{backgroundColor: '#BE2D39'}}
                >
                  {tournaments.length}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Aperçu des tournois */}
        {hasTournaments && isCurrentMonth && (
          <div className="space-y-1">
            {tournaments.slice(0, 2).map(tournament => (
              <div 
                key={tournament.id}
                className="text-xs p-1 rounded text-white truncate"
                style={{backgroundColor: '#BE2D39'}}
                title={tournament.name}
              >
                {tournament.name}
              </div>
            ))}
            {tournaments.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{tournaments.length - 2} autres
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tooltip avec détails */}
      {showTooltip && hasTournaments && (
        <EventTooltip 
          tournaments={tournaments}
          tournamentPlayersMap={tournamentPlayersMap}
          date={date}
        />
      )}
    </div>
  );
} 