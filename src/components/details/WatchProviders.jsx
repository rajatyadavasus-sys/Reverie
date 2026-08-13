import React, { useEffect, useState } from 'react';
import { getMovieWatchProviders, getTVWatchProviders } from '../../services/tmdb';
import { Tv, ShoppingCart, ExternalLink } from 'lucide-react';

// Priority order: Indian platforms first, then global
const REGION_PRIORITY = ['IN', 'US', 'GB'];

// Direct deep-link URLs for major streaming platforms
const PROVIDER_URLS = {
  // Indian platforms
  8:    'https://www.netflix.com',
  9:    'https://www.amazon.com/prime-video',
  2:    'https://tv.apple.com',
  337:  'https://www.disneyplus.com',        // Disney+
  122:  'https://www.hotstar.com',            // Hotstar
  1853: 'https://www.jiocinema.com',
  220:  'https://www.zee5.com',
  11:   'https://www.mxplayer.in',
  218:  'https://www.sonyliv.com',
  2336: 'https://www.erosnow.com',
  392:  'https://www.sunnxt.com',
  // Global
  15:   'https://www.hulu.com',
  384:  'https://www.hbomax.com',
  387:  'https://www.peacocktv.com',
  386:  'https://www.peacocktv.com',
  531:  'https://www.paramountplus.com',
  350:  'https://www.apple.com/apple-tv-plus',
  283:  'https://www.crunchyroll.com',
  43:   'https://www.starz.com',
  257:  'https://www.fubo.tv',
  300:  'https://www.showtime.com',
};

const getProviderUrl = (providerId, tmdbLink) =>
  PROVIDER_URLS[providerId] || tmdbLink || 'https://www.themoviedb.org';

const ProviderLogo = ({ provider, tmdbLink, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const url = getProviderUrl(provider.provider_id, tmdbLink);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group/logo"
      title={`Watch on ${provider.provider_name}`}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
        alt={provider.provider_name}
        className={`${sizeClass} rounded-xl object-cover border border-white/10 transition-all duration-200 group-hover/logo:scale-110 group-hover/logo:border-white/30 group-hover/logo:shadow-lg`}
      />
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover/logo:opacity-100 transition-opacity pointer-events-none z-10">
        {provider.provider_name}
      </div>
    </a>
  );
};

const ProviderSection = ({ title, providers, icon: Icon, color, tmdbLink }) => {
  if (!providers?.length) return null;
  return (
    <div className="mb-6 last:mb-0">
      <div className={`flex items-center gap-2 mb-3`}>
        <Icon className={`w-4 h-4 ${color}`} />
        <p className={`text-sm font-semibold ${color}`}>{title}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {providers.map(p => (
          <ProviderLogo key={p.provider_id} provider={p} tmdbLink={tmdbLink} />
        ))}
      </div>
    </div>
  );
};


const WatchProviders = ({ id, mediaType }) => {
  const [providers, setProviders] = useState(null);
  const [region, setRegion]       = useState('IN');
  const [loading, setLoading]     = useState(true);
  const [tmdbLink, setTmdbLink]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const fn = mediaType === 'tv' ? getTVWatchProviders : getMovieWatchProviders;
        const data = await fn(id);

        // Pick best available region
        let bestRegion = null;
        for (const r of REGION_PRIORITY) {
          if (data.results?.[r]) { bestRegion = r; break; }
        }
        // If none of priority regions, pick first available
        if (!bestRegion && data.results) {
          bestRegion = Object.keys(data.results)[0] || null;
        }

        if (bestRegion) {
          setProviders(data.results[bestRegion]);
          setRegion(bestRegion);
        } else {
          setProviders(null);
        }
        setTmdbLink(data.results?.[bestRegion]?.link || '');
      } catch (err) {
        console.error('Watch providers error:', err);
        setProviders(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id, mediaType]);

  if (loading) {
    return (
      <div className="animate-pulse h-20 rounded-2xl bg-white/5" />
    );
  }

  const hasFlatrate = providers?.flatrate?.length > 0;
  const hasBuy      = providers?.buy?.length > 0;
  const hasRent     = providers?.rent?.length > 0;
  const hasAds      = providers?.ads?.length > 0;
  const hasFree     = providers?.free?.length > 0;

  const hasAny = hasFlatrate || hasBuy || hasRent || hasAds || hasFree;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Where to Watch</h3>
          <p className="text-gray-500 text-sm">
            Showing availability in <span className="text-gray-400 font-medium">{region === 'IN' ? '🇮🇳 India' : region === 'US' ? '🇺🇸 USA' : region}</span>
          </p>
        </div>
        {tmdbLink && (
          <a
            href={tmdbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-white transition-colors font-medium"
          >
            Full availability <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {!hasAny ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
          <Tv className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium mb-1">Not available for streaming</p>
          <p className="text-gray-600 text-sm">No streaming data found for your region.</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-7 space-y-2">
          <ProviderSection
            title="Stream"
            providers={providers?.flatrate}
            icon={Tv}
            color="text-green-400"
            tmdbLink={tmdbLink}
          />
          <ProviderSection
            title="Free / Ad-supported"
            providers={[...(providers?.ads || []), ...(providers?.free || [])]}
            icon={Tv}
            color="text-blue-400"
            tmdbLink={tmdbLink}
          />
          <ProviderSection
            title="Buy"
            providers={providers?.buy}
            icon={ShoppingCart}
            color="text-yellow-400"
            tmdbLink={tmdbLink}
          />
          <ProviderSection
            title="Rent"
            providers={providers?.rent}
            icon={ShoppingCart}
            color="text-orange-400"
            tmdbLink={tmdbLink}
          />
        </div>
      )}
    </div>
  );
};

export default WatchProviders;
