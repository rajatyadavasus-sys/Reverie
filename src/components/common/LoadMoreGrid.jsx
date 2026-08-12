import React, { useState } from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { ChevronDown, Loader2 } from 'lucide-react';

/**
 * A movie/TV grid that supports "Load More" pagination.
 * Props:
 *   initialItems  — first batch of items (already fetched)
 *   mediaType     — 'movie' | 'tv'
 *   fetchMore     — async fn(page: number) => { results, total_pages }
 *                   pass null if no more pages should be fetched
 */
const LoadMoreGrid = ({ initialItems = [], mediaType = 'movie', fetchMore = null }) => {
  const [items, setItems]       = useState(initialItems);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [hasMore, setHasMore]   = useState(!!fetchMore);

  const handleLoadMore = async () => {
    if (loading || !fetchMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await fetchMore(nextPage);
      const newItems = data.results.filter(r => r.poster_path); // only items with posters
      setItems(prev => [...prev, ...newItems]);
      setPage(nextPage);
      if (nextPage >= data.total_pages) setHasMore(false);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {items.map(item => (
          <MovieCard key={`${item.id}-${item.media_type || mediaType}`} item={item} mediaType={item.media_type || mediaType} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && fetchMore && (
        <div className="flex justify-center mt-14">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center gap-3 px-10 py-4 rounded-full bg-[var(--color-card)] hover:bg-white/10 border border-white/10 hover:border-[var(--color-accent)]/50 text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent)]" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 text-[var(--color-accent)]" />
                Show More
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-gray-600 text-sm mt-14">
          You've seen it all! ✨
        </p>
      )}
    </div>
  );
};

export default LoadMoreGrid;
