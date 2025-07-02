'use client';

import { useState, useEffect } from 'react';
import { startggService, PlayerSetsInTournament, TournamentSet } from '@/lib/startgg';
import { getAllVods, buildVodUrl, SetVod } from '@/lib/sanity';
import { Trophy, X, TrendingUp, TrendingDown, Minus, Users, ExternalLink, Play, AlertCircle, Plus } from 'lucide-react';
import VodSubmissionModal from './VodSubmissionModal';

interface PlayerSetsDetailsProps {
  userSlug: string;
  tournamentSlug: string;
  tournamentName: string;
  playerName: string;
  onClose: () => void;
}

export default function PlayerSetsDetails({ 
  userSlug, 
  tournamentSlug, 
  tournamentName, 
  playerName, 
  onClose 
}: PlayerSetsDetailsProps) {
  const [sets, setSets] = useState<PlayerSetsInTournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allVods, setAllVods] = useState<SetVod[]>([]);
  const [vodSubmissionModal, setVodSubmissionModal] = useState<{
    isOpen: boolean;
    setData?: {
      playerName: string;
      opponentName: string;
      setName: string;
      tournamentName: string;
    };
  }>({ isOpen: false });

  useEffect(() => {
    loadData();
  }, [userSlug, tournamentSlug]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Charger les sets et toutes les VODs en parallèle
      const [setsData, vodsData] = await Promise.all([
        startggService.getPlayerSetsInTournament(userSlug, tournamentSlug),
        getAllVods()
      ]);
      
      setSets(setsData);
      setAllVods(vodsData);
    } catch (err) {
      console.error('Error loading player sets:', err);
      setError('Erreur lors du chargement des sets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVodSubmissionSuccess = () => {
    // Recharger les VODs après une soumission réussie
    loadData();
  };

  const openVodSubmissionModal = (set: TournamentSet) => {
    const opponent = getOpponentName(set);
    const setName = set.fullRoundText || `Round ${set.round}`;
    
    setVodSubmissionModal({
      isOpen: true,
      setData: {
        playerName,
        opponentName: opponent,
        setName,
        tournamentName
      }
    });
  };

  // Fonction pour trouver les VODs correspondant à un set spécifique (correspondance exacte)
  const findVodsForSet = (set: TournamentSet): SetVod[] => {
    const opponent = getOpponentName(set);
    const setName = set.fullRoundText || `Round ${set.round}`;
    
    return allVods.filter(vod => {
      // Recherche flexible sur le nom du tournoi
      const tournamentMatch = vod.tournamentName.toLowerCase().includes(tournamentName.toLowerCase()) ||
                            tournamentName.toLowerCase().includes(vod.tournamentName.toLowerCase());
      
      if (!tournamentMatch) return false;
      
      // Normaliser les noms pour la comparaison exacte
      const normalizePlayerName = (name: string) => name.toLowerCase().trim().replace(/\s+/g, ' ');
      
      const normalizedPlayerName = normalizePlayerName(playerName);
      const normalizedOpponent = normalizePlayerName(opponent);
      const normalizedSetName = normalizePlayerName(setName);
      
      const normalizedVodPlayer = normalizePlayerName(vod.playerName);
      const normalizedVodOpponent = normalizePlayerName(vod.opponentName);
      const normalizedVodSet = normalizePlayerName(vod.setName);
      
      // Vérification exacte des joueurs (dans les deux sens possibles)
      const exactPlayerMatch = (
        (normalizedVodPlayer === normalizedPlayerName && normalizedVodOpponent === normalizedOpponent) ||
        (normalizedVodPlayer === normalizedOpponent && normalizedVodOpponent === normalizedPlayerName)
      );
      
      // Vérification exacte du nom du set
      const exactSetMatch = normalizedVodSet === normalizedSetName;
      
      // Les deux doivent correspondre exactement
      return exactPlayerMatch && exactSetMatch;
    });
  };

  // Fonction pour rendre les boutons/indications VOD selon le statut
  const renderVodElements = (vods: SetVod[]) => {
    if (vods.length === 0) return null;

    const validatedVods = vods.filter(vod => vod.validationStatus === 'valide');
    const pendingVods = vods.filter(vod => vod.validationStatus === 'en_cours_validation');
    
    return (
      <div className="flex flex-wrap gap-2">
        {/* VODs validées - boutons cliquables */}
        {validatedVods.map(vod => (
          <a
            key={vod._id}
            href={buildVodUrl(vod.vodUrl, vod.timestamp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            VOD
          </a>
        ))}
        
        {/* VODs en cours de validation - indicateur non cliquable */}
        {pendingVods.map(vod => (
          <div
            key={vod._id}
            className="flex items-center justify-center text-center  px-1 py-1 bg-orange-500 text-white text-sm font-bold rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            VOD EN VALIDATION
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour afficher les crédits Twitter des contributeurs
  const renderTwitterCredits = (vods: SetVod[]) => {
    const vodsWithTwitter = vods.filter(vod => 
      vod.submitterTwitter && 
      (vod.validationStatus === 'valide' || vod.validationStatus === 'en_cours_validation')
    );

    if (vodsWithTwitter.length === 0) return null;

    return (
      <div className="absolute bottom-2 right-2 flex flex-wrap gap-1">
        {vodsWithTwitter.map(vod => {
          const username = vod.submitterTwitter?.replace('@', '') || '';
          return (
            <a
              key={vod._id}
              href={`https://x.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors opacity-70"
              title={`VOD proposée par @${username}`}
            >
              Contributeur : {username}
            </a>
          );
        })}
      </div>
    );
  };

  const getSetResult = (set: TournamentSet) => {
    if (!set.slots || set.slots.length !== 2) return 'unknown';
    
    const userSlot = set.slots.find(slot => 
      slot.entrant?.participants?.some(p => p.gamerTag === playerName)
    );
    
    if (!userSlot) return 'unknown';
    
    const isWinner = set.winnerId === userSlot.entrant?.id;
    return isWinner ? 'win' : 'loss';
  };

  const getOpponentName = (set: TournamentSet) => {
    if (!set.slots || set.slots.length !== 2) return 'Adversaire inconnu';
    
    const opponentSlot = set.slots.find(slot => 
      !slot.entrant?.participants?.some(p => p.gamerTag === playerName)
    );
    
    if (opponentSlot?.entrant?.participants?.[0]) {
      const participant = opponentSlot.entrant.participants[0];
      return participant.prefix 
        ? `${participant.prefix} ${participant.gamerTag}`
        : participant.gamerTag;
    }
    
    return 'Adversaire inconnu';
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Date inconnue';
    return new Date(timestamp * 1000).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateText = (state?: number) => {
    switch (state) {
      case 1: return 'En attente';
      case 2: return 'En cours';
      case 3: return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const getResultStats = () => {
    if (!sets?.nodes) return { wins: 0, losses: 0, total: 0 };
    
    const completedSets = sets.nodes.filter(set => set.state === 3);
    const wins = completedSets.filter(set => getSetResult(set) === 'win').length;
    const losses = completedSets.filter(set => getSetResult(set) === 'loss').length;
    
    return { wins, losses, total: completedSets.length };
  };

  const stats = getResultStats();

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Fermer la modal seulement si on clique sur l'overlay, pas sur le contenu
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100" style={{borderBottomColor: '#F2A6AC'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#BE2D39'}}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  SETS DE {playerName.toUpperCase()}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-gray-600 font-medium">{tournamentName}</p>
                  <a
                    href={`https://www.start.gg/${tournamentSlug}/details`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium text-white transition-colors"
                    style={{backgroundColor: '#BE2D39'}}
                    onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#A12630'}
                    onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#BE2D39'}
                  >
                    <ExternalLink className="w-3 h-3" />
                    START.GG
                  </a>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          {!isLoading && sets && (
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#FEF1F2'}}>
                  <TrendingUp className="w-4 h-4" style={{color: '#BE2D39'}} />
                </div>
                <span className="font-bold text-gray-900">{stats.wins} victoires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-bold text-gray-900">{stats.losses} défaites</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <span className="font-bold text-gray-900">{stats.total} sets total</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{borderBottomColor: '#BE2D39'}}></div>
              <p className="text-gray-600 font-medium">Chargement des sets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ERREUR</h3>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : !sets?.nodes || sets.nodes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AUCUN SET TROUVÉ</h3>
              <p className="text-gray-600 font-medium">Aucun match trouvé pour ce joueur dans ce tournoi.</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {sets.nodes.map((set) => {
                  const result = getSetResult(set);
                  const opponent = getOpponentName(set);
                  
                  const vods = findVodsForSet(set);

                  return (
                    <div 
                      key={set.id} 
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        result === 'win' 
                          ? 'border-green-200 bg-green-50' 
                          : result === 'loss' 
                            ? 'border-red-200 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Icône résultat */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            result === 'win' 
                              ? 'bg-green-100 text-green-600' 
                              : result === 'loss' 
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {result === 'win' ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : result === 'loss' ? (
                              <TrendingDown className="w-5 h-5" />
                            ) : (
                              <Minus className="w-5 h-5" />
                            )}
                          </div>
                          
                          {/* Info du set */}
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-900">
                                {playerName} vs {opponent}
                              </span>
                              {set.displayScore && (
                                <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                                  result === 'win' 
                                    ? 'bg-green-100 text-green-700' 
                                    : result === 'loss' 
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {set.displayScore}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span className="font-medium">{set.fullRoundText || `Round ${set.round}`}</span>
                              <span>•</span>
                              <span>{getStateText(set.state)}</span>
                              {set.completedAt && (
                                <>
                                  <span>•</span>
                                  <span>{formatDate(set.completedAt)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {/* VODs existantes */}
                          {renderVodElements(vods)}
                          
                          {/* Bouton pour proposer une VOD si aucune VOD validée */}
                          {vods.filter(vod => vod.validationStatus === 'valide').length === 0 && (
                            <button
                              onClick={() => openVodSubmissionModal(set)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              SOUMETTRE VOD
                            </button>
                          )}
                          
                          {/* Badge résultat */}
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            result === 'win' 
                              ? 'bg-green-600 text-white' 
                              : result === 'loss' 
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-600 text-white'
                          }`}>
                            {result === 'win' ? 'VICTOIRE' : result === 'loss' ? 'DÉFAITE' : 'EN COURS'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Crédits Twitter des contributeurs */}
                      {renderTwitterCredits(vods)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors"
            >
              FERMER
            </button>
          </div>
        </div>
      </div>

      {/* Modal de soumission de VOD */}
      {vodSubmissionModal.isOpen && vodSubmissionModal.setData && (
        <VodSubmissionModal
          isOpen={vodSubmissionModal.isOpen}
          onClose={() => setVodSubmissionModal({ isOpen: false })}
          playerName={vodSubmissionModal.setData.playerName}
          opponentName={vodSubmissionModal.setData.opponentName}
          setName={vodSubmissionModal.setData.setName}
          tournamentName={vodSubmissionModal.setData.tournamentName}
          onSuccess={handleVodSubmissionSuccess}
        />
      )}
    </div>
  );
}