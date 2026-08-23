import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Film, Tv, User } from 'lucide-react';
import { searchMulti } from '../../services/tmdb';

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await searchMulti(query);
        // Filter out people without profiles and items without posters to keep UI clean
        const validResults = data.results.filter(
          item => (item.media_type === 'person' ? item.profile_path : item.poster_path)
        ).slice(0, 6);
        setResults(validResults);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery('');
    if (item.media_type === 'person') {
      navigate(`/person/${item.id}`);
    } else {
      navigate(`/${item.media_type}/${item.id}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm hidden lg:block">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV, actors..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white/10 transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#171C2A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left"
              >
                {/* Image */}
                <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <img
                    src={`/tmdb-images/w92${item.media_type === 'person' ? item.profile_path : item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm truncate">
                    {item.title || item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                    {item.media_type === 'movie' && <Film className="w-3 h-3" />}
                    {item.media_type === 'tv' && <Tv className="w-3 h-3" />}
                    {item.media_type === 'person' && <User className="w-3 h-3" />}
                    <span className="capitalize">{item.media_type}</span>
                    {item.release_date && <span>• {item.release_date.split('-')[0]}</span>}
                    {item.first_air_date && <span>• {item.first_air_date.split('-')[0]}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full p-3 text-center text-xs font-bold text-[var(--color-accent)] bg-black/20 hover:bg-black/40 transition-colors"
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
