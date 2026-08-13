import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  getMovieDetails, getSimilarMovies, getMovieCredits, getMovieVideos,
  getTVDetails, getSimilarTVShows, getTVCredits, getTVVideos,
} from '../services/tmdb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieCard from '../components/common/MovieCard';
import SeasonAccordion from '../components/details/SeasonAccordion';
import ReviewModal from '../components/details/ReviewModal';
import WatchProviders from '../components/details/WatchProviders';
import CastSection from '../components/details/CastSection';
import TrailerModal from '../components/details/TrailerModal';
import { Star, Clock, Calendar, Heart, Tv, Film, Eye, EyeOff, MessageSquarePlus, Trash2, PlayCircle } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useWatched } from '../context/WatchedContext';
import { useReviews } from '../context/ReviewContext';
import { getReviewTag, getTagColors } from '../utils/ratings';

const ReviewTag = ({ voteAverage, voteCount }) => {
  const tag = getReviewTag(voteAverage, voteCount);
  const colors = getTagColors(tag.type);

  return (
    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold tracking-wide uppercase ${colors}`}>
      <span>{tag.emoji}</span>
      <span>{tag.label}</span>
      <span className="hidden md:inline opacity-60 normal-case font-normal">— {tag.description}</span>
    </div>
  );
};

// Pick best trailer from TMDB videos
const pickTrailer = (videos = []) => {
  const priority = ['Trailer', 'Teaser', 'Clip', 'Behind the Scenes'];
  for (const type of priority) {
    const found = videos.filter(v => v.site === 'YouTube' && v.type === type);
    if (found.length) return found[0];
  }
  return videos.find(v => v.site === 'YouTube') || null;
};

const MediaDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const isTV = location.pathname.startsWith('/tv/');

  const [media, setMedia] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isWatched, markWatched, unmarkWatched }              = useWatched();
  const { getReview }                                          = useReviews();
  const [showReviewModal, setShowReviewModal]                  = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        if (isTV) {
          const [details, sim, credits, videos] = await Promise.all([
            getTVDetails(id),
            getSimilarTVShows(id),
            getTVCredits(id),
            getTVVideos(id),
          ]);
          setMedia(details);
          setSimilar(sim.results.slice(0, 5));
          setCast(credits.cast || []);
          const trailer = pickTrailer(videos.results);
          if (trailer) setTrailerKey(trailer.key);
        } else {
          const [details, sim, credits, videos] = await Promise.all([
            getMovieDetails(id),
            getSimilarMovies(id),
            getMovieCredits(id),
            getMovieVideos(id),
          ]);
          setMedia(details);
          setSimilar(sim.results.slice(0, 5));
          setCast(credits.cast || []);
          const trailer = pickTrailer(videos.results);
          if (trailer) setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, isTV]);

  if (loading) return <div className="pt-32"><LoadingSpinner /></div>;
  if (!media) return <div className="pt-32 text-center text-white text-xl">Not found.</div>;

  const mediaType  = isTV ? 'tv' : 'movie';
  const title      = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;
  const year       = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const runtime    = isTV
    ? (media.episode_run_time?.[0] ? `${media.episode_run_time[0]} min/ep` : null)
    : (media.runtime ? `${media.runtime} min` : null);

  const isSaved    = isInWatchlist(media.id, mediaType);
  const isMarked   = isWatched(media.id, mediaType);
  const userReview = getReview(media.id, mediaType);

  const toggleWatchlist = () => {
    if (isSaved) removeFromWatchlist(media.id, mediaType);
    else addToWatchlist({ ...media, media_type: mediaType });
  };

  const toggleWatched = () => {
    if (isMarked) unmarkWatched(media.id, mediaType);
    else markWatched({ ...media, media_type: mediaType });
  };

  return (
    <div className="w-full pb-24">
      {/* Backdrop */}
      <div className="relative w-full h-[55vh] lg:h-[75vh]">
        {media.backdrop_path ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-[var(--color-background)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-[var(--color-background)]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 lg:px-16 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Poster */}
          <div className="w-48 md:w-64 lg:w-72 flex-shrink-0 mx-auto lg:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-2 ring-[var(--color-accent)]/20">
              <img
                src={
                  media.poster_path
                    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Poster'
                }
                alt={title}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-end pb-2 text-center lg:text-left">

            {/* Type badge */}
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-gray-300">
                {isTV ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                {isTV ? 'TV Show' : 'Movie'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight">
              {title}
            </h1>

            {media.tagline && (
              <p className="text-lg text-gray-400 italic mb-6">{media.tagline}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-6">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{media.vote_average?.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({media.vote_count?.toLocaleString()} votes)</span>
              </div>
              {runtime && (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{runtime}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{year}</span>
              </div>
              {isTV && media.number_of_seasons && (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/5">
                  <Tv className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {media.number_of_seasons} Season{media.number_of_seasons > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* FeelFlix Review Tag */}
            <div className="flex justify-center lg:justify-start mb-8">
              <ReviewTag voteAverage={media.vote_average} voteCount={media.vote_count} />
            </div>

            {/* Genres */}
            {media.genres?.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                {media.genres.map(g => (
                  <span
                    key={g.id}
                    className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="max-w-3xl mb-10">
              <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">{media.overview}</p>
            </div>

            {/* Action buttons row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              {/* Watchlist */}
              <button
                onClick={toggleWatchlist}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 ${
                  isSaved
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30 hover:bg-[var(--color-accent-hover)]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              {/* Watched */}
              <button
                onClick={toggleWatched}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm border transition-all duration-200 hover:scale-105 ${
                  isMarked
                    ? 'bg-green-500/15 text-green-400 border-green-500/30'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {isMarked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {isMarked ? 'Watched' : 'Mark as Watched'}
              </button>

              {/* Write / Edit Review */}
              <button
                onClick={() => setShowReviewModal(true)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm border transition-all duration-200 hover:scale-105 ${
                  userReview
                    ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/30'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <MessageSquarePlus className="w-4 h-4" />
                {userReview ? 'Edit Your Review' : 'Write a Review'}
              </button>

              {/* Watch Trailer */}
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 hover:scale-105"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch Trailer
                </button>
              )}
            </div>

            {/* User's existing review card */}
            {userReview && (
              <div className="max-w-2xl bg-white/[0.04] border border-[var(--color-accent)]/20 rounded-2xl p-6 group/review">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Your Review</span>
                    <span className="text-gray-600 text-xs">
                      {new Date(userReview.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={() => removeReview(media.id, mediaType)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover/review:opacity-100"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Tag badge */}
                {(() => {
                  const tagMeta = {
                    masterpiece:  { emoji: '🏆', label: 'Masterpiece',  color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' },
                    'must-watch': { emoji: '👍', label: 'Must Watch',   color: 'text-green-400 bg-green-500/15 border-green-500/30' },
                    timepass:     { emoji: '☕', label: 'Timepass',     color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
                    skip:         { emoji: '❌', label: 'Skip',         color: 'text-red-400 bg-red-500/15 border-red-500/30' },
                  }[userReview.tag];
                  if (!tagMeta) return null;
                  return (
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold mb-4 ${tagMeta.color}`}>
                      {tagMeta.emoji} {tagMeta.label}
                    </span>
                  );
                })()}
                {userReview.opinion && (
                  <p className="text-gray-300 text-sm leading-relaxed">{userReview.opinion}</p>
                )}
                {!userReview.opinion && (
                  <p className="text-gray-600 text-sm italic">No written opinion added.</p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          media={media}
          mediaType={mediaType}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          title={`${title} - Trailer`}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Where to Watch */}
      <div className="container mx-auto px-8 lg:px-16 pt-20">
        <WatchProviders id={media.id} mediaType={mediaType} />
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="container mx-auto px-8 lg:px-16 pt-20">
          <CastSection cast={cast} />
        </div>
      )}

      {/* Seasons & Episodes (TV only) */}

      {isTV && media.seasons?.length > 0 && (
        <div className="container mx-auto px-8 lg:px-16 pt-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Seasons & Episodes</h2>
              <p className="text-gray-400">
                {media.seasons.filter(s => s.season_number > 0).length} seasons ·{' '}
                {media.number_of_episodes} total episodes
              </p>
            </div>
          </div>
          <SeasonAccordion seasons={media.seasons} tvId={media.id} />
        </div>
      )}

      {/* Similar titles */}
      {similar.length > 0 && (
        <div className="container mx-auto px-8 lg:px-16 pt-24">
          <h2 className="text-3xl font-bold text-white mb-10">
            You might also feel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {similar.map(item => (
              <MovieCard key={item.id} item={item} mediaType={mediaType} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
