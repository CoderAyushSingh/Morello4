
import React, { useEffect, useState } from 'react';
import { tmdbService, ORIGINAL_IMAGE_URL, IMAGE_BASE_URL } from '../services/tmdb';
import { CastMember, Movie, Trailer, Provider, CrewMember, DetailedMedia } from '../types';
import MovieCard from '../components/media/MovieCard';
import { Clock, Globe, Activity, Layers, Calendar, Languages, Tv, ExternalLink } from 'lucide-react';

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

  // Share Logic & Meta Tags
  const shareMessage = React.useMemo(() => {
    return encodeURIComponent(`🎥 Just discovered *${data?.title || ''}* on Morello!\n\n⭐ Rating: ${data?.vote_average ? data.vote_average.toFixed(1) : 'N/A'}/10\n${data?.overview ? `"${data.overview.slice(0, 80)}..."` : ''}\n\n🍿 Stream here: ${window.location.href}`);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const metaImage = document.querySelector('meta[property="og:image"]');
    const metaTitle = document.querySelector('meta[property="og:title"]');

    if (metaImage) metaImage.setAttribute('content', `${IMAGE_BASE_URL}${data.poster_path}`);
    else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.content = `${IMAGE_BASE_URL}${data.poster_path}`;
      document.head.appendChild(meta);
    }

    if (metaTitle) metaTitle.setAttribute('content', `${data.title} - Morello`);
    else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = `${data.title} - Morello`;
      document.head.appendChild(meta);
    }
  }, [data]);

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

        const videos = res.videos?.results || [];
        const isValidTrailer = (v: Trailer) => !v.name.toLowerCase().includes('sign language');

        const video = videos.find((v: Trailer) => v.site === 'YouTube' && v.type === 'Trailer' && v.name.includes('Official') && isValidTrailer(v))
          || videos.find((v: Trailer) => v.site === 'YouTube' && v.type === 'Trailer' && isValidTrailer(v))
          || videos.find((v: Trailer) => v.site === 'YouTube' && v.type === 'Teaser' && v.name.includes('Official') && isValidTrailer(v))
          || videos.find((v: Trailer) => v.site === 'YouTube' && v.type === 'Teaser' && isValidTrailer(v))
          || videos.find((v: Trailer) => v.site === 'YouTube' && isValidTrailer(v))
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
              <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.7em] border-l-2 border-white pl-6">Overview</h2>
              <p className="text-zinc-100 text-xl md:text-2xl leading-relaxed font-light max-w-4xl">
                {data.overview}
              </p>
            </section>

            {/* Genre Section */}
            <section className="space-y-8">
              <h2 className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.7em] border-l-2 border-white pl-6">Genres</h2>
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

            {/* Rating Display - Circular UI */}
            <div className="bg-zinc-950/50 border border-zinc-900/80 p-6 rounded-lg shadow-2xl backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <div className="text-6xl">⭐</div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">Rating</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-[#f5c518] text-black text-[9px] font-black px-1.5 py-0.5 rounded-[2px]">IMDb</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                      className="text-zinc-900"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    {/* Progress Ring */}
                    <path
                      className={`${(data.vote_average || 0) >= 7 ? 'text-emerald-500' : (data.vote_average || 0) >= 5 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                      strokeDasharray={`${(data.vote_average || 0) * 10}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white tracking-tighter">{(data.vote_average || 0).toFixed(1)}</span>
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">/10</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${(data.vote_average || 0) >= 7 ? 'bg-emerald-500' : 'bg-zinc-600'} animate-pulse`}></div>
                      <span className="text-white text-sm font-bold tracking-tight">
                        {(data.vote_average || 0) >= 8 ? 'Masterpiece' :
                          (data.vote_average || 0) >= 7 ? 'Excellent' :
                            (data.vote_average || 0) >= 5 ? 'Mixed' : 'Poor'}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-[10px] leading-relaxed max-w-[120px]">Based on global critic consensus.</p>
                  </div>
                  <div className="mt-1 pt-2 border-t border-white/5">
                    <p className="text-zinc-500 text-[9px] font-mono">
                      <span className="text-zinc-300 font-bold">{(data.vote_count || 0).toLocaleString()}</span> ratings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* REFINED SHARE SECTION - Curated Social Hub */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-sm space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <p className="text-zinc-500 text-[8px] uppercase font-black tracking-[0.4em]">Social Era</p>
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">


                <div className="grid grid-cols-4 gap-2">
                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black border border-zinc-800 h-10 flex items-center justify-center rounded-sm hover:border-white hover:bg-zinc-900 transition-all text-white"
                    title="Share on X"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${shareMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black border border-zinc-800 h-10 flex items-center justify-center rounded-sm hover:border-[#1877F2] hover:text-[#1877F2] transition-all text-white"
                    title="Share on Facebook"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${shareMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black border border-zinc-800 h-10 flex items-center justify-center rounded-sm hover:border-[#25D366] hover:text-[#25D366] transition-all text-white"
                    title="Share on WhatsApp"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${shareMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black border border-zinc-800 h-10 flex items-center justify-center rounded-sm hover:border-[#0088cc] hover:text-[#0088cc] transition-all text-white"
                    title="Share on Telegram"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </a>
                </div>

                <div className="relative group/copy">
                  <button
                    onClick={handleShare}
                    className="w-full bg-white text-black py-4 px-4 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-emerald-400"
                  >
                    <span>{copied ? 'Link Copied' : 'Copy Public Link'}</span>
                    <span className="text-zinc-400 group-hover/copy:text-black transition-colors">{copied ? '✓' : '🔗'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* WHERE TO WATCH - Premium Glass UI */}
            <div className="bg-zinc-950/50 border border-zinc-900/80 p-8 rounded-lg shadow-2xl backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Globe size={48} />
              </div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <Tv size={18} className="text-zinc-500" />
                  <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">Where to Watch</h3>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-emerald-500/20">IN Region</span>
              </div>

              <div className="space-y-4 relative z-10">
                {providers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      {providers.map(p => (
                        <a
                          key={p.provider_id}
                          href={getDirectOttLink(p.provider_name, title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group/btn p-4 rounded-md bg-zinc-900/40 border border-white/5 hover:border-white/20 hover:bg-zinc-900/80 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={`${IMAGE_BASE_URL}${p.logo_path}`}
                              className="w-10 h-10 rounded-md shadow-lg"
                              alt={p.provider_name}
                            />
                            <div>
                              <p className="text-[12px] font-bold text-white tracking-wide">{p.provider_name}</p>
                              <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider group-hover/btn:text-emerald-400 transition-colors">Stream Now</p>
                            </div>
                          </div>
                          <ExternalLink size={16} className="text-zinc-600 group-hover/btn:text-white transition-colors" />
                        </a>
                      ))}
                    </div>
                    <a
                      href={watchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-md text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-200 mt-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      <span>Visit Platform</span>
                      <ExternalLink size={12} />
                    </a>
                  </>
                ) : (
                  <div className="text-center py-12 border border-dashed border-zinc-800 rounded-md flex flex-col items-center gap-3">
                    <div className="p-3 bg-zinc-900/50 rounded-full text-zinc-600">
                      <Tv size={24} />
                    </div>
                    <p className="text-[9px] uppercase font-bold text-zinc-600 tracking-[0.2em]">No Streaming <br /> Providers Found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Box - All data verified from API mapping */}
            {/* Details Box - Redesigned Grid */}
            <div className="bg-zinc-950/50 border border-zinc-900/80 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
              <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em] mb-8">Details</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Runtime */}
                <div className="bg-zinc-900/40 p-4 rounded-md border border-white/5 flex flex-col gap-2 hover:bg-zinc-900/60 transition-colors group">
                  <Clock size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Runtime</p>
                    <p className="text-white text-sm font-bold uppercase tracking-tight">{runtimeStr}</p>
                  </div>
                </div>

                {/* Rating / Certification */}
                <div className="bg-zinc-900/40 p-4 rounded-md border border-white/5 flex flex-col gap-2 hover:bg-zinc-900/60 transition-colors group">
                  <Activity size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Rated</p>
                    <p className="text-white text-sm font-bold uppercase tracking-tight">{certification}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-zinc-900/40 p-4 rounded-md border border-white/5 flex flex-col gap-2 hover:bg-zinc-900/60 transition-colors group">
                  <Calendar size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Status</p>
                    <p className="text-white text-sm font-bold uppercase tracking-tight">{data.status}</p>
                  </div>
                </div>

                {/* Original Language */}
                <div className="bg-zinc-900/40 p-4 rounded-md border border-white/5 flex flex-col gap-2 hover:bg-zinc-900/60 transition-colors group">
                  <Languages size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Language</p>
                    <p className="text-white text-sm font-bold uppercase tracking-tight truncate">
                      {data.spoken_languages?.[0]?.english_name || 'English'}
                    </p>
                  </div>
                </div>

                {/* TV Specific: Seasons */}
                {type === 'tv' && (
                  <div className="bg-zinc-900/40 p-4 rounded-md border border-white/5 flex flex-col gap-2 hover:bg-zinc-900/60 transition-colors group col-span-2">
                    <Layers size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Structure</p>
                      <p className="text-white text-sm font-bold uppercase tracking-tight">{data.number_of_seasons} Seasons • {data.number_of_episodes} Episodes</p>
                    </div>
                  </div>
                )}
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
