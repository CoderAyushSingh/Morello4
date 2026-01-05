import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';

interface WelcomeAnimationProps {
    onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
    const [stage, setStage] = useState(0);
    const [posters, setPosters] = useState<string[]>([]);

    // Popular movie posters for background collage
    const POSTER_PATHS = [
        '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // Dark Knight
        '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', // Oppenheimer
        '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', // Avatar
        '/pBkGKqCD28UfJt4rmigihCcP08.jpg', // Spiderman
        '/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg', // Guardians
        '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // Godfather
        '/sM33SANp9z6rXW8Itn7NnG1GOEs.jpg', // Zootopia
        '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', // Shawshank
        '/u3bZgnGQ9T6UB9kQDgw4TftLi9.jpg', // La La Land
        '/gEU2QniL6E8ahDaPCy6DKzvp5yS.jpg', // Godfather 2
        '/abf8tHznhSvl9B6A1k44q8q6G5x.jpg', // Goodfellas
        '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'  // Parasite
    ];

    useEffect(() => {
        // Shuffle and set posters
        setPosters(POSTER_PATHS.sort(() => 0.5 - Math.random()));

        const timer1 = setTimeout(() => setStage(1), 300); // Posters fade in
        const timer2 = setTimeout(() => setStage(2), 1000); // Logo & Particles
        const timer3 = setTimeout(() => setStage(3), 2200); // Text Reveal
        const timer4 = setTimeout(() => setStage(4), 3500); // Exit
        const timer5 = setTimeout(() => onComplete(), 4000); // Unmount

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${stage === 4 ? 'opacity-0' : 'opacity-100'}`}>

            {/* 🎬 Background Poster Wall */}
            <div className={`absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-2 opacity-20 transform scale-105 transition-all duration-[3000ms] ${stage >= 1 ? 'translate-y-0 opacity-20' : 'translate-y-10 opacity-0'}`}>
                {posters.map((path, idx) => (
                    <div
                        key={idx}
                        className="relative pb-[150%] overflow-hidden bg-zinc-900/50 rounded-lg animate-pulse"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${path}`}
                            alt="Poster"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 mix-blend-screen"
                        />
                    </div>
                ))}
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            {/* ✨ Large Particles */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo */}
                <div className={`relative w-24 h-24 md:w-36 md:h-36 mb-6 transition-all duration-[1200ms] ease-out transform ${stage >= 2 ? 'scale-100 opacity-100 rotate-0' : 'scale-150 opacity-0 rotate-12'}`}>
                    <img src={logo} alt="Morello" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                </div>

                {/* Brand Text */}
                <div className="overflow-hidden">
                    <h1 className={`text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-[0.1em] transform transition-all duration-[1000ms] cubic-bezier(0.2, 1, 0.3, 1) ${stage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        MORELLO
                    </h1>
                </div>

                {/* Loading Bar */}
                <div className={`mt-8 w-48 h-0.5 bg-zinc-800 overflow-hidden rounded-full transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-full h-full bg-white animate-progress origin-left" />
                </div>
            </div>
        </div>
    );
};

export default WelcomeAnimation;
