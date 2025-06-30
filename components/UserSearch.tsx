'use client';

import { useState } from 'react';
import { startggService, User, UserSet } from '@/lib/startgg';
import { User as UserIcon, Search, ExternalLink, Trophy, Calendar, MapPin, Users, GamepadIcon } from 'lucide-react';

export default function UserSearch() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSlug, setUserSlug] = useState('');

  const searchUser = async () => {
    if (!userSlug.trim()) {
      setError('Veuillez entrer un slug d&apos;utilisateur');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await startggService.getUser(userSlug);
      setUser(userData);
      
      if (!userData) {
        setError('Aucun utilisateur trouvé');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Erreur lors de la récupération de l&apos;utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const extractSlugFromUrl = (input: string): string => {
    // Si c'est une URL complète, extraire le slug
    if (input.includes('start.gg/user/')) {
      const match = input.match(/start\.gg\/user\/([^/?#]+)/);
      return match ? match[1] : input;
    }
    return input;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = extractSlugFromUrl(value);
    setUserSlug(slug);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Date inconnue';
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRange = (startAt?: number, endAt?: number) => {
    if (!startAt) return 'Date inconnue';
    
    const start = new Date(startAt * 1000);
    const end = endAt ? new Date(endAt * 1000) : null;
    
    if (end && start.toDateString() !== end.toDateString()) {
      return `${formatDate(startAt)} - ${formatDate(endAt)}`;
    }
    return formatDate(startAt);
  };

  const getBestImage = (set: UserSet): string | null => {
    // Priorité : Event image > Tournament image > Videogame image
    if (set.event?.images && set.event.images.length > 0) {
      return set.event.images[0].url;
    }
    
    if (set.event?.tournament?.images && set.event.tournament.images.length > 0) {
      return set.event.tournament.images[0].url;
    }
    
    if (set.event?.videogame?.images && set.event.videogame.images.length > 0) {
      return set.event.videogame.images[0].url;
    }
    
    return null;
  };

  const getUniqueEvents = (sets: UserSet[]): UserSet[] => {
    const eventMap = new Map<string, UserSet>();
    
    sets.forEach(set => {
      if (set.event?.id) {
        // Si on n'a pas encore cet événement, on l'ajoute
        if (!eventMap.has(set.event.id)) {
          eventMap.set(set.event.id, set);
        }
      }
    });
    
    return Array.from(eventMap.values());
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-white">Recherche de Joueur</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="user-search" className="block text-sm font-medium text-gray-300 mb-2">
            URL ou slug d&apos;utilisateur
          </label>
          <div className="flex gap-2">
            <input
              id="user-search"
              type="text"
              value={userSlug}
              onChange={handleInputChange}
              placeholder="c28aec41 ou https://www.start.gg/user/c28aec41"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={searchUser}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-md transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              Rechercher
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {user && (
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md">
            <h3 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Joueur trouvé
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Informations de base */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Informations générales</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><strong>ID :</strong> {user.id}</p>
                  <p><strong>Slug :</strong> {user.slug}</p>
                  {user.name && <p><strong>Nom :</strong> {user.name}</p>}
                  {user.bio && <p><strong>Bio :</strong> {user.bio}</p>}
                </div>
              </div>

              {/* Informations du joueur */}
              {user.player && (
                <div className="space-y-2">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Profil Joueur
                  </h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><strong>Gamertag :</strong> 
                      {user.player.prefix ? `${user.player.prefix} | ` : ''}{user.player.gamerTag}
                    </p>
                    {user.player.rankings && user.player.rankings.length > 0 && (
                      <div>
                        <strong>Rankings :</strong>
                        <ul className="ml-4 mt-1">
                          {user.player.rankings.map((ranking, index) => (
                            <li key={index}>
                              #{ranking.rank} - {ranking.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Réseaux sociaux */}
            {user.authorizations && user.authorizations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-500/30">
                <h4 className="font-medium text-white mb-2">Réseaux sociaux</h4>
                <div className="flex flex-wrap gap-2">
                  {user.authorizations.map((auth, index) => (
                    <span key={index} className="px-2 py-1 bg-green-600/30 rounded text-xs text-green-200">
                      {auth.type}: {auth.externalUsername}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lien vers le profil */}
            <div className="mt-4 pt-4 border-t border-green-500/30">
              <a
                href={`https://start.gg/user/${user.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Voir le profil sur Start.gg
              </a>
            </div>
          </div>
        )}

        {/* Prochains Événements */}
        {user && user.player && user.player.sets && user.player.sets.nodes.length > 0 && (
          <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-md mt-4">
            <h3 className="font-semibold text-blue-300 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Événements Récents ({getUniqueEvents(user.player.sets.nodes).length})
            </h3>
            <p className="text-xs text-blue-200 mb-4">
              {user.player.sets.nodes.length} sets trouvés, regroupés en {getUniqueEvents(user.player.sets.nodes).length} événements uniques
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {getUniqueEvents(user.player.sets.nodes).map((set: UserSet) => {
                const backgroundImage = getBestImage(set);
                return (
                  <div 
                    key={set.id} 
                    className="relative rounded-lg p-4 border border-white/10 overflow-hidden backdrop-blur-sm"
                    style={{
                      background: backgroundImage 
                        ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`
                        : 'rgba(255, 255, 255, 0.05)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Overlay pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    
                    {/* Contenu de la carte */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm line-clamp-2">
                            {set.event?.name || 'Événement inconnu'}
                          </h4>
                          {set.event?.tournament && (
                            <p className="text-xs text-gray-400 mt-1">{set.event.tournament.name}</p>
                          )}
                        </div>
                        {set.event?.tournament?.isRegistrationOpen && (
                          <span className="ml-2 px-2 py-1 bg-green-600/30 text-green-200 text-xs rounded-full whitespace-nowrap">
                            Inscriptions ouvertes
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-300">
                        {/* Date */}
                        {set.event?.tournament && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-blue-400" />
                            <span>{formatDateRange(set.event.tournament.startAt, set.event.tournament.endAt)}</span>
                          </div>
                        )}
                        
                        {/* Lieu */}
                        {set.event?.tournament && (set.event.tournament.city || set.event.tournament.countryCode) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>
                              {set.event.tournament.city && set.event.tournament.countryCode 
                                ? `${set.event.tournament.city}, ${set.event.tournament.countryCode}`
                                : set.event.tournament.city || set.event.tournament.countryCode}
                            </span>
                          </div>
                        )}
                        
                        {/* Participants */}
                        {set.event?.tournament?.numAttendees && (
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 text-purple-400" />
                            <span>{set.event.tournament.numAttendees} participants</span>
                          </div>
                        )}
                        
                        {/* Jeu */}
                        {set.event?.videogame && (
                          <div className="flex items-center gap-2">
                            <GamepadIcon className="w-3 h-3 text-yellow-400" />
                            <span className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                              {set.event.videogame.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Lien vers le tournoi */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <a
                          href={`https://start.gg/${set.event?.tournament?.slug || set.event?.slug || '#'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Voir le tournoi
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message si aucun événement */}
        {user && user.player && user.player.sets && (user.player.sets.nodes.length === 0 || getUniqueEvents(user.player.sets.nodes).length === 0) && (
          <div className="p-4 bg-gray-500/20 border border-gray-500/30 rounded-md mt-4 text-center">
            <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Aucun événement trouvé pour ce joueur</p>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
          <p>Exemples :</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>URL complète : https://www.start.gg/user/c28aec41</li>
            <li>Slug seulement : c28aec41</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 