import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Smile, CloudRain, Heart, Zap, Ghost, Leaf, Aperture } from 'lucide-react';
import { getTrendingMovies } from '../../services/tmdb';

const EMOTIONS = [
  {
    key: 'happy',
    Icon: Smile,
    label: 'Happy',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
  },
  {
    key: 'sad',
    Icon: CloudRain,
    label: 'Melancholic',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.4)',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.3)',
  },
  {
    key: 'romantic',
    Icon: Heart,
    label: 'Romantic',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.4)',
    bg: 'rgba(244,114,182,0.1)',
    border: 'rgba(244,114,182,0.3)',
  },
  {
    key: 'excited',
    Icon: Zap,
    label: 'Excited',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.4)',
    bg: 'rgba(251,146,60,0.1)',
    border: 'rgba(251,146,60,0.3)',
  },
  {
    key: 'scared',
    Icon: Ghost,
    label: 'Thrilled',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.4)',
    bg: 'rgba(192,132,252,0.1)',
    border: 'rgba(192,132,252,0.3)',
  },
  {
    key: 'relaxed',
    Icon: Leaf,
    label: 'Relaxed',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.4)',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.3)',
  },
  {
    key: 'mind-bending',
    Icon: Aperture,
    label: 'Mind-Bending',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.4)',
    bg: 'rgba(129,140,248,0.1)',
    border: 'rgba(129,140,248,0.3)',
  },
];

const MarqueeColumn = ({ items, reverse = false }) => {
  // We duplicate the items array so it can loop seamlessly
  const doubled = [...items, ...items];
  const animationClass = reverse ? 'animate-marquee-y-reverse' : 'animate-marquee-y';

  return (
    <div className="relative h-[120vh] w-32 md:w-40 lg:w-48 overflow-hidden rounded-2xl rotate-12 scale-110 shadow-2xl bg-white/5 border border-white/10 group-hover/marquee:border-white/20 transition-colors">
      <div className={`flex flex-col gap-4 absolute w-full ${animationClass}`}>
        {doubled.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="w-full aspect-[2/3] rounded-xl overflow-hidden shrink-0 bg-gray-900">
            {item.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        ))}
      </div>
      {/* Glossy overlay on the column */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};

const HeroSection = () => {
  const [postersCol1, setPostersCol1] = useState([]);
  const [postersCol2, setPostersCol2] = useState([]);
  const [hoveredEmotion, setHoveredEmotion] = useState(null);

  // Helper to shuffle array
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    // Fetch multiple pages so we have a large pool to shuffle
    Promise.all([
      getTrendingMovies('week'),
      fetch(`https://api.themoviedb.org/3/trending/movie/week?page=2`, {
        headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` }
      }).then(r => r.json())
    ]).then(([page1, page2]) => {
      const allValid = [...page1.results, ...page2.results].filter(r => r.poster_path);
      
      const updatePosters = () => {
        const shuffled = shuffle(allValid);
        const half = Math.floor(shuffled.length / 2);
        setPostersCol1(shuffled.slice(0, half));
        setPostersCol2(shuffled.slice(half));
      };

      updatePosters(); // Initial load
      
      // Reshuffle every 15 seconds to keep the carousel fresh
      const interval = setInterval(updatePosters, 15000);
      return () => clearInterval(interval);
    }).catch(console.error);
  }, []);

  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[var(--color-background)]">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Content & Mood Discovery */}
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start pt-20 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            <span className="text-sm font-medium tracking-wide">Discover Movies Through Emotion</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
            Feel Movies. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-purple-400">
              Not Ratings.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-xl mb-10 leading-relaxed font-light">
            Explore a universe of cinematic experiences curated by the feelings they evoke. Masterpieces await.
          </p>

          <Link 
            to="/explore" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_var(--color-accent)] mb-12"
          >
            <Play className="w-6 h-6 fill-white" />
            Browse Movies
          </Link>
          
          {/* Stunning Mood Discovery Block */}
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">Or pick your mood</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            
            <div className="flex flex-wrap gap-3 lg:gap-4 justify-center lg:justify-start">
              {EMOTIONS.map((em, i) => (
                <Link
                  key={em.key}
                  to={`/emotion/${em.key}`}
                  onMouseEnter={() => setHoveredEmotion(em.key)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                  className="relative group flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 overflow-hidden bg-white/[0.02] border border-white/5"
                  style={{
                    background: hoveredEmotion === em.key ? em.bg : 'rgba(255,255,255,0.03)',
                    borderColor: hoveredEmotion === em.key ? em.border : 'rgba(255,255,255,0.05)',
                    boxShadow: hoveredEmotion === em.key ? `0 8px 32px -8px ${em.glow}, inset 0 1px 0 rgba(255,255,255,0.1)` : 'none',
                    transform: hoveredEmotion === em.key ? 'translateY(-4px) scale(1.05)' : 'none',
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  {/* Ambient glow blob inside the pill */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(circle at center, ${em.glow} 0%, transparent 70%)` }}
                  />

                  <em.Icon
                    className="w-5 h-5 transition-all duration-300 relative z-10"
                    style={{ 
                      color: hoveredEmotion === em.key ? em.color : '#9ca3af',
                      transform: hoveredEmotion === em.key ? 'scale(1.2) rotate(-10deg)' : 'scale(1)' 
                    }}
                  />
                  <span
                    className="text-sm font-semibold transition-colors duration-300 relative z-10"
                    style={{ color: hoveredEmotion === em.key ? '#ffffff' : '#d1d5db' }}
                  >
                    {em.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Animated Posters Carousel */}
        <div className="hidden lg:flex items-center justify-center gap-6 md:gap-8 group/marquee perspective-1000">
          {postersCol1.length > 0 && postersCol2.length > 0 ? (
            <>
              {/* Column 1 - scrolls up */}
              <MarqueeColumn items={postersCol1} />
              
              {/* Column 2 - scrolls down (reverse) */}
              <MarqueeColumn items={postersCol2} reverse={true} />
            </>
          ) : (
            // Placeholder while loading
            <div className="w-full h-full min-h-[600px] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--color-accent)] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
      
      {/* Fade out edges of the hero section so the marquees don't get cut off harshly */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-background)] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent z-20 pointer-events-none" />
    </div>
  );
};

export default HeroSection;
