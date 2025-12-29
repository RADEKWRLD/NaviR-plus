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
    id: 'baidu',
    name: 'Baidu',
    icon: 'baidu',
    searchUrl: 'https://www.baidu.com/s?wd={query}',
    color: '#2932E1'
  },
  {
    id: 'bingcn',
    name: 'BingCN',
    icon: 'bing',
    searchUrl: 'https://cn.bing.com/search?q={query}',
    color: '#008373'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    searchUrl: 'https://github.com/search?q={query}',
    color: '#24292e'
  },
  {
    id: 'zhihu',
    name: 'Zhihu',
    icon: 'zhihu',
    searchUrl: 'https://www.zhihu.com/search?q={query}',
    color: '#0084FF'
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    icon: 'bilibili',
    searchUrl: 'https://search.bilibili.com/all?keyword={query}',
    color: '#00A1D6'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    icon: 'duckduckgo',
    searchUrl: 'https://duckduckgo.com/?q={query}',
    color: '#DE5833'
  },
  {
    id: 'yandex',
    name: 'Yandex',
    icon: 'yandex',
    searchUrl: 'https://yandex.com/search/?text={query}',
    color: '#FF0000'
  }
];
