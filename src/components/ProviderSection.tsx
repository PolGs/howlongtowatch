import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, tmdbService } from '../services/tmdb';
import MovieCard from './MovieCard';

interface ProviderSectionProps {
  title: string;
  providerId: number;
  country: string;
  onSelectMovie: (movie: Movie) => void;
}

export default function ProviderSection({ title, providerId, country, onSelectMovie }: ProviderSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const movieData = await tmdbService.discoverByProvider(providerId, 'movie', country);
        const tvData = await tmdbService.discoverByProvider(providerId, 'tv', country);

        const combined = [
          ...movieData.results.slice(0, 6).map((m: Movie) => ({ ...m, media_type: 'movie' })),
          ...tvData.results.slice(0, 6).map((t: Movie) => ({ ...t, media_type: 'tv' }))
        ].sort((a, b) => b.vote_average - a.vote_average).slice(0, 12);

        setMovies(combined);
      } catch (error) {
        console.error('Error loading provider content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [providerId, country]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`provider-${title}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 group">
      <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
      <div className="relative">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div
          id={`provider-${title}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[180px] sm:min-w-[220px]">
              <MovieCard item={movie} onClick={() => onSelectMovie(movie)} />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
