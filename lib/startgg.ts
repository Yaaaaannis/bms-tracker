// Types pour les données de l'API Start.gg
export interface Event {
  id: string;
  name: string;
}

// Player interface for components that need simple player data
export interface Player {
  id: string;
  gamerTag: string;
  prefix?: string;
}

// Set type alias for components that work with set data
export type Set = UserSet;

// Types étendus pour supporter toutes les données disponibles
export interface Image {
  url: string;
  width?: number;
  height?: number;
  ratio?: number;
  type?: string;
}

export interface Address {
  country?: string;
  state?: string;
  city?: string;
  countryId?: number;
  stateId?: number;
}

export interface PageInfo {
  total?: number;
  totalPages?: number;
}

export interface Seed {
  seedNum?: number;
  placement?: number;
}

export interface Participant {
  id: string;
  gamerTag: string;
  prefix?: string;
  player?: {
    id: string;
    gamerTag: string;
  };
}

export interface Entrant {
  id: string;
  name: string;
  participants?: Participant[];
}

export interface SetSlot {
  id: string;
  seed?: Seed;
  entrant?: Entrant;
}

export interface UserSet {
  id: string;
  fullRoundText?: string;
  round?: number;
  startedAt?: number;
  completedAt?: number;
  winnerId?: string;
  displayScore?: string;
  slots?: SetSlot[];
  event?: {
    id: string;
    name: string;
    slug: string;
    startAt?: number;
    endAt?: number;
    numEntrants?: number;
    images?: Image[];
    tournament?: {
      id: string;
      name: string;
      slug: string;
      startAt?: number;
      endAt?: number;
      city?: string;
      countryCode?: string;
      isRegistrationOpen?: boolean;
      numAttendees?: number;
      images?: Image[];
    };
    videogame?: {
      id: string;
      name: string;
      slug?: string;
      images?: Image[];
    };
  };
}

export interface TournamentSet {
  id: string;
  fullRoundText?: string;
  round?: number;
  startedAt?: number;
  completedAt?: number;
  winnerId?: string;
  displayScore?: string;
  totalGames?: number;
  state?: number; // 1 = pending, 2 = started, 3 = completed
  slots?: SetSlot[];
}

export interface PlayerSetsInTournament {
  pageInfo?: PageInfo;
  nodes: TournamentSet[];
}

export interface User {
  id: string;
  slug: string;
  name?: string;
  bio?: string;
  birthday?: string;
  discriminator?: string;
  email?: string;
  genderPronoun?: string;
  images?: Image[];
  location?: Address;
  player?: {
    id: string;
    gamerTag: string;
    prefix?: string;
    rankings?: Array<{
      rank: number;
      title: string;
    }>;
    sets?: {
      pageInfo?: PageInfo;
      nodes: UserSet[];
    };
  };
  authorizations?: Array<{
    type: string;
    externalUsername: string;
    externalId?: string;
    url?: string;
  }>;
  events?: {
    pageInfo?: PageInfo;
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
      startAt?: number;
      endAt?: number;
      numEntrants?: number;
      entrantSizeMin?: number;
      entrantSizeMax?: number;
      tournament?: {
        id: string;
        name: string;
        slug: string;
        city?: string;
        countryCode?: string;
      };
      videogame?: {
        id: string;
        name: string;
        slug: string;
      };
    }>;
  };
  tournaments?: {
    pageInfo?: PageInfo;
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
      startAt?: number;
      endAt?: number;
      city?: string;
      countryCode?: string;
      numAttendees?: number;
      isRegistrationOpen?: boolean;
      registrationClosesAt?: number;
      images?: Image[];
      events?: Array<{
        id: string;
        name: string;
        numEntrants?: number;
        videogame?: {
          name: string;
        };
      }>;
    }>;
  };
  leagues?: {
    pageInfo?: PageInfo;
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
      startAt?: number;
      endAt?: number;
      events?: Array<{
        id: string;
        name: string;
      }>;
    }>;
  };
}

export interface Tournament {
  id: string;
  name: string;
  slug?: string;
  startAt?: number;
  city?: string;
  countryCode?: string;
  events?: Event[];
}

export interface UserTournaments {
  pageInfo?: PageInfo;
  nodes: Array<{
    id: string;
    name: string;
    slug: string;
    startAt?: number;
    endAt?: number;
    city?: string;
    countryCode?: string;
    numAttendees?: number;
    isRegistrationOpen?: boolean;
    images?: Image[];
    events?: Array<{
      id: string;
      name: string;
      numEntrants?: number;
      videogame?: {
        name: string;
      };
    }>;
  }>;
}

