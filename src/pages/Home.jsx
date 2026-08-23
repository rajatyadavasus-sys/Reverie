import React, { useEffect, useState } from 'react';
import HeroSection from '../components/common/HeroSection';
import LoadMoreGrid from '../components/common/LoadMoreGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getTrendingMovies, getTrendingTV } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { Film, Tv } from 'lucide-react';

const BEARER = () => import.meta.env.VITE_TMDB_API_KEY;
const trendingMovieFetch = (page) =>
  fetch(`/api/tmdb/trending/movie/day?page=${page}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${BEARER()}` },
  }).then(r => r.json());
const trendingTVFetch = (page) =>
  fetch(`/api/tmdb/trending/tv/day?page=${page}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${BEARER()}` },
  }).then(r => r.json());



const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV]         = useState([]);
  const [activeTab, setActiveTab]           = useState('movies');
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const shuffle = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const fetchTrending = async () => {
      try {
        const [m1, m2, t1, t2] = await Promise.all([
          getTrendingMovies('day'),
          trendingMovieFetch(2),
          getTrendingTV('day'),
          trendingTVFetch(2)
        ]);

        const allMovies = [...m1.results, ...m2.results];
        const allTV = [...t1.results, ...t2.results];

        const updateGrid = () => {
          setTrendingMovies(shuffle(allMovies).slice(0, 10));
          setTrendingTV(shuffle(allTV).slice(0, 10));
        };

        updateGrid();
        const interval = setInterval(updateGrid, 15000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    let cleanup = null;
    fetchTrending().then(fn => { if (fn) cleanup = fn; });
    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div className="w-full">
      <HeroSection />

      {/* ΓöÇΓöÇ Trending Section ΓöÇΓöÇ */}
      <section className="container mx-auto px-8 lg:px-16 py-16">

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-gray-600 text-xs uppercase tracking-widest font-semibold">Trending</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Header + tab switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Trending Now</h2>
            <p className="text-gray-400">What the world is watching today</p>
          </div>

          <div className="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeTab === 'movies'
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-lg shadow-[var(--color-accent)]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" /> Movies
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeTab === 'tv'
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-lg shadow-[var(--color-accent)]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-4 h-4" /> TV Shows
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : activeTab === 'movies' ? (
          <LoadMoreGrid
            key="trending-movies"
            initialItems={trendingMovies}
            mediaType="movie"
            fetchMore={trendingMovieFetch}
          />
        ) : (
          <LoadMoreGrid
            key="trending-tv"
            initialItems={trendingTV}
            mediaType="tv"
            fetchMore={trendingTVFetch}
          />
        )}
      </section>
    </div>
  );
};

export default Home;
