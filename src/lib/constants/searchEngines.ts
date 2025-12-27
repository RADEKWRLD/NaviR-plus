import type { SearchEngine } from '@/types/search.types';

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'google',
    searchUrl: 'https://www.google.com/search?q={query}',
    color: '#4285F4'
  },
  {
    id: 'bing',
    name: 'Bing',
    icon: 'bing',
    searchUrl: 'https://www.bing.com/search?q={query}',
    color: '#008373'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    icon: 'duckduckgo',
    searchUrl: 'https://duckduckgo.com/?q={query}',
    color: '#DE5833'
  }
];
