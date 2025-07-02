'use client';

import { useState } from 'react';
import { X, Play, Clock, Twitter, Send, AlertCircle } from 'lucide-react';
import { createVodSubmission } from '@/lib/sanity';

interface VodSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  opponentName: string;
  setName: string;
  tournamentName: string;
  onSuccess: () => void;
}

export default function VodSubmissionModal({
  isOpen,
  onClose,
  playerName,
  opponentName,
  setName,
  tournamentName,
  onSuccess
}: VodSubmissionModalProps) {
  const [vodUrl, setVodUrl] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vodUrl.trim()) {
      setError('L\'URL de la VOD est obligatoire');
      return;
    }

    // Validation basique de l'URL
    try {
      new URL(vodUrl);
    } catch {
      setError('Veuillez entrer une URL valide');
      return;
    }

    // Vérifier que c'est YouTube ou Twitch
    const isValidPlatform = vodUrl.includes('youtube.com') || 
                           vodUrl.includes('youtu.be') || 
                           vodUrl.includes('twitch.tv');
    
    if (!isValidPlatform) {
      setError('Seules les URLs YouTube et Twitch sont acceptées');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createVodSubmission({
        playerName,
        opponentName,
        setName,
        tournamentName,
        vodUrl: vodUrl.trim(),
        timestamp: timestamp.trim() || undefined,
        submitterTwitter: twitterHandle.trim() || undefined
      });

      // Reset form
      setVodUrl('');
      setTimestamp('');
      setTwitterHandle('');
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#BE2D39'}}>
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  PROPOSER UNE VOD
                </h2>
                <p className="text-gray-600 font-medium">Aidez la communauté à enrichir la base de données</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info du set (lecture seule) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Informations du set</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Joueurs:</span> {playerName} vs {opponentName}</p>
              <p><span className="font-medium">Phase:</span> {setName}</p>
              <p><span className="font-medium">Tournoi:</span> {tournamentName}</p>
            </div>
          </div>

          {/* URL de la VOD */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              URL de la VOD *
            </label>
            <div className="relative">
              <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={vodUrl}
                onChange={(e) => setVodUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... ou https://www.twitch.tv/videos/..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Seules les URLs YouTube et Twitch sont acceptées</p>
          </div>

          {/* Timestamp */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Timestamp (optionnel)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="1h23m45s ou 1:23:45 ou 5040"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: 1h23m45s, 1:23:45 ou secondes (5040)</p>
          </div>

          {/* Compte Twitter */}
          <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                Votre nom d&apos;utilisateur Twitter (optionnel)
              </label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@votre_pseudo ou votre_pseudo"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                maxLength={16}
              />
            </div>
                          <p className="text-xs text-gray-500 mt-1">
                Seulement votre nom d&apos;utilisateur (pas de lien). Pour vous créditer si la VOD est validée.
              </p>
          </div>



          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Info validation */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">
                Votre soumission sera examinée avant publication. Merci de contribuer à la communauté !
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: '#BE2D39'}}
              onMouseOver={(e) => !isSubmitting && ((e.target as HTMLElement).style.backgroundColor = '#A12630')}
              onMouseOut={(e) => !isSubmitting && ((e.target as HTMLElement).style.backgroundColor = '#BE2D39')}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ENVOI EN COURS...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ENVOYER LA VOD
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 