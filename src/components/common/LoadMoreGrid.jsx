import React, { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { Loader2 } from 'lucide-react';

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

  const observer = useRef();

  const handleLoadMore = useCallback(async () => {
    if (loading || !fetchMore || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await fetchMore(nextPage);
      const newItems = data.results.filter(r => r.poster_path); // only items with posters
      setItems(prev => {
        // Prevent duplicates (API sometimes returns same items on adjacent pages)
        const existingIds = new Set(prev.map(i => i.id));
        const uniqueNewItems = newItems.filter(i => !existingIds.has(i.id));
        return [...prev, ...uniqueNewItems];
      });
      setPage(nextPage);
      if (nextPage >= data.total_pages || data.results.length === 0) setHasMore(false);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, fetchMore, hasMore, page]);

  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        handleLoadMore();
      }
    }, { rootMargin: '200px' }); // trigger a bit before they hit bottom
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, handleLoadMore]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {items.map(item => (
          <MovieCard key={`${item.id}-${item.media_type || mediaType}`} item={item} mediaType={item.media_type || mediaType} />
        ))}
      </div>

      {/* Infinite Scroll trigger element */}
      {hasMore && fetchMore && (
        <div ref={lastElementRef} className="flex justify-center mt-14 h-10">
          {loading && (
            <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading more...
            </div>
          )}
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
