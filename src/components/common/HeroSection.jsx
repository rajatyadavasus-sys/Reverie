import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';
import { getTrendingMovies } from '../../services/tmdb';

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

  useEffect(() => {
    getTrendingMovies('week').then(data => {
      const valid = data.results.filter(r => r.poster_path);
      const half = Math.floor(valid.length / 2);
      setPostersCol1(valid.slice(0, half));
      setPostersCol2(valid.slice(half));
    }).catch(console.error);
  }, []);

  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[var(--color-background)]">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Content */}
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
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-xl mb-12 leading-relaxed font-light">
            Explore a universe of cinematic experiences curated by the feelings they evoke. Masterpieces await.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link 
              to="/explore" 
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_var(--color-accent)]"
            >
              <Play className="w-6 h-6 fill-white" />
              Browse Movies
            </Link>
            <Link 
              to="/emotions" 
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold text-lg transition-all hover:scale-105"
            >
              Explore by Mood
            </Link>
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
