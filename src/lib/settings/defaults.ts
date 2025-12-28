import type { Settings } from '@/types/settings';

export const DEFAULT_SETTINGS: Settings = {
  appearance: {
    theme: 'light',
    backgroundEffect: 'blob',
    clockFormat: '24h',
  },
  search: {
    defaultEngine: 'google',
    openInNewTab: true,
  },
  bookmarks: {
    showTitle: true,
  },
};

export const SETTINGS_STORAGE_KEY = 'navir_settings';
