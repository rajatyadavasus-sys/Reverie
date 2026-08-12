import React, { useEffect, useState } from 'react';
import HeroSection from '../components/common/HeroSection';
import LoadMoreGrid from '../components/common/LoadMoreGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getTrendingMovies, getTrendingTV } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { Film, Tv, Smile, CloudRain, Heart, Zap, Ghost, Leaf, Aperture } from 'lucide-react';

const BEARER = () => import.meta.env.VITE_TMDB_API_KEY;
const trendingMovieFetch = (page) =>
  fetch(`https://api.themoviedb.org/3/trending/movie/day?page=${page}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${BEARER()}` },
  }).then(r => r.json());
const trendingTVFetch = (page) =>
  fetch(`https://api.themoviedb.org/3/trending/tv/day?page=${page}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${BEARER()}` },
  }).then(r => r.json());

const EMOTIONS = [
  { key: 'happy',        Icon: Smile, label: 'Happy & Uplifting' },
  { key: 'sad',          Icon: CloudRain, label: 'Melancholic' },
  { key: 'romantic',     Icon: Heart, label: 'Romantic' },
  { key: 'excited',      Icon: Zap, label: 'Excited' },
  { key: 'scared',       Icon: Ghost, label: 'Thrilled' },
  { key: 'relaxed',      Icon: Leaf, label: 'Relaxed' },
  { key: 'mind-bending', Icon: Aperture, label: 'Mind-Bending' },
];

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV]         = useState([]);
  const [activeTab, setActiveTab]           = useState('movies'); // 'movies' | 'tv'
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [moviesData, tvData] = await Promise.all([
          getTrendingMovies('day'),
          getTrendingTV('day'),
        ]);
        setTrendingMovies(moviesData.results.slice(0, 10));
        setTrendingTV(tvData.results.slice(0, 10));
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);


  return (
    <div className="w-full">
      <HeroSection />

      {/* ── Trending Section ── */}
      <section className="container mx-auto px-8 lg:px-16 py-20">

        {/* Header + tab switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Trending Now</h2>
            <p className="text-gray-400">What the world is watching today</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab: Movies */}
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeTab === 'movies'
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-4 h-4" /> Movies
            </button>

            {/* Tab: TV Shows */}
            <button
              onClick={() => setActiveTab('tv')}
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

        {/* Grid with Load More */}
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

      {/* ── Emotion Categories ── */}
      <section className="container mx-auto px-8 lg:px-16 py-16 mb-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How do you want to feel?</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Skip the ratings. Pick your mood — we'll find the perfect watch.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {EMOTIONS.map(em => (
              <Link
                key={em.key}
                to={`/emotion/${em.key}`}
                className="relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#131824] border border-white/10 text-white font-medium transition-all duration-500 hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_40px_-10px_var(--color-accent)] group overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <em.Icon className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                <span className="relative z-10 group-hover:font-bold">{em.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
