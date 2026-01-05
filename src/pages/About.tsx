import aboutHero from '../assets/about_hero.png';
import aboutVintageCamera from '../assets/about_vintage_camera.png';
import aboutCinemaAudience from '../assets/about_cinema_audience.png';
import aboutCardDiscover from '../assets/about_card_discover.png';
import aboutCardExplore from '../assets/about_card_explore.png';
import aboutCardExperience from '../assets/about_card_experience.png';
import aboutFeaturesBg from '../assets/about_features_bg.png';
import React, { useEffect, useState } from 'react';
import { Film, Globe, Heart, Check, Play } from 'lucide-react';
import { tmdbService, ORIGINAL_IMAGE_URL } from '../services/tmdb';

interface AboutProps {
    onNavigate?: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
    const [movies, setMovies] = useState<any[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await tmdbService.getTrending('movie');
                setMovies(res.results.slice(0, 8)); // Get top 8 trending movies
            } catch (error) {
                console.error("Failed to fetch movies for About page", error);
            }
        };
        fetchMovies();
    }, []);

    const handleExplore = () => {
        if (onNavigate) {
            onNavigate('movies');
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black">
            {/* 🎥 Hero Section */}
            <section className="relative h-[50vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={aboutHero}
                        alt="Cinema Projector"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-80" />
                </div>

                <div className="relative z-10 space-y-6 animate-fadeInUp max-w-4xl mx-auto">
                    <p className="text-sm md:text-base uppercase tracking-[0.4em] text-zinc-400 font-bold">Morello</p>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-2xl">
                        Our Story
                    </h1>
                    <p className="text-xl md:text-3xl font-serif italic text-zinc-200 tracking-wide font-light">
                        Where movies become experiences.
                    </p>
                    <div className="w-24 h-[1px] bg-white/30 mx-auto mt-8"></div>
                    <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed pt-4 font-light">
                        Morello is not just a platform — <br /> it's a place where cinema lives, breathes, and connects us all.
                    </p>
                </div>
            </section>

            {/* 📽️ Why We Started */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-zinc-900/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 border-l-2 border-white pl-4">
                            Why We Started Morello
                        </h2>
                        <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
                            <p>
                                Movies are more than entertainment.
                            </p>
                            <p>
                                They inspire, teach, and connect people across the world.
                            </p>
                            <p>
                                We created Morello to bring every movie, every series, every story — into one elegant space.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-[250px] rounded-sm overflow-hidden border border-white/10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
                            <img
                                src={aboutVintageCamera}
                                alt="Vintage Camera"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="h-[250px] rounded-sm overflow-hidden border border-white/10 shadow-2xl mt-12 relative group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
                            <img
                                src={aboutCinemaAudience}
                                alt="Cinema Audience"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 💎 Feature Cards (Glassmorphism) */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={aboutFeaturesBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
                </div>

                {/* Background Glow (kept subtle) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-r from-transparent via-zinc-900/30 to-transparent blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <GlassCard
                            title="Discover"
                            subtitle="Explore movies worldwide"
                            image={aboutCardDiscover}
                            delay="0"
                        />
                        <GlassCard
                            title="Explore"
                            subtitle="Explore stories without limits"
                            image={aboutCardExplore}
                            delay="100"
                        />
                        <GlassCard
                            title="Experience"
                            subtitle="Experience cinema differently"
                            image={aboutCardExperience}
                            color="text-rose-500"
                            delay="200"
                        />
                    </div>
                </div>
            </section>

            {/* ✅ Value Props List */}
            <section className="py-24 bg-gradient-to-b from-black to-zinc-950 border-y border-zinc-900">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                    <ValueItem text="Curated movie & series details" />
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <ValueItem text="Honest reviews" />
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <ValueItem text="Ad-free & seamless" />
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <ValueItem text="Built for movie lovers" />
                </div>
            </section>

            {/* 🎞️ Visual Grid Strip */}
            <section className="overflow-hidden py-12 opacity-60 hover:opacity-100 transition-opacity duration-700">
                <div className="flex gap-2 min-w-max animate-scroll">
                    {movies.length > 0 ? (
                        <>
                            {movies.map((m) => (
                                <div key={m.id} className="w-64 aspect-video rounded-sm overflow-hidden relative">
                                    <img
                                        src={m.backdrop_path ? `${ORIGINAL_IMAGE_URL}${m.backdrop_path}` : `https://picsum.photos/seed/${m.id}/400/250`}
                                        alt={m.title}
                                        className="w-full h-full object-cover transition-all duration-500"
                                    />
                                </div>
                            ))}
                            {/* Duplicate for seamless scroll */}
                            {movies.map((m) => (
                                <div key={`dup-${m.id}`} className="w-64 aspect-video rounded-sm overflow-hidden relative">
                                    <img
                                        src={m.backdrop_path ? `${ORIGINAL_IMAGE_URL}${m.backdrop_path}` : `https://picsum.photos/seed/${m.id}/400/250`}
                                        alt={m.title}
                                        className="w-full h-full object-cover transition-all duration-500"
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        // Fallback while loading
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="w-64 aspect-video bg-zinc-900 animate-pulse rounded-sm"></div>
                        ))
                    )}
                </div>
            </section>

            {/* 🎬 Final CTA */}
            <section className="py-32 relative flex flex-col items-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1596443686812-2f45229eeb36?q=80&w=2070&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                        alt="Audience"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <p className="text-2xl md:text-3xl font-serif italic text-white tracking-wide">
                            “Every movie has a story.
                        </p>
                        <p className="text-2xl md:text-3xl font-serif italic text-white tracking-wide">
                            Morello exists to help you find it. ”
                        </p>
                    </div>

                    <button
                        onClick={handleExplore}
                        className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <span>Start Exploring Morello</span>
                    </button>

                    {/* Theater Seats Effect at Bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                </div>
            </section>
        </div>
    );
};

const GlassCard = ({ title, subtitle, image, color = "text-zinc-400", delay }: { title: string, subtitle: string, image: string, color?: string, delay: string }) => (
    <div
        className="group relative h-[300px] rounded-lg overflow-hidden bg-black/40 border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col justify-end p-8"
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Background Image with Hover Zoom */}
        <div className="absolute inset-0 z-0">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">{title}</h3>
            <p className="text-sm uppercase tracking-widest text-zinc-300 drop-shadow-md">{subtitle}</p>

            {/* Active Indicator */}
            <div className="w-12 h-1 bg-white mt-4 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
        </div>
    </div>
);

const ValueItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-6 group cursor-default">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-zinc-700 bg-transparent group-hover:border-white group-hover:bg-white transition-all duration-300">
            <Check size={12} className="text-transparent group-hover:text-black transition-colors" />
        </div>
        <span className="text-lg md:text-xl font-light text-zinc-400 group-hover:text-white transition-colors tracking-wide">
            {text}
        </span>
    </div>
);

export default About;
