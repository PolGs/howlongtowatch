import { X, Clock, Star, Calendar } from 'lucide-react';
import { Movie, tmdbService } from '../services/tmdb';

interface MovieModalProps {
  item: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ item, onClose }: MovieModalProps) {
  if (!item) return null;

  const title = item.title || item.name || 'Untitled';
  const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const runtime = item.runtime || (item.episode_run_time?.[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="relative h-96 overflow-hidden">
          <img
            src={tmdbService.getImageUrl(item.backdrop_path || item.poster_path, 'w1280')}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="p-8 -mt-32 relative z-10">
          <div className="flex gap-6 mb-6">
            <img
              src={tmdbService.getImageUrl(item.poster_path, 'w342')}
              alt={title}
              className="w-48 rounded-2xl border-2 border-white/20 shadow-2xl"
            />

            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-semibold">{rating}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>{year}</span>
                </div>

                {runtime && (
                  <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{tmdbService.formatRuntime(runtime)}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {item.overview || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
