import { useState } from 'react';
import { Clock, Globe } from 'lucide-react';
import SearchBar from './components/SearchBar';
import MovieSection from './components/MovieSection';
import ProviderSection from './components/ProviderSection';
import MovieModal from './components/MovieModal';
import { Movie, tmdbService } from './services/tmdb';

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [country, setCountry] = useState('US');

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
  ];

  const handleSelectMovie = async (movie: Movie) => {
    try {
      let details;
      if (movie.media_type === 'movie') {
        details = await tmdbService.getMovieDetails(movie.id);
      } else {
        details = await tmdbService.getTVDetails(movie.id);
      }
      setSelectedMovie({ ...movie, ...details });
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <header className="pt-16 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-12 h-12 text-white" />
              <h1 className="text-6xl font-bold text-white tracking-tight">
                HowLongToWatch
              </h1>
            </div>
            <p className="text-gray-400 text-xl">
              Discover how long it takes to watch your favorite movies and shows
            </p>
          </div>

          <SearchBar onSelectItem={setSelectedMovie} />
        </header>

        <main className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-white">Browse by Region</h2>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-gray-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <MovieSection
            title="Popular Movies"
            fetchFunction={tmdbService.getPopularMovies}
            onSelectMovie={handleSelectMovie}
          />

          <MovieSection
            title="Recently Released"
            fetchFunction={tmdbService.getRecentMovies}
            onSelectMovie={handleSelectMovie}
          />

          <ProviderSection
            title="Latest on Netflix"
            providerId={8}
            country={country}
            onSelectMovie={handleSelectMovie}
          />

          <ProviderSection
            title="Latest on HBO Max"
            providerId={384}
            country={country}
            onSelectMovie={handleSelectMovie}
          />
        </main>
      </div>

      {selectedMovie && (
        <MovieModal item={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}

export default App;
