import React from 'react';
import { User } from 'lucide-react';

const CastSection = ({ cast = [] }) => {
  if (!cast.length) return null;

  const topCast = cast.slice(0, 15);

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-8">Cast</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-5">
        {topCast.map(person => (
          <div key={person.cast_id || person.id} className="group flex flex-col items-center text-center gap-3">
            {/* Avatar */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-[var(--color-accent)]/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            {/* Name & character */}
            <div className="w-full">
              <p className="text-white text-xs font-semibold leading-tight truncate">{person.name}</p>
              <p className="text-gray-500 text-[11px] leading-tight truncate mt-0.5 italic">{person.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastSection;
