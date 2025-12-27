'use client';

import { useState } from 'react';
import type { SearchEngine } from '@/types/search.types';
import { SEARCH_ENGINES } from '@/lib/constants/searchEngines';
import EngineIcon from './EngineIcon';

interface SearchEngineSwitcherProps {
  selectedEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
}

export default function SearchEngineSwitcher({ selectedEngine, onEngineChange }: SearchEngineSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEngineSelect = (engine: SearchEngine) => {
    onEngineChange(engine);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current engine display - icon with dropdown arrow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 transition-colors rounded"
        type="button"
      >
        <EngineIcon engine={selectedEngine.icon} size={24} />
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu - with icons */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 bg-white border-[3px] border-black z-20 min-w-50">
            {SEARCH_ENGINES.map((engine) => (
              <button
                key={engine.id}
                onClick={() => handleEngineSelect(engine)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[#FF6B35] hover:text-white transition-colors ${
                  selectedEngine.id === engine.id ? 'bg-black text-white' : ''
                }`}
                type="button"
              >
                <EngineIcon engine={engine.icon} size={20} />
                <span className="text-sm font-bold tracking-wider">{engine.name.toUpperCase()}</span>
                {selectedEngine.id === engine.id && (
                  <svg className="ml-auto w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
