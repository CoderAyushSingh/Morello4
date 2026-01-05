
import React, { useEffect, useState } from 'react';
import { tmdbService } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/media/MovieCard';

interface ListingProps {
  type: 'movie' | 'tv';
  title: string;
  onMediaClick: (id: number, type: 'movie' | 'tv') => void;
  initialGenreId?: number;
}

const Listing: React.FC<ListingProps> = ({ type, title, onMediaClick, initialGenreId }) => {
  const [items, setItems] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenreId?.toString() || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const gRes = await tmdbService.getGenres(type);
        setGenres(gRes.genres);
      } catch (err) { }
    };
    loadFilters();
  }, [type]);

  // Sync selectedGenre if initialGenreId changes (e.g., from direct navigation)
  useEffect(() => {
    if (initialGenreId) {
      setSelectedGenre(initialGenreId.toString());
      setPage(1);
    }
  }, [initialGenreId]);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          sort_by: 'popularity.desc'
        };
        if (selectedGenre) params.with_genres = selectedGenre;
        if (selectedLanguage) params.with_original_language = selectedLanguage;

        const res = await tmdbService.discover(type, params);
        setItems(prev => page === 1 ? res.results : [...prev, ...res.results]);
      } catch (err) { }
      setLoading(false);
    };
    loadItems();
  }, [type, selectedGenre, selectedLanguage, page]);

  return (
    <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
        <div className="space-y-4">
          <span className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.6em]">Discover</span>
          <h1 className="text-6xl font-bold uppercase tracking-tighter leading-none">{title}</h1>
          <p className="text-zinc-500 text-xs font-light tracking-[0.2em] uppercase">Premium selection from global studios</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col space-y-2">
            <span className="text-[8px] uppercase tracking-widest text-zinc-700 font-black ml-1">Genre</span>
            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              className="bg-black border border-zinc-900 text-[10px] uppercase tracking-widest px-6 py-3 rounded-sm focus:outline-none focus:border-white transition-all text-zinc-400 font-bold"
            >
              <option value="">All Genres</option>
              {genres.map(g => <option key={g.id} value={g.id.toString()}>{g.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-[8px] uppercase tracking-widest text-zinc-700 font-black ml-1">Language</span>
            <select
              value={selectedLanguage}
              onChange={(e) => { setSelectedLanguage(e.target.value); setPage(1); }}
              className="bg-black border border-zinc-900 text-[10px] uppercase tracking-widest px-6 py-3 rounded-sm focus:outline-none focus:border-white transition-all text-zinc-400 font-bold"
            >
              <option value="">All Regions</option>
              <option value="hi">Hindi (India)</option>
              <option value="en">English (Global)</option>
              <option value="ml">Malayalam</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
              <option value="es">Spanish</option>
              <option value="ko">Korean</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-16">
        {items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="animate-fadeInUp" style={{ animationDelay: `${(idx % 6) * 0.1}s` }}>
            <MovieCard item={item} onClick={onMediaClick} />
          </div>
        ))}
      </div>

      <div className="mt-32 flex justify-center">
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={loading}
          className="group relative border border-zinc-900 hover:border-white text-white px-16 py-5 text-[10px] uppercase tracking-[0.5em] font-black transition-all overflow-hidden"
        >
          <span className="relative z-10">{loading ? 'Loading...' : 'Load More Content'}</span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
          <span className="absolute inset-0 z-20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity">
            {loading ? 'Processing' : 'Discover More'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Listing;
