import React, { useEffect, useState } from 'react';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getPopularTV, getTopRatedTV, getOnAirTV } from '../services/tmdb';
import LoadMoreGrid from '../components/common/LoadMoreGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Film, Tv } from 'lucide-react';

const fetchPage = (apiFn) => async (page) => {
  const res = await apiFn();
  // TMDB endpoint wrappers don't take page yet — do a direct call
  return res;
};

// Section wrapper
const ExploreSection = ({ title, fetchFn, mediaType }) => {
  const [initial, setInitial]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchFn(1).then(data => {
      setInitial(data.results.filter(r => r.poster_path));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

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
    { title: '🎬 Now Playing',   fn: (p) => fetch(`https://api.themoviedb.org/3/movie/now_playing?page=${p}`, { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'movie' },
    { title: '🔥 Popular',       fn: (p) => fetch(`https://api.themoviedb.org/3/movie/popular?page=${p}`,     { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'movie' },
    { title: '🏆 Top Rated',     fn: (p) => fetch(`https://api.themoviedb.org/3/movie/top_rated?page=${p}`,   { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'movie' },
  ];

  const tvSections = [
    { title: '📡 On Air',        fn: (p) => fetch(`https://api.themoviedb.org/3/tv/on_the_air?page=${p}`,  { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'tv' },
    { title: '🔥 Popular Shows', fn: (p) => fetch(`https://api.themoviedb.org/3/tv/popular?page=${p}`,     { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'tv' },
    { title: '🏆 Top Rated Shows', fn: (p) => fetch(`https://api.themoviedb.org/3/tv/top_rated?page=${p}`, { headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` } }).then(r => r.json()), media: 'tv' },
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
              ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Film className="w-4 h-4" /> Movies
        </button>
        <button
          onClick={() => setActiveTab('tv')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
            activeTab === 'tv'
              ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Tv className="w-4 h-4" /> TV Shows
        </button>
      </div>

      {/* Sections */}
      {sections.map(s => (
        <ExploreSection key={`${activeTab}-${s.title}`} title={s.title} fetchFn={s.fn} mediaType={s.media} />
      ))}
    </div>
  );
};

export default Explore;
