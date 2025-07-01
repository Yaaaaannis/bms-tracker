'use client';

import { useState } from 'react';
import { Trophy, ExternalLink, Users, Calendar } from 'lucide-react';
import UserTournaments from '@/components/UserTournaments';
import { Calendar as CalendarComponent } from '@/components/calendar';
import Footer from '@/components/Footer';
import { useTournaments } from '@/lib/TournamentsContext';

type ActiveSection = 'tournois' | 'agenda' | 'joueurs' | 'startgg';

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('tournois');
  
  // Utiliser le contexte pour récupérer les données
  const {
    allTournaments,
    tournamentsWithPlayers,
    isLoadingTournaments,
    dataLoaded,
    lastLoadTime,
    cacheExpiry,
    refreshData,
  } = useTournaments();

  const handleSectionChange = (section: ActiveSection) => {
    console.log(`🔄 Navigation vers: ${section}`);
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'agenda':
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
      case 'tournois':
        return (
          <section className="w-full py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <UserTournaments />
            </div>
          </section>
        );
      case 'joueurs':
        return (
          <section className="w-full py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Section Joueurs</h3>
                  <p className="text-gray-600">Cette section sera bientôt disponible.</p>
                </div>
              </div>
            </div>
          </section>
        );
      case 'startgg':
        return (
          <section className="w-full py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
                <div className="text-center">
                  <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Start.gg Integration</h3>
                  <p className="text-gray-600 mb-4">Accédez directement à la plateforme Start.gg</p>
                  <a
                    href="https://start.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{backgroundColor: '#BE2D39'}}
                    onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#A12630'}
                    onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#BE2D39'}
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visiter Start.gg
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header moderne BMS style */}
      <header className="w-full border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo BMS */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg width="40" height="28" viewBox="0 0 142 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-9.76585e-06 0L37.13 18.71C37.59 21.16 37.45 23.85 37.43 26.37C37.43 26.86 37.23 27.33 37.22 27.87C37.2 31.15 37.36 34.4 37.41 37.67L42.29 40.29C42.31 40.75 42.48 41.22 42.51 41.67C43.11 49.33 42.06 57.74 42.52 65.49C42.72 66.97 41.03 65.82 40.27 65.45C27.26 59.1 14.59 51.87 1.69999 45.25C1.19999 44.99 0.54999 44.68 -0.0100098 44.6V0H-9.76585e-06ZM13.23 23.81C14.61 24.28 23.48 29.26 24.08 29.09C24.26 29.04 24.39 28.82 24.39 28.63C23.98 27.74 24.55 26.41 23.81 25.8C21.01 24.54 18.32 22.87 15.54 21.6C14.83 21.28 13.98 20.84 13.23 20.79V23.81ZM13.35 34.41C12.88 34.56 12.81 37.39 13.43 37.69L28.53 45.46C29.7 46.05 29.37 42.75 29.1 42.43C27.23 41.62 14.19 34.14 13.35 34.41Z" fill="#BE2D39"/>
                  <path d="M141.73 0.190054V14.1701C140.12 14.6601 138.51 15.5601 137 16.3401C129.63 20.1201 121.67 23.8401 114.51 27.8601C114.12 28.0801 112.6 28.9301 112.43 29.1801C112.15 29.5701 111.91 32.4301 112.97 31.8101C122.36 27.5801 131.39 22.4301 140.79 18.2301C141.1 18.0901 141.37 17.9101 141.74 17.9501V44.7801L99.03 66.3201V53.7501C100.38 52.9001 101.78 52.0501 103.18 51.2901C110.74 47.1801 119.05 43.4001 126.37 38.9501C128.28 37.7901 128.8 37.7401 128.51 35.1401L127.37 35.2301C118.04 40.0301 108.86 45.1801 99.49 49.8801C99.33 49.9201 99.03 49.6801 99.03 49.6001V22.7701C99.03 22.2001 101.11 21.1901 101.67 20.8801C108.07 17.3001 114.99 14.0901 121.52 10.6801C128.05 7.27005 134.08 3.70005 140.41 0.650054C140.84 0.440054 141.27 0.260054 141.74 0.180054L141.73 0.190054Z" fill="#BE2D39"/>
                  <path d="M82.96 28.06C82.86 27.7 78.33 25.42 78.05 25.7L77.82 76.59C77.61 77.16 72.3 79.71 71.43 80.02C71.09 80.14 70.79 80.3101 70.41 80.3C69.82 80.2701 65.28 77.9501 64.53 77.48C63.93 77.1001 63.23 76.8101 63.16 76.01C63.02 59.31 63.66 42.56 63.11 25.88C62.81 25.58 58.76 27.66 58.76 28.05V74.25L57.87 74.1C53.84 71.82 49.43 70.14 45.4 67.86C44.85 67.55 44.01 67.18 43.87 66.56C43.83 57.5 43.78 48.44 43.82 39.38C43.84 34.68 44.08 29.94 44.03 25.21C44.01 23.35 43.62 21.3 43.85 19.38C44.03 17.9 44.66 18.02 45.78 17.34C53.67 14.09 61.48 8.68004 69.27 5.49004C70.48 5.00004 70.48 5.02004 71.68 5.49004L97.52 18.58L97.69 18.98L97.66 66.75C97.55 67.12 96.72 67.53 96.38 67.73C92.36 70.1301 87.51 71.89 83.42 74.25C83.26 74.29 82.96 74.04 82.96 73.96V28.06Z" fill="#BE2D39"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">BMS TRACKER</h1>
                <p className="text-sm text-gray-500 font-medium">ESPORTS TOURNAMENTS</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-gray-700 font-medium transition-colors" style={{color: 'inherit'}} onMouseOver={(e) => (e.target as HTMLElement).style.color = '#BE2D39'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>
                ACCUEIL
              </a>
              <a href="#" className="text-gray-700 font-medium transition-colors" style={{color: 'inherit'}} onMouseOver={(e) => (e.target as HTMLElement).style.color = '#BE2D39'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'inherit'}>
                TOURNOIS
              </a>
              <a 
                href="https://start.gg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                style={{backgroundColor: '#BE2D39'}}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#A12630'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#BE2D39'}
              >
                <ExternalLink className="w-4 h-4" />
                START.GG
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section moderne */}
      <section className="w-full py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
                         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{backgroundColor: '#FEF1F2', color: '#BE2D39', borderColor: '#F2A6AC'}}>
               <Trophy className="w-4 h-4" />
               <span className="font-semibold text-sm">SUIVI DE TOURNOIS ESPORTS</span>
             </div>
            
            {/* Titre principal */}
                         <h1 className="text-6xl md:text-7xl font-black text-[#BE2D39] tracking-tight leading-none">
               BMS<br/>
               <span className='text-black'>TRACKER</span>
             </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Suivez les prochains tournois de vos joueurs favoris en temps réel
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">2</div>
                <div className="text-sm font-medium text-gray-500">JOUEURS</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
                             <div className="text-center">
                 <div className="text-3xl font-black" style={{color: '#BE2D39'}}>LIVE</div>
                 <div className="text-sm font-medium text-gray-500">TRACKING</div>
               </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">24/7</div>
                <div className="text-sm font-medium text-gray-500">UPDATES</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Collections style BMS */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              COLLECTIONS
            </h2>
          </div>
          
          {/* Grid de collections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Joueurs */}
             <div 
               className={`group relative transition-all duration-300 cursor-pointer ${
                 activeSection === 'joueurs' 
                   ? 'bg-gray-900' 
                   : 'bg-gray-100 hover:bg-gray-200'
               }`}
               onClick={() => handleSectionChange('joueurs')}
               onMouseOver={(e) => {
                 if (activeSection !== 'joueurs') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 }
               }}
               onMouseOut={(e) => {
                 if (activeSection !== 'joueurs') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '';
                 }
               }}
             >
               <div className="p-8 h-32 flex items-center justify-between">
                 <div>
                   <h3 className={`text-2xl font-black transition-colors ${
                     activeSection === 'joueurs' 
                       ? 'text-white' 
                       : 'text-gray-900 group-hover:text-white'
                   }`}>
                     JOUEURS
                   </h3>
                   <span className={`text-sm font-medium ${
                     activeSection === 'joueurs' 
                       ? 'text-gray-300' 
                       : 'text-gray-500 group-hover:text-red-100'
                   }`}>
                     02
                   </span>
                 </div>
                 <Users className={`w-8 h-8 transition-colors ${
                   activeSection === 'joueurs' 
                     ? 'text-white' 
                     : 'text-gray-400 group-hover:text-white'
                 }`} />
               </div>
             </div>
            
                         {/* Tournois */}
             <div 
               className={`group relative transition-all duration-300 cursor-pointer ${
                 activeSection === 'tournois' 
                   ? 'bg-gray-900' 
                   : 'bg-gray-100 hover:bg-gray-200'
               }`}
               style={{
                 backgroundColor: activeSection === 'tournois' ? '#BE2D39' : undefined
               }}
               onClick={() => handleSectionChange('tournois')}
               onMouseOver={(e) => {
                 if (activeSection !== 'tournois') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 } else {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#A12630';
                 }
               }}
               onMouseOut={(e) => {
                 if (activeSection === 'tournois') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 } else {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '';
                 }
               }}
             >
               <div className="p-8 h-32 flex items-center justify-between">
                 <div>
                   <h3 className={`text-2xl font-black transition-colors ${
                     activeSection === 'tournois' 
                       ? 'text-white' 
                       : 'text-gray-900 group-hover:text-white'
                   }`}>
                     TOURNOIS
                   </h3>
                   <span className={`text-sm font-medium ${
                     activeSection === 'tournois' 
                       ? 'text-red-200' 
                       : 'text-gray-500 group-hover:text-red-100'
                   }`}>
                     LIVE
                   </span>
                 </div>
                 <Trophy className={`w-8 h-8 transition-colors ${
                   activeSection === 'tournois' 
                     ? 'text-white' 
                     : 'text-gray-400 group-hover:text-white'
                 }`} />
               </div>
             </div>
            
                         {/* Calendrier */}
             <div 
               className={`group relative transition-all duration-300 cursor-pointer ${
                 activeSection === 'agenda' 
                   ? 'bg-gray-900' 
                   : 'bg-gray-100 hover:bg-gray-200'
               }`}
               style={{
                 backgroundColor: activeSection === 'agenda' ? '#BE2D39' : undefined
               }}
               onClick={() => handleSectionChange('agenda')}
               onMouseOver={(e) => {
                 if (activeSection !== 'agenda') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 } else {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#A12630';
                 }
               }}
               onMouseOut={(e) => {
                 if (activeSection === 'agenda') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 } else {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '';
                 }
               }}
             >
               <div className="p-8 h-32 flex items-center justify-between">
                 <div>
                   <h3 className={`text-2xl font-black transition-colors ${
                     activeSection === 'agenda' 
                       ? 'text-white' 
                       : 'text-gray-900 group-hover:text-white'
                   }`}>
                     AGENDA
                   </h3>
                   <span className={`text-sm font-medium ${
                     activeSection === 'agenda' 
                       ? 'text-red-200' 
                       : 'text-gray-500 group-hover:text-red-100'
                   }`}>
                     2024
                   </span>
                 </div>
                 <Calendar className={`w-8 h-8 transition-colors ${
                   activeSection === 'agenda' 
                     ? 'text-white' 
                     : 'text-gray-400 group-hover:text-white'
                 }`} />
               </div>
             </div>
             
             {/* Start.gg */}
             <div 
               className={`group relative transition-all duration-300 cursor-pointer ${
                 activeSection === 'startgg' 
                   ? 'bg-gray-900' 
                   : 'bg-gray-100 hover:bg-gray-200'
               }`}
               style={{
                 backgroundColor: activeSection === 'startgg' ? '#BE2D39' : undefined
               }}
               onClick={() => handleSectionChange('startgg')}
               onMouseOver={(e) => {
                 if (activeSection !== 'startgg') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 } else {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#A12630';
                 }
               }}
               onMouseOut={(e) => {
                 if (activeSection === 'startgg') {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '#BE2D39';
                 } else {
                   (e.currentTarget as HTMLElement).style.backgroundColor = '';
                 }
               }}
             >
               <div className="p-8 h-32 flex items-center justify-between">
                 <div>
                   <h3 className={`text-2xl font-black transition-colors ${
                     activeSection === 'startgg' 
                       ? 'text-white' 
                       : 'text-gray-900 group-hover:text-white'
                   }`}>
                     START.GG
                   </h3>
                   <span className={`text-sm font-medium ${
                     activeSection === 'startgg' 
                       ? 'text-red-200' 
                       : 'text-gray-500 group-hover:text-red-100'
                   }`}>
                     API
                   </span>
                 </div>
                 <ExternalLink className={`w-8 h-8 transition-colors ${
                   activeSection === 'startgg' 
                     ? 'text-white' 
                     : 'text-gray-400 group-hover:text-white'
                 }`} />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Section dynamique basée sur la sélection */}
      {renderActiveSection()}

      {/* Footer */}
      <Footer />
    </div>
  );
}
