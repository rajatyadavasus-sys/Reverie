import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadMoreGrid from '../components/common/LoadMoreGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Smile, CloudRain, Heart, Zap, Ghost, Leaf, Aperture } from 'lucide-react';

const EMOTION_MAP = {
  happy: {
    movieGenres: '35|18',
    tvGenres: '35|18',
    withoutGenres: '16,27,53,80,9648,10752', // Exclude Animation, Horror, Thriller, Crime, Mystery, War
    label: 'Happy & Uplifting',
    Icon: Smile,
    description: 'Feel-good live-action films, heartwarming comedies, and inspiring human stories to brighten your day.',
    gradient: 'from-yellow-500/20 to-orange-500/10',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/20',
    sectionColor: 'border-yellow-500',
  },
  sad: {
    movieGenres: '18',
    tvGenres: '18',
    label: 'Melancholic',
    Icon: CloudRain,
    description: 'Emotional dramas that let you feel deeply and find cathartic release.',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    sectionColor: 'border-blue-500',
  },
  romantic: {
    movieGenres: '10749',
    tvGenres: '10749',
    label: 'Romantic',
    Icon: Heart,
    description: 'Sweeping love stories and heartfelt romances for those tender moments.',
    gradient: 'from-pink-500/20 to-rose-500/10',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
    sectionColor: 'border-pink-500',
  },
  excited: {
    movieGenres: '28|12',
    tvGenres: '28|12',
    label: 'Excited',
    Icon: Zap,
    description: 'Action-packed adventures and adrenaline-fueled thrillers to get your heart racing.',
    gradient: 'from-orange-500/20 to-red-500/10',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    sectionColor: 'border-orange-500',
  },
  scared: {
    movieGenres: '27|53',
    tvGenres: '27|9648',
    label: 'Thrilled',
    Icon: Ghost,
    description: 'Spine-chilling horror and nerve-wracking thrillers for a late-night scare session.',
    gradient: 'from-purple-500/20 to-indigo-500/10',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    sectionColor: 'border-purple-500',
    customInjectTV: [61889, 203857, 71728], // Daredevil, Born Again, The Punisher
    customInjectMovie: [7267, 13074],       // The Punisher (2004), War Zone (2008)
  },
  relaxed: {
    movieGenres: '99|10770',
    tvGenres: '99|10764',
    label: 'Relaxed',
    Icon: Leaf,
    description: 'Calm documentaries and easy-viewing shows to wind down and decompress.',
    gradient: 'from-green-500/20 to-teal-500/10',
    accent: 'text-green-400',
    border: 'border-green-500/20',
    sectionColor: 'border-green-500',
  },
  'mind-bending': {
    movieGenres: '878|9648',
    tvGenres: '10765|9648',
    label: 'Mind-Bending',
    Icon: Aperture,
    description: 'Mind-twisting sci-fi and mysteries that make you question everything.',
    gradient: 'from-violet-500/20 to-fuchsia-500/10',
    accent: 'text-violet-400',
    border: 'border-violet-500/20',
    sectionColor: 'border-violet-500',
  },
};

const BEARER = () => import.meta.env.VITE_TMDB_API_KEY;
const HEADERS = () => ({ accept: 'application/json', Authorization: `Bearer ${BEARER()}` });

const buildFetch = (type, genres, withoutGenres, sort, customInject) => async (page = 1) => {
  const withoutParam = withoutGenres ? `&without_genres=${withoutGenres}` : '';
  const base = type === 'movie'
    ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genres}${withoutParam}&sort_by=${sort}&vote_count.gte=100&page=${page}`
    : `https://api.themoviedb.org/3/discover/tv?with_genres=${genres}${withoutParam}&sort_by=${sort}&vote_count.gte=50&page=${page}`;
  
  const res = await fetch(base, { headers: HEADERS() });
  const data = await res.json();

  // Inject custom titles on page 1 only
  if (page === 1 && customInject?.length > 0) {
    const injected = await Promise.all(
      customInject.map(id => 
        fetch(`https://api.themoviedb.org/3/${type}/${id}`, { headers: HEADERS() }).then(r => r.json())
      )
    );
    // Filter out errors and add media_type so cards render properly
    const validInjected = injected.filter(item => item.success !== false).map(item => ({...item, media_type: type}));
    
    // Deduplicate against fetched data
    const existingIds = new Set(validInjected.map(i => i.id));
    const filteredResults = data.results.filter(i => !existingIds.has(i.id));
    
    data.results = [...validInjected, ...filteredResults];
  }

  return data;
};

const SECTIONS = [
  { key: 'toprated',  label: '🏆 Top Rated',        sort: 'vote_average.desc',  desc: 'The highest rated titles in this mood' },
  { key: 'popular',   label: '🔥 Most Popular',      sort: 'popularity.desc',    desc: 'What everyone is watching right now' },
  { key: 'recent',    label: '🆕 Recently Released',  sort: 'release_date.desc',  desc: 'Fresh titles in this category' },
];

const EmotionSection = ({ label, desc, fetchFn, mediaType, sectionColor }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn(1).then(data => {
      setItems(data.results?.filter(r => r.poster_path) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="mb-24">
      <div className={`border-l-4 ${sectionColor} pl-5 mb-10`}>
        <h2 className="text-2xl font-bold text-white">{label}</h2>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <LoadMoreGrid
          initialItems={items}
          mediaType={mediaType}
          fetchMore={fetchFn}
        />
      )}
    </div>
  );
};

const EmotionCategory = () => {
  const { emotion } = useParams();
  const em = EMOTION_MAP[emotion] || EMOTION_MAP['happy'];
  const [activeTab, setActiveTab] = useState('movies');

  const mediaType = activeTab === 'movies' ? 'movie' : 'tv';
  const genres    = activeTab === 'movies' ? em.movieGenres : em.tvGenres;

  return (
    <div className="w-full pb-24">
      {/* Emotion Hero */}
      <div className={`w-full bg-gradient-to-br ${em.gradient} border-b ${em.border} relative overflow-hidden`}>
        {/* Abstract background glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-current opacity-20 blur-[100px] rounded-full ${em.accent}`}></div>
        
        <div className="container mx-auto px-8 lg:px-16 py-24 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <em.Icon className={`w-24 h-24 ${em.accent} drop-shadow-2xl`} />
          </div>
          <h1 className={`text-5xl md:text-7xl font-black mb-6 ${em.accent}`}>{em.label}</h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">{em.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-8 lg:px-16 py-16">
        {/* Tab switcher */}
        <div className="flex items-center gap-3 mb-20">
          {[
            { key: 'movies', label: '🎬 Movies' },
            { key: 'tv',     label: '📺 TV Shows' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <EmotionSection
            key={`${activeTab}-${emotion}-${section.key}`}
            label={section.label}
            desc={section.desc}
            fetchFn={buildFetch(mediaType, genres, em.withoutGenres, section.sort, activeTab === 'tv' ? em.customInjectTV : em.customInjectMovie)}
            mediaType={mediaType}
            sectionColor={em.sectionColor}
          />
        ))}
      </div>
    </div>
  );
};

export default EmotionCategory;
