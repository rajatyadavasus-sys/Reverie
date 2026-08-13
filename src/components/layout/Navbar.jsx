import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, User, Sparkles, Dices, Loader2, LogOut } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import { useAuth } from '../../context/AuthContext';

// Curated masterpiece pool — dark thrillers, intense dramas, romantic classics,
// prestige TV, malayalam cinema, and iconic animation
const SURPRISE_POOL = [
  // Dark/Intense Movies
  { id: 11324,  type: 'movie' }, // Nightcrawler
  { id: 271110, type: 'movie' }, // Southpaw
  { id: 807,    type: 'movie' }, // Se7en
  { id: 27205,  type: 'movie' }, // Inception
  { id: 103,    type: 'movie' }, // Taxi Driver
  { id: 769,    type: 'movie' }, // GoodFellas
  { id: 278,    type: 'movie' }, // The Shawshank Redemption
  { id: 238,    type: 'movie' }, // The Godfather
  { id: 240,    type: 'movie' }, // Godfather Part II
  { id: 424,    type: 'movie' }, // Schindler's List
  { id: 539,    type: 'movie' }, // Psycho
  { id: 77,     type: 'movie' }, // Memento
  { id: 680,    type: 'movie' }, // Pulp Fiction
  { id: 37724,  type: 'movie' }, // Skyfall
  { id: 155,    type: 'movie' }, // The Dark Knight
  { id: 264660, type: 'movie' }, // Ex Machina
  { id: 694919, type: 'movie' }, // Money Heist film
  { id: 475557, type: 'movie' }, // Joker
  { id: 335984, type: 'movie' }, // Blade Runner 2049
  { id: 600,    type: 'movie' }, // Full Metal Jacket
  { id: 346364, type: 'movie' }, // It
  // Romantic classics
  { id: 313369, type: 'movie' }, // La La Land
  { id: 43347,  type: 'movie' }, // Love and Other Drugs
  { id: 296096, type: 'movie' }, // Me Before You
  { id: 10096,  type: 'movie' }, // 13 Going on 30
  { id: 4951,   type: 'movie' }, // 10 Things I Hate About You
  { id: 19913,  type: 'movie' }, // 500 Days of Summer
  { id: 332562, type: 'movie' }, // A Star Is Born
  { id: 10591,  type: 'movie' }, // The Girl Next Door
  { id: 65513,  type: 'movie' }, // Silver Linings Playbook
  // Malayalam masterpieces
  { id: 937287, type: 'movie' }, // Meiyazhagan
  { id: 372058, type: 'movie' }, // Your Name (Japanese, epic)
  { id: 702,    type: 'movie' }, // The Great Escape
  // Animation & World Cinema
  { id: 12477,  type: 'movie' }, // Grave of the Fireflies
  { id: 129,    type: 'movie' }, // Spirited Away
  { id: 508442, type: 'movie' }, // Soul
  { id: 354912, type: 'movie' }, // Coco
  { id: 315162, type: 'movie' }, // Puss in Boots: The Last Wish
  // Prestige TV
  { id: 1396,   type: 'tv' },    // Breaking Bad
  { id: 60574,  type: 'tv' },    // Better Call Saul
  { id: 1399,   type: 'tv' },    // Game of Thrones
  { id: 87108,  type: 'tv' },    // Chernobyl
  { id: 71446,  type: 'tv' },    // Money Heist
  { id: 1403,   type: 'tv' },    // Daredevil
  { id: 1434,   type: 'tv' },    // Narcos
  { id: 18347,  type: 'tv' },    // The Sopranos
  { id: 44217,  type: 'tv' },    // The Wire
  { id: 85552,  type: 'tv' },    // Euphoria
  { id: 66788,  type: 'tv' },    // Mr. Robot
  { id: 95396,  type: 'tv' },    // Succession
];

// Fisher-Yates shuffle
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Module-level queue — persists across renders, never repeats until all 55 are shown
let surpriseQueue = shuffleArray(SURPRISE_POOL);

const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, logout, promptLogin } = useAuth();

  const navLinkClass = ({ isActive }) => 
    `text-lg font-medium transition-colors duration-300 ${isActive ? 'text-[var(--color-accent)]' : 'text-gray-300 hover:text-white'}`;

  const handleSurprise = () => {
    // When queue is empty, reshuffle and start again
    if (surpriseQueue.length === 0) {
      surpriseQueue = shuffleArray(SURPRISE_POOL);
    }
    const pick = surpriseQueue.pop();
    navigate(`/${pick.type}/${pick.id}`);
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

        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={handleSurprise}
            disabled={loading}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Dices className="w-5 h-5 text-pink-400" />}
            Surprise Me
          </button>
          
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

          <SearchBar />
          
          {/* Mobile search icon */}
          <Link to="/search" className="lg:hidden text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <Search className="w-6 h-6" />
          </Link>
          <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <Heart className="w-6 h-6" />
          </Link>
          
          {currentUser ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white overflow-hidden border border-white/20 transition-all hover:scale-105">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-[#171C2A] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-white/5">
                  <p className="text-white text-sm font-semibold truncate">{currentUser.displayName}</p>
                  <p className="text-gray-400 text-xs truncate">{currentUser.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={promptLogin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 font-semibold text-sm whitespace-nowrap"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
