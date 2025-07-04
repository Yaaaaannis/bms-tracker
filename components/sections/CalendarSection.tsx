import { Calendar as CalendarComponent } from '@/components/calendar';
import { useTournaments } from '@/lib/TournamentsContext';

export default function CalendarSection() {
  const {
    allTournaments,
    tournamentsWithPlayers,
    isLoadingTournaments,
    dataLoaded,
    lastLoadTime,
    cacheExpiry,
    refreshData,
  } = useTournaments();

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {isLoadingTournaments ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-700">Chargement des tournois...</span>
            </div>
          </div>
        ) : (
          <CalendarComponent 
            tournaments={allTournaments} 
            tournamentsWithPlayers={tournamentsWithPlayers}
            onRefresh={refreshData}
            isLoading={isLoadingTournaments}
            dataLoaded={dataLoaded}
            lastLoadTime={lastLoadTime}
            cacheExpiry={cacheExpiry}
          />
        )}
      </div>
    </div>
  );
} 