import { Trophy, ExternalLink, Users, Calendar } from 'lucide-react';

export type ActiveSection = 'tournois' | 'agenda' | 'joueurs' | 'startgg';

interface CollectionsSectionProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export default function CollectionsSection({ activeSection, onSectionChange }: CollectionsSectionProps) {
  const collections = [
    {
      id: 'joueurs' as ActiveSection,
      title: 'JOUEURS',
      subtitle: '02',
      icon: Users,
    },
    {
      id: 'tournois' as ActiveSection,
      title: 'TOURNOIS',
      subtitle: 'LIVE',
      icon: Trophy,
    },
    {
      id: 'agenda' as ActiveSection,
      title: 'AGENDA',
      subtitle: '2025',
      icon: Calendar,
    },
    {
      id: 'startgg' as ActiveSection,
      title: 'START.GG',
      subtitle: 'API',
      icon: ExternalLink,
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            COLLECTIONS
          </h2>
        </div>
        
        {/* Grid de collections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {collections.map((collection) => {
            const Icon = collection.icon;
            const isActive = activeSection === collection.id;
            
            return (
              <div 
                key={collection.id}
                className={`group relative transition-all duration-300 cursor-pointer h-32 ${
                  isActive 
                    ? 'bg-[#A72832]' 
                    : 'bg-gray-100 hover:bg-[#A72832]'
                }`}
                onClick={() => onSectionChange(collection.id)}
              >
                <div className="p-8 h-full flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-black transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-900 group-hover:text-white'
                    }`}>
                      {collection.title}
                    </h3>
                    <span className={`text-sm font-medium ${
                      isActive 
                        ? 'text-red-200' 
                        : 'text-gray-500 group-hover:text-red-100'
                    }`}>
                      {collection.subtitle}
                    </span>
                  </div>
                  <Icon className={`w-8 h-8 transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-white'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 