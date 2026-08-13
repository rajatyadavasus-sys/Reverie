import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadMoreGrid from '../components/common/LoadMoreGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Smile, CloudRain, Heart, Zap, Ghost, Leaf, Aperture } from 'lucide-react';

const EMOTION_MAP = {
  happy: {
    movieGenres: '35|18',
    tvGenres: '35|18',
    withoutGenres: '16,27,53,80,9648,10752',
    label: 'Happy & Uplifting',
    sub: 'Comedies & feel-good films',
    Icon: Smile,
    description: 'Feel-good live-action films, heartwarming comedies, and inspiring human stories to brighten your day.',
    gradient: 'from-yellow-500/20 to-orange-500/10',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/20',
    sectionColor: 'border-yellow-500',
    hexColor: '#f59e0b',
  },
  sad: {
    movieGenres: '18',
    tvGenres: '18',
    label: 'Melancholic',
    sub: 'Emotional dramas',
    Icon: CloudRain,
    description: 'Emotional dramas that let you feel deeply and find cathartic release.',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    sectionColor: 'border-blue-500',
    hexColor: '#60a5fa',
  },
  romantic: {
    movieGenres: '10749',
    tvGenres: '10749',
    withoutGenres: '16', // Exclude animation from romantic
    label: 'Romantic',
    sub: 'Love stories & romance',
    Icon: Heart,
    description: 'Sweeping love stories and heartfelt romances for those tender moments.',
    gradient: 'from-pink-500/20 to-rose-500/10',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
    sectionColor: 'border-pink-500',
    customInjectMovie: [313369, 43347, 296096, 10096, 11252, 4951, 19973], // Classic Romantics
    hexColor: '#f472b6',
  },
  excited: {
    movieGenres: '28|12',
    tvGenres: '28|12',
    label: 'Excited',
    sub: 'Action & adventure',
    Icon: Zap,
    description: 'Action-packed adventures and adrenaline-fueled thrillers to get your heart racing.',
    gradient: 'from-orange-500/20 to-red-500/10',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    sectionColor: 'border-orange-500',
    hexColor: '#fb923c',
  },
  scared: {
    movieGenres: '27|53',
    tvGenres: '27|9648',
    label: 'Thrilled',
    sub: 'Horror & thrillers',
    Icon: Ghost,
    description: 'Spine-chilling horror and nerve-wracking thrillers for a late-night scare session.',
    gradient: 'from-purple-500/20 to-indigo-500/10',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    sectionColor: 'border-purple-500',
    customInjectTV: [61889, 203857, 71728],
    customInjectMovie: [7267, 13074],
    hexColor: '#c084fc',
  },
  relaxed: {
    movieGenres: '99|10770',
    tvGenres: '99|10764',
    label: 'Relaxed',
    sub: 'Documentaries & calm films',
    Icon: Leaf,
    description: 'Calm documentaries and easy-viewing shows to wind down and decompress.',
    gradient: 'from-green-500/20 to-teal-500/10',
    accent: 'text-green-400',
    border: 'border-green-500/20',
    sectionColor: 'border-green-500',
    hexColor: '#34d399',
  },
  'mind-bending': {
    movieGenres: '878|9648',
    tvGenres: '10765|9648',
    label: 'Mind-Bending',
    sub: 'Sci-Fi & mystery',
    Icon: Aperture,
    description: 'Mind-twisting sci-fi and mysteries that make you question everything.',
    gradient: 'from-violet-500/20 to-fuchsia-500/10',
    accent: 'text-violet-400',
    border: 'border-violet-500/20',
    sectionColor: 'border-violet-500',
    hexColor: '#818cf8',
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
  const [hoveredEmotion, setHoveredEmotion] = useState(null);

  const mediaType = activeTab === 'movies' ? 'movie' : 'tv';
  const genres    = activeTab === 'movies' ? em.movieGenres : em.tvGenres;

  return (
    <div className="w-full pb-24">
      {/* Emotion Hero - Bento Box Redesign */}
      <div className="w-full relative overflow-hidden bg-[var(--color-background)] border-b border-white/5">
        <div className="container mx-auto px-8 lg:px-16 py-12 lg:py-24 relative z-10">
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-stretch">
            
            {/* Left Side: Current Emotion (Hero Card) */}
            <div className="flex-1 relative rounded-[2rem] overflow-hidden flex flex-col justify-center p-10 lg:p-16 border border-white/10" style={{ backgroundColor: '#121620' }}>
              <div 
                className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 pointer-events-none"
                style={{ backgroundColor: em.hexColor }}
              />
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-lg" style={{ boxShadow: `0 10px 40px -10px ${em.hexColor}60` }}>
                  <em.Icon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight leading-tight">{em.label}</h1>
                <p className="text-gray-400 text-xl max-w-xl leading-relaxed">{em.description}</p>
              </div>
            </div>

            {/* Right Side: Other Emotions Grid */}
            <div className="xl:w-[600px] flex-shrink-0 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500">Or pick another mood</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(EMOTION_MAP).map(([key, data]) => {
                  if (key === emotion) return null;
                  return (
                    <Link
                      key={key}
                      to={`/emotion/${key}`}
                      onMouseEnter={() => setHoveredEmotion(key)}
                      onMouseLeave={() => setHoveredEmotion(null)}
                      className="group relative flex flex-col p-4 sm:p-5 rounded-3xl transition-all duration-300 overflow-hidden border border-white/5"
                      style={{
                        backgroundColor: '#121620',
                        transform: hoveredEmotion === key ? 'translateY(-4px)' : 'none',
                        boxShadow: hoveredEmotion === key ? `0 12px 30px -10px ${data.hexColor}30` : '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                    >
                      {/* Soft Background Glow on Hover */}
                      <div 
                        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[50px] opacity-10 transition-opacity duration-300 group-hover:opacity-30 pointer-events-none"
                        style={{ backgroundColor: data.hexColor }}
                      />

                      {/* Icon */}
                      <div className="relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10">
                        <data.Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Text */}
                      <div className="relative z-10 mt-auto">
                        <h4 className="text-[15px] sm:text-base font-bold text-white tracking-tight leading-tight mb-1">{data.label}</h4>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{data.sub}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
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
