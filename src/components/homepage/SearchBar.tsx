'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { searchTools } from '@/lib/tools-data';
import { trackEvent } from '@/lib/analytics';
import type { Tool } from '@/types/tool';

interface SearchBarProps {
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ autoFocus = false, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      setSelectedIndex(-1);
      return;
    }

    const searchResults = searchTools(searchQuery);
    setResults(searchResults);
    setShowResults(true);
    setSelectedIndex(-1);

    trackEvent('search', {
      search_term: searchQuery,
      results_count: searchResults.length,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigateToTool(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  const navigateToTool = (tool: Tool) => {
    setShowResults(false);
    setQuery('');
    router.push(`/tools/${tool.slug}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          placeholder="Search for tools (e.g., PDF, JSON, Image)..."
          className="w-full bg-slate-900 border-2 border-cyan-500 rounded-full py-4 pl-14 pr-14 text-white placeholder-slate-400 focus:outline-none focus:border-violet-nebula transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {results.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => navigateToTool(tool)}
              className={`w-full text-left px-6 py-4 hover:bg-slate-800 transition-colors border-b border-slate-700 last:border-b-0 ${
                index === selectedIndex ? 'bg-slate-800' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{tool.name}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">{tool.shortDescription}</p>
                  <span className="inline-block mt-2 text-xs text-cyan-400 font-medium uppercase">
                    {tool.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl p-6 z-50">
          <p className="text-slate-400 text-center">
            No tools found for "{query}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
