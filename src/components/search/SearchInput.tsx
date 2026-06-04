'use client';

import { useState, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';
import SearchEngineSwitcher from './SearchEngineSwitcher';
import { SEARCH_ENGINES } from '@/lib/constants/searchEngines';
import { useSettings } from '@/context/SettingsContext';

export default function SearchInput() {
  const { settings } = useSettings();
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(() => {
    const defaultEngine = SEARCH_ENGINES.find(
      (e) => e.id === settings.search.defaultEngine
    );
    return defaultEngine || SEARCH_ENGINES[0];
  });
  const [isFocused, setIsFocused] = useState(false);
  const leftBracketRef = useRef<HTMLDivElement>(null);
  const rightBracketRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchUrl = selectedEngine.searchUrl.replace('{query}', encodeURIComponent(query));
    if (settings.search.openInNewTab) {
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = searchUrl;
    }
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

  const variant = settings.appearance.uiVariant;
  const variantClass = `ui-search-${variant}`;

  return (
    <div className="relative w-[90vw] md:w-[70vw] lg:w-[50vw] flex items-center gap-2 md:gap-4">
      {/* Left bracket - appears on focus（wrapper 负责竖直居中，不参与 GSAP 动画） */}
      <div className="hidden md:flex items-center justify-center h-14 md:h-16 lg:h-20 shrink-0">
        <div
          ref={leftBracketRef}
          className="relative -top-[0.08em] text-4xl md:text-6xl lg:text-8xl font-bold leading-none"
          style={{
            opacity: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'right',
            willChange: 'transform, opacity',
            fontFamily: 'var(--ui-font)',
          }}
        >
          (
        </div>
      </div>

      {/* Search container - single thick border rectangle */}
      <div className={`relative border-[3px] border-(--border-default) bg-(--bg-main) flex items-stretch flex-1 ${variantClass}`}>
        {/* Left side - Engine switcher (square) */}
        <div className="ui-search-engine shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 border-r-[3px] border-(--border-default) flex items-center justify-center bg-(--bg-secondary)">
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
          className="ui-search-input flex-1 px-4 md:px-6 lg:px-8 text-base md:text-xl lg:text-2xl font-bold bg-transparent border-none outline-none uppercase tracking-wide text-center"
          style={{ fontFamily: 'var(--ui-font)' }}
        />

        {/* Right side - Search button (square) */}
        <button
          onClick={handleSearch}
          className="ui-search-button shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-(--color-accent) hover:bg-(--color-accent-hover) transition-colors flex items-center justify-center border-l-[3px] border-(--border-default)"
          aria-label="Search"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* Right bracket - appears on focus（wrapper 负责竖直居中，不参与 GSAP 动画） */}
      <div className="hidden md:flex items-center justify-center h-14 md:h-16 lg:h-20 shrink-0">
        <div
          ref={rightBracketRef}
          className="relative -top-[0.08em] text-4xl md:text-6xl lg:text-8xl font-bold leading-none"
          style={{
            opacity: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            willChange: 'transform, opacity',
            fontFamily: 'var(--ui-font)',
          }}
        >
          )
        </div>
      </div>
    </div>
  );
}
