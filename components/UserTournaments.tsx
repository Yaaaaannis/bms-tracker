'use client';

import { useState, useEffect } from 'react';
import { startggService, UserTournaments as UserTournamentsType, User } from '@/lib/startgg';
import { Trophy, ExternalLink, Calendar, MapPin, Users, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import EventFilters, { FilterType } from './EventFilters';
import PlayerSetsDetails from './PlayerSetsDetails';

// Joueurs prédéfinis - CHANGEZ CES SLUGS ICI
const DEFAULT_PLAYERS = [
  'c28aec41',  // Joueur 1 - remplacez par le slug voulu
  '57bd7962',   // Joueur 2 - remplacez par le slug voulu  

];

interface PlayerData {
  user: User | null;
  tournaments: UserTournamentsType | null;
  isLoading: boolean;
  error: string | null;
}

interface TournamentNode {
  id: string;
  name: string;
  slug: string;
  startAt?: number;
  endAt?: number;
  city?: string;
  countryCode?: string;
  numAttendees?: number;
  isRegistrationOpen?: boolean;
  images?: Array<{ url: string; type?: string }>;
  events?: Array<{ id: string; name: string; numEntrants?: number; videogame?: { name: string } }>;
}

interface GroupedTournament {
  tournament: TournamentNode;
  participatingPlayers: { slug: string; user: User }[];
}

export default function UserTournaments() {
  const [playersData, setPlayersData] = useState<{ [key: string]: PlayerData }>({});
  const [groupedTournaments, setGroupedTournaments] = useState<GroupedTournament[]>([]);
  const [allTournaments, setAllTournaments] = useState<GroupedTournament[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventFilter, setEventFilter] = useState<FilterType>('upcoming');
  const [selectedTournamentForSets, setSelectedTournamentForSets] = useState<{
    userSlug: string;
    tournamentSlug: string;
    tournamentName: string;
    playerName: string;
  } | null>(null);
  const itemsPerPage = 15;

  // Initialiser les données des joueurs
  useEffect(() => {
    const initialData: { [key: string]: PlayerData } = {};
    DEFAULT_PLAYERS.forEach(slug => {
      initialData[slug] = {
        user: null,
        tournaments: null,
        isLoading: true,
        error: null
      };
    });
    setPlayersData(initialData);

    // Charger les données de chaque joueur
    DEFAULT_PLAYERS.forEach(slug => loadPlayerData(slug));
  }, []);

  // Regrouper les tournois quand les données changent
  useEffect(() => {
    groupTournaments();
  }, [playersData]);

  const loadPlayerData = async (slug: string) => {
    try {
      // Récupérer les informations complètes de l'utilisateur (avec images)
      const userData = await startggService.getUserEnhanced(slug);
      
      // Récupérer ses tournois
      const tournamentsData = await startggService.getUserTournaments(slug);
      
      setPlayersData(prev => ({
        ...prev,
        [slug]: {
          user: userData,
          tournaments: tournamentsData,
          isLoading: false,
          error: tournamentsData?.nodes.length === 0 ? 'Aucun tournoi trouvé' : null
        }
      }));
    } catch (err) {
      console.error(`Error fetching data for ${slug}:`, err);
      setPlayersData(prev => ({
        ...prev,
        [slug]: {
          ...prev[slug],
          isLoading: false,
          error: 'Erreur lors du chargement'
        }
      }));
    }
  };

  const groupTournaments = () => {
    const tournamentMap = new Map<string, GroupedTournament>();

    // Parcourir chaque joueur et ses tournois
    Object.entries(playersData).forEach(([slug, playerData]) => {
      if (playerData.tournaments && playerData.user) {
        playerData.tournaments.nodes.forEach(tournament => {
          const tournamentId = tournament.id;
          
          if (tournamentMap.has(tournamentId)) {
            // Ajouter ce joueur à la liste des participants
            const existing = tournamentMap.get(tournamentId)!;
            if (!existing.participatingPlayers.some(p => p.slug === slug) && playerData.user) {
              existing.participatingPlayers.push({ slug, user: playerData.user });
            }
          } else {
            // Créer une nouvelle entrée pour ce tournoi
            if (playerData.user) {
              tournamentMap.set(tournamentId, {
                tournament,
                participatingPlayers: [{ slug, user: playerData.user }]
              });
            }
          }
        });
      }
    });

    // Convertir en tableau et stocker tous les tournois
    const allTourns = Array.from(tournamentMap.values())
      .sort((a, b) => {
        const dateA = a.tournament.startAt || 0;
        const dateB = b.tournament.startAt || 0;
        return dateB - dateA; // Plus récent en premier pour les événements passés
      });

    setAllTournaments(allTourns);
    
    // Appliquer le filtre
    applyFilter(allTourns, eventFilter);
  };

  const applyFilter = (tournaments: GroupedTournament[], filter: FilterType) => {
    const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    
    let filtered: GroupedTournament[];
    
    if (filter === 'upcoming') {
      // Garder seulement les tournois qui n'ont pas encore commencé
      filtered = tournaments
        .filter(item => !item.tournament.startAt || item.tournament.startAt > now)
        .sort((a, b) => {
          const dateA = a.tournament.startAt || 0;
          const dateB = b.tournament.startAt || 0;
          return dateA - dateB; // Plus proche en premier
        });
    } else {
      // Garder seulement les tournois qui ont déjà commencé ou sont terminés
      filtered = tournaments
        .filter(item => item.tournament.startAt && item.tournament.startAt <= now)
        .sort((a, b) => {
          const dateA = a.tournament.startAt || 0;
          const dateB = b.tournament.startAt || 0;
          return dateB - dateA; // Plus récent en premier
        });
    }

    setGroupedTournaments(filtered);
    setCurrentPage(1); // Reset pagination quand le filtre change
  };

  const handleFilterChange = (filter: FilterType) => {
    setEventFilter(filter);
    applyFilter(allTournaments, filter);
  };

  // Calculs de pagination
  const totalPages = Math.ceil(groupedTournaments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTournaments = groupedTournaments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Date inconnue';
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const allPlayersLoaded = DEFAULT_PLAYERS.every(slug => 
    playersData[slug] && !playersData[slug].isLoading
  );

  // Calculer les comptes pour les filtres
  const now = Math.floor(Date.now() / 1000);
  const upcomingCount = allTournaments.filter(item => 
    !item.tournament.startAt || item.tournament.startAt > now
  ).length;
  const pastCount = allTournaments.filter(item => 
    item.tournament.startAt && item.tournament.startAt <= now
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 px-4 sm:px-0">
      {/* Section Joueurs - Cards */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#BE2D39'}}>
            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">JOUEURS SUIVIS</h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium">{DEFAULT_PLAYERS.length} joueurs esports</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {DEFAULT_PLAYERS.map((slug, index) => {
            const playerData = playersData[slug];
            
            return (
              <div key={slug} className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 transition-all duration-300" onMouseOver={(e) => {(e.currentTarget as HTMLElement).style.backgroundColor = '#FEF1F2'; (e.currentTarget as HTMLElement).style.borderColor = '#F2A6AC';}} onMouseOut={(e) => {(e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.borderColor = '';}}>
                {playerData?.isLoading ? (
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4 animate-pulse"></div>
                    <div className="h-4 sm:h-5 bg-gray-200 rounded mb-2 sm:mb-3 animate-pulse"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
                  </div>
                ) : playerData?.error && !playerData?.user ? (
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                    </div>
                    <h3 className="font-bold text-red-600 mb-2">ERREUR</h3>
                    <p className="text-red-500 text-xs sm:text-sm font-medium">{slug}</p>
                  </div>
                ) : playerData?.user ? (
                  <div className="text-center">
                    {/* Photo de profil */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
                      {playerData.user.images && playerData.user.images.length > 0 ? (
                        <img
                          src={playerData.user.images[0].url}
                          alt={playerData.user.player?.gamerTag || playerData.user.name || 'Joueur'}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 shadow-lg hover:scale-105 transition-transform duration-300"
                          style={{borderColor: '#F2A6AC'}}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
                        style={{ 
                          background: 'linear-gradient(135deg, #BE2D39 0%, #A12630 100%)', 
                          display: playerData.user.images && playerData.user.images.length > 0 ? 'none' : 'flex' 
                        }}
                      >
                        <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Nom */}
                    <h3 className="font-black text-gray-900 mb-2 text-base sm:text-lg tracking-tight">
                      {playerData.user.player?.gamerTag || playerData.user.name || `JOUEUR ${index + 1}`}
                    </h3>
                    
                    {/* Sponsor */}
                    {playerData.user.player?.prefix && (
                      <div className="mb-2 sm:mb-3">
                        <span className="px-2 sm:px-3 py-1 text-white text-xs sm:text-sm font-bold rounded-full" style={{backgroundColor: '#BE2D39'}}>
                          {playerData.user.player.prefix}
                        </span>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="text-gray-600 font-medium">
                        {playerData.tournaments?.pageInfo?.total || playerData.tournaments?.nodes.length || 0} tournois
                      </div>
                      {playerData.user.player?.rankings && playerData.user.player.rankings.length > 0 && (
                        <div className="flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 px-2 sm:px-3 py-1 rounded-full">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-bold">#{playerData.user.player.rankings[0].rank}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtres des événements */}
      {allPlayersLoaded && (
        <EventFilters
          selectedFilter={eventFilter}
          onFilterChange={handleFilterChange}
          upcomingCount={upcomingCount}
          pastCount={pastCount}
        />
      )}

      {/* Section Tournois - Tableau moderne */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-8 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#BE2D39'}}>
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {eventFilter === 'upcoming' ? 'PROCHAINS TOURNOIS' : 'TOURNOIS PASSÉS'}
                </h2>
                <p className="text-sm sm:text-base text-gray-500 font-medium">
                  {eventFilter === 'upcoming' 
                    ? 'Événements à venir uniquement' 
                    : 'Événements déjà terminés ou en cours - Cliquez sur une ligne pour voir les sets détaillés'
                  }
                </p>
              </div>
              {allPlayersLoaded && (
                <span className="px-3 sm:px-4 py-1 sm:py-2 font-bold rounded-full border text-sm sm:text-base" style={{backgroundColor: '#FEF1F2', color: '#BE2D39', borderColor: '#F2A6AC'}}>
                  {groupedTournaments.length}
                </span>
              )}
            </div>
            
            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                Page {currentPage} sur {totalPages}
              </div>
            )}
          </div>
        </div>

        {!allPlayersLoaded ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 mx-auto mb-4 sm:mb-6" style={{borderBottomColor: '#BE2D39'}}></div>
            <p className="text-gray-600 font-medium text-base sm:text-lg">Chargement des tournois...</p>
          </div>
        ) : groupedTournaments.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">AUCUN TOURNOI TROUVÉ</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium">Aucun événement disponible pour ces joueurs.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-8 py-3 sm:py-5 text-left text-xs sm:text-sm font-black text-gray-900 border-b border-gray-200 tracking-wide">
                      TOURNOI
                    </th>
                    <th className="px-4 sm:px-8 py-3 sm:py-5 text-left text-xs sm:text-sm font-black text-gray-900 border-b border-gray-200 tracking-wide">
                      NOS PARTICIPANTS
                    </th>
                    <th className="px-4 sm:px-8 py-3 sm:py-5 text-left text-xs sm:text-sm font-black text-gray-900 border-b border-gray-200 tracking-wide">
                      DATE
                    </th>
                    <th className="px-4 sm:px-8 py-3 sm:py-5 text-left text-xs sm:text-sm font-black text-gray-900 border-b border-gray-200 tracking-wide hidden sm:table-cell">
                      LIEU
                    </th>
                    <th className="px-4 sm:px-8 py-3 sm:py-5 text-left text-xs sm:text-sm font-black text-gray-900 border-b border-gray-200 tracking-wide hidden md:table-cell">
                      STATISTIQUES
                    </th>
                    <th className="px-4 sm:px-8 py-3 sm:py-5 text-center text-xs sm:text-sm font-black text-gray-900 border-b border-gray-200 tracking-wide">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {currentTournaments.map((item) => {
                    const isPastEvent = eventFilter === 'past' && item.participatingPlayers.length > 0;
                    
                    return (
                      <tr 
                        key={item.tournament.id} 
                        className={`transition-all duration-200 ${
                          isPastEvent 
                            ? 'cursor-pointer hover:bg-red-50 hover:shadow-md hover:border-red-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (isPastEvent) {
                            const firstPlayer = item.participatingPlayers[0];
                            setSelectedTournamentForSets({
                              userSlug: firstPlayer.slug,
                              tournamentSlug: item.tournament.slug,
                              tournamentName: item.tournament.name,
                              playerName: firstPlayer.user.player?.gamerTag || firstPlayer.user.name || 'Joueur'
                            });
                          }
                        }}
                        style={{
                          borderLeft: isPastEvent ? '4px solid transparent' : undefined
                        }}
                        onMouseOver={(e) => {
                          if (isPastEvent) {
                            (e.currentTarget as HTMLElement).style.borderLeftColor = '#BE2D39';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (isPastEvent) {
                            (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                          }
                        }}
                      >
                      {/* Nom du tournoi */}
                      <td className="px-4 sm:px-8 py-4 sm:py-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          {item.tournament.images && item.tournament.images.length > 0 && (
                            <div className="relative">
                              <img
                                src={item.tournament.images[0].url}
                                alt={item.tournament.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 shadow-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 leading-tight">
                              {item.tournament.name}
                            </h3>
                            {item.tournament.events && item.tournament.events.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.tournament.events.slice(0, 2).map(event => (
                                  <span 
                                    key={event.id}
                                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded border font-medium"
                                    style={{backgroundColor: '#FEF1F2', color: '#BE2D39', borderColor: '#F2A6AC'}}
                                  >
                                    {event.name}
                                  </span>
                                ))}
                                {item.tournament.events.length > 2 && (
                                  <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200 font-medium">
                                    +{item.tournament.events.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Participants de notre liste */}
                      <td className="px-4 sm:px-8 py-4 sm:py-6">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {item.participatingPlayers.map(player => (
                            <div 
                              key={player.slug}
                              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 text-gray-900 text-xs sm:text-sm rounded-lg border border-gray-200 transition-all duration-200"
                              onMouseOver={(e) => {(e.currentTarget as HTMLElement).style.backgroundColor = '#FEF1F2'; (e.currentTarget as HTMLElement).style.borderColor = '#F2A6AC';}}
                              onMouseOut={(e) => {(e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.borderColor = '';}}
                            >
                              <div className="relative flex-shrink-0">
                                {player.user.images && player.user.images.length > 0 ? (
                                  <img
                                    src={player.user.images[0].url}
                                    alt={player.user.player?.gamerTag || player.user.name || ''}
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-purple-300/50 shadow-sm"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border shadow-sm"
                                  style={{
                                    background: 'linear-gradient(135deg, #BE2D39 0%, #A12630 100%)', 
                                    borderColor: '#F2A6AC',
                                    display: player.user.images && player.user.images.length > 0 ? 'none' : 'flex' 
                                  }}
                                >
                                <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-gray-900 block truncate">
                                  {player.user.player?.gamerTag || player.user.name}
                                </span>
                                {player.user.player?.prefix && (
                                  <span className="text-xs font-medium" style={{color: '#BE2D39'}}>
                                    {player.user.player.prefix}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      
                      {/* Date */}
                      <td className="px-4 sm:px-8 py-4 sm:py-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-lg ${
                            eventFilter === 'upcoming' 
                              ? '' 
                              : 'bg-gray-50'
                          }`} style={eventFilter === 'upcoming' ? {backgroundColor: '#FEF1F2'} : {}}>
                            <Calendar className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              eventFilter === 'upcoming' 
                                ? '' 
                                : 'text-gray-500'
                            }`} style={eventFilter === 'upcoming' ? {color: '#BE2D39'} : {}} />
                          </div>
                          <div>
                            <div className="text-gray-900 font-bold text-xs sm:text-sm">
                              {formatDate(item.tournament.startAt)}
                            </div>
                            <div className={`text-xs mt-0.5 sm:mt-1 font-medium ${
                              eventFilter === 'upcoming' 
                                ? 'text-green-600' 
                                : 'text-gray-500'
                            }`}>
                              {eventFilter === 'upcoming' ? 'À venir' : 'Passé'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Lieu */}
                      <td className="px-4 sm:px-8 py-4 sm:py-6 hidden sm:table-cell">
                        {(item.tournament.city || item.tournament.countryCode) ? (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <MapPin className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-gray-900 font-bold text-sm">
                                {item.tournament.city || item.tournament.countryCode}
                              </div>
                              {item.tournament.city && item.tournament.countryCode && (
                                <div className="text-xs text-gray-500 mt-1 font-medium">
                                  {item.tournament.countryCode}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm font-medium">Non spécifié</span>
                        )}
                      </td>
                      
                      {/* Statistiques */}
                      <td className="px-4 sm:px-8 py-4 sm:py-6 hidden md:table-cell">
                        <div className="space-y-2">
                          {item.tournament.numAttendees && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4" style={{color: '#BE2D39'}} />
                              <span className="text-gray-900 font-bold">{item.tournament.numAttendees}</span>
                              <span className="text-gray-500 font-medium">participants</span>
                            </div>
                          )}
                          {item.tournament.isRegistrationOpen !== undefined && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              item.tournament.isRegistrationOpen
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {item.tournament.isRegistrationOpen ? '🟢 Inscriptions ouvertes' : '🔴 Inscriptions fermées'}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-4 sm:px-8 py-4 sm:py-6 text-center">
                        {(() => {
                          const now = Math.floor(Date.now() / 1000);
                          const isUpcoming = !item.tournament.startAt || item.tournament.startAt > now;
                          
                          if (isUpcoming) {
                              return (
                                <a
                                  href={`https://start.gg/${item.tournament.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                                  style={{backgroundColor: '#BE2D39'}}
                                  onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#A12630'}
                                  onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#BE2D39'}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">S&apos;INSCRIRE</span>
                                  <span className="sm:hidden">VOIR</span>
                                </a>
                              );
                            } else {
                              return (
                                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium rounded-lg">
                                  TERMINÉ
                                </span>
                              );
                            }
                        })()}
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-gray-600 font-medium text-center sm:text-left">
                    Affichage de {startIndex + 1} à {Math.min(endIndex, groupedTournaments.length)} sur {groupedTournaments.length} tournois
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">PRÉCÉDENT</span>
                    </button>
                    
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'text-white shadow-md'
                                : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                            style={currentPage === pageNum ? {backgroundColor: '#BE2D39'} : {}}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span className="hidden sm:inline">SUIVANT</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal des sets détaillés */}
      {selectedTournamentForSets && (
        <PlayerSetsDetails
          userSlug={selectedTournamentForSets.userSlug}
          tournamentSlug={selectedTournamentForSets.tournamentSlug}
          tournamentName={selectedTournamentForSets.tournamentName}
          playerName={selectedTournamentForSets.playerName}
          onClose={() => setSelectedTournamentForSets(null)}
        />
      )}
    </div>
  );
} 