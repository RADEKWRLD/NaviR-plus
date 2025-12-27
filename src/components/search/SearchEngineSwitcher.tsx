'use client';

import { useState } from 'react';
import type { SearchEngine } from '@/types/search.types';
import EngineIcon from './EngineIcon';
import EngineDropdown from './EngineDropdown';

interface SearchEngineSwitcherProps {
  engines: SearchEngine[];
  currentEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
}

export default function SearchEngineSwitcher({ engines, currentEngine, onEngineChange }: SearchEngineSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-full flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-2xl border-r border-gray-200"
        aria-label="Select search engine"
      >
        <div className="flex items-center gap-1">
          <EngineIcon engine={currentEngine.icon} size={20} />
          <svg
            className="w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <EngineDropdown
          engines={engines}
          currentEngine={currentEngine}
          onSelect={onEngineChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
