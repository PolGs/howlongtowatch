import { Clock, Star } from 'lucide-react';
import { Movie, tmdbService } from '../services/tmdb';

interface MovieCardProps {
  item: Movie;
  onClick?: () => void;
}

export default function MovieCard({ item, onClick }: MovieCardProps) {
  const title = item.title || item.name || 'Untitled';
  const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  return (
    <button
      onClick={onClick}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 transform duration-300"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={tmdbService.getImageUrl(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold truncate mb-1">{title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{year}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
