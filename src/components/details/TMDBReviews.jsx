import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';

const getRatingTag = (rating) => {
  if (!rating) return { label: 'Unrated Review', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
  
  if (rating >= 8) {
    return { label: '🌟 Masterpiece', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.2)]' };
  } else if (rating >= 6) {
    return { label: '👍 Good Watch', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
  } else if (rating >= 4) {
    return { label: '🤔 Mixed', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
  } else {
    return { label: '👎 Not Recommended', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  }
};

const TMDBReviews = ({ reviews }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  if (!reviews || reviews.length === 0) return null;

  const hasMore = visibleCount < reviews.length;
  const showMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div className="container mx-auto px-8 lg:px-16 pt-24">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="w-8 h-8 text-[var(--color-accent)]" />
        <h2 className="text-3xl font-bold text-white">Audience Reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.slice(0, visibleCount).map((review) => {
          const rating = review.author_details?.rating;
          const tag = getRatingTag(rating);
          const avatar = review.author_details?.avatar_path;
          const avatarUrl = avatar 
            ? avatar.startsWith('/https') 
              ? avatar.substring(1) 
              : `https://image.tmdb.org/t/p/w150_and_h150_face${avatar}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`;

          return (
            <div key={review.id} className="bg-[#121620] border border-white/5 rounded-2xl p-6 flex flex-col transition-all hover:bg-[#161b27]">
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={avatarUrl} alt={review.author} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="text-white font-bold text-sm truncate max-w-[150px]">{review.author}</h4>
                    {rating && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-400">{rating}/10</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tag.bg} ${tag.border} ${tag.color} ${tag.glow || ''}`}>
                  {tag.label}
                </div>
              </div>

              <div className="text-gray-400 text-sm leading-relaxed line-clamp-6 flex-1">
                {review.content.replace(/_/g, '').replace(/\*/g, '')}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button 
            onClick={showMore}
            className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all hover:scale-105"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default TMDBReviews;
