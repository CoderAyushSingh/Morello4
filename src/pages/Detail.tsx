
import React, { useEffect, useState } from 'react';
import { tmdbService, ORIGINAL_IMAGE_URL, IMAGE_BASE_URL } from '../services/tmdb';
import { CastMember, Movie, Trailer, Provider, CrewMember, DetailedMedia } from '../types';
import MovieCard from '../components/media/MovieCard';

const Detail: React.FC<{
  id: number;
  type: 'movie' | 'tv';
  onMediaClick: (id: number, type: 'movie' | 'tv') => void;
  onActorClick: (id: number) => void;
  onGenreClick: (id: number, type: 'movie' | 'tv') => void;
}> = ({ id, type, onMediaClick, onActorClick, onGenreClick }) => {
  const [data, setData] = useState<DetailedMedia | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [watchLink, setWatchLink] = useState<string>('');
  const [certification, setCertification] = useState<string>('UA');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const res = await tmdbService.getDetails(type, id);
        setData(res);
        setCast(res.credits?.cast?.slice(0, 15) || []);

        const keyCrew = (res.credits?.crew || []).filter((c: any) =>
          ['Director', 'Writer', 'Producer', 'Creator', 'Executive Producer'].includes(c.job)
        ).reduce((acc: any[], current: any) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) return acc.concat([current]);
          else return acc;
        }, []).slice(0, 8);
        setCrew(keyCrew);

        const video = (res.videos?.results || []).find((v: Trailer) => v.type === 'Trailer' && v.site === 'YouTube')
          || (res.videos?.results || []).find((v: Trailer) => v.type === 'Teaser' && v.site === 'YouTube')
          || (res.videos?.results || [])[0]
          || null;
        setTrailer(video);
        setRecommendations(res.recommendations?.results || []);

        const countryData = res['watch/providers']?.results?.IN;
        if (countryData) {
          setWatchLink(countryData.link || '');
          const provData = [
            ...(countryData.flatrate || []),
            ...(countryData.rent || []),
            ...(countryData.buy || [])
          ].reduce((acc: Provider[], curr: Provider) => {
            if (!acc.find(p => p.provider_id === curr.provider_id)) acc.push(curr);
            return acc;
          }, []);
          setProviders(provData);
        }

        if (type === 'movie') {
          const inRating = res.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'IN');
          const usRating = res.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US');
          const cert = inRating?.release_dates?.[0]?.certification || usRating?.release_dates?.[0]?.certification;
          setCertification(cert || 'UA');
        } else {
          const inRating = res.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'IN');
          const usRating = res.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'US');
          setCertification(inRating?.rating || usRating?.rating || 'U/A');
        }

      } catch (err) {
        console.error("Detail loading error", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, type]);

  const getDirectOttLink = (providerName: string, mediaTitle: string) => {
    const query = encodeURIComponent(mediaTitle);
    const name = providerName.toLowerCase();
    if (name.includes('netflix')) return `https://www.netflix.com/search?q=${query}`;
    if (name.includes('prime')) return `https://www.amazon.in/s?k=${query}&i=instant-video`;
    if (name.includes('hotstar')) return `https://www.hotstar.com/in/search?q=${query}`;
    if (name.includes('zee5')) return `https://www.zee5.com/search?q=${query}`;
    if (name.includes('sony')) return `https://www.sonyliv.com/search?q=${query}`;
    if (name.includes('jio')) return `https://www.jiocinema.com/search/${query}`;
    if (name.includes('apple')) return `https://tv.apple.com/search/${query}`;
    if (name.includes('google')) return `https://play.google.com/store/search?q=${query}&c=movies`;
    return watchLink || "#";
  };

  const handleShare = async () => {
    const shareData = {
      title: data?.title || data?.name || 'Morello Cinema',
      text: `Check out ${data?.title || data?.name} on Morello!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  if (loading || !data) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin"></div>
        <div className="text-zinc-600 uppercase tracking-[0.8em] font-black text-[10px]">MORELLO</div>
      </div>
    </div>
  );

  const title = data.title || data.name;
  const year = (data.release_date || data.first_air_date || '').split('-')[0];
  const runtimeStr = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : (data.episode_run_time?.[0] ? `${data.episode_run_time[0]}m` : 'N/A');

  return (
    <div className="bg-black text-white min-h-screen relative font-['Google Sans'] overflow-x-hidden">
      {/* 🎭 Hero Backdrop */}
      <section className="relative h-[75vh] w-full flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src={data.backdrop_path ? `${ORIGINAL_IMAGE_URL}${data.backdrop_path}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80'}
            className="w-full h-full object-cover opacity-80 transition-opacity duration-1000"
            alt="Backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-20 max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 w-full pb-16 flex flex-col md:flex-row items-end gap-10 animate-fadeInUp">
          <div className="w-56 h-80 flex-shrink-0 rounded-sm overflow-hidden shadow-2xl border border-white/10 transform translate-y-24 hidden lg:block bg-zinc-950">
            <img
              src={data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : 'https://placehold.co/300x450/222/999?text=No+Poster'}
              className="w-full h-full object-cover"
              alt={title}
            />
          </div>

          <div className="space-y-4 pb-2">
            <div className="flex items-center gap-3 text-zinc-400 text-[9px] font-bold uppercase tracking-[0.4em]">
              <span className="text-white border border-zinc-700 px-2 py-0.5 rounded-sm">{type === 'movie' ? 'Cinema' : 'Web Series'}</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span>{year}</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span className="text-white">{data.status}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none drop-shadow-2xl">{title}</h1>
            {data.tagline && (
              <p className="text-zinc-300 text-lg md:text-xl font-light italic tracking-tight opacity-90 max-w-2xl">{data.tagline}</p>
            )}
          </div>
        </div>
      </section>

      {/* 🎞️ Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12 xl:gap-20">

          {/* ⬅️ Left Column (Details) */}
          <div className="space-y-24">

            {/* Overview */}
            <section className="space-y-6">
              <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.7em] border-l-2 border-white pl-6">The Narrative</h2>
              <p className="text-zinc-100 text-xl md:text-2xl leading-relaxed font-light max-w-4xl">
                {data.overview}
              </p>
            </section>

            {/* Genre Section */}
            <section className="space-y-8">
              <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.7em] border-l-2 border-white pl-6">Genres & Vibe</h2>
              <div className="flex flex-wrap gap-3">
                {data.genres.map((g: any) => (
                  <span
                    key={g.id}
                    onClick={() => onGenreClick(g.id, type)}
                    className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-sm text-[10px] uppercase tracking-[0.4em] text-white font-black hover:bg-white hover:text-black transition-all cursor-pointer shadow-md"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Leading Cast */}
            <section className="space-y-10">
              <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.7em] border-l-2 border-white pl-6">Leading Cast</h2>
              <div className="flex space-x-10 overflow-x-auto hide-scrollbar pb-6 pt-2 px-2">
                {cast.map(c => (
                  <div key={c.id} className="flex flex-col items-center group cursor-pointer flex-shrink-0" onClick={() => onActorClick(c.id)}>
                    <div className="w-28 h-28 rounded-full overflow-hidden mb-6 border-2 border-zinc-800 group-hover:border-white transition-all duration-500 shadow-xl bg-zinc-950">
                      <img
                        src={c.profile_path ? `${IMAGE_BASE_URL}${c.profile_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=111&color=fff&size=150`}
                        className="w-full h-full object-cover"
                        alt={c.name}
                      />
                    </div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest text-center w-28 truncate">{c.name}</p>
                    <p className="text-zinc-600 text-[8px] uppercase tracking-[0.2em] text-center mt-1.5 w-28 truncate font-bold">{c.character}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trailer Player - Optimized for smaller container */}
            {trailer && (
              <section className="space-y-8">
                <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.7em] border-l-2 border-white pl-6">Trailer or Teaser</h2>
                <div className="max-w-2xl w-full aspect-video rounded-sm overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?modestbranding=1&rel=0&showinfo=0&autoplay=0&hl=en&origin=${window.location.origin}&enablejsapi=1`}
                    title={`${title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}
          </div>

          {/* ➡️ Right Column (Action & Specs) */}
          <aside className="space-y-12">

            {/* Rating Display */}
            <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.5em]">Critics Score</span>
                <div className="bg-[#f5c518] text-black px-2 py-1 rounded-sm font-black text-[9px] tracking-tighter">IMDb</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-white leading-none tracking-tighter">{(data.vote_average || 0).toFixed(1)}</span>
                  <span className="text-zinc-800 text-xl mb-1 font-black">/ 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-10 bg-white/20"></div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-black">{(data.vote_count || 0).toLocaleString()} Reviews</p>
                </div>
              </div>
            </div>

            {/* REFINED SHARE SECTION - Small Dark Premium Box */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm space-y-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-zinc-500 text-[8px] uppercase font-black tracking-[0.4em]">Curated Social</p>
                <span className="text-[10px] opacity-40">●</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-tighter leading-none text-white">Share Masterpiece</h3>
                <button
                  onClick={handleShare}
                  className="w-full bg-white text-black py-3 px-4 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-zinc-200"
                >
                  <span className="text-base">{copied ? '✓' : '🔗'}</span>
                  <span>{copied ? 'Link Copied' : 'Public Link'}</span>
                </button>
              </div>
            </div>

            {/* WHERE TO WATCH - Premium Black UI */}
            <div className="bg-black border border-zinc-900 p-8 rounded-sm space-y-8 relative overflow-hidden group">
              <div className="flex items-center justify-between relative z-10">
                <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.5em]">Where to Watch</h3>
                <span className="text-[9px] bg-zinc-900 text-zinc-400 px-3 py-1 rounded-full uppercase tracking-widest font-black border border-zinc-800">IN Region</span>
              </div>

              <div className="space-y-3 relative z-10">
                {providers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      {providers.map(p => (
                        <a
                          key={p.provider_id}
                          href={getDirectOttLink(p.provider_name, title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group/btn p-4 rounded-sm bg-zinc-950 border border-zinc-900 hover:border-zinc-500 transition-all duration-300 shadow-inner"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={`${IMAGE_BASE_URL}${p.logo_path}`}
                              className="w-12 h-12 rounded-sm border border-white/5"
                              alt={p.provider_name}
                            />
                            <div>
                              <p className="text-[12px] font-black text-white tracking-[0.05em] uppercase">{p.provider_name}</p>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.1em] mt-0.5 group-hover/btn:text-white transition-colors">Digital Home</p>
                            </div>
                          </div>
                          <div className="text-zinc-800 group-hover/btn:text-white transition-colors">
                            <span className="text-xl">→</span>
                          </div>
                        </a>
                      ))}
                    </div>
                    <a
                      href={watchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-white text-black py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 mt-4"
                    >
                      Browse Platform
                    </a>
                  </>
                ) : (
                  <div className="text-center py-12 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center gap-4">
                    <div className="text-2xl animate-pulse grayscale">📡</div>
                    <p className="text-[9px] uppercase font-black text-zinc-700 tracking-[0.3em] text-center">Identifying Streaming <br />Contracts...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Box - All data verified from API mapping */}
            <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm space-y-10 shadow-xl">
              <h3 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.5em]">Detailed</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
                  <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Runtime</span>
                  <span className="text-white text-[12px] font-black uppercase">{runtimeStr}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
                  <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Rating</span>
                  <span className="text-white text-[12px] font-black uppercase border border-white/30 px-3 py-1 rounded-sm">{certification}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
                  <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Status</span>
                  <span className="text-white text-[12px] font-black uppercase">{data.status}</span>
                </div>
                {type === 'tv' && (
                  <>
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
                      <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Seasons</span>
                      <span className="text-white text-[12px] font-black uppercase">{data.number_of_seasons}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
                  <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Original Lang</span>
                  <span className="text-white text-[12px] font-black uppercase">{data.spoken_languages?.[0]?.english_name || 'English'}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 🍿 Recommendations Section */}
        <div className="mt-48 pt-32 border-t border-zinc-900">
          <section className="space-y-12">
            <div className="flex justify-between items-end">
              <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.8em] border-l-2 border-white pl-8">Curated Discoveries</h2>
              <p className="text-zinc-700 text-[9px] uppercase tracking-[0.4em] font-black">Based on your selection</p>
            </div>
            <div className={`overflow-x-auto hide-scrollbar pb-16 pt-8 px-2 ${recommendations.length > 0 ? 'grid grid-rows-2 grid-flow-col gap-5' : 'block'}`}>
              {recommendations.length > 0 ? recommendations.slice(0, 15).map(m => (
                <div key={m.id} className="w-32 md:w-36 transition-all hover:scale-105 duration-300">
                  <MovieCard item={m} onClick={onMediaClick} />
                </div>
              )) : (
                <div className="w-full text-center py-20 border border-zinc-900/40 rounded-sm">
                  <p className="text-zinc-800 uppercase tracking-[1em] text-[10px] font-black">End of archives.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Detail;
