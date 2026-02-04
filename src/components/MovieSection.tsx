import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../services/tmdb';
import MovieCard from './MovieCard';

interface MovieSectionProps {
  title: string;
  fetchFunction: () => Promise<{ results: Movie[] }>;
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieSection({ title, fetchFunction, onSelectMovie }: MovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchFunction();
        setMovies(data.results.slice(0, 12));
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [fetchFunction]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`section-${title}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
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
          id={`section-${title}`}
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
