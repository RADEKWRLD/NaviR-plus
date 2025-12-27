'use client';

import { useState, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';
import SearchEngineSwitcher from './SearchEngineSwitcher';
import { SEARCH_ENGINES } from '@/lib/constants/searchEngines';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(SEARCH_ENGINES[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchUrl = selectedEngine.searchUrl.replace('{query}', encodeURIComponent(query));
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFocus = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        borderColor: 'var(--color-accent)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleBlur = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        borderColor: 'var(--color-black)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div className="relative w-[50vw]">
      {/* Search container - single thick border rectangle */}
      <div
        ref={containerRef}
        className="relative border-[3px] border-black bg-white flex items-stretch"
        style={{
          willChange: 'border-color',
          minHeight: '80px'
        }}
      >
        {/* Left side - Engine switcher*/}
        <div className="shrink-0 w-20 h-20 border-r-[3px] border-black flex items-center justify-center bg-gray-50">
          <SearchEngineSwitcher
            selectedEngine={selectedEngine}
            onEngineChange={setSelectedEngine}
          />
        </div>

        {/* Middle - Input area */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="TYPE YOUR QUERY"
          className="flex-1 px-8 py-6 text-2xl font-bold bg-transparent border-none outline-none placeholder-[#999999] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        />

        {/* Right side - Search button (square) */}
        <button
          onClick={handleSearch}
          className="shrink-0 w-20 h-20 bg-[#0066FF] hover:bg-[#0052CC] transition-colors flex items-center justify-center border-l-[3px] border-black"
          aria-label="Search"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>
    </div>
  );
}
