'use client';

import { Tournament, User } from '@/lib/startgg';
import CalendarDay from './CalendarDay';

interface TournamentWithPlayers {
  tournament: Tournament;
  participatingPlayers: Array<{
    slug: string;
    user: User;
  }>;
}

interface CalendarGridProps {
  currentDate: Date;
  tournaments: Tournament[];
  tournamentsWithPlayers?: TournamentWithPlayers[];
}

export default function CalendarGrid({ currentDate, tournaments, tournamentsWithPlayers }: CalendarGridProps) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1);
  
  // Première date à afficher (peut être du mois précédent)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  // Dernière date à afficher (peut être du mois suivant)
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 41); // 6 semaines * 7 jours - 1
  
  // Générer toutes les dates à afficher
  const dates = [];
  const currentDateLoop = new Date(startDate);
  while (currentDateLoop <= endDate) {
    dates.push(new Date(currentDateLoop));
    currentDateLoop.setDate(currentDateLoop.getDate() + 1);
  }

  // Grouper les tournois par date avec informations des joueurs
  const tournamentsByDate = new Map<string, Tournament[]>();
  const tournamentPlayersMap = new Map<string, TournamentWithPlayers>();

  // Créer une map des tournois avec joueurs pour accès rapide
  if (tournamentsWithPlayers) {
    tournamentsWithPlayers.forEach(item => {
      tournamentPlayersMap.set(item.tournament.id, item);
    });
  }

  tournaments.forEach(tournament => {
    if (tournament.startAt) {
      const tournamentDate = new Date(tournament.startAt * 1000);
      const dateKey = `${tournamentDate.getFullYear()}-${tournamentDate.getMonth()}-${tournamentDate.getDate()}`;
      
      if (!tournamentsByDate.has(dateKey)) {
        tournamentsByDate.set(dateKey, []);
      }
      tournamentsByDate.get(dateKey)!.push(tournament);
    }
  });

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="p-6">
      {/* En-têtes des jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div 
            key={day} 
            className="p-3 text-center text-sm font-bold text-gray-600 bg-gray-50 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map(date => {
          const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayTournaments = tournamentsByDate.get(dateKey) || [];
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              tournaments={dayTournaments}
              tournamentPlayersMap={tournamentPlayersMap}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
            />
          );
        })}
      </div>
    </div>
  );
} 