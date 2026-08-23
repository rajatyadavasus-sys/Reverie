import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../services/tmdb';
import MovieCard from '../components/common/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMulti(q);
      setResults(data.results.filter(r => r.media_type !== 'person' && r.poster_path));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search on initial load if ?q= param exists
  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) handleSearch(urlQ);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search + sync URL as user types
  useEffect(() => {
    if (query.trim()) setSearchParams({ q: query }, { replace: true });
    const timer = setTimeout(() => handleSearch(query), 500);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);


  return (
    <div className="container mx-auto px-8 lg:px-16 py-16 min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Search</h1>
        <p className="text-xl text-gray-400">Find any movie or TV show</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-6 w-6 h-6 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows..."
            autoFocus
            className="w-full pl-16 pr-14 py-5 rounded-2xl bg-[var(--color-card)] border border-white/10 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : searched && results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-2xl mb-3">No results found</p>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-gray-400 mb-10 text-lg">
            Found <span className="text-white font-semibold">{results.length}</span> results for{' '}
            <span className="text-[var(--color-accent)] font-semibold">"{query}"</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {results.map(item => (
              <MovieCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <p className="text-gray-500 text-xl">Start typing to discover movies</p>
        </div>
      )}
    </div>
  );
};

export default Search;
