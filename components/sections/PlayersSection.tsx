import { Users } from 'lucide-react';

export default function PlayersSection() {
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
} 