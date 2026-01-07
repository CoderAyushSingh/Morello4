import React from 'react';
import { Movie } from '../../types';
import { IMAGE_BASE_URL } from '../../services/tmdb';

interface RankingCardProps {
  item: Movie;
  rank: number;
  onClick: (id: number, type: 'movie' | 'tv') => void;
}

const RankingCard: React.FC<RankingCardProps> = ({ item, rank, onClick }) => {
  const isMovie = item.title !== undefined;

  return (
    <div
      onClick={() => onClick(item.id, isMovie ? 'movie' : 'tv')}
      className="flex-shrink-0 cursor-pointer group flex items-end ml-[-20px] first:ml-0"
    >
      <div className="text-[120px] font-black text-transparent stroke-white stroke-2 italic leading-none z-10 select-none opacity-20 group-hover:opacity-40 transition-opacity" style={{ WebkitTextStroke: '2px white' }}>
        {rank}
      </div>
      <div className="w-[163px] h-[245px] relative overflow-hidden rounded-sm poster-shadow ml-[-30px] z-20 transition-transform duration-300 group-hover:translate-y-[-10px]">
        <img
          src={`${IMAGE_BASE_URL}${item.poster_path}`}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default RankingCard;
