import React, { useState, useEffect } from 'react';
import { X, Star, Send, Trash2 } from 'lucide-react';
import { useReviews } from '../../context/ReviewContext';
import { useWatched } from '../../context/WatchedContext';

import { ReviewIcon } from '../../utils/ratings';

const TAGS = [
  {
    key: 'masterpiece',
    icon: 'Trophy',
    label: 'Masterpiece',
    desc: 'An absolute gem. One for the ages.',
    border: 'border-yellow-500/30 hover:border-yellow-400',
    text: 'text-yellow-400',
    selectedBg: 'bg-yellow-500/20 ring-4 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.3)]',
    gradient: 'from-yellow-500/20 to-orange-500/10',
  },
  {
    key: 'must-watch',
    icon: 'ThumbsUp',
    label: 'Must Watch',
    desc: 'Highly recommend. Don\'t miss it.',
    border: 'border-green-500/30 hover:border-green-400',
    text: 'text-green-400',
    selectedBg: 'bg-green-500/20 ring-4 ring-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    gradient: 'from-green-500/20 to-emerald-500/10',
  },
  {
    key: 'timepass',
    icon: 'Coffee',
    label: 'Timepass',
    desc: 'Decent. Good for a lazy evening.',
    border: 'border-blue-500/30 hover:border-blue-400',
    text: 'text-blue-400',
    selectedBg: 'bg-blue-500/20 ring-4 ring-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    key: 'skip',
    icon: 'XCircle',
    label: 'Skip',
    desc: 'Save your time. Not worth it.',
    border: 'border-red-500/30 hover:border-red-400',
    text: 'text-red-400',
    selectedBg: 'bg-red-500/20 ring-4 ring-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    gradient: 'from-red-500/20 to-rose-500/10',
  },
];

const ReviewModal = ({ media, mediaType, onClose }) => {
  const { getReview, addReview, removeReview } = useReviews();
  const { markWatched } = useWatched();

  const existing = getReview(media.id, mediaType);

  const [selectedTag, setSelectedTag] = useState(existing?.tag || null);
  const [opinion, setOpinion]         = useState(existing?.opinion || '');
  const [submitted, setSubmitted]     = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = () => {
    if (!selectedTag) return;
    const review = {
      id: media.id,
      media_type: mediaType,
      title: media.title || media.name,
      poster_path: media.poster_path,
      tag: selectedTag,
      opinion: opinion.trim(),
    };
    addReview(review);
    // Auto mark as watched when you review
    markWatched({ ...media, media_type: mediaType });
    setSubmitted(true);
    setTimeout(onClose, 1400);
  };

  const handleDelete = () => {
    removeReview(media.id, mediaType);
    onClose();
  };

  const title = media.title || media.name;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl bg-[#1a1f31] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-5 p-7 border-b border-white/5">
          {media.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
              alt={title}
              className="w-14 aspect-[2/3] object-cover rounded-xl flex-shrink-0 border border-white/10"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-widest mb-1">
              Your Review
            </p>
            <h2 className="text-white font-bold text-xl leading-tight line-clamp-2">{title}</h2>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white font-bold text-xl mb-2">Review Saved!</p>
            <p className="text-gray-400">Also marked as Watched.</p>
          </div>
        ) : (
          <div className="p-7 space-y-8">

            {/* Tag selection */}
            <div>
              <p className="text-white font-semibold text-base mb-5">
                How would you tag this?
                <span className="text-red-400 ml-1">*</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {TAGS.map(tag => {
                  const isSelected = selectedTag === tag.key;
                  return (
                    <button
                      key={tag.key}
                      onClick={() => setSelectedTag(tag.key)}
                      className={`group relative overflow-hidden flex flex-col items-start p-6 rounded-3xl border-2 text-left transition-all duration-300 z-10 ${
                        isSelected 
                          ? `${tag.border} ${tag.selectedBg} scale-[1.02] -translate-y-1` 
                          : `bg-[#131824] ${tag.border} hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl`
                      }`}
                    >
                      {/* Ambient glowing bg on hover or active */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tag.gradient} opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>
                      
                      {/* Inner Content */}
                      <div className="relative z-20 w-full">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4 transition-all duration-500 transform ${isSelected ? 'bg-white/10 border-white/20 scale-110 shadow-lg' : 'group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 group-hover:shadow-lg'}`}>
                          <ReviewIcon iconName={tag.icon} className={`w-6 h-6 text-white drop-shadow-md transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                        </div>
                        <span className={`block font-extrabold text-xl mb-1 ${tag.text} tracking-tight transition-all duration-300 ${isSelected ? 'tracking-wide' : 'group-hover:tracking-wide'}`}>
                          {tag.label}
                        </span>
                        <span className="block text-sm text-gray-400 font-medium leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {tag.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opinion textarea */}
            <div>
              <label className="text-white font-semibold text-base mb-3 block">
                Your Opinion{' '}
                <span className="text-gray-500 font-normal text-sm">(optional)</span>
              </label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                placeholder="What did you think? Any scenes that stood out? Would you watch it again?..."
                rows={4}
                maxLength={500}
                className="w-full bg-[var(--color-background)] border border-white/10 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] rounded-xl p-4 text-white placeholder-gray-600 text-sm leading-relaxed resize-none outline-none transition-all"
              />
              <p className="text-right text-gray-600 text-xs mt-2">{opinion.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleSubmit}
                disabled={!selectedTag}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
                {existing ? 'Update Review' : 'Submit Review'}
              </button>

              {existing && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-5 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
