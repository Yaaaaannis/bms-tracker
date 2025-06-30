'use client';

import { Tournament, Player, Set } from '@/lib/startgg';
import { Calendar, MapPin, Trophy, Clock, ExternalLink } from 'lucide-react';

interface PlayerEventsProps {
  player: Player | null;
  upcomingTournaments: Tournament[];
  recentSets: Set[];
  isLoading: boolean;
  error: string | null;
}

export default function PlayerEvents({ 
  player, 
  upcomingTournaments, 
  recentSets, 
  isLoading, 
  error 
}: PlayerEventsProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-white">Chargement des événements...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400">
            <Trophy className="w-5 h-5" />
            <h3 className="font-semibold">Erreur</h3>
          </div>
          <p className="mt-2 text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateText = (state: number) => {
    switch (state) {
      case 1: return 'En attente';
      case 2: return 'En cours';
      case 3: return 'Terminé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Player Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {player.prefix && <span className="text-blue-400">{player.prefix} | </span>}
              {player.gamerTag}
            </h1>
            <p className="text-gray-300">ID: {player.id}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Prochains tournois</h2>
        </div>

        {upcomingTournaments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Aucun tournoi à venir trouvé</p>
            <p className="text-sm text-gray-500 mt-1">
              Les tournois à venir apparaîtront ici une fois que le joueur s&apos;inscrira
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white line-clamp-2">{tournament.name}</h3>
                  <a
                    href={`https://start.gg/${tournament.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                {tournament.startAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(tournament.startAt)}</span>
                  </div>
                )}
                
                {(tournament.city || tournament.countryCode) && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {tournament.city && `${tournament.city}, `}
                      {tournament.countryCode}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Sets */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Sets récents</h2>
        </div>

        {recentSets.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Aucun set récent trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSets.slice(0, 10).map((set) => (
              <div key={set.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{set.event.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    set.state === 3 ? 'bg-green-500/20 text-green-300' :
                    set.state === 2 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {getStateText(set.state || 0)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">
                  {set.event.tournament.name}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    {set.displayScore && (
                      <span>Score: {set.displayScore}</span>
                    )}
                    {set.round && (
                      <span className="ml-3">Round {set.round}</span>
                    )}
                  </div>
                  
                  {set.completedAt && (
                    <div className="text-gray-400">
                      {formatDate(set.completedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 