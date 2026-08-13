const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
// Uses the v3 API key as a Bearer token — works correctly from the browser.
// Get yours at: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  // Append extra query params (e.g. query, page, with_genres)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
};

// Movies
export const getTrendingMovies = (timeWindow = 'day') => fetchFromTMDB(`/trending/movie/${timeWindow}`);
export const getTrendingTV     = (timeWindow = 'day') => fetchFromTMDB(`/trending/tv/${timeWindow}`);
export const getMovieDetails = (id) => fetchFromTMDB(`/movie/${id}`);
export const getMovieVideos = (id) => fetchFromTMDB(`/movie/${id}/videos`);
export const getMovieCredits = (id) => fetchFromTMDB(`/movie/${id}/credits`);
export const getSimilarMovies = (id) => fetchFromTMDB(`/movie/${id}/similar`);
export const getPopularMovies = () => fetchFromTMDB(`/movie/popular`);
export const getTopRatedMovies = () => fetchFromTMDB(`/movie/top_rated`);
export const getNowPlayingMovies = () => fetchFromTMDB(`/movie/now_playing`);
export const getUpcomingMovies = () => fetchFromTMDB(`/movie/upcoming`);

// TV
export const getTVDetails          = (id)           => fetchFromTMDB(`/tv/${id}`);
export const getTVVideos           = (id)           => fetchFromTMDB(`/tv/${id}/videos`);
export const getTVCredits          = (id)           => fetchFromTMDB(`/tv/${id}/credits`);
export const getSimilarTVShows     = (id)           => fetchFromTMDB(`/tv/${id}/similar`);
export const getTVSeason           = (seriesId, seasonNumber) => fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}?append_to_response=aggregate_credits,credits`);
export const getTVSeasonVideos     = (seriesId, seasonNumber) => fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}/videos`);
export const getTVRecommendations  = (id)           => fetchFromTMDB(`/tv/${id}/recommendations`);
export const getTVExternalIds      = (id)           => fetchFromTMDB(`/tv/${id}/external_ids`);
export const getPopularTV          = ()             => fetchFromTMDB(`/tv/popular`);
export const getTopRatedTV         = ()             => fetchFromTMDB(`/tv/top_rated`);
export const getOnAirTV            = ()             => fetchFromTMDB(`/tv/on_the_air`);

// People
export const getPersonDetails = (id) => fetchFromTMDB(`/person/${id}`);
export const getPersonMovieCredits = (id) => fetchFromTMDB(`/person/${id}/movie_credits`);
export const getPersonTVCredits = (id) => fetchFromTMDB(`/person/${id}/tv_credits`);
export const getPersonImages = (id) => fetchFromTMDB(`/person/${id}/images`);

// Search
export const searchMulti = (query, page = 1) => fetchFromTMDB(`/search/multi`, { query, page });

// Discovery (For Emotions)
export const discoverMoviesByGenres = (genreIds) => fetchFromTMDB(`/discover/movie`, { with_genres: genreIds });
export const discoverTVByGenres     = (genreIds) => fetchFromTMDB(`/discover/tv`,    { with_genres: genreIds });

// Watch Providers (streaming platforms)
export const getMovieWatchProviders = (id) => fetchFromTMDB(`/movie/${id}/watch/providers`);
export const getTVWatchProviders    = (id) => fetchFromTMDB(`/tv/${id}/watch/providers`);
