'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap/config';
import { useSearchEngine } from '@/hooks/useSearchEngine';
import SearchEngineSwitcher from './SearchEngineSwitcher';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentEngine, setCurrentEngine, handleSearch, allEngines } = useSearchEngine();

  useEffect(() => {
    if (!containerRef.current) return;

    if (isFocused) {
      gsap.to(containerRef.current, {
        borderColor: 'var(--border-focus)',
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'expo.out'
      });
    } else {
      gsap.to(containerRef.current, {
        borderColor: 'var(--border-default)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        duration: 0.3,
        ease: 'expo.out'
      });
    }
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div
        ref={containerRef}
        className="flex items-center bg-white rounded-2xl transition-all overflow-hidden"
        style={{
          border: '1px solid var(--border-default)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          height: '56px'
        }}
      >
        {/* Engine Switcher */}
        <SearchEngineSwitcher
          engines={allEngines}
          currentEngine={currentEngine}
          onEngineChange={setCurrentEngine}
        />

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search the web..."
          className="flex-1 h-full px-4 outline-none text-base text-gray-900 placeholder-gray-400"
          style={{
            fontFamily: 'inherit'
          }}
        />

        {/* Search Button */}
        {query && (
          <button
            type="submit"
            className="h-full px-6 text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
