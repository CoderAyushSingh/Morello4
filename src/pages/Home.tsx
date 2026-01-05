
import React, { useEffect, useState } from 'react';
import { tmdbService, ORIGINAL_IMAGE_URL, IMAGE_BASE_URL, BACKDROP_IMAGE_URL } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/media/MovieCard';
import RankingCard from '../components/media/RankingCard';
import { Mouse } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HomeProps {
  onMediaClick: (id: number, type: 'movie' | 'tv') => void;
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onMediaClick, onNavigate }) => {
  const { t } = useLanguage();
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [picks, setPicks] = useState<Movie[]>([]);
  const [topSeries, setTopSeries] = useState<Movie[]>([]);
  const [heroBackdrop, setHeroBackdrop] = useState<string>('');
  const [movieCtaBackdrop, setMovieCtaBackdrop] = useState<string>('');
  const [tvCtaBackdrop, setTvCtaBackdrop] = useState<string>('');

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: 'smooth'
    });
  };

  // 2025 Global Charts List
  const GLOBAL_CHARTS_IDS = [
    1061474, // Superman
    1078605, // Weapons
    1233413, // Sinners
    1054867, // One Battle After Another
    1234821, // Jurassic World Rebirth
    1062722, // Frankenstein
    1263256, // Happy Gilmore 2
    986056,  // Thunderbolts*
    575265,  // Mission: Impossible - The Final Reckoning
    911430   // F1
  ];

  // 2025 Streaming Trends List
  const STREAMING_TRENDS_IDS = [
    111803, // The White Lotus
    100088, // The Last of Us
    95396,  // Severance
    119051, // Wednesday
    93405,  // Squid Game
    259909, // Dexter: Resurrection
    113988, // Monster (DAHMER)
    245703, // Dept. Q
    83867,  // Andor
    42009   // Black Mirror
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [latest, pickRes] = await Promise.all([
          tmdbService.getLatestMovies(),
          tmdbService.getTrending('all')
        ]);

        // Fetch custom Global Charts movies individually
        const globalChartsMovies = await Promise.all(
          GLOBAL_CHARTS_IDS.map(id => tmdbService.getDetails('movie', id).catch(e => null))
        );

        // Fetch custom Streaming Trends series individually
        const streamingTrendsSeries = await Promise.all(
          STREAMING_TRENDS_IDS.map(id => tmdbService.getDetails('tv', id).catch(e => null))
        );

        setLatestMovies(latest.results);
        setTopMovies(globalChartsMovies.filter(m => m !== null) as Movie[]); // Filter out any failed fetches
        setPicks(pickRes.results.slice(0, 12));
        setTopSeries(streamingTrendsSeries.filter(s => s !== null) as Movie[]);

        const randomHero = pickRes.results[Math.floor(Math.random() * 5)]?.backdrop_path;
        if (randomHero) setHeroBackdrop(randomHero);

        // Fetch dynamic backdrops for CTA boxes
        const randomMovie = globalChartsMovies[Math.floor(Math.random() * globalChartsMovies.length)]?.backdrop_path;
        const randomTV = streamingTrendsSeries[Math.floor(Math.random() * streamingTrendsSeries.length)]?.backdrop_path;
        setMovieCtaBackdrop(randomMovie);
        setTvCtaBackdrop(randomTV);

      } catch (err) {
        console.error("Home data failed", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="pb-32 bg-black relative">
      {/* 🎬 Hero Section */}
      <section className="relative h-[92vh] w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackdrop ? `${BACKDROP_IMAGE_URL}${heroBackdrop}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80'}
            className="w-full h-full object-cover opacity-60 scale-110"
            alt="Cinematic Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-5xl px-8 animate-fadeInUp">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] text-white">
            {t('hero.titleLine1')} <br /> {t('hero.titleLine2')} <span className="text-white">MORELLO</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg uppercase tracking-[0.5em] font-medium max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="pt-10 flex flex-col md:flex-row gap-6 justify-center">
            <button
              onClick={() => onNavigate('movies')}
              className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all hover:scale-105"
            >
              {t('hero.explore')}
            </button>
            <button
              onClick={() => onNavigate('tv')}
              className="bg-zinc-900 border border-zinc-800 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all hover:scale-105"
            >
              {t('hero.browse')}
            </button>
          </div>
        </div>

        {/* Scroll Mouse Icon */}
        <div
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
        >
          <Mouse className="w-6 h-6 text-white animate-scrollWheel" strokeWidth={1.5} />
          <span className="text-[8px] uppercase tracking-[0.3em] font-medium text-white/80">{t('hero.scroll')}</span>
        </div>
      </section>

      {/* 📐 Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-16 lg:px-24 xl:px-32 space-y-24 md:space-y-32 -mt-20 relative z-20">

        {/* Latest Movies Section */}
        <section>
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter border-l-4 border-white pl-4 md:pl-6">{t('home.latestCinema')}</h2>
            <button onClick={() => onNavigate('movies')} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all font-black">{t('home.viewAll')}</button>
          </div>
          <div className="flex space-x-3 md:space-x-4 overflow-x-auto hide-scrollbar pb-10">
            {latestMovies.map(movie => (
              <div key={movie.id} className="w-[110px] md:w-[140px] flex-shrink-0 transition-transform hover:scale-105 duration-300">
                <MovieCard item={movie} onClick={onMediaClick} />
              </div>
            ))}
          </div>
        </section>

        {/* Top 10 Movies Ranking */}
        <section>
          <div className="mb-8 md:mb-12">
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-black mb-2">{t('home.globalCharts')}</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter">{t('home.topMoviesTitle')}</h2>
          </div>
          <div className="flex space-x-6 md:space-x-12 overflow-x-auto hide-scrollbar pb-10 px-2 md:px-4">
            {topMovies.map((movie, index) => (
              <RankingCard key={movie.id} item={movie} rank={index + 1} onClick={onMediaClick} />
            ))}
          </div>
        </section>

        {/* Morello Picks - Best Movies & Series */}
        <section className="bg-zinc-950/50 border border-zinc-900 p-6 md:p-16 rounded-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-zinc-600 text-[9px] uppercase tracking-[0.6em] font-black px-3 py-1 border border-zinc-900 rounded-full">{t('home.editorsChoice')}</span>
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none">{t('home.picksTitle')}</h2>
            </div>
            <p className="text-zinc-500 text-xs max-w-sm font-light leading-relaxed">{t('home.picksDesc')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {picks.map(item => (
              <MovieCard key={item.id} item={item} onClick={onMediaClick} />
            ))}
          </div>
        </section>

        {/* Top 10 Web Series Ranking */}
        <section>
          <div className="mb-8 md:mb-12">
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-black mb-2">{t('home.streamingTrends')}</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter">{t('home.topSeriesTitle')}</h2>
          </div>
          <div className="flex space-x-6 md:space-x-12 overflow-x-auto hide-scrollbar pb-10 px-2 md:px-4">
            {topSeries.map((series, index) => (
              <RankingCard key={series.id} item={series} rank={index + 1} onClick={onMediaClick} />
            ))}
          </div>
        </section>

        {/* Browse All Section - Small Box CTA Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            onClick={() => onNavigate('movies')}
            className="group relative h-[300px] overflow-hidden rounded-sm cursor-pointer border border-zinc-900 transition-all hover:border-zinc-700"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img
              src={movieCtaBackdrop ? `${IMAGE_BASE_URL}${movieCtaBackdrop}` : "https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&q=80"}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              alt="Browse Movies"
            />
            <div className="absolute bottom-10 left-10 z-20 space-y-2">
              <h3 className="text-4xl font-bold uppercase tracking-tighter leading-none">{t('home.browseCinema')}</h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-bold group-hover:text-white transition-colors">{t('home.browseCinemaDesc')}</p>
              <div className="w-10 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('tv')}
            className="group relative h-[300px] overflow-hidden rounded-sm cursor-pointer border border-zinc-900 transition-all hover:border-zinc-700"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img
              src={tvCtaBackdrop ? `${IMAGE_BASE_URL}${tvCtaBackdrop}` : "https://images.unsplash.com/photo-1593784991095-a205039470b6?auto=format&fit=crop&q=80"}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              alt="Browse Series"
            />
            <div className="absolute bottom-10 left-10 z-20 space-y-2">
              <h3 className="text-4xl font-bold uppercase tracking-tighter leading-none">{t('home.browseSeries')}</h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-bold group-hover:text-white transition-colors">{t('home.browseSeriesDesc')}</p>
              <div className="w-10 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
