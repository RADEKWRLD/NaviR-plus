'use client';

import { useState, useCallback } from 'react';
import type { SearchEngine } from '@/types/search.types';
import { SEARCH_ENGINES } from '@/lib/constants/searchEngines';

/**
 * Hook to manage search engine state and search functionality
 */
export const useSearchEngine = () => {
  const [currentEngine, setCurrentEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    const searchUrl = currentEngine.searchUrl.replace('{query}', encodeURIComponent(query));
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  }, [currentEngine]);

  return {
    currentEngine,
    setCurrentEngine,
    handleSearch,
    allEngines: SEARCH_ENGINES
  };
};
