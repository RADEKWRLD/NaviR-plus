// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 时钟格式
export type ClockFormat = '12h' | '24h';

// 背景效果类型
export type BackgroundEffect =
  | 'blob'           // 动画 blob
  | 'world-map'      // World Map.svg
  | 'wave'           // wave-haikei.svg
  | 'blob-scatter'   // blob-scatter-haikei.svg
  | 'layered-peaks'  // layered-peaks-haikei.svg
  | 'layered-steps'  // layered-steps-haikei.svg
  | 'none';

// 搜索引擎 ID
export type SearchEngineId =
  | 'google'
  | 'bing'
  | 'baidu'
  | 'bingcn'
  | 'github'
  | 'zhihu'
  | 'bilibili';

// 外观设置
export interface AppearanceSettings {
  theme: Theme;
  backgroundEffect: BackgroundEffect;
  clockFormat: ClockFormat;
}

// 搜索设置
export interface SearchSettings {
  defaultEngine: SearchEngineId;
  openInNewTab: boolean;
}

// 书签设置
export interface BookmarkSettings {
  showTitle: boolean;
}

// 完整设置对象
export interface Settings {
  appearance: AppearanceSettings;
  search: SearchSettings;
  bookmarks: BookmarkSettings;
}

// 设置 Context 类型
export interface SettingsContextType {
  settings: Settings;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
  updateSearch: (updates: Partial<SearchSettings>) => void;
  updateBookmarks: (updates: Partial<BookmarkSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

// 设置分类
export type SettingsCategory =
  | 'appearance'
  | 'search'
  | 'bookmarks'
  | 'account'
  | 'data';