export interface UserEvents {
  pageInfo?: PageInfo;
  nodes: Array<{
    id: string;
    name: string;
    slug: string;
    startAt?: number;
    numEntrants?: number;
    tournament?: {
      id: string;
      name: string;
      slug: string;
      city?: string;
      countryCode?: string;
    };
    videogame?: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface TournamentQueryResponse {
  tournament: Tournament;
}

// Requête GraphQL pour récupérer un événement directement
const EVENT_QUERY = `
  query getEventId($slug: String) {
    event(slug: $slug) {
      id
      name
    }
  }
`;

// Requête GraphQL étendue pour récupérer TOUTES les données disponibles d'un utilisateur
const ENHANCED_USER_QUERY = `
  query getEnhancedUser($slug: String) {
    user(slug: $slug) {
      # Informations de base
      id
      slug
      name
      bio
      
      # Images et médias
      images(type: "profile") {
        url
        width
        height
        ratio
      }
      
      # Localisation
      location {
        country
        state
        city
        countryId
        stateId
      }
      
      # Joueur associé avec plus de détails
      player {
        id
        gamerTag
        prefix
        # Classements pour différents jeux
        rankings(videogameId: 1386) {
          rank
          title
        }
        # Derniers sets/matches
        sets(perPage: 20) {
          pageInfo {
            total
            totalPages
          }
          nodes {
            id
            fullRoundText
            round
            startedAt
            completedAt
            winnerId
            displayScore
            # Événement associé
            event {
              id
              name
              slug
              startAt
              numEntrants
              images {
                url
                type
              }
              tournament {
                id
                name
                slug
                startAt
                endAt
                city
                countryCode
                isRegistrationOpen
                numAttendees
                images {
                  url
                  type
                }
              }
              videogame {
                id
                name
                slug
                images {
                  url
                  type
                }
              }
            }
            # Participants du match
            slots {
              id
              seed {
                seedNum
                placement
              }
              entrant {
                id
                name
                participants {
                  id
                  gamerTag
                  prefix
                  player {
                    id
                    gamerTag
                  }
                }
              }
            }
          }
        }
      }
      
      # Autorisations externes (réseaux sociaux)
      authorizations(types: [TWITTER, TWITCH, DISCORD]) {
        type
        externalUsername
        externalId
        url
      }
      
      # Tournois de l'utilisateur (simple)
      tournaments(query: {
        perPage: 10
        page: 1
      }) {
        pageInfo {
          total
          totalPages
        }
        nodes {
          id
          name
          slug
          startAt
          endAt
          city
          countryCode
          numAttendees
          isRegistrationOpen
          images {
            url
            type
          }
        }
      }
      
      # Événements de l'utilisateur (simple)
      events(query: {
        perPage: 10
        page: 1
      }) {
        pageInfo {
          total
          totalPages
        }
        nodes {
          id
          name
          slug
          startAt
          numEntrants
          tournament {
            id
            name
            slug
            city
            countryCode
          }
          videogame {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

// Requête GraphQL pour récupérer un tournoi
const TOURNAMENT_QUERY = `
  query TournamentQuery($slug: String) {
    tournament(slug: $slug){
      id
      name
      events {
        id
        name
      }
    }
  }
`;

// Requête GraphQL originale (plus simple) pour récupérer un utilisateur
const USER_QUERY = `
  query getUser($slug: String) {
    user(slug: $slug) {
      id
      slug
      name
      bio
      player {
        id
        gamerTag
        prefix
        rankings(videogameId: 1386) {
          rank
          title
        }
        sets(
          perPage: 10
        ) {
          nodes {
            id
            event {
              id
              name
              slug
              images {
                url
                type
              }
              tournament {
                id
                name
                slug
                startAt
                endAt
                city
                countryCode
                isRegistrationOpen
                numAttendees
                images {
                  url
                  type
                }
              }
              videogame {
                id
                name
                images {
                  url
                  type
                }
              }
            }
          }
        }
      }
      authorizations {
        type
        externalUsername
      }
    }
  }
`;

class StartggService {
  private readonly API_URL = 'https://api.start.gg/gql/alpha';
  private readonly API_TOKEN = process.env.NEXT_PUBLIC_STARTGG_TOKEN;

  private async makeRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {


    
    if (!this.API_TOKEN) {
      throw new Error('API Token manquant! Vérifiez votre fichier .env.local');
    }

    const requestBody = {
      query,
      variables,
    };
    


    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });



    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    
    if (data.errors) {

      throw new Error(`GraphQL error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    return data.data;
  }

  // Fonction pour récupérer un événement directement
  async getEvent(slug: string): Promise<Event> {
    const data = await this.makeRequest<{ event: Event }>(EVENT_QUERY, { slug });
    return data.event;
  }

  // Fonction pour récupérer un utilisateur
  async getUser(slug: string): Promise<User> {
    const data = await this.makeRequest<{ user: User }>(ENHANCED_USER_QUERY, { slug });
    return data.user;
  }

  // Fonction pour récupérer un utilisateur avec requête simple (pour compatibilité)
  async getUserSimple(slug: string): Promise<User> {
    const data = await this.makeRequest<{ user: User }>(USER_QUERY, { slug });
    return data.user;
  }

  // Fonction pour récupérer un utilisateur avec tous les détails étendus
  async getUserEnhanced(slug: string): Promise<User> {
    const data = await this.makeRequest<{ user: User }>(ENHANCED_USER_QUERY, { slug });
    return data.user;
  }

