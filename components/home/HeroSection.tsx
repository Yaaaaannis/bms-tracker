import { Trophy } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-red-50 text-red-600 border-red-200">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold text-sm">SUIVI DE TOURNOIS ESPORTS</span>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-6xl md:text-7xl font-black text-[#A72832] tracking-tight leading-none">
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
              <div className="text-3xl font-black text-[#A72832]">LIVE</div>
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
  );
} 