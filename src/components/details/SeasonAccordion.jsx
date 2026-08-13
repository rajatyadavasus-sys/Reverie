import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, Tv, User } from 'lucide-react';
import { getTVSeason } from '../../services/tmdb';

const EpisodeCard = ({ episode }) => {
  const [expanded, setExpanded] = useState(false);
  const stillUrl = episode.still_path
    ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
    : null;
  const airDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="bg-[var(--color-background)] rounded-xl border border-white/5 hover:border-white/15 transition-all overflow-hidden">
      <div
        className="flex items-start gap-5 p-5 cursor-pointer"
        onClick={() => setExpanded(prev => !prev)}
      >
        {/* Episode still */}
        <div className="flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-white/5">
          {stillUrl ? (
            <img src={stillUrl} alt={episode.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tv className="w-6 h-6 text-gray-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[var(--color-accent)] font-semibold mb-1">
                Episode {episode.episode_number}
              </p>
              <h4 className="text-white font-semibold text-base leading-snug line-clamp-1">
                {episode.name}
              </h4>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3 text-xs text-gray-400 mt-1">
              {episode.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {episode.runtime}m
                </span>
              )}
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Quick meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {airDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {airDate}
              </span>
            )}
            {episode.vote_average > 0 && (
              <span>★ {episode.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Expandable overview */}
      {expanded && episode.overview && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4">
          <p className="text-gray-300 text-sm leading-relaxed">{episode.overview}</p>
        </div>
      )}
    </div>
  );
};

// Mini cast strip for season
const SeasonCast = ({ cast = [] }) => {
  const [showAll, setShowAll] = useState(false);
  if (!cast.length) return null;
  const displayed = showAll ? cast : cast.slice(0, 10);

  return (
    <div className="mt-6 mb-2">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Season Cast</p>
      <div className="flex flex-wrap gap-4">
        {displayed.map(person => (
          <div key={person.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-white/15 transition-all">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w45${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold leading-tight truncate max-w-[100px]">{person.name}</p>
              {person.character && (
                <p className="text-gray-500 text-[10px] italic truncate max-w-[100px]">{person.character}</p>
              )}
            </div>
          </div>
        ))}
        {cast.length > 10 && (
          <button
            onClick={() => setShowAll(p => !p)}
            className="flex items-center px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
          >
            {showAll ? 'Show less' : `+${cast.length - 10} more`}
          </button>
        )}
      </div>
    </div>
  );
};

const SeasonAccordion = ({ seasons = [], tvId }) => {
  const [openSeason, setOpenSeason]   = useState(null);
  const [seasonData, setSeasonData]   = useState({});
  const [loadingEps, setLoadingEps]   = useState({});

  const toggleSeason = async (seasonNumber) => {
    if (openSeason === seasonNumber) {
      setOpenSeason(null);
      return;
    }
    setOpenSeason(seasonNumber);

    // Already loaded
    if (seasonData[seasonNumber]) return;

    setLoadingEps(prev => ({ ...prev, [seasonNumber]: true }));
    try {
      const data = await getTVSeason(tvId, seasonNumber);
      setSeasonData(prev => ({
        ...prev,
        [seasonNumber]: {
          episodes: data.episodes || [],
          cast: data.credits?.cast || data.aggregate_credits?.cast || [],
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEps(prev => ({ ...prev, [seasonNumber]: false }));
    }
  };

  const displaySeasons = seasons.filter(s => s.season_number > 0);

  return (
    <div className="mt-2 space-y-4">
      {displaySeasons.map(season => {
        const isOpen   = openSeason === season.season_number;
        const posterUrl = season.poster_path
          ? `https://image.tmdb.org/t/p/w185${season.poster_path}`
          : null;
        const airYear = season.air_date
          ? new Date(season.air_date).getFullYear()
          : null;
        const data = seasonData[season.season_number];

        return (
          <div
            key={season.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-[var(--color-accent)]/40 bg-[var(--color-card)]'
                : 'border-white/5 bg-white/[0.02] hover:border-white/10'
            }`}
          >
            {/* Season header — always visible */}
            <button
              onClick={() => toggleSeason(season.season_number)}
              className="w-full flex items-center gap-6 p-6 text-left"
            >
              {/* Poster */}
              <div className="flex-shrink-0 w-14 aspect-[2/3] rounded-lg overflow-hidden bg-white/5">
                {posterUrl ? (
                  <img src={posterUrl} alt={season.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tv className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg">{season.name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-400">
                  {airYear && <span>{airYear}</span>}
                  <span>{season.episode_count} Episodes</span>
                  {season.vote_average > 0 && (
                    <span>★ {season.vote_average.toFixed(1)}</span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 ml-4">
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[var(--color-accent)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Season overview */}
            {isOpen && season.overview && (
              <div className="px-6 pb-4 -mt-2">
                <p className="text-gray-400 text-sm leading-relaxed">{season.overview}</p>
              </div>
            )}

            {/* Season cast + Episodes */}
            {isOpen && (
              <div className="px-6 pb-6">
                {loadingEps[season.season_number] ? (
                  <div className="py-8 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Season-level cast */}
                    <SeasonCast cast={data?.cast || []} />

                    {/* Episodes list */}
                    {data?.episodes?.length > 0 ? (
                      <div className="space-y-3 mt-6">
                        {data.episodes.map(ep => (
                          <EpisodeCard key={ep.id} episode={ep} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm py-6 text-center">No episode data available yet.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SeasonAccordion;