  // Fonction pour récupérer uniquement les tournois d'un utilisateur
  async getUserTournaments(slug: string, page: number = 1, perPage: number = 10): Promise<UserTournaments> {
    const query = `
      query getUserTournaments($slug: String, $page: Int!, $perPage: Int!) {
        user(slug: $slug) {
          tournaments(query: {
            perPage: $perPage
            page: $page
          }) {
            pageInfo {
              total
              totalPages
            }
            nodes {
              id
              name
              slug
              startAt
              endAt
              city
              countryCode
              numAttendees
              isRegistrationOpen
              images {
                url
                type
              }
              events {
                id
                name
                numEntrants
                videogame {
                  name
                }
              }
            }
          }
        }
      }
    `;
    
    const data = await this.makeRequest<{ user: { tournaments: UserTournaments } }>(query, { 
      slug, 
      page, 
      perPage 
    });
    return data.user.tournaments;
  }

  // Fonction pour récupérer uniquement les événements d'un utilisateur
  async getUserEvents(slug: string, page: number = 1, perPage: number = 10): Promise<UserEvents> {
    const query = `
      query getUserEvents($slug: String, $page: Int!, $perPage: Int!) {
        user(slug: $slug) {
          events(query: {
            perPage: $perPage
            page: $page
          }) {
            pageInfo {
              total
              totalPages
            }
            nodes {
              id
              name
              slug
              startAt
              numEntrants
              tournament {
                id
                name
                slug
                city
                countryCode
              }
              videogame {
                id
                name
                slug
              }
            }
          }
        }
      }
    `;
    
    const data = await this.makeRequest<{ user: { events: UserEvents } }>(query, { 
      slug, 
      page, 
      perPage 
    });
    return data.user.events;
  }

  // Fonction pour récupérer un tournoi spécifique
  async getTournament(slug: string): Promise<Tournament> {
    const data = await this.makeRequest<TournamentQueryResponse>(TOURNAMENT_QUERY, { slug });
    return data.tournament;
  }

  // Fonction pour récupérer les tournois populaires (pour compatibilité avec votre code existant)
  async getPopularTournaments(): Promise<Tournament[]> {
    // Retourner des données factices pour éviter les erreurs API

    return [
      {
        id: '1',
        name: 'Genesis 9',
        slug: 'tournament/genesis-9-1',
        startAt: Math.floor(Date.now() / 1000),
        city: 'San Jose',
        countryCode: 'US'
      },
      {
        id: '2', 
        name: 'EVO 2023',
        slug: 'tournament/evo-2023-1',
        startAt: Math.floor(Date.now() / 1000),
        city: 'Las Vegas',
        countryCode: 'US'
      },
      {
        id: '3',
        name: 'Big House 10',
        slug: 'tournament/big-house-10',
        startAt: Math.floor(Date.now() / 1000),
        city: 'Ann Arbor',
        countryCode: 'US'
      }
    ];
  }


  // Fonction utilitaire pour récupérer un seul événement directement (pour vos tests)
  async getSingleEventForTesting(slug: string): Promise<Event | null> {
    try {
      const event = await this.getEvent(slug);
      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  // Fonction pour récupérer l'ID d'un tournoi à partir de son slug
  async getTournamentId(tournamentSlug: string): Promise<string | null> {
    const query = `
      query getTournamentId($slug: String!) {
        tournament(slug: $slug) {
          id
        }
      }
    `;
    
    try {
      const data = await this.makeRequest<{ tournament: { id: string } }>(query, { slug: tournamentSlug });
      return data.tournament?.id || null;
    } catch (error) {
      console.error('Error fetching tournament ID:', error);
      return null;
    }
  }

  // Fonction pour récupérer les sets d'un joueur dans un tournoi spécifique
  async getPlayerSetsInTournament(userSlug: string, tournamentSlug: string, page: number = 1, perPage: number = 20): Promise<PlayerSetsInTournament> {
    // D'abord récupérer l'ID du tournoi
    const tournamentId = await this.getTournamentId(tournamentSlug);
    
    if (!tournamentId) {
      console.error('Tournament ID not found for slug:', tournamentSlug);
      return { nodes: [] };
    }

    const query = `
      query getPlayerSetsInTournament($userSlug: String!, $tournamentIds: [ID]!, $page: Int!, $perPage: Int!) {
        user(slug: $userSlug) {
          player {
            sets(
              filters: {
                tournamentIds: $tournamentIds
              }
              perPage: $perPage
              page: $page
            ) {
              pageInfo {
                total
                totalPages
              }
              nodes {
                id
                fullRoundText
                round
                startedAt
                completedAt
                winnerId
                displayScore
                totalGames
                state
                slots {
                  id
                  seed {
                    seedNum
                    placement
                  }
                  entrant {
                    id
                    name
                    participants {
                      id
                      gamerTag
                      prefix
                      player {
                        id
                        gamerTag
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    const data = await this.makeRequest<{ user: { player: { sets: PlayerSetsInTournament } } }>(query, { 
      userSlug, 
      tournamentIds: [tournamentId], // Passer un tableau d'IDs
      page, 
      perPage 
    });
    
    if (!data.user?.player?.sets) {
      return { nodes: [] };
    }
    
    return data.user.player.sets;
  }
}

export const startggService = new StartggService();
