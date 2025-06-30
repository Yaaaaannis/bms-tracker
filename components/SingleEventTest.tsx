'use client';

import { useState } from 'react';
import { startggService, Event } from '@/lib/startgg';
import { Trophy, Calendar } from 'lucide-react';

export default function SingleEventTest() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventSlug, setEventSlug] = useState('');
  const [apiConnectionStatus, setApiConnectionStatus] = useState<string | null>(null);

    const testApiConnection = async () => {
    setApiConnectionStatus('test en cours...');
    try {
      const isConnected = await startggService.testApiConnection();
      setApiConnectionStatus(isConnected ? '✅ Connexion API réussie' : '❌ Échec de la connexion API');
    } catch (err) {
      console.error('API connection test error:', err);
      setApiConnectionStatus('❌ Erreur de connexion API');
    }
  };

  const testEvent = async () => {
    if (!eventSlug.trim()) {
      setError('Veuillez entrer un slug d&apos;événement');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const eventData = await startggService.getSingleEventForTesting(eventSlug);
      setEvent(eventData);
      
      if (!eventData) {
        setError('Aucun événement trouvé pour ce tournoi');
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Erreur lors de la récupération de l&apos;événement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-blue-400" />
                 <h2 className="text-xl font-bold text-white">Test d&apos;Événement Unique</h2>
      </div>

      <div className="space-y-4">
        {/* Test de connexion API */}
        <div className="p-3 bg-gray-800/50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Test de connexion API</span>
            <button
              onClick={testApiConnection}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
            >
              Tester
            </button>
          </div>
          {apiConnectionStatus && (
            <p className="text-sm text-gray-300">{apiConnectionStatus}</p>
          )}
        </div>

        <div>
          <label htmlFor="tournament-slug" className="block text-sm font-medium text-gray-300 mb-2">
            Slug de l&apos;événement (ex: &quot;tournament/genesis-9-1/event/ultimate-singles&quot;)
          </label>
          <div className="flex gap-2">
            <input
              id="tournament-slug"
              type="text"
              value={eventSlug}
              onChange={(e) => setEventSlug(e.target.value)}
              placeholder="tournament/nom-du-tournoi/event/nom-de-levenement"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={testEvent}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-md transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              Tester
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {event && (
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md">
            <h3 className="font-semibold text-green-300 mb-2">Événement trouvé :</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>ID :</strong> {event.id}</p>
              <p><strong>Nom :</strong> {event.name}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
          <p>Exemples de slugs d&apos;événements :</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>tournament/genesis-9-1/event/ultimate-singles</li>
            <li>tournament/evo-2023-1/event/street-fighter-6</li>
            <li>tournament/big-house-10/event/melee-singles</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 