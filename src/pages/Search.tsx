
import React, { useEffect, useState } from 'react';
import { tmdbService, IMAGE_BASE_URL } from '../services/tmdb';
import { Movie } from '../types';
import logo from '../assets/logo.png';

interface SearchProps {
  onMediaClick: (id: number, type: 'movie' | 'tv') => void;
  onActorClick: (id: number) => void;
}

const Search: React.FC<SearchProps> = ({ onMediaClick, onActorClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await tmdbService.search(query);
        // Clean results: Ensure they have an image and are valid types
        setResults(res.results.filter((r: any) =>
          (r.media_type === 'person' && r.profile_path) ||
          (r.media_type !== 'person' && (r.poster_path || r.backdrop_path))
        ));
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 py-20 min-h-screen">
      <div className="max-w-2xl mx-auto mb-20 text-center">
        <h1 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em] mb-8">Search Collection</h1>
        <div className="relative group max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none z-10">
            <svg className="w-6 h-6 text-zinc-500 group-focus-within:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, series, or actors..."
            className="relative w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-2xl md:text-3xl font-light text-white py-8 pl-20 pr-12 rounded-full focus:outline-none focus:border-white/20 focus:bg-black/80 focus:ring-1 focus:ring-white/10 shadow-2xl transition-all duration-500 placeholder:text-zinc-700 placeholder:font-thin"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-8 flex items-center text-zinc-600 hover:text-white transition-colors duration-300 z-10"
            >
              <div className="bg-zinc-800 rounded-full p-1 hover:bg-zinc-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
            </button>
          )}
          <div className="absolute -bottom-12 left-0 w-full text-center opacity-0 group-focus-within:opacity-100 transition-opacity duration-500">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-medium">
              {loading ? <span className="animate-pulse">Searching Database...</span> : results.length > 0 ? `${results.length} Results Found` : 'Type to explore'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((item, idx) => {
              const isPerson = item.media_type === 'person';
              const isMovie = item.media_type === 'movie' || item.title !== undefined;
              const title = item.name || item.title;

              let subtitle = '';
              let imagePath = '';

              if (isPerson) {
                subtitle = 'Actor';
                imagePath = item.profile_path ? `${IMAGE_BASE_URL}${item.profile_path}` : '';
              } else {
                const year = (item.release_date || item.first_air_date || '').split('-')[0];
                subtitle = `${year} • ${isMovie ? 'Movie' : 'TV'}`;
                imagePath = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '';
              }

              const poster = imagePath || 'https://placehold.co/500x750/111/444?text=No+Image';

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => isPerson ? onActorClick(item.id) : onMediaClick(item.id, isMovie ? 'movie' : 'tv')}
                  className="group relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-600 transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={poster}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1 line-clamp-2 drop-shadow-md">{title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                      <span>{subtitle}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : query.length >= 2 && !loading ? (
          <div className="py-40 text-center">
            <p className="text-zinc-800 font-black text-[10px] uppercase tracking-[1em]">No Matches In Archives</p>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center space-y-8 opacity-40">
            <img src={logo} alt="Morello Logo" className="w-24 h-24 object-contain opacity-50 grayscale" />
            <p className="text-xs font-black uppercase tracking-[1.5em] text-center">Explore the Morello Collection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
