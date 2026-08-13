import React from 'react';
import * as Icons from 'lucide-react';

/**
 * Calculates a human-readable Reverie review tag.
 * Considers BOTH rating AND vote count to avoid mislabelling
 * movies that are too new or have very few votes.
 *
 * Tier logic (from best to worst):
 *  🏆 Masterpiece   — 8.0+ with 200+ votes (genuinely great, enough people agree)
 *  👍 Must Watch    — 7.0+ with  50+ votes (really good, worth your evening)
 *  ☕ Timepass      — 6.0+ (decent watch, kill time)
 *  😬 Disappointing — 5.0+ (below average)
 *  ❌ Skip          — below 5.0
 *  🕐 Too Early     — fewer than 10 votes (jury still out)
 */
export const getReviewTag = (voteAverage, voteCount) => {
  // Not enough data yet
  if (!voteCount || voteCount < 10) {
    return {
      label: 'Too Early to Tell',
      type: 'early',
      description: 'Not enough votes yet',
      icon: 'Clock',
    };
  }

  if (voteAverage >= 8.0 && voteCount >= 200) {
    return {
      label: 'Masterpiece',
      type: 'masterpiece',
      description: 'A rare gem — universally loved',
      icon: 'Trophy',
    };
  }

  if (voteAverage >= 7.0 && voteCount >= 50) {
    return {
      label: 'Must Watch',
      type: 'muswatch',
      description: "Highly recommended — don't miss it",
      icon: 'ThumbsUp',
    };
  }

  if (voteAverage >= 6.0) {
    return {
      label: 'Timepass',
      type: 'timepass',
      description: 'Decent watch for a lazy evening',
      icon: 'Coffee',
    };
  }

  if (voteAverage >= 5.0) {
    return {
      label: 'Disappointing',
      type: 'disappointing',
      description: 'Could have been better',
      icon: 'Frown',
    };
  }

  return {
    label: 'Skip',
    type: 'skip',
    description: 'Not worth your time',
    icon: 'XCircle',
  };
};

/**
 * Returns Tailwind color classes for each tag type.
 */
export const getTagColors = (type) => {
  const map = {
    masterpiece:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    muswatch:      'bg-green-500/15 text-green-400 border-green-500/30',
    timepass:      'bg-blue-500/15 text-blue-400 border-blue-500/30',
    disappointing: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    skip:          'bg-red-500/15 text-red-400 border-red-500/30',
    early:         'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };
  return map[type] || map.early;
};

/**
 * Renders the corresponding Lucide Icon
 */
export const ReviewIcon = ({ iconName, className }) => {
  const IconComponent = Icons[iconName] || Icons.Circle;
  return <IconComponent className={className} />;
};
