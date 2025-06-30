'use client';

import { useState } from 'react';
import { Search, User } from 'lucide-react';

interface PlayerSearchProps {
  onUserSelect: (userId: string) => void;
  isLoading?: boolean;
}

export default function PlayerSearch({ onUserSelect, isLoading }: PlayerSearchProps) {
  const [gamerTag, setGamerTag] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const tag = gamerTag.trim();
    if (!tag) {
      setError('Veuillez entrer un gamerTag valide');
      return;
    }

    onUserSelect(tag);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Rechercher un joueur</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gamerTag" className="block text-sm font-medium text-gray-300 mb-2">
              GamerTag du joueur
            </label>
            <input
              type="text"
              id="gamerTag"
              value={gamerTag}
              onChange={(e) => setGamerTag(e.target.value)}
              placeholder="ex: Glutonny, Leffen, Armada..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !gamerTag.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Chargement...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Rechercher les événements
              </>
            )}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-400">
          <p>💡 Astuce: Entrez le nom de joueur (gamerTag) tel qu&apos;il apparaît sur Start.gg</p>
          <p className="mt-1">Exemples: <strong>Glutonny</strong>, <strong>Leffen</strong>, <strong>Armada</strong></p>
        </div>
      </div>
    </div>
  );
} 