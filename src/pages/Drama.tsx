
import React, { useEffect, useState } from 'react';
import { tmdbService } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/media/MovieCard';


interface DramaProps {
    onMediaClick: (id: number, type: 'movie' | 'tv') => void;
}

const Drama: React.FC<DramaProps> = ({ onMediaClick }) => {
    const [kDramas, setKDramas] = useState<Movie[]>([]);
    const [cDramas, setCDramas] = useState<Movie[]>([]);
    const [anime, setAnime] = useState<Movie[]>([]);
    const [providers, setProviders] = useState<{ provider_id: number; provider_name: string; logo_path: string }[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeTab, setActiveTab] = useState<'K-DRAMA' | 'C-DRAMA' | 'ANIME'>('K-DRAMA');
    const [pages, setPages] = useState({ 'K-DRAMA': 1, 'C-DRAMA': 1, 'ANIME': 1 });

    useEffect(() => {
        const fetchInitial = async () => {
            const pRes = await tmdbService.getWatchProviders('tv');
            setProviders(pRes.results);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const commonParams = selectedProvider ? { with_watch_providers: selectedProvider, watch_region: 'IN' } : {};

                const [kRes, cRes, aRes] = await Promise.all([
                    tmdbService.discover('tv', { with_original_language: 'ko', sort_by: 'popularity.desc', 'vote_count.gte': '100', ...commonParams }),
                    tmdbService.discover('tv', { with_original_language: 'zh', sort_by: 'popularity.desc', 'vote_count.gte': '50', ...commonParams }),
                    tmdbService.discover('tv', { with_original_language: 'ja', with_genres: '16', sort_by: 'popularity.desc', 'vote_count.gte': '100', ...commonParams })
                ]);
                setKDramas(kRes.results);
                setCDramas(cRes.results);
                setAnime(aRes.results);
            } catch (err) {
                console.error("Failed to fetch drama data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedProvider]); // Reload when filter changes

    const handleLoadMore = async () => {
        setLoadingMore(true);
        const nextPage = pages[activeTab] + 1;
        const commonParams = selectedProvider ? { with_watch_providers: selectedProvider, watch_region: 'IN' } : {};

        try {
            let res;
            if (activeTab === 'K-DRAMA') {
                res = await tmdbService.discover('tv', {
                    with_original_language: 'ko',
                    sort_by: 'popularity.desc',
                    'vote_count.gte': '100',
                    page: nextPage.toString(),
                    ...commonParams
                });
                setKDramas(prev => [...prev, ...res.results]);
            } else if (activeTab === 'C-DRAMA') {
                res = await tmdbService.discover('tv', {
                    with_original_language: 'zh',
                    sort_by: 'popularity.desc',
                    'vote_count.gte': '50',
                    page: nextPage.toString(),
                    ...commonParams
                });
                setCDramas(prev => [...prev, ...res.results]);
            } else {
                res = await tmdbService.discover('tv', {
                    with_original_language: 'ja',
                    with_genres: '16',
                    sort_by: 'popularity.desc',
                    'vote_count.gte': '100',
                    page: nextPage.toString(),
                    ...commonParams
                });
                setAnime(prev => [...prev, ...res.results]);
            }
            setPages(prev => ({ ...prev, [activeTab]: nextPage }));
        } catch (err) {
            console.error("Failed to load more", err);
        } finally {
            setLoadingMore(false);
        }
    };

    const getActiveData = () => {
        switch (activeTab) {
            case 'K-DRAMA': return kDramas;
            case 'C-DRAMA': return cDramas;
            case 'ANIME': return anime;
            default: return [];
        }
    };

    const getTabDescription = () => {
        switch (activeTab) {
            case 'K-DRAMA': return "The finest storytelling from South Korea. Romance, Thriller, and more.";
            case 'C-DRAMA': return "Epic historical dramas and modern tales from China.";
            case 'ANIME': return "Trending animation series from Japan.";
        }
    };

    // Only show full screen loader on initial mount if no data
    if (loading && kDramas.length === 0 && cDramas.length === 0 && anime.length === 0) return (
        <div className="h-screen flex items-center justify-center bg-black">
            <div className="flex space-x-4 overflow-hidden">
                {['M', 'O', 'R', 'E', 'L', 'L', 'O'].map((char, i) => (
                    <span
                        key={i}
                        className="text-4xl md:text-6xl font-black text-white animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-24 min-h-screen">
            {/* Header & Tabs */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 mb-20 animate-fadeIn">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-10">
                    <div>
                        <span className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.6em] block mb-4">International Collections</span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white mb-6">
                            {activeTab}
                        </h1>
                        <p className="text-zinc-500 max-w-2xl text-lg font-light tracking-wide transition-all duration-300">
                            {getTabDescription()}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 items-end">
                        <div className="flex bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800">
                            {['K-DRAMA', 'C-DRAMA', 'ANIME'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab as any); setSelectedProvider(''); setPages(prev => ({ ...prev, [tab]: 1 })); }}
                                    className={`px-6 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* OTT Logos Filter - Custom Dropdown */}
                        <div className="flex flex-col space-y-2 items-end relative z-50">
                            <span className="text-[8px] uppercase tracking-widest text-zinc-700 font-black mr-1">Streaming Partner</span>

                            <div className="relative group">
                                <button className="flex items-center gap-2 bg-black border border-zinc-900 px-4 py-3 rounded-sm hover:border-zinc-700 transition-all min-w-[200px] justify-between group-focus-within:border-white">
                                    <div className="flex items-center gap-2">
                                        {selectedProvider ? (
                                            <>
                                                {providers.find(p => p.provider_id.toString() === selectedProvider) && (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/original${providers.find(p => p.provider_id.toString() === selectedProvider)?.logo_path}`}
                                                        className="w-4 h-4 rounded-sm object-cover"
                                                        alt="Selected"
                                                    />
                                                )}
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-white truncate max-w-[120px]">
                                                    {providers.find(p => p.provider_id.toString() === selectedProvider)?.provider_name}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">All Platforms</span>
                                        )}
                                    </div>
                                    <span className="text-zinc-600 text-[8px]">▼</span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-2 w-[280px] max-h-[400px] overflow-y-auto bg-black border border-zinc-800 rounded-sm shadow-2xl p-2 grid grid-cols-4 gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 hide-scrollbar z-50">
                                    <button
                                        onClick={() => { setSelectedProvider(''); setPages(prev => ({ ...prev, [activeTab]: 1 })); }}
                                        className={`col-span-4 py-3 text-[10px] uppercase font-black hover:bg-zinc-900 border border-transparent hover:border-zinc-800 flex items-center justify-center gap-2 ${!selectedProvider ? 'text-white bg-zinc-900' : 'text-zinc-500'}`}
                                    >
                                        All Platforms
                                    </button>
                                    {providers.map(p => (
                                        <button
                                            key={p.provider_id}
                                            onClick={() => { setSelectedProvider(p.provider_id.toString()); setPages(prev => ({ ...prev, [activeTab]: 1 })); }}
                                            className={`flex flex-col items-center gap-1 p-2 rounded-sm border hover:bg-zinc-900 transition-all ${selectedProvider === p.provider_id.toString() ? 'border-white bg-zinc-900' : 'border-transparent hover:border-zinc-800'}`}
                                            title={p.provider_name}
                                        >
                                            <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-8 h-8 rounded-md object-cover shadow-sm" />
                                            <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-wide truncate w-full text-center">{p.provider_name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32">
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-16 min-h-[500px] transition-all duration-300 ${loading ? 'opacity-40 grayscale blur-sm' : 'opacity-100'}`}>
                    {getActiveData().map((item, idx) => (
                        <div key={`${item.id}-${activeTab}-${idx}`} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <MovieCard item={item} onClick={onMediaClick} />
                        </div>
                    ))}
                </div>

                {getActiveData().length === 0 && !loading && (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xs uppercase tracking-widest">No Content Found</p>
                    </div>
                )}

                {/* Load More Button */}
                {getActiveData().length > 0 && (
                    <div className="mt-32 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="group relative border border-zinc-900 hover:border-white text-white px-16 py-5 text-[10px] uppercase tracking-[0.5em] font-black transition-all overflow-hidden"
                        >
                            <span className="relative z-10">{loadingMore ? 'Loading...' : 'Load More Content'}</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
                            <span className="absolute inset-0 z-20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity">
                                {loadingMore ? 'Processing' : 'Discover More'}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drama;
