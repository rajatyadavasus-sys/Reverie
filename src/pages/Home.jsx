import React, { useEffect, useState } from 'react';
import HeroSection from '../components/common/HeroSection';
import MovieCard from '../components/common/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getTrendingMovies, getTrendingTV } from '../services/tmdb';
import { Film, Tv, ChevronDown } from 'lucide-react';

const BEARER = () => import.meta.env.VITE_TMDB_API_KEY;
const trendingMovieFetch = (page) =>
  fetch(`https://api.themoviedb.org/3/trending/movie/day?page=${page}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${BEARER()}` },
  }).then(r => r.json());
const trendingTVFetch = (page) =>
  fetch(`https://api.themoviedb.org/3/trending/tv/day?page=${page}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${BEARER()}` },
  }).then(r => r.json());

const INITIAL_COUNT = 6;

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV]         = useState([]);
  const [activeTab, setActiveTab]           = useState('movies');
  const [loading, setLoading]               = useState(true);
  const [showAll, setShowAll]               = useState(false);

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
          setTrendingMovies(shuffle(allMovies));
          setTrendingTV(shuffle(allTV));
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

  const activeItems = activeTab === 'movies' ? trendingMovies : trendingTV;
  const visibleItems = showAll ? activeItems : activeItems.slice(0, INITIAL_COUNT);

  return (
    <div className="w-full">
      <HeroSection />

      {/* ── Trending Section ── */}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('movies'); setShowAll(false); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeTab === 'movies'
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-4 h-4" /> Movies
            </button>
            <button
              onClick={() => { setActiveTab('tv'); setShowAll(false); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeTab === 'tv'
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Tv className="w-4 h-4" /> TV Shows
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {visibleItems.map(item => (
                <MovieCard
                  key={`${activeTab}-${item.id}`}
                  item={item}
                  mediaType={activeTab === 'movies' ? 'movie' : 'tv'}
                />
              ))}
            </div>

            {!showAll && activeItems.length > INITIAL_COUNT && (
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
          </>
        )}
      </section>
    </div>
  );
};

export default Home;

