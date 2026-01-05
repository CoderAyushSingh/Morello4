
export interface Movie {
  id: number;
  title: string;
  name?: string; // For TV series
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  // vote_count is used in Detail.tsx and returned by TMDB API
  vote_count: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv' | 'person';
  profile_path?: string; // For people
}

export interface DetailedMedia extends Movie {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  spoken_languages: { name: string; english_name: string }[];
  production_countries: { name: string; iso_3166_1: string }[];
  tagline: string;
  // status is used in Detail.tsx and returned by TMDB Details API
  status: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}

export interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  known_for_department: string;
  profile_path: string;
  combined_credits: {
    cast: Movie[];
  };
}

export interface Trailer {
  key: string;
  site: string;
  type: string;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}
