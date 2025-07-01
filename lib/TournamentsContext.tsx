'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tournament, startggService, User } from '@/lib/startgg';

// Joueurs prédéfinis - centralisés ici
export const DEFAULT_PLAYERS = [
  'c28aec41',  // Joueur 1
  '57bd7962',   // Joueur 2
];

export interface TournamentWithPlayers {
  tournament: Tournament;
  participatingPlayers: Array<{
    slug: string;
    user: User;
  }>;
}

interface TournamentsContextType {
  allTournaments: Tournament[];
  tournamentsWithPlayers: TournamentWithPlayers[];
  isLoadingTournaments: boolean;
  dataLoaded: boolean;
  lastLoadTime: number;
  cacheExpiry: number;
  refreshData: () => Promise<void>;
  isDataFresh: () => boolean;
}

const TournamentsContext = createContext<TournamentsContextType | undefined>(undefined);

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [tournamentsWithPlayers, setTournamentsWithPlayers] = useState<TournamentWithPlayers[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  // Vérifier si les données sont encore fraîches
  const isDataFresh = () => {
    return dataLoaded && (Date.now() - lastLoadTime) < CACHE_TTL;
  };

  // Logique de chargement des données
  const loadAllTournamentsData = async () => {
    console.log('🔄 Chargement des données depuis l\'API...');
    setIsLoadingTournaments(true);
    const allTourns: Tournament[] = [];
    const tournamentsMap = new Map<string, TournamentWithPlayers>();

    try {
      for (const playerSlug of DEFAULT_PLAYERS) {
        try {
          // Récupérer les informations du joueur
          const userData = await startggService.getUserEnhanced(playerSlug);
          const userTournaments = await startggService.getUserTournaments(playerSlug);
          
          if (userTournaments?.nodes && userData) {
            userTournaments.nodes.forEach(tournament => {
              const tournamentData: Tournament = {
                id: tournament.id,
                name: tournament.name,
                slug: tournament.slug,
                startAt: tournament.startAt,
                city: tournament.city,
                countryCode: tournament.countryCode,
                events: tournament.events?.map(e => ({ id: e.id, name: e.name })) || []
              };

              if (tournamentsMap.has(tournament.id)) {
                // Ajouter ce joueur à la liste des participants
                const existing = tournamentsMap.get(tournament.id)!;
                if (!existing.participatingPlayers.some(p => p.slug === playerSlug)) {
                  existing.participatingPlayers.push({ slug: playerSlug, user: userData });
                }
              } else {
                // Créer une nouvelle entrée pour ce tournoi
                tournamentsMap.set(tournament.id, {
                  tournament: tournamentData,
                  participatingPlayers: [{ slug: playerSlug, user: userData }]
                });
                allTourns.push(tournamentData);
              }
            });
          }
        } catch (error) {
          console.error(`Erreur lors du chargement des tournois pour ${playerSlug}:`, error);
        }
      }

      setAllTournaments(allTourns);
      setTournamentsWithPlayers(Array.from(tournamentsMap.values()));
      setDataLoaded(true);
      setLastLoadTime(Date.now());
      console.log(`✅ Données chargées avec succès (${allTourns.length} tournois)`);
    } catch (error) {
      console.error('Erreur lors du chargement des tournois:', error);
    } finally {
      setIsLoadingTournaments(false);
    }
  };

  // Fonction pour forcer le rechargement des données
  const refreshData = async () => {
    console.log('🔄 Rechargement forcé des données...');
    setDataLoaded(false);
    setLastLoadTime(0);
    await loadAllTournamentsData();
  };

  // Charger les données au montage du provider
  useEffect(() => {
    const loadData = async () => {
      // Ne pas recharger si les données sont déjà chargées et fraîches
      if (isDataFresh()) {
        console.log('📋 Données en cache utilisées, pas de rechargement API');
        return;
      }
      
      await loadAllTournamentsData();
    };

    loadData();
  }, []);

  const contextValue: TournamentsContextType = {
    allTournaments,
    tournamentsWithPlayers,
    isLoadingTournaments,
    dataLoaded,
    lastLoadTime,
    cacheExpiry: CACHE_TTL,
    refreshData,
    isDataFresh,
  };

  return (
    <TournamentsContext.Provider value={contextValue}>
      {children}
    </TournamentsContext.Provider>
  );
}

export function useTournaments() {
  const context = useContext(TournamentsContext);
  if (context === undefined) {
    throw new Error('useTournaments must be used within a TournamentsProvider');
  }
  return context;
} 