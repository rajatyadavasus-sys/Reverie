import React from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { Heart, Trash2, Film, Tv } from 'lucide-react';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="container mx-auto px-8 lg:px-16 py-16 min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-accent)]/10 mb-6">
          <Heart className="w-10 h-10 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">My Watchlist</h1>
        <p className="text-xl text-gray-400">
          {watchlist.length === 0
            ? 'Your watchlist is empty. Start saving movies!'
            : `${watchlist.length} title${watchlist.length > 1 ? 's' : ''} saved`}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl mb-8">Discover movies and add them to your watchlist.</p>
          <Link
            to="/explore"
            className="inline-block px-10 py-4 rounded-full bg-[var(--color-accent)] text-white font-bold text-lg hover:bg-[var(--color-accent-hover)] transition-all hover:scale-105"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {watchlist.map(item => {
            const type = item.media_type || 'movie';
            const title = item.title || item.name;
            const year = (item.release_date || item.first_air_date || '').split('-')[0];
            const route = type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

            return (
              <div
                key={`${type}-${item.id}`}
                className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-white/5 flex items-center gap-6 p-5 hover:border-[var(--color-accent)]/40 transition-all"
              >
                <Link to={route} className="flex-shrink-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={title}
                    className="w-20 h-28 object-cover rounded-xl"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={route}>
                    <h3 className="text-white font-semibold text-lg mb-1 hover:text-[var(--color-accent)] transition-colors line-clamp-2">{title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    {type === 'tv' ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                    <span className="capitalize">{type}</span>
                    {year && <span>· {year}</span>}
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(item.id, type)}
                  className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 p-2 rounded-full hover:bg-red-400/10"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
