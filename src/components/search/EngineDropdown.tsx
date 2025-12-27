'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';
import type { SearchEngine } from '@/types/search.types';
import EngineIcon from './EngineIcon';

interface EngineDropdownProps {
  engines: SearchEngine[];
  currentEngine: SearchEngine;
  onSelect: (engine: SearchEngine) => void;
  onClose: () => void;
}

export default function EngineDropdown({ engines, currentEngine, onSelect, onClose }: EngineDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownRef.current) return;

    const items = dropdownRef.current.querySelectorAll('.engine-item');

    gsap.fromTo(
      dropdownRef.current,
      {
        opacity: 0,
        y: -10
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'expo.out'
      }
    );

    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: -10
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'expo.out'
      }
    );
  }, []);

  const handleSelect = (engine: SearchEngine) => {
    onSelect(engine);
    onClose();
  };

  return (
    <>
      {/* Backdrop to capture outside clicks */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      {/* Dropdown menu */}
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
        style={{ willChange: 'transform, opacity' }}
      >
        {engines.map((engine) => (
          <button
            key={engine.id}
            onClick={() => handleSelect(engine)}
            className={`engine-item w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
              currentEngine.id === engine.id ? 'bg-gray-50' : ''
            }`}
          >
            <EngineIcon engine={engine.icon} size={20} />
            <span className="text-sm font-medium text-gray-900">{engine.name}</span>
            {currentEngine.id === engine.id && (
              <svg className="ml-auto w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
