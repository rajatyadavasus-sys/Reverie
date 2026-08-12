import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, CloudRain, Heart, Zap, Ghost, Leaf, Aperture, Dices } from 'lucide-react';

const EMOTIONS = [
  { key: 'happy', label: 'Happy & Uplifting', Icon: Smile, color: 'from-yellow-500/20 to-orange-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', desc: 'Comedies & feel-good films' },
  { key: 'sad', label: 'Melancholic', Icon: CloudRain, color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/20', text: 'text-blue-400', desc: 'Emotional dramas' },
  { key: 'romantic', label: 'Romantic', Icon: Heart, color: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/20', text: 'text-pink-400', desc: 'Love stories & romance' },
  { key: 'excited', label: 'Excited', Icon: Zap, color: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/20', text: 'text-orange-400', desc: 'Action & adventure' },
  { key: 'scared', label: 'Thrilled', Icon: Ghost, color: 'from-purple-500/20 to-indigo-500/10', border: 'border-purple-500/20', text: 'text-purple-400', desc: 'Horror & thrillers' },
  { key: 'relaxed', label: 'Relaxed', Icon: Leaf, color: 'from-green-500/20 to-teal-500/10', border: 'border-green-500/20', text: 'text-green-400', desc: 'Documentaries & calm films' },
  { key: 'mind-bending', label: 'Mind-Bending', Icon: Aperture, color: 'from-violet-500/20 to-fuchsia-500/10', border: 'border-violet-500/20', text: 'text-violet-400', desc: 'Sci-fi & mystery' },
];

const Emotions = () => {
  return (
    <div className="container mx-auto px-8 lg:px-16 py-16 min-h-screen">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
          How do you <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-purple-400">want to feel?</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Skip the star ratings. Pick your mood, and we'll find the perfect cinematic experience for you.
        </p>
      </div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {EMOTIONS.map(em => (
          <Link
            key={em.key}
            to={`/emotion/${em.key}`}
            className={`group block bg-[#131824] rounded-[2rem] p-10 border ${em.border} hover:-translate-y-4 hover:rotate-1 hover:scale-105 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] hover:shadow-current relative overflow-hidden z-10 ${em.text}`}
          >
            {/* Ambient Glowing Background that reveals on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${em.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Dynamic Spotlight that follows card */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] bg-current opacity-30 group-hover:opacity-70 group-hover:scale-150 transition-all duration-700`}></div>
            
            <div className="mb-6 relative z-20">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                <em.Icon className={`w-10 h-10 text-white drop-shadow-md group-hover:scale-125 transition-transform duration-500 ease-out`} />
              </div>
            </div>
            <h2 className={`text-3xl font-black mb-3 text-white relative z-20 tracking-tight group-hover:tracking-wide transition-all duration-500`}>{em.label}</h2>
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed relative z-20 group-hover:text-gray-200 transition-colors duration-500">{em.desc}</p>
          </Link>
        ))}

        {/* Bonus Wildcard card */}
        <Link
          to="/explore"
          className="group block bg-[#131824] rounded-[2rem] p-10 border border-white/10 hover:border-gray-400 hover:-translate-y-4 hover:-rotate-1 hover:scale-105 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(255,255,255,0.1)] text-gray-300 relative overflow-hidden z-10"
        >
          {/* Ambient Glowing Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="mb-6 relative z-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Dices className="w-10 h-10 text-white drop-shadow-md group-hover:scale-125 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
            </div>
          </div>
          <h2 className="text-3xl font-black mb-3 text-white relative z-20 tracking-tight group-hover:tracking-wide transition-all duration-500">Surprise Me</h2>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed relative z-20 group-hover:text-gray-200 transition-colors duration-500">No mood? Browse everything and let fate decide.</p>
        </Link>
      </div>
    </div>
  );
};

export default Emotions;
