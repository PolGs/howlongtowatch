import { useState, useEffect, useRef } from 'react';
import { Search, Clock } from 'lucide-react';
import { tmdbService, Movie } from '../services/tmdb';

interface SearchBarProps {
  onSelectItem?: (item: Movie) => void;
}

export default function SearchBar({ onSelectItem }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const data = await tmdbService.searchMulti(query);
          const filteredResults = data.results
            .filter((item: Movie) => item.media_type === 'movie' || item.media_type === 'tv')
            .slice(0, 6);
          setResults(filteredResults);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelectItem = async (item: Movie) => {
    try {
      let details;
      if (item.media_type === 'movie') {
        details = await tmdbService.getMovieDetails(item.id);
      } else {
        details = await tmdbService.getTVDetails(item.id);
      }

      if (onSelectItem) {
        onSelectItem({ ...item, ...details });
      }
      setShowResults(false);
      setQuery('');
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies and TV shows..."
          className="w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 text-lg focus:outline-none focus:border-white/40 transition-all"
        />
        {isLoading && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-colors text-left"
            >
              <img
                src={tmdbService.getImageUrl(item.poster_path, 'w92')}
                alt={item.title || item.name}
                className="w-12 h-18 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {item.title || item.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.media_type === 'movie' ? 'Movie' : 'TV Show'} • {
                    item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A'
                  }
                </p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
