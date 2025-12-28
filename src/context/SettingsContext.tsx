'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type {
  Settings,
  AppearanceSettings,
  SearchSettings,
  BookmarkSettings,
  SettingsContextType,
  Theme,
  ColorScheme,
} from '@/types/settings';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '@/lib/settings/defaults';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function getStoredSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // 深度合并，确保所有字段都存在
      return {
        appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
        search: { ...DEFAULT_SETTINGS.search, ...parsed.search },
        bookmarks: { ...DEFAULT_SETTINGS.bookmarks, ...parsed.bookmarks },
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

// 应用主题到 CSS 变量
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// 应用配色方案
function applyColorScheme(scheme: ColorScheme) {
  document.documentElement.setAttribute('data-color-scheme', scheme);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化加载设置
  useEffect(() => {
    const stored = getStoredSettings();
    setSettings(stored);
    applyTheme(stored.appearance.theme);
    applyColorScheme(stored.appearance.colorScheme);
    setIsLoading(false);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (settings.appearance.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.appearance.theme]);

  const updateAppearance = useCallback((updates: Partial<AppearanceSettings>) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        appearance: { ...prev.appearance, ...updates },
      };
      saveSettings(newSettings);

      // 如果更新了主题，立即应用
      if (updates.theme) {
        applyTheme(updates.theme);
      }

      // 如果更新了配色，立即应用
      if (updates.colorScheme) {
        applyColorScheme(updates.colorScheme);
      }

      return newSettings;
    });
  }, []);

  const updateSearch = useCallback((updates: Partial<SearchSettings>) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        search: { ...prev.search, ...updates },
      };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const updateBookmarks = useCallback((updates: Partial<BookmarkSettings>) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        bookmarks: { ...prev.bookmarks, ...updates },
      };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.appearance.theme);
    applyColorScheme(DEFAULT_SETTINGS.appearance.colorScheme);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateAppearance,
        updateSearch,
        updateBookmarks,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
