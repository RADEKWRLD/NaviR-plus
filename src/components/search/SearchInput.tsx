'use client';

import { useState, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';
import SearchEngineSwitcher from './SearchEngineSwitcher';
import { SEARCH_ENGINES } from '@/lib/constants/searchEngines';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(SEARCH_ENGINES[0]);
  const [isFocused, setIsFocused] = useState(false);
  const leftBracketRef = useRef<HTMLDivElement>(null);
  const rightBracketRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchUrl = selectedEngine.searchUrl.replace('{query}', encodeURIComponent(query));
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Animate brackets appearing
    if (leftBracketRef.current && rightBracketRef.current) {
      gsap.fromTo([leftBracketRef.current, rightBracketRef.current],
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'expo.out'
        }
      );
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Animate brackets disappearing
    if (leftBracketRef.current && rightBracketRef.current) {
      gsap.to([leftBracketRef.current, rightBracketRef.current],
        {
          scaleX: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }
      );
    }
  };

  return (
    <div className="relative w-[50vw] flex items-center gap-4">
      {/* Left bracket - appears on focus */}
      <div
        ref={leftBracketRef}
        className="text-8xl font-bold leading-none"
        style={{
          opacity: 0,
          transform: 'scaleX(0)',
          transformOrigin: 'right',
          willChange: 'transform, opacity'
        }}
      >
        (
      </div>

      {/* Search container - single thick border rectangle */}
      <div className="relative border-[3px] border-black bg-white flex items-stretch flex-1">
        {/* Left side - Engine switcher (square) */}
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
          className="flex-1 px-8 text-2xl font-bold bg-transparent border-none outline-none placeholder-[#999999] uppercase tracking-wide text-center"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        />

        {/* Right side - Search button (square) */}
        <button
          onClick={handleSearch}
          className="shrink-0 w-20 h-20 bg-[#FF6B35] hover:bg-[#E85A2B] transition-colors flex items-center justify-center border-l-[3px] border-black"
          aria-label="Search"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* Right bracket - appears on focus */}
      <div
        ref={rightBracketRef}
        className="text-8xl font-bold leading-none"
        style={{
          opacity: 0,
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          willChange: 'transform, opacity'
        }}
      >
        )
      </div>
    </div>
  );
}
