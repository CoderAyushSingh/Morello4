
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
// Image Sizes: w300, w780, w1280, original
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_IMAGE_URL = 'https://image.tmdb.org/t/p/w1280'; // Optimized relative to 'original'
export const ORIGINAL_IMAGE_URL = 'https://image.tmdb.org/t/p/original'; // Keep for specific high-res needs only

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) throw new Error('TMDB API request failed');
  return response.json();
}

export const tmdbService = {
  getTrending: (type: 'movie' | 'tv' | 'all' = 'all') =>
    fetchTMDB(`/trending/${type}/week`),

  getLatestMovies: () =>
    fetchTMDB('/movie/now_playing', { region: 'IN' }),

  getTopRated: (type: 'movie' | 'tv' = 'movie') =>
    fetchTMDB(`/${type}/top_rated`),

  getDetails: (type: 'movie' | 'tv', id: number) => {
    const append = type === 'movie'
      ? 'credits,videos,recommendations,watch/providers,release_dates'
      : 'credits,videos,recommendations,watch/providers,content_ratings';
    return fetchTMDB(`/${type}/${id}`, { append_to_response: append });
  },

  getActorDetails: (id: number) =>
    fetchTMDB(`/person/${id}`, { append_to_response: 'combined_credits' }),

  search: (query: string) =>
    fetchTMDB('/search/multi', { query }),

  getUpcoming: (region?: string) =>
    fetchTMDB('/movie/upcoming', region ? { region } : {}),

  discover: (type: 'movie' | 'tv', params: Record<string, string>) =>
    fetchTMDB(`/discover/${type}`, params),

  getGenres: (type: 'movie' | 'tv') =>
    fetchTMDB(`/genre/${type}/list`),

  getWatchProviders: (type: 'movie' | 'tv') =>
    fetchTMDB(`/watch/providers/${type}`, { watch_region: 'IN' })
};
