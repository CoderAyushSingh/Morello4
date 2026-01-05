
import React, { useEffect, useState } from 'react';
import { tmdbService, IMAGE_BASE_URL } from '../services/tmdb';
import { ActorDetails } from '../types';
import MovieCard from '../components/media/MovieCard';

interface ActorDetailProps {
  id: number;
  onMediaClick: (id: number, type: 'movie' | 'tv') => void;
}

const ActorDetail: React.FC<ActorDetailProps> = ({ id, onMediaClick }) => {
  const [data, setData] = useState<ActorDetails | null>(null);

  useEffect(() => {
    const loadActor = async () => {
      try {
        const res = await tmdbService.getActorDetails(id);
        setData(res);
      } catch (err) {
        console.error("Actor detail error", err);
      }
    };
    loadActor();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!data) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin"></div>
    </div>
  );

  const movies = data.combined_credits.cast.filter(c => c.media_type === 'movie').sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 12);
  const series = data.combined_credits.cast.filter(c => c.media_type === 'tv').sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 12);

  return (
    <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 py-24 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-16 xl:gap-24">

        {/* Left Side: Photo & Info */}
        <aside className="space-y-12">
          <div className="w-full h-[450px] overflow-hidden rounded-sm poster-shadow border border-zinc-900 bg-zinc-950">
            <img
              src={data.profile_path ? `${IMAGE_BASE_URL}${data.profile_path}` : 'https://placehold.co/300x450/111/444?text=No+Image'}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              alt={data.name}
            />
          </div>
          <div className="space-y-8 bg-zinc-950 p-8 rounded-sm border border-zinc-900">
            <div className="space-y-2">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">Profession</p>
              <p className="text-[12px] text-white uppercase tracking-widest font-bold">{data.known_for_department}</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">Born</p>
              <p className="text-[12px] text-white uppercase tracking-widest font-bold">{data.birthday || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">Place of Birth</p>
              <p className="text-[12px] text-white uppercase tracking-widest font-bold leading-relaxed">{data.place_of_birth || 'N/A'}</p>
            </div>
          </div>
        </aside>

        {/* Right Side: Bio & Filmography */}
        <div className="space-y-24">
          <section className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none">{data.name}</h1>
            <div className="space-y-6">
              <h3 className="text-zinc-600 text-[10px] uppercase tracking-[0.6em] font-black border-l-2 border-white pl-6">Biography</h3>
              <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed font-light max-w-4xl line-clamp-5">{data.biography || "No biography available."}</p>
            </div>
          </section>

          {movies.length > 0 && (
            <section className="space-y-12">
              <div className="flex justify-between items-end">
                <h3 className="text-zinc-600 text-[10px] uppercase tracking-[0.6em] font-black border-l-2 border-white pl-6">Cinematic Works</h3>
                <span className="text-zinc-700 text-[9px] uppercase tracking-[0.2em] font-black">Top Performers</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12 px-4">
                {movies.map(m => (
                  <MovieCard key={m.id} item={m} onClick={onMediaClick} />
                ))}
              </div>
            </section>
          )}

          {series.length > 0 && (
            <section className="space-y-12">
              <div className="flex justify-between items-end">
                <h3 className="text-zinc-600 text-[10px] uppercase tracking-[0.6em] font-black border-l-2 border-white pl-6">Digital Series</h3>
                <span className="text-zinc-700 text-[9px] uppercase tracking-[0.2em] font-black">Notable Credits</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12 px-4">
                {series.map(s => (
                  <MovieCard key={s.id} item={s} onClick={onMediaClick} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorDetail;
