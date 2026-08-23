import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonDetails, getPersonMovieCredits, getPersonTVCredits } from '../services/tmdb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieCard from '../components/common/MovieCard';
import { ChevronLeft, User } from 'lucide-react';

const ActorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('movies');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchActor = async () => {
      try {
        setLoading(true);
        const [details, movieCredits, tvCredits] = await Promise.all([
          getPersonDetails(id),
          getPersonMovieCredits(id),
          getPersonTVCredits(id)
        ]);
        
        setPerson(details);
        
        // Sort credits by popularity and remove those without posters
        const m = movieCredits.cast.filter(c => c.poster_path).sort((a, b) => b.popularity - a.popularity);
        const t = tvCredits.cast.filter(c => c.poster_path).sort((a, b) => b.popularity - a.popularity);
        
        setCredits({ movies: m, tv: t });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActor();
  }, [id]);

  if (loading) return <div className="py-32"><LoadingSpinner /></div>;
  if (!person) return <div className="text-center py-32 text-white">Actor not found.</div>;

  const activeCredits = activeTab === 'movies' ? credits.movies : credits.tv;

  return (
    <div className="container mx-auto px-8 lg:px-16 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/10">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="font-semibold text-sm uppercase tracking-wider">Back</span>
      </button>

      <div className="flex flex-col md:flex-row gap-12 mb-20">
        {/* Profile Image */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-white/5">
            {person.profile_path ? (
              <img 
                src={`/tmdb-images/w780${person.profile_path}`} 
                alt={person.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-24 h-24 text-gray-600" />
              </div>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="flex-1 text-white">
          <h1 className="text-5xl font-black mb-2">{person.name}</h1>
          <p className="text-xl text-[var(--color-accent)] font-medium mb-6">
            {person.known_for_department}
          </p>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 text-sm text-gray-300">
            {person.birthday && (
              <div><span className="text-gray-500 block text-xs uppercase mb-1">Born</span> {person.birthday}</div>
            )}
            {person.place_of_birth && (
              <div><span className="text-gray-500 block text-xs uppercase mb-1">Place of Birth</span> {person.place_of_birth}</div>
            )}
            {person.deathday && (
              <div><span className="text-gray-500 block text-xs uppercase mb-1">Died</span> {person.deathday}</div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-white/10 pb-2 inline-block">Biography</h3>
            <p className="text-gray-400 leading-relaxed max-w-4xl whitespace-pre-line">
              {person.biography || "We don't have a biography for this actor."}
            </p>
          </div>
        </div>
      </div>

      {/* Known For Grid */}
      <div>
        <div className="flex items-center gap-6 mb-10 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold text-white">Known For</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'movies' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Movies ({credits.movies.length})
            </button>
            <button 
              onClick={() => setActiveTab('tv')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'tv' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              TV Shows ({credits.tv.length})
            </button>
          </div>
        </div>

        {activeCredits.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {activeCredits.map(item => (
              <MovieCard key={`${item.id}-${activeTab}`} item={item} mediaType={activeTab === 'movies' ? 'movie' : 'tv'} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No {activeTab} credits found.</p>
        )}
      </div>
    </div>
  );
};

export default ActorProfile;
