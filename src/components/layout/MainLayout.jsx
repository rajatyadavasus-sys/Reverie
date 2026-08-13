import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <footer className="mt-24 py-12 border-t border-white/5">
        <div className="container mx-auto px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Reverie. Feel Movies. Not Ratings.
          </p>
          <p className="text-gray-500 text-sm">
            Powered by TMDB
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
