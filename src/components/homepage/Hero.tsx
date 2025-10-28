'use client';

import { SearchBar } from './SearchBar';

export function Hero() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Logo/Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-nebula to-cyan-star rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <svg
              className="w-16 h-16 text-white -rotate-12 hover:rotate-0 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-violet-nebula via-purple-400 to-cyan-star bg-clip-text text-transparent">
          ToolGalaxyHub
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-slate-300 mb-3">
          Your Universe of Free Online Tools
        </p>
        <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          100+ browser-based utilities for files, images, text, code, and more.
          <span className="text-cyan-star font-semibold"> No login. No limits. 100% free forever.</span>
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <SearchBar autoFocus={false} />
        </div>

        {/* Stats */}
        <div className="mt-12 flex justify-center gap-8 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-star">115+</div>
            <div className="text-sm text-slate-400">Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-nebula">8</div>
            <div className="text-sm text-slate-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">100%</div>
            <div className="text-sm text-slate-400">Free</div>
          </div>
        </div>
      </div>
    </section>
  );
}
