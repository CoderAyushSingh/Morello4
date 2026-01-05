import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Film, User, Hash, CornerDownLeft, MoveUp, MoveDown, Tv, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tmdbService, IMAGE_BASE_URL } from '../../services/tmdb';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Debounced Search
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await tmdbService.search(query);
                // Filter out results without standard media types or missing images/titles if desired
                // For now, take top 8 relevant results
                const filtered = data.results
                    .filter((item: any) => ['movie', 'tv', 'person'].includes(item.media_type))
                    .slice(0, 8);
                setResults(filtered);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery(''); // Reset on close
            setResults([]);
        }
    }, [isOpen]);

    // Keyboard Navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (results.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const handleSelect = (item: any) => {
        onClose();
        if (item.media_type === 'movie') {
            navigate(`/detail/movie/${item.id}`);
        } else if (item.media_type === 'tv') {
            navigate(`/detail/tv/${item.id}`);
        } else if (item.media_type === 'person') {
            navigate(`/actor/${item.id}`);
        }
    };

    const MotionDiv = motion.div as any;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl bg-[#0F0F0F] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
                    >
                        {/* Header / Input */}
                        <div className="flex items-center px-4 py-4 border-b border-zinc-800 gap-3">
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5 text-zinc-500" />
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search movies, shows, people..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none"
                            />
                            <button
                                onClick={onClose}
                                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500 font-medium hover:text-white transition-colors"
                            >
                                ESC
                            </button>
                        </div>

                        {/* List */}
                        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
                            {!query && results.length === 0 ? (
                                <div className="py-12 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
                                    <Hash className="w-8 h-8 opacity-20" />
                                    <p>Type to search the full database</p>
                                </div>
                            ) : results.length === 0 && !isLoading ? (
                                <div className="py-12 text-center text-zinc-500 text-sm">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <>
                                    <div className="px-4 py-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                                        Top Results
                                    </div>

                                    <div className="px-2 space-y-0.5">
                                        {results.map((item, index) => {
                                            const isSelected = index === selectedIndex;
                                            const title = item.title || item.name;
                                            const subtitle = item.release_date || item.first_air_date || (item.known_for_department ? item.known_for_department : null);
                                            const year = subtitle ? new Date(subtitle).getFullYear() : 'N/A';
                                            const imagePath = item.poster_path || item.profile_path;

                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleSelect(item)}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                    className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Thumbnail */}
                                                        <div className={`w-8 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0 border ${isSelected ? 'border-zinc-600' : 'border-transparent'}`}>
                                                            {imagePath ? (
                                                                <img
                                                                    src={`${IMAGE_BASE_URL}${imagePath}`}
                                                                    alt={title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                    {item.media_type === 'person' ? <User size={12} /> : <Film size={12} />}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                                                {title}
                                                            </span>
                                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                                {item.media_type === 'movie' && <span className="flex items-center gap-1"><Film size={10} /> Movie</span>}
                                                                {item.media_type === 'tv' && <span className="flex items-center gap-1"><Tv size={10} /> TV</span>}
                                                                {item.media_type === 'person' && <span className="flex items-center gap-1"><User size={10} /> Person</span>}

                                                                {subtitle && item.media_type !== 'person' && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{year}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <CornerDownLeft className="w-4 h-4 text-zinc-500" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="bg-zinc-800 p-1 rounded-sm"><MoveUp className="w-3 h-3" /></span>
                                    <span className="bg-zinc-800 p-1 rounded-sm"><MoveDown className="w-3 h-3" /></span>
                                    <span>Move</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="bg-zinc-800 p-1 rounded-sm"><CornerDownLeft className="w-3 h-3" /></span>
                                    <span>Select</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="bg-zinc-800 p-1 rounded-sm">ESC</span>
                                <span>Exit</span>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
