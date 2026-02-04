const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};

export interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  runtime?: number;
  episode_run_time?: number[];
  media_type?: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export const tmdbService = {
  searchMulti: async (query: string) => {
    const response = await fetch(
      `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
      options
    );
    return response.json();
  },

  getPopularMovies: async () => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?language=en-US&page=1`,
      options
    );
    return response.json();
  },

  getRecentMovies: async () => {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?language=en-US&page=1`,
      options
    );
    return response.json();
  },

  getTrending: async (mediaType: string = 'all', timeWindow: string = 'week') => {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}`,
      options
    );
    return response.json();
  },

  getMovieDetails: async (movieId: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?language=en-US`,
      options
    );
    return response.json();
  },

  getTVDetails: async (tvId: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?language=en-US`,
      options
    );
    return response.json();
  },

  getWatchProviders: async (mediaType: string, id: number, country: string = 'US') => {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}/watch/providers`,
      options
    );
    const data = await response.json();
    return data.results?.[country] || null;
  },

  discoverByProvider: async (providerId: number, mediaType: string = 'movie', country: string = 'US') => {
    const response = await fetch(
      `${BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=${country}&with_watch_providers=${providerId}`,
      options
    );
    return response.json();
  },

  getImageUrl: (path: string | null, size: string = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  formatRuntime: (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
};
