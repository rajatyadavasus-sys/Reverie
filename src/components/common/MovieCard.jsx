import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Tv, Film } from 'lucide-react';
import { getReviewTag, getTagColors, ReviewIcon } from '../../utils/ratings';

const MovieCard = ({ item, mediaType = 'movie' }) => {
  const type = item.media_type || mediaType;
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const posterPath = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  const route = type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

  const tag = getReviewTag(item.vote_average, item.vote_count);
  const tagColors = getTagColors(tag.type);

  return (
    <Link to={route} className="block group">
      <div className="bg-[var(--color-card)] rounded-2xl overflow-hidden transition-all duration-300 border-2 border-transparent group-hover:border-[var(--color-accent)] group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-purple-900/25 flex flex-col h-full">

        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
          {posterPath ? (
            <img
              src={posterPath}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              {type === 'tv' ? <Tv className="w-12 h-12" /> : <Film className="w-12 h-12" />}
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
          </div>

          {/* Movie/TV badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-gray-300">
            {type === 'tv' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
            <span className="capitalize">{type === 'tv' ? 'TV' : 'Film'}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5 flex flex-col flex-grow gap-3">
          <h3 className="font-semibold text-base text-white line-clamp-1 leading-snug">{title}</h3>

          {/* FeelFlix Tag */}
          <div className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${tagColors}`}>
            <ReviewIcon iconName={tag.icon} className="w-3.5 h-3.5" />
            <span>{tag.label}</span>
          </div>

          <p className="text-gray-500 text-xs mt-auto">{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
