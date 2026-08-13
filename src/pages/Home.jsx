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
  {
    key: 'happy',
    Icon: Smile,
    label: 'Happy',
    sub: 'Uplifting & Feel-Good',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    emoji: '☀️',
  },
  {
    key: 'sad',
    Icon: CloudRain,
    label: 'Melancholic',
    sub: 'Emotional & Deep',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.25)',
    emoji: '🌧️',
  },
  {
    key: 'romantic',
    Icon: Heart,
    label: 'Romantic',
    sub: 'Love & Tenderness',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.35)',
    bg: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.25)',
    emoji: '🌹',
  },
  {
    key: 'excited',
    Icon: Zap,
    label: 'Excited',
    sub: 'Action & Adrenaline',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.35)',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    emoji: '⚡',
  },
  {
    key: 'scared',
    Icon: Ghost,
    label: 'Thrilled',
    sub: 'Horror & Suspense',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.35)',
    bg: 'rgba(192,132,252,0.08)',
    border: 'rgba(192,132,252,0.25)',
    emoji: '👻',
  },
  {
    key: 'relaxed',
    Icon: Leaf,
    label: 'Relaxed',
    sub: 'Calm & Chill',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.35)',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.25)',
    emoji: '🌿',
  },
  {
    key: 'mind-bending',
    Icon: Aperture,
    label: 'Mind-Bending',
    sub: 'Sci-Fi & Mystery',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.35)',
    bg: 'rgba(129,140,248,0.08)',
    border: 'rgba(129,140,248,0.25)',
    emoji: '🌀',
  },
];

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV]         = useState([]);
  const [activeTab, setActiveTab]           = useState('movies');
  const [loading, setLoading]               = useState(true);
  const [hoveredEmotion, setHoveredEmotion] = useState(null);

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

      {/* ── Emotion Picker ── */}
      <section className="container mx-auto px-8 lg:px-16 pt-16 pb-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-accent)] mb-3">Mood Discovery</p>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">How do you want to feel?</h2>
          <p className="text-gray-500 text-base">Skip the ratings. Pick your mood — we'll find the perfect watch.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {EMOTIONS.map((em, i) => (
            <Link
              key={em.key}
              to={`/emotion/${em.key}`}
              onMouseEnter={() => setHoveredEmotion(em.key)}
              onMouseLeave={() => setHoveredEmotion(null)}
              className="relative group flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl text-center transition-all duration-300 overflow-hidden"
              style={{
                background: hoveredEmotion === em.key ? em.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${hoveredEmotion === em.key ? em.border : 'rgba(255,255,255,0.07)'}`,
                boxShadow: hoveredEmotion === em.key ? `0 8px 32px -8px ${em.glow}, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
                transform: hoveredEmotion === em.key ? 'translateY(-4px) scale(1.03)' : 'none',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Ambient glow blob */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 120%, ${em.glow} 0%, transparent 70%)` }}
              />

              {/* Emoji */}
              <span
                className="text-2xl transition-all duration-300 relative z-10"
                style={{ transform: hoveredEmotion === em.key ? 'scale(1.2) rotate(-8deg)' : 'scale(1)' }}
              >
                {em.emoji}
              </span>

              {/* Icon */}
              <em.Icon
                className="w-4 h-4 transition-all duration-300 relative z-10"
                style={{ color: hoveredEmotion === em.key ? em.color : '#6b7280' }}
              />

              {/* Label */}
              <div className="relative z-10">
                <p
                  className="text-xs font-bold transition-colors duration-300 leading-tight"
                  style={{ color: hoveredEmotion === em.key ? em.color : '#e5e7eb' }}
                >
                  {em.label}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5 leading-tight group-hover:text-gray-400 transition-colors duration-300">
                  {em.sub}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: em.color,
                  width: hoveredEmotion === em.key ? '60%' : '0%',
                }}
              />
            </Link>
          ))}
        </div>
      </section>

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
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeTab === 'movies'
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-4 h-4" /> Movies
            </button>
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
