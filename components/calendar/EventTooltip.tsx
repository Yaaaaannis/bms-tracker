'use client';

import { Tournament, User } from '@/lib/startgg';
import { Clock, MapPin, ExternalLink, Calendar, Users } from 'lucide-react';

interface TournamentWithPlayers {
  tournament: Tournament;
  participatingPlayers: Array<{
    slug: string;
    user: User;
  }>;
}

interface EventTooltipProps {
  tournaments: Tournament[];
  tournamentPlayersMap?: Map<string, TournamentWithPlayers>;
  date: Date;
}

export default function EventTooltip({ tournaments, tournamentPlayersMap, date }: EventTooltipProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="absolute z-50 bottom-full left-0 mb-2 w-80 max-w-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div 
          className="px-4 py-3 text-white"
          style={{backgroundColor: '#BE2D39'}}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <h3 className="font-bold text-sm">
              {formatDate(date)}
            </h3>
          </div>
          <p className="text-xs opacity-90 mt-1">
            {tournaments.length} tournoi{tournaments.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Contenu */}
        <div className="max-h-64 overflow-y-auto">
          {tournaments.map((tournament, index) => (
            <div 
              key={tournament.id} 
              className={`p-4 ${index < tournaments.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                  {tournament.name}
                </h4>
                <a
                  href={`https://start.gg/${tournament.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-1">
                {tournament.startAt && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(tournament.startAt)}</span>
                  </div>
                )}

                {(tournament.city || tournament.countryCode) && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {tournament.city && `${tournament.city}, `}
                      {tournament.countryCode}
                    </span>
                  </div>
                )}

                {/* Afficher les joueurs participants */}
                {tournamentPlayersMap && tournamentPlayersMap.has(tournament.id) && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>
                      {tournamentPlayersMap.get(tournament.id)!.participatingPlayers
                        .map(player => {
                          const gamerTag = player.user.player?.gamerTag || player.user.name || player.slug;
                          const prefix = player.user.player?.prefix;
                          return prefix ? `${prefix} | ${gamerTag}` : gamerTag;
                        })
                        .join(', ')
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Flèche du tooltip */}
        <div 
          className="absolute top-full left-4 w-3 h-3 transform rotate-45 border-r border-b border-gray-200"
          style={{backgroundColor: 'white'}}
        />
      </div>
    </div>
  );
} 