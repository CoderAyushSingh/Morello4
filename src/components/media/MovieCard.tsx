
import React from 'react';
import { Movie } from '../../types';
import { IMAGE_BASE_URL } from '../../services/tmdb';

interface MovieCardProps {
  item: Movie;
  onClick: (id: number, type: 'movie' | 'tv') => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onClick }) => {
  const isMovie = item.title !== undefined;
  const title = item.title || item.name;

  return (
    <div
      onClick={() => onClick(item.id, isMovie ? 'movie' : 'tv')}
      className="w-full flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-[1.03]"
    >
      <div className="w-full aspect-[2/3] relative overflow-hidden rounded-sm poster-shadow">
        <img
          src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://placehold.co/300x450/222/999?text=No+Poster'}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>
      <div className="mt-3 w-full">
        <h3 className="text-white text-xs font-medium uppercase tracking-wider truncate group-hover:text-zinc-300 transition-colors">
          {title}
        </h3>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
          {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '2025'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
