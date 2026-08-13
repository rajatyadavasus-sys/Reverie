import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, User, Sparkles, Dices, Loader2 } from 'lucide-react';
import { getTrendingMovies, getTrendingTV } from '../../services/tmdb';
import SearchBar from '../common/SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const navLinkClass = ({ isActive }) => 
    `text-lg font-medium transition-colors duration-300 ${isActive ? 'text-[var(--color-accent)]' : 'text-gray-300 hover:text-white'}`;

  const handleSurprise = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const isMovie = Math.random() > 0.5;
      const fn = isMovie ? getTrendingMovies : getTrendingTV;
      const data = await fn('week');
      const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
      navigate(`/${isMovie ? 'movie' : 'tv'}/${randomItem.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 py-6">
      <div className="container mx-auto px-8 lg:px-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-[var(--color-accent)]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight transition-all duration-300 group-hover:from-white group-hover:to-purple-200">Reverie</h1>
            <p className="text-[10px] text-[var(--color-accent)] font-bold tracking-[0.2em] uppercase">Cinematic Daydreams</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
          <NavLink to="/emotions" className={navLinkClass}>Emotions</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleSurprise}
            disabled={loading}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Dices className="w-5 h-5 text-pink-400" />}
            Surprise Me
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block"></div>

          <SearchBar />
          
          {/* Mobile search icon */}
          <Link to="/search" className="lg:hidden text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <Search className="w-6 h-6" />
          </Link>
          <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <Heart className="w-6 h-6" />
          </Link>
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10 ml-2">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
