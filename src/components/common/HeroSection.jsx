import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Smile, CloudRain, Heart, Zap, Ghost, Leaf, Aperture } from 'lucide-react';
import { getTrendingMovies } from '../../services/tmdb';

const EMOTIONS = [
  {
    key: 'happy',
    Icon: Smile,
    label: 'Happy & Uplifting',
    sub: 'Comedies & feel-good films',
    color: '#f59e0b',
  },
  {
    key: 'sad',
    Icon: CloudRain,
    label: 'Melancholic',
    sub: 'Emotional dramas',
    color: '#60a5fa',
  },
  {
    key: 'romantic',
    Icon: Heart,
    label: 'Romantic',
    sub: 'Love stories & romance',
    color: '#f472b6',
  },
  {
    key: 'excited',
    Icon: Zap,
    label: 'Excited',
    sub: 'Action & adventure',
    color: '#fb923c',
  },
  {
    key: 'scared',
    Icon: Ghost,
    label: 'Thrilled',
    sub: 'Horror & thrillers',
    color: '#c084fc',
  },
  {
    key: 'relaxed',
    Icon: Leaf,
    label: 'Relaxed',
    sub: 'Documentaries & calm films',
    color: '#34d399',
  },
  {
    key: 'mind-bending',
    Icon: Aperture,
    label: 'Mind-Bending',
    sub: 'Sci-Fi & mystery',
    color: '#818cf8',
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
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start pt-24 lg:pt-0 w-full overflow-hidden">
          
          {/* Mobile Horizontal Animated Carousel (Only visible on small screens) */}
          <div className="lg:hidden w-screen -mx-8 mb-10 overflow-hidden relative group/marquee">
            <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--color-background)] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--color-background)] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-4 w-[200%] animate-marquee-x">
              {[...postersCol1, ...postersCol2, ...postersCol1, ...postersCol2].map((m, i) => (
                <Link 
                  key={`mobile-${m.id}-${i}`}
                  to={`/movie/${m.id}`}
                  className="flex-shrink-0 w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-transform active:scale-95"
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_var(--color-accent)] mb-12"
          >
            <Play className="w-6 h-6 fill-current" />
            Browse Movies
          </Link>
          
          {/* Stunning Mood Discovery Block */}
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">Or pick your mood</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-xl">
              {EMOTIONS.map((em, i) => (
                <Link
                  key={em.key}
                  to={`/emotion/${em.key}`}
                  onMouseEnter={() => setHoveredEmotion(em.key)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                  className="relative group flex flex-col p-4 sm:p-5 rounded-3xl transition-all duration-300 overflow-hidden border border-white/5"
                  style={{
                    backgroundColor: '#121620',
                    transform: hoveredEmotion === em.key ? 'translateY(-4px)' : 'none',
                    boxShadow: hoveredEmotion === em.key ? `0 12px 30px -10px ${em.color}30` : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Large soft background radial glow */}
                  <div 
                    className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[50px] opacity-10 transition-opacity duration-300 group-hover:opacity-30 pointer-events-none"
                    style={{ backgroundColor: em.color }}
                  />

                  {/* Icon Container */}
                  <div className="relative z-10 w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10">
                    <em.Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Text */}
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold text-white tracking-tight leading-tight mb-1">{em.label}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{em.sub}</p>
                  </div>
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
