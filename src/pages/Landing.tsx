
import React, { useState, useEffect } from 'react';
import { Play, Star, TrendingUp, MonitorPlay, MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { tmdbService, BACKDROP_IMAGE_URL, IMAGE_BASE_URL } from '../services/tmdb';
import { Movie } from '../types';
import { useTransition } from '../context/TransitionContext';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { startTransition } = useTransition();
    const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await tmdbService.getTrending('movie');
                if (data.results && data.results.length > 0) {
                    // Filter for high quality backdrops only
                    setFeaturedMovies(data.results.slice(0, 10));
                }
            } catch (error) {
                console.error("Failed to fetch landing movies", error);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        if (featuredMovies.length === 0) return;

        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
                setIsAnimating(false);
            }, 500); // Wait for fade out
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [featuredMovies]);

    const currentMovie = featuredMovies[currentIndex];

    // --- Poster Wall Logic ---
    const [posterWall, setPosterWall] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const [trending, topRated, upcoming] = await Promise.all([
                    tmdbService.getTrending('movie'),
                    tmdbService.getTopRated('movie'),
                    tmdbService.getUpcoming()
                ]);

                // Combine and shuffle for variety
                const allMovies = [...trending.results, ...topRated.results, ...upcoming.results]
                    .filter(m => m.poster_path) // Ensure poster exists
                    .sort(() => Math.random() - 0.5); // Shuffle

                setPosterWall(allMovies);
            } catch (error) {
                console.error("Failed to fetch poster wall", error);
            }
        };
        fetchAllMovies();
    }, []);

    // Split movies into 5 columns
    const columns = [
        posterWall.slice(0, 10),
        posterWall.slice(10, 20),
        posterWall.slice(20, 30),
        posterWall.slice(30, 40),
        posterWall.slice(40, 50),
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative font-sans selection:bg-yellow-500/30">

            {/* --- Cinematic Poster Wall Background --- */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50 transform scale-110">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />

                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 h-[150vh] -mt-[25vh] transform -rotate-12 scale-125">
                    {columns.map((col, i) => (
                        <div key={i} className={`flex flex-col gap-4 ${i % 2 === 0 ? 'animate-marquee-vertical' : 'animate-marquee-vertical-reverse'}`}>
                            {/* Double the list for seamless loop */}
                            {[...col, ...col].map((movie, idx) => (
                                <div key={`${i}-${idx}`} className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-zinc-900">
                                    <img
                                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                        alt=""
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient Overlays for Readability - On top of wall */}
            <div className="fixed inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-0 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]/50 z-0 pointer-events-none" />

            {/* Navigation Bar (Simple) */}
            <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-8 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Morello" className="w-14 h-14 object-contain" />
                    <span className="font-bold text-3xl tracking-tighter">MORELLO</span>
                </div>
                <div>
                    <button
                        onClick={() => startTransition('/login')}
                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-white/20 px-4 py-2 rounded-full"
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-40 max-w-[1400px] mx-auto px-4 flex flex-col items-center pt-10 md:pt-20">

                {/* Header Text */}
                <div className="text-center space-y-6 mb-16 relative">
                    <p className="text-yellow-400 font-bold tracking-[0.2em] text-xs md:text-sm uppercase animate-fadeIn">
                        Make Your Life Cinematic
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] flex flex-col items-center gap-2">
                        <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-500 cursor-default">
                            The New Era
                        </span>
                        <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-500 cursor-default">
                            Of Cinema
                        </span>
                    </h1>

                    <div className="pt-8">
                        <button
                            onClick={() => startTransition('/login')}
                            className="group relative inline-flex items-center gap-3 bg-[#FFD700] hover:bg-[#F4C430] text-black px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,215,0,0.5)]"
                        >
                            Start now
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                </div>

                {/* 3D Dashboard Showcase */}
                <div className="relative w-full max-w-5xl perspective-1000px group">

                    {/* Main Dashboard Card (Tilted) */}
                    <div className="relative w-full aspect-video bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform rotate-x-[20deg] rotate-y-[-0deg] scale-90 group-hover:rotate-x-[10deg] group-hover:scale-95 transition-all duration-1000 ease-out shadow-purple-500/20">

                        {/* Fake Dashboard UI */}
                        <div className="absolute inset-0 p-6 flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="h-2 w-32 bg-white/10 rounded-full" />
                            </div>

                            {/* Content Grid */}
                            <div className="flex-1 grid grid-cols-3 gap-6">

                                {/* Featured Card (Large) */}
                                <div className="col-span-2 row-span-2 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 relative overflow-hidden group/card border border-white/5">

                                    {/* Dynamic Background Image */}
                                    <div
                                        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 scale-105' : 'opacity-60 scale-100'}`}
                                        style={{
                                            backgroundImage: currentMovie?.backdrop_path ? `url(${BACKDROP_IMAGE_URL}${currentMovie.backdrop_path})` : 'none'
                                        }}
                                    />

                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                    {/* Dynamic Content */}
                                    <div className="relative z-10 h-full flex flex-col justify-end">
                                        <div className={`transition-all duration-500 transform ${isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                                            <h3 className="text-3xl font-bold mb-2 leading-tight">
                                                {currentMovie?.title || 'Loading Cinema...'}
                                            </h3>
                                            <p className="text-zinc-400 text-sm flex items-center gap-2">
                                                {currentMovie ? `Top Rated • ${new Date(currentMovie.release_date).getFullYear()}` : 'Curating best titles...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stat Card 1 */}
                                <div className="bg-zinc-800/50 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500">
                                        <Star className="fill-current w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{currentMovie?.vote_average ? currentMovie.vote_average.toFixed(1) : '4.9'}/10</div>
                                        <div className="text-xs text-zinc-500">Global Rating</div>
                                    </div>
                                </div>

                                {/* Stat Card 2 */}
                                <div className="bg-zinc-800/50 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-500">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">#{currentIndex + 1}</div>
                                        <div className="text-xs text-zinc-500">Trending Now</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reflection Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                    </div>


                    {/* Floating Elements (Decorations) */}

                    {/* Top Left - Quick Play */}
                    <div className="absolute -top-10 -left-10 md:-left-20 bg-[#2a2a2a] p-4 rounded-2xl shadow-xl shadow-black/50 border border-white/10 animate-float-slow">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
                                <MonitorPlay className="fill-current w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold">Resume</div>
                                <div className="text-xs text-zinc-400">Interstellar</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right - Star Graphic */}
                    <div className="absolute -bottom-10 -right-10 md:-right-20 animate-float-delayed z-20">
                        <div className="relative">
                            <Star className="w-24 h-24 text-yellow-400 fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] rotate-12" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full" />
                        </div>
                    </div>

                    {/* Bottom Left - QR style decor */}
                    <div className="absolute -bottom-20 left-0 md:-left-10 w-32 h-32 bg-white p-2 rounded-xl rotate-[-12deg] shadow-lg animate-float-slower hidden md:block">
                        <div className="w-full h-full bg-black flex items-center justify-center">
                            <span className="text-white font-mono text-xs text-center leading-tight">SCAN<br />TO<br />WATCH</span>
                        </div>
                    </div>

                    {/* Top Right - Payment/Sub style */}
                    <div className="absolute -top-5 -right-5 md:-right-10 bg-gradient-to-br from-purple-600 to-indigo-600 p-4 pr-8 rounded-2xl shadow-xl rotate-[12deg] animate-float border border-white/20">
                        <div className="text-xs font-medium text-white/80 mb-1">Premium Plan</div>
                        <div className="text-2xl font-bold text-white">Rs 0.00</div>
                        <div className="text-[10px] text-white/60">Limited Time Offer</div>
                    </div>

                </div>

                {/* --- NEW FEATURES SECTION --- */}
                <section className="relative z-40 py-32 px-4 max-w-[1400px] mx-auto w-full">

                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-[#FFD700] font-bold tracking-[0.2em] text-sm uppercase">
                            Main Features
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] max-w-4xl mx-auto">
                            Curated to make <br />
                            <span className="text-zinc-500">Discovery Simple</span> <br />
                            For Every Fan
                        </h3>

                        <div className="pt-6">
                            <button
                                onClick={() => startTransition('/login')}
                                className="bg-[#FFD700] hover:bg-[#F4C430] text-black px-8 py-3 rounded-full font-bold text-sm transition-transform hover:scale-105"
                            >
                                Start now
                            </button>
                        </div>
                    </div>

                    {/* Marquee/Grid of Feature Cards */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">

                        {/* Card 1: Yellow Icon */}
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-[#FFD700] rounded-[2rem] flex items-center justify-center transform hover:-rotate-6 transition-transform duration-300">
                            <MonitorPlay className="w-16 h-16 text-black" />
                        </div>

                        {/* Card 2: Image */}
                        <div className="w-56 h-56 md:w-64 md:h-64 bg-zinc-800 rounded-[2rem] overflow-hidden relative group transform hover:rotate-3 transition-transform duration-300 border border-white/10">
                            <img
                                src={featuredMovies[1]?.poster_path ? `${IMAGE_BASE_URL}${featuredMovies[1].poster_path}` : "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHkjDfoveCc.jpg"}
                                alt="Feature"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>

                        {/* Card 3: Circle Logo */}
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-[#0f0f0f] border border-white/10 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-2xl shadow-yellow-500/10">
                            <img src={logo} alt="Morello" className="w-24 h-24 object-contain" />
                        </div>

                        {/* Card 4: Red Icon */}
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-[#ff4b4b] rounded-[2rem] flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
                            <Star className="w-16 h-16 text-white fill-current" />
                        </div>

                        {/* Card 5: Image */}
                        <div className="w-56 h-56 md:w-64 md:h-64 bg-zinc-800 rounded-[2rem] overflow-hidden relative group transform hover:-rotate-3 transition-transform duration-300 border border-white/10">
                            <img
                                src={featuredMovies[2]?.poster_path ? `${IMAGE_BASE_URL}${featuredMovies[2].poster_path}` : "https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg"}
                                alt="Feature"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>

                    </div>

                </section>

            </main>

            {/* Global Styles for Animations */}
            <style>{`
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes marquee-vertical-reverse {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 60s linear infinite;
        }
        .animate-marquee-vertical-reverse {
          animation: marquee-vertical-reverse 60s linear infinite;
        }
        .perspective-1000px {
          perspective: 1000px;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-10px) rotate(-12deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 10s ease-in-out infinite; }
        .animate-float-delayed { animation: float-slow 7s ease-in-out 2s infinite; }
      `}</style>
        </div>
    );
};

export default Landing;
