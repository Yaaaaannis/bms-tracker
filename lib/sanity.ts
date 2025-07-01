import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '../sanity/env';

// Configuration Sanity
const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
});

export interface SetVod {
  _id: string;
  setName: string;
  playerName: string;
  opponentName: string;
  tournamentName: string;
  vodUrl: string;
  timestamp?: string;
}

// Récupérer toutes les VODs
export async function getAllVods(): Promise<SetVod[]> {
  try {
    const vods = await client.fetch(`
      *[_type == "setVod"]{
        _id,
        setName,
        playerName,
        opponentName,
        tournamentName,
        vodUrl,
        timestamp
      }
    `);
    return vods;
  } catch (error) {
    console.error('Erreur lors de la récupération des VODs:', error);
    return [];
  }
}

// Chercher une VOD pour un set spécifique
export async function findVodForSet(
  playerName: string,
  opponentName: string,
  tournamentName: string,
  setName?: string
): Promise<SetVod | null> {
  try {
    // Recherche avec matching flexible sur les noms
    const query = `
      *[_type == "setVod" && 
        (playerName match $playerName || opponentName match $playerName) &&
        (playerName match $opponentName || opponentName match $opponentName) &&
        tournamentName match $tournamentName
        ${setName ? '&& setName match $setName' : ''}
      ][0]
    `;
    
    const params = {
      playerName: `*${playerName.toLowerCase()}*`,
      opponentName: `*${opponentName.toLowerCase()}*`, 
      tournamentName: `*${tournamentName.toLowerCase()}*`,
      ...(setName && { setName: `*${setName.toLowerCase()}*` })
    };

    const vod = await client.fetch(query, params);
    return vod || null;
  } catch (error) {
    console.error('Erreur lors de la recherche de VOD:', error);
    return null;
  }
}

// Helper pour construire l'URL avec timestamp (YouTube, Twitch, etc.)
export function buildVodUrl(url: string, timestamp?: string): string {
  if (!timestamp) return url;
  
  // Détection du type de plateforme
  const isTwitch = url.includes('twitch.tv');
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  
  // Conversion du timestamp en secondes si nécessaire
  let seconds = 0;
  let timeParam = timestamp;
  
  // Si c'est au format "1h23m45s", "5m30s", etc.
  if (timestamp.includes('h') || timestamp.includes('m') || timestamp.includes('s')) {
    const hours = timestamp.match(/(\d+)h/)?.[1] || '0';
    const minutes = timestamp.match(/(\d+)m/)?.[1] || '0'; 
    const secs = timestamp.match(/(\d+)s/)?.[1] || '0';
    seconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(secs);
    
    if (isYouTube) {
      timeParam = `${seconds}s`;
    } else if (isTwitch) {
      timeParam = timestamp; // Twitch supporte le format "1h23m45s" directement
    }
  } else if (timestamp.includes(':')) {
    // Format "1:23:45" ou "5:30"
    const parts = timestamp.split(':').map(p => parseInt(p));
    if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    
    if (isYouTube) {
      timeParam = `${seconds}s`;
    } else if (isTwitch) {
      // Convertir en format Twitch
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      timeParam = `${h}h${m}m${s}s`;
    }
  } else {
    // Format en secondes pures "5040"
    seconds = parseInt(timestamp) || 0;
    if (isYouTube) {
      timeParam = `${seconds}s`;
    } else if (isTwitch) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      timeParam = `${h}h${m}m${s}s`;
    }
  }
  
  // Construction de l'URL finale
  if (isYouTube) {
    return `${url}${url.includes('?') ? '&' : '?'}t=${timeParam}`;
  } else if (isTwitch) {
    return `${url}${url.includes('?') ? '&' : '?'}t=${timeParam}`;
  } else {
    // Autres plateformes - on essaie le format YouTube par défaut
    return `${url}${url.includes('?') ? '&' : '?'}t=${seconds}s`;
  }
} 