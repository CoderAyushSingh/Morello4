
import React, { useEffect, useState } from 'react';
import { tmdbService, IMAGE_BASE_URL } from '../services/tmdb';
import { Movie } from '../types';

interface UpcomingProps {
  onMediaClick: (id: number, type: 'movie' | 'tv') => void;
}

const Upcoming: React.FC<UpcomingProps> = ({ onMediaClick }) => {
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'IN' | 'US'>('IN');

  const INDIAN_UPCOMING_IDS = [
    1196946, // Ikkis
    1022453, // The Raja Saab
    1235877, // Jana Nayagan
    1213898, // Border 2
    1339876, // Mardaani 3
    1320660, // Pati Patni Aur Woh 2
    1376856, // The Paradise
    1475768, // Battle of Galwan
    1213243, // Toxic
    1411327, // Nagzilla
    1269325, // Drishyam 3
    656908,  // Ramayana
    1235057  // Love and War
  ];

  const WORLD_UPCOMING_IDS = [
    1003596, // Avengers: Doomsday (30 Jan)
    755679,  // Fast & Furious 11 (24 Jul)
    1084244, // Toy Story 5 (19 Jun)
    1170608  // Dune: Messiah (06 Nov)
  ];

  const MANUAL_WORLD_MOVIES: Movie[] = [
    {
      id: 888001,
      title: "Blade",
      overview: "Marvel Studios' reboot of the vampire hunter saga starring Mahershala Ali.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-02-13",
      vote_average: 0,
      vote_count: 0,
      genre_ids: []
    },
    {
      id: 888002,
      title: "Avengers: Secret Wars",
      overview: "The epic conclusion to the Multiverse Saga.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-05-01",
      vote_average: 0,
      vote_count: 0,
      genre_ids: []
    },
    {
      id: 888003,
      title: "Star Wars: New Jedi Order",
      overview: "Rey Skywalker attempts to rebuild the Jedi Order 15 years after The Rise of Skywalker.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-05-22",
      vote_average: 0,
      vote_count: 0,
      genre_ids: []
    },
    {
      id: 888004,
      title: "Minions 3",
      overview: "The third installment in the Minions prequel series.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-07-03",
      vote_average: 0,
      vote_count: 0,
      genre_ids: []
    },
    {
      id: 888005,
      title: "Spider-Man 4",
      overview: "Tom Holland returns as Peter Parker in this new chapter following No Way Home.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-07-17",
      vote_average: 0,
      vote_count: 0,
      genre_ids: []
    },
    {
      id: 888006,
      title: "Ice Age 6",
      overview: "The herd returns for another chilling adventure.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2026-12-18",
      vote_average: 0,
      vote_count: 0,
      genre_ids: []
    }
  ];

  // Manual entry for King (SRK) as ID is not yet stable/found
  const KING_MOVIE: Movie = {
    id: 999999, // Placeholder
    title: "King",
    overview: "Upcoming action thriller starring Shah Rukh Khan and Suhana Khan. Directed by Sujoy Ghosh.",
    poster_path: null, // Will fall back to placeholder or generic
    backdrop_path: null,
    release_date: "2026-12-31", // TBA 2026
    vote_average: 0,
    vote_count: 0,
    genre_ids: []
  };

  useEffect(() => {
    setUpcoming([]);
    const load = async () => {
      try {
        if (activeTab === 'IN') {
          // Fetch curated Indian list
          const fetched = await Promise.all(
            INDIAN_UPCOMING_IDS.map(id => tmdbService.getDetails('movie', id).catch(e => null))
          );

          let fullList = fetched.filter(m => m !== null) as Movie[];
          fullList.push(KING_MOVIE); // Add King manually

          // Sort by release date
          const sorted = fullList.sort((a, b) => new Date(a.release_date || '2099-01-01').getTime() - new Date(b.release_date || '2099-01-01').getTime());
          setUpcoming(sorted);

        } else {
          // Fetch curated World list
          const fetched = await Promise.all(
            WORLD_UPCOMING_IDS.map(id => tmdbService.getDetails('movie', id).catch(e => null))
          );

          let fullList = fetched.filter(m => m !== null) as Movie[];
          fullList = [...fullList, ...MANUAL_WORLD_MOVIES];

          // Sort by release date
          const sorted = fullList.sort((a, b) => new Date(a.release_date || '2099-01-01').getTime() - new Date(b.release_date || '2099-01-01').getTime());
          setUpcoming(sorted);
        }

      } catch (err) {
        console.error("Upcoming failed", err);
      }
    };
    load();
  }, [activeTab]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12 min-h-screen">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-white mb-2">Premiere Calendar</h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Upcoming releases curated for you.</p>
        </div>

        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('IN')}
            className={`px-6 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'IN' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Top Indian
          </button>
          <button
            onClick={() => setActiveTab('US')}
            className={`px-6 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'US' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            World
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {upcoming.length > 0 ? (
          upcoming.map((movie, idx) => {
            const date = movie.release_date ? new Date(movie.release_date) : new Date();
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
            const weekday = date.toLocaleString('default', { weekday: 'long' });
            const isTBA = movie.id === 999999; // Check for our manual King entry

            return (
              <div
                key={movie.id}
                className="group flex flex-col md:flex-row gap-6 bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 p-4 rounded-xl transition-all duration-300 animate-fadeInUp cursor-pointer"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => onMediaClick(movie.id, 'movie')}
              >
                {/* Date Box */}
                <div className="flex-shrink-0 w-full md:w-24 bg-zinc-900 md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 flex md:flex-col items-center justify-center md:justify-start gap-2 md:gap-0 border-b md:border-b-0 md:border-r border-zinc-800">
                  <span className="text-xs font-black text-red-500 uppercase tracking-wider">{isTBA ? 'TBA' : month}</span>
                  <span className="text-3xl md:text-4xl font-bold text-white tracking-tighter">{isTBA ? '2026' : (day < 10 ? `0${day}` : day)}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{isTBA ? 'Coming Soon' : weekday}</span>
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="w-16 h-24 md:w-20 md:h-28 flex-shrink-0 overflow-hidden rounded-lg shadow-lg bg-zinc-800">
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/300x450/222/999?text=No+Poster'}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{movie.title}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed max-w-3xl">{movie.overview || "Plot details pending..."}</p>
                  </div>

                  <div className="flex-shrink-0 self-center">
                    <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-zinc-600 uppercase tracking-widest text-xs">Loading Calendar...</div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
