
import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { tmdbService, ORIGINAL_IMAGE_URL } from '../../services/tmdb';

const AuthBanner: React.FC = () => {
    const [backdrop, setBackdrop] = useState<string>('');
    const [mediaTitle, setMediaTitle] = useState<string>('');

    useEffect(() => {
        const fetchBackground = async () => {
            try {
                const data = await tmdbService.getTrending('all');
                if (data.results && data.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.results.length);
                    const item = data.results[randomIndex];
                    setBackdrop(item.backdrop_path);
                    setMediaTitle(item.title || item.name);
                }
            } catch (error) {
                console.error('Failed to fetch background:', error);
            }
        };

        fetchBackground();
    }, []);

    return (
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center p-24">
            {/* Dynamic Background Image */}
            {backdrop && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={`${ORIGINAL_IMAGE_URL}${backdrop}`}
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 transition-opacity duration-1000 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                </div>
            )}

            {/* Radial Gradient Overlay */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/20 via-black/80 to-black z-0 pointer-events-none"></div>

            <div className="relative z-10 text-center max-w-lg">
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-colors duration-500"></div>
                        <img src={logo} alt="Morello" className="w-24 h-24 object-contain relative z-10 drop-shadow-2xl" />
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase text-white ml-6 flex items-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Morello</h1>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Welcome to Morello</h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-12 font-medium drop-shadow-md">
                    Your one-stop site for latest movie reviews and info. Get the details and insights about your favorite films.
                </p>

                {/* Feature Card */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 text-left border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-colors"></div>

                    <h3 className="text-xl font-bold text-white mb-2">Get movie reviews and ratings,</h3>
                    <h3 className="text-xl font-bold text-white mb-4">discover new releases!</h3>

                    {mediaTitle && (
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Currently Trending: {mediaTitle}</p>
                    )}

                    <p className="text-zinc-400 text-xs mb-8">Join us to dive into the world of cinema and find your next favorite movie.</p>

                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 overflow-hidden transform group-hover:translate-x-1 transition-transform">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-white font-bold transform group-hover:translate-x-1 transition-transform">
                            +2k
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthBanner;
