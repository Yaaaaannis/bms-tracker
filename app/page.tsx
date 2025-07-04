'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CollectionsSection, { ActiveSection } from '@/components/home/CollectionsSection';
import TournamentsSection from '@/components/sections/TournamentsSection';
import CalendarSection from '@/components/sections/CalendarSection';
import PlayersSection from '@/components/sections/PlayersSection';
import StartGGSection from '@/components/sections/StartGGSection';

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('tournois');

  const handleSectionChange = (section: ActiveSection) => {
    console.log(`🔄 Navigation vers: ${section}`);
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'agenda':
        return <CalendarSection />;
      case 'tournois':
        return <TournamentsSection />;
      case 'joueurs':
        return <PlayersSection />;
      case 'startgg':
        return <StartGGSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CollectionsSection 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      {renderActiveSection()}
      <Footer />
    </div>
  );
}
