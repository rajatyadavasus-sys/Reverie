import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import { WatchedProvider }   from './context/WatchedContext';
import { ReviewProvider }    from './context/ReviewContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Explore from './pages/Explore';
import Search from './pages/Search';
import EmotionCategory from './pages/EmotionCategory';
import Emotions from './pages/Emotions';
import Watchlist from './pages/Watchlist';
import ActorProfile from './pages/ActorProfile';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
    <p className="text-8xl font-black text-[var(--color-accent)] mb-4">404</p>
    <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
    <p className="text-gray-400">The page you're looking for doesn't exist.</p>
  </div>
);

function App() {
  return (
    <WatchlistProvider>
      <WatchedProvider>
        <ReviewProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="explore" element={<Explore />} />
                <Route path="search" element={<Search />} />
                <Route path="emotions" element={<Emotions />} />
                <Route path="emotion/:emotion" element={<EmotionCategory />} />
                <Route path="watchlist" element={<Watchlist />} />
                <Route path="movie/:id" element={<MovieDetails />} />
                <Route path="tv/:id" element={<MovieDetails />} />
                <Route path="person/:id" element={<ActorProfile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </ReviewProvider>
      </WatchedProvider>
    </WatchlistProvider>
  );
}

export default App;
