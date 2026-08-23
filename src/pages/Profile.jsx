import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useWatched } from '../context/WatchedContext';
import { useReviews } from '../context/ReviewContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/common/MovieCard';
import { Palette, List, CheckCircle, MessageSquare } from 'lucide-react';
import { ReviewIcon } from '../utils/ratings';
import { getRatingTag } from '../components/details/TMDBReviews';

const Profile = () => {
  const { currentUser } = useAuth();
  const { watchlist } = useWatchlist();
  const { watched } = useWatched();
  const { reviews } = useReviews();
  const { theme, setTheme, themes } = useTheme();

  const [activeTab, setActiveTab] = useState('watchlist');

  // Early return removed so non-logged in users can see the theme switcher on this page.
  // We will conditionally render the profile sections below.

  const renderTabContent = () => {
    switch (activeTab) {
      case 'watchlist':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.length > 0 ? (
              watchlist.map(item => <MovieCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">Your watchlist is empty.</p>
            )}
          </div>
        );
      case 'watched':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watched.length > 0 ? (
              watched.map(item => <MovieCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">You haven't marked anything as watched yet.</p>
            )}
          </div>
        );
      case 'reviews':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length > 0 ? (
              reviews.map(review => {
                const tag = getRatingTag(review.tag);
                return (
                  <div key={`${review.media_type}-${review.id}`} className="bg-[#121620] border border-white/5 rounded-2xl p-6 flex flex-col transition-all hover:bg-[#161b27] hover:border-white/10">
                    <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4">
                      {review.poster_path && (
                        <img src={`https://image.tmdb.org/t/p/w92${review.poster_path}`} alt={review.title} className="w-12 h-16 rounded-md object-cover" />
                      )}
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight line-clamp-1">{review.title}</h4>
                        <div className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tag.bg} ${tag.border} ${tag.color}`}>
                          <ReviewIcon iconName={tag.label.includes('Masterpiece') ? 'Trophy' : tag.label.includes('Must Watch') ? 'ThumbsUp' : tag.label.includes('Timepass') ? 'Coffee' : 'XCircle'} className="w-3 h-3" />
                          {tag.label.replace(/[^a-zA-Z ]/g, '')}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{review.opinion || "No written review."}</p>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">You haven't written any reviews yet.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${currentUser?.email || 'reverie'}&backgroundColor=transparent`;

  return (
    <div className="container mx-auto px-8 lg:px-16 py-12">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-[var(--color-card)]/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        {/* Glow effect behind avatar */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-[var(--color-accent)] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="relative w-32 h-32 rounded-full border-4 border-[var(--color-accent)]/30 object-cover shadow-2xl bg-white/5 p-2 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">
            {currentUser ? (currentUser.displayName || 'Cinema Lover') : 'Guest Explorer'}
          </h1>
          <p className="text-gray-400 mb-6">
            {currentUser ? currentUser.email : 'Sign in to track your cinematic journey'}
          </p>
          
          {currentUser && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold text-white">
                <span className="text-[var(--color-accent)] mr-2">{watchlist.length}</span> Watchlist
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold text-white">
                <span className="text-[var(--color-accent)] mr-2">{watched.length}</span> Watched
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold text-white">
                <span className="text-[var(--color-accent)] mr-2">{reviews.length}</span> Reviews
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Bento Block */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-6 h-6 text-[var(--color-accent)]" />
          <h2 className="text-2xl font-bold text-white tracking-tight">App Theme</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themes.map(t => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative flex flex-col items-start p-6 rounded-3xl transition-all duration-300 border text-left overflow-hidden group ${
                  isActive 
                    ? 'border-[var(--color-accent)] shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-[var(--color-accent)]/10' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {/* Background Gradient similar to Emotions page */}
                <div 
                  className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${isActive ? 'opacity-40' : 'group-hover:opacity-30'}`}
                  style={{ background: `radial-gradient(circle at top right, ${t.color}, transparent 70%)` }}
                ></div>
                
                <span 
                  className="w-10 h-10 rounded-full shadow-lg mb-6 relative z-10 border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
                  style={{ backgroundColor: t.color }}
                >
                  {isActive && <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>}
                </span>
                
                <span className={`text-xl font-black relative z-10 mb-1 tracking-tight ${isActive ? 'text-white' : 'text-gray-200'}`}>
                  {t.name}
                </span>
                
                <span className="text-sm font-medium text-gray-400 relative z-10">
                  {t.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {currentUser ? (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-12 border-b border-white/5 pb-6">
            <button 
              onClick={() => setActiveTab('watchlist')}
              className={`relative group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                activeTab === 'watchlist' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeTab === 'watchlist' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] opacity-20 transition-opacity duration-300"></div>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <List className={`w-5 h-5 relative z-10 ${activeTab === 'watchlist' ? 'text-[var(--color-accent)]' : ''}`} /> 
              <span className="relative z-10">My Watchlist</span>
              {activeTab === 'watchlist' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]"></div>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('watched')}
              className={`relative group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                activeTab === 'watched' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeTab === 'watched' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] opacity-20 transition-opacity duration-300"></div>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CheckCircle className={`w-5 h-5 relative z-10 ${activeTab === 'watched' ? 'text-[var(--color-accent)]' : ''}`} /> 
              <span className="relative z-10">Watched History</span>
              {activeTab === 'watched' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]"></div>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('reviews')}
              className={`relative group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                activeTab === 'reviews' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeTab === 'reviews' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] opacity-20 transition-opacity duration-300"></div>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <MessageSquare className={`w-5 h-5 relative z-10 ${activeTab === 'reviews' ? 'text-[var(--color-accent)]' : ''}`} /> 
              <span className="relative z-10">My Reviews</span>
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]"></div>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border-t border-white/5 mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Discover Your Cinematic Style</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Sign in to start building your personalized watchlist, tracking what you've watched, and writing your own cinematic reviews.</p>
        </div>
      )}

    </div>
  );
};

export default Profile;
