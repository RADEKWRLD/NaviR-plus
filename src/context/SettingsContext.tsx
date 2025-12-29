'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
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
import { trpc } from '@/lib/trpc/client';

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

// 初始化时直接从 localStorage 获取设置
// 注意：主题已在 layout.tsx 的内联脚本中应用，这里只返回设置值
function getInitialSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  return getStoredSettings();
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  // 使用函数初始化，直接从 localStorage 读取，无需 useEffect
  const [settings, setSettings] = useState<Settings>(getInitialSettings);
  // 初始化完成后就不再 loading
  const [isLoading] = useState(false);
  const hasSyncedRef = useRef(false);

  // tRPC
  const saveMutation = trpc.settings.save.useMutation();
  const { refetch: refetchSettings } = trpc.settings.get.useQuery(undefined, {
    enabled: false, // 手动触发
  });

  // 使用 ref 保存 mutation，避免依赖问题
  const saveMutationRef = useRef(saveMutation);
  const refetchSettingsRef = useRef(refetchSettings);

  // 保持 ref 与最新值同步（在 effect 中更新）
  useEffect(() => {
    saveMutationRef.current = saveMutation;
    refetchSettingsRef.current = refetchSettings;
  });

  // 判断是否已登录
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // 登录时同步: 从云端拉取数据 (云端优先)
  useEffect(() => {
    if (isAuthenticated && !hasSyncedRef.current) {
      const syncOnLogin = async () => {
        hasSyncedRef.current = true;

        try {
          const result = await refetchSettingsRef.current();
          if (result.data) {
            // 云端有数据，使用云端数据覆盖本地
            setSettings(result.data);
            saveSettings(result.data);
            applyTheme(result.data.appearance.theme);
            applyColorScheme(result.data.appearance.colorScheme);
          } else {
            // 云端没有数据，将本地数据上传到云端
            const localSettings = getStoredSettings();
            await saveMutationRef.current.mutateAsync(localSettings);
          }
        } catch (error) {
          console.error('Settings sync on login failed:', error);
        }
      };

      syncOnLogin();
    }
  }, [isAuthenticated]);

  // 登出时重置同步状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      hasSyncedRef.current = false;
    }
  }, [status]);

  // 监听系统主题变化
  useEffect(() => {
    if (settings.appearance.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.appearance.theme]);

  // 同步设置到云端的辅助函数
  const syncToCloud = useCallback(
    (newSettings: Settings) => {
      if (isAuthenticated) {
        saveMutationRef.current.mutate(newSettings, {
          onError: (error) => {
            console.error('Failed to sync settings:', error);
          },
        });
      }
    },
    [isAuthenticated]
  );

  const updateAppearance = useCallback(
    (updates: Partial<AppearanceSettings>) => {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          appearance: { ...prev.appearance, ...updates },
        };
        saveSettings(newSettings);
        syncToCloud(newSettings);

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
    },
    [syncToCloud]
  );

  const updateSearch = useCallback(
    (updates: Partial<SearchSettings>) => {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          search: { ...prev.search, ...updates },
        };
        saveSettings(newSettings);
        syncToCloud(newSettings);
        return newSettings;
      });
    },
    [syncToCloud]
  );

  const updateBookmarks = useCallback(
    (updates: Partial<BookmarkSettings>) => {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          bookmarks: { ...prev.bookmarks, ...updates },
        };
        saveSettings(newSettings);
        syncToCloud(newSettings);
        return newSettings;
      });
    },
    [syncToCloud]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.appearance.theme);
    applyColorScheme(DEFAULT_SETTINGS.appearance.colorScheme);
    syncToCloud(DEFAULT_SETTINGS);
  }, [syncToCloud]);

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
