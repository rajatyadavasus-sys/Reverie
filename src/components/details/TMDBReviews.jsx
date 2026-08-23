import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const getRatingTag = (val) => {
  if (!val) return { label: 'Unrated Review', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
  
  if (typeof val === 'string') {
    if (val === 'masterpiece') return { label: '🌟 Masterpiece', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.2)]' };
    if (val === 'must-watch') return { label: '👍 Must Watch', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (val === 'timepass') return { label: '☕ Timepass', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    if (val === 'skip') return { label: '🚫 Skip', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  }

  if (val >= 8) return { label: '🌟 Masterpiece', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.2)]' };
  if (val >= 6) return { label: '👍 Good Watch', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
  if (val >= 4) return { label: '🤔 Mixed', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
  return { label: '👎 Not Recommended', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
};

const ReviewCard = ({ review, isCurrentUser = false, isReverieUser = false }) => {
  const { currentUser } = useAuth();
  const isPlatformUser = isCurrentUser || isReverieUser;
  
  const ratingVal = review.tag || review.author_details?.rating || review.rating;
  const numericRating = typeof ratingVal === 'number' ? ratingVal : null;
  const tag = getRatingTag(ratingVal);

  const emailForAvatar = isCurrentUser 
    ? (currentUser?.email || 'reverie') 
    : (review.authorEmail || review.author || 'reverie');

  const avatarUrl = isPlatformUser
    ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${emailForAvatar}&backgroundColor=transparent`
    : review.author_details?.avatar_path
      ? review.author_details.avatar_path.startsWith('/https') ? review.author_details.avatar_path.substring(1) : `https://image.tmdb.org/t/p/w150_and_h150_face${review.author_details.avatar_path}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`;

  const authorName = isCurrentUser 
    ? (currentUser?.displayName || 'Cinema Lover') 
    : isPlatformUser 
      ? (review.authorName || 'Reverie User') 
      : review.author;
      
  const content = isPlatformUser ? review.opinion : review.content?.replace(/_/g, '').replace(/\*/g, '');

  return (
    <div className={`relative bg-[#121620] border rounded-2xl p-6 flex flex-col transition-all hover:bg-[#161b27] ${isPlatformUser ? 'border-[var(--color-accent)]/30 shadow-[0_0_15px_rgba(124,58,237,0.05)]' : 'border-white/5'}`}>
      {isCurrentUser && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" />
          Your Review
        </div>
      )}
      {!isCurrentUser && isReverieUser && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          Reverie User
        </div>
      )}

      <div className="flex items-start gap-3 mb-4 pr-24">
        <img src={avatarUrl} alt={authorName} className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0" />
        <div>
          <h4 className="text-white font-bold text-sm">{authorName}</h4>
          {numericRating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-gray-400">{numericRating}/10</span>
            </div>
          )}
        </div>
      </div>

      <div className={`inline-flex self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-4 ${tag.bg} ${tag.border} ${tag.color} ${tag.glow || ''}`}>
        {tag.label}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed line-clamp-6 flex-1">{content}</p>
    </div>
  );
};

const TMDBReviews = ({ reviews, globalReviews = [], userReview }) => {
  const { currentUser } = useAuth();
  const [visibleCount, setVisibleCount] = useState(6);

  // Reverie reviews use 'tag' and 'opinion', not 'text'
  const hasUserReview = userReview && (userReview.tag || userReview.opinion);
  const hasGlobalReviews = globalReviews && globalReviews.length > 0;
  const hasTMDBReviews = reviews && reviews.length > 0;

  if (!hasUserReview && !hasGlobalReviews && !hasTMDBReviews) return null;

  // Filter out the user's own global review so we don't show it twice
  // (since we already show it at the very top via `userReview`)
  const otherGlobalReviews = globalReviews.filter(
    (gr) => !(currentUser && gr.authorUid === currentUser.uid)
  );

  const totalReviews = (otherGlobalReviews.length) + (reviews?.length || 0);
  const hasMore = visibleCount < totalReviews;
  
  const showMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div className="container mx-auto px-8 lg:px-16 pt-24">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="w-8 h-8 text-[var(--color-accent)]" />
        <h2 className="text-3xl font-bold text-white">Audience Reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User's own Reverie review — always first, pinned */}
        {hasUserReview && <ReviewCard review={userReview} isCurrentUser={true} />}

        {/* Other Reverie community reviews */}
        {otherGlobalReviews.slice(0, visibleCount).map((review, i) => (
          <ReviewCard key={`global-${i}`} review={review} isReverieUser={true} />
        ))}

        {/* TMDB community reviews */}
        {reviews?.slice(0, Math.max(0, visibleCount - otherGlobalReviews.length)).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
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
