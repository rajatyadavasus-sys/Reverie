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

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
        <h1 className="text-3xl font-bold text-white mb-4">Sign in required</h1>
        <p className="text-gray-400">Please sign in to view your profile.</p>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-8 lg:px-16 py-12">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-[#1a1f31]/50 p-8 rounded-3xl border border-white/5">
        <img 
          src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=7c3aed&color=fff`} 
          alt="Profile" 
          className="w-32 h-32 rounded-full border-4 border-[var(--color-accent)]/30 object-cover shadow-2xl"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">{currentUser.displayName || 'Cinema Lover'}</h1>
          <p className="text-gray-400 mb-6">{currentUser.email}</p>
          
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
        </div>

        {/* Theme Switcher block */}
        <div className="w-full md:w-auto bg-[#131824] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-white font-bold mb-4">
            <Palette className="w-4 h-4 text-[var(--color-accent)]" />
            App Theme
          </div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  theme === t.id 
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white' 
                    : 'border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: t.color }}></span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
            activeTab === 'watchlist' ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <List className="w-4 h-4" /> My Watchlist
        </button>
        <button 
          onClick={() => setActiveTab('watched')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
            activeTab === 'watched' ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Watched History
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
            activeTab === 'reviews' ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> My Reviews
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

    </div>
  );
};

export default Profile;
