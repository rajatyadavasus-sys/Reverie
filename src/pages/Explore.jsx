import React, { useEffect, useState } from 'react';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getPopularTV, getTopRatedTV, getOnAirTV } from '../services/tmdb';
import LoadMoreGrid from '../components/common/LoadMoreGrid';
import MovieCard from '../components/common/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Film, Tv, ChevronDown } from 'lucide-react';

const fetchPage = (apiFn) => async (page) => {
  const res = await apiFn();
  return res;
};

// Section wrapper
const ExploreSection = ({ title, fetchFn, mediaType, limited }) => {
  const [initial, setInitial]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showAll, setShowAll]   = useState(false);

  useEffect(() => {
    fetchFn(1).then(data => {
      setInitial(data.results.filter(r => r.poster_path));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (limited) {
    const visibleItems = showAll ? initial : initial.slice(0, 6);
    return (
      <div className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-10 border-l-4 border-[var(--color-accent)] pl-5">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {visibleItems.map(item => (
            <MovieCard key={item.id} item={item} mediaType={mediaType} />
          ))}
        </div>
        {!showAll && initial.length > 6 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all hover:scale-105"
            >
              <ChevronDown className="w-5 h-5" />
              Show More
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-24">
      <h2 className="text-2xl font-bold text-white mb-10 border-l-4 border-[var(--color-accent)] pl-5">
        {title}
      </h2>
      <LoadMoreGrid
        initialItems={initial}
        mediaType={mediaType}
        fetchMore={fetchFn}
      />
    </div>
  );
};

const Explore = () => {
  const [activeTab, setActiveTab] = useState('movies');

  const movieSections = [
    { title: '🎬 Now Playing',   fn: (p) => fetch(`/api/tmdb/movie/now_playing?page=${p}`, { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'movie', limited: true },
    { title: '🔥 Popular',       fn: (p) => fetch(`/api/tmdb/movie/popular?page=${p}`,     { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'movie' },
    { title: '🏆 Top Rated',     fn: (p) => fetch(`/api/tmdb/movie/top_rated?page=${p}`,   { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'movie' },
  ];

  const tvSections = [
    { title: '📡 On Air',        fn: (p) => fetch(`/api/tmdb/tv/on_the_air?page=${p}`,  { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'tv', limited: true },
    { title: '🔥 Popular Shows', fn: (p) => fetch(`/api/tmdb/tv/popular?page=${p}`,     { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'tv' },
    { title: '🏆 Top Rated Shows', fn: (p) => fetch(`/api/tmdb/tv/top_rated?page=${p}`, { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'tv' },
  ];

  const sections = activeTab === 'movies' ? movieSections : tvSections;

  return (
    <div className="container mx-auto px-8 lg:px-16 py-12">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Explore</h1>
        <p className="text-xl text-gray-400">Discover everything — from blockbusters to hidden gems</p>
      </div>

      {/* Movie / TV Tab */}
      <div className="flex items-center gap-3 justify-center mb-16">
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
            activeTab === 'movies'
              ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-lg shadow-[var(--color-accent)]/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Film className="w-4 h-4" /> Movies
        </button>
        <button
          onClick={() => setActiveTab('tv')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
            activeTab === 'tv'
              ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-lg shadow-[var(--color-accent)]/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Tv className="w-4 h-4" /> TV Shows
        </button>
      </div>

      {/* Sections */}
      {sections.map(s => (
        <ExploreSection key={`${activeTab}-${s.title}`} title={s.title} fetchFn={s.fn} mediaType={s.media} limited={s.limited} />
      ))}
    </div>
  );
};

export default Explore;
