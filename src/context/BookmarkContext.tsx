'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Bookmark } from '@/types/bookmark';
import { trpc } from '@/lib/trpc/client';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'position'>) => void;
  updateBookmark: (id: string, data: Partial<Pick<Bookmark, 'title' | 'url'>>) => void;
  deleteBookmark: (id: string) => void;
  reorderBookmarks: (activeId: string, overId: string) => void;
  isSyncing: boolean;
  syncError: string | null;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const BOOKMARKS_KEY = 'navir_bookmarks';

const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'default-1',
    title: '哔哩哔哩',
    url: 'https://www.bilibili.com',
    position: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-2',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    position: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-3',
    title: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    position: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-4',
    title: '网易云音乐',
    url: 'https://music.163.com',
    position: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-5',
    title: 'GitHub',
    url: 'https://github.com',
    position: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-6',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    position: 5,
    createdAt: new Date().toISOString(),
  },
];

function getLocalBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKMARKS;

  const saved = localStorage.getItem(BOOKMARKS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as Bookmark[];
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  }
  return DEFAULT_BOOKMARKS;
}

function saveLocalBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(getLocalBookmarks);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const hasSyncedRef = useRef(false);

  // tRPC mutations
  const syncAllMutation = trpc.bookmark.syncAll.useMutation();
  const createMutation = trpc.bookmark.create.useMutation();
  const updateMutation = trpc.bookmark.update.useMutation();
  const deleteMutation = trpc.bookmark.delete.useMutation();
  const reorderMutation = trpc.bookmark.reorder.useMutation();

  // tRPC query for fetching bookmarks
  const { refetch: refetchBookmarks } = trpc.bookmark.list.useQuery(undefined, {
    enabled: false, // 手动触发
  });

  // 判断是否已登录
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // 登录时同步: 从云端拉取数据
  useEffect(() => {
    if (isAuthenticated && !hasSyncedRef.current) {
      const syncOnLogin = async () => {
        setIsSyncing(true);
        setSyncError(null);
        hasSyncedRef.current = true;

        try {
          // 从云端获取书签数据
          const result = await refetchBookmarks();
          if (result.data && result.data.length > 0) {
            // 云端有数据，使用云端数据
            setBookmarks(result.data);
            saveLocalBookmarks(result.data);
          } else {
            // 云端没有数据，将本地数据上传到云端
            const localBookmarks = getLocalBookmarks();
            if (localBookmarks.length > 0) {
              await syncAllMutation.mutateAsync(
                localBookmarks.map((b) => ({
                  clientId: b.id,
                  title: b.title,
                  url: b.url,
                  position: b.position,
                  createdAt: b.createdAt,
                }))
              );
            }
          }
        } catch (error) {
          console.error('Sync on login failed:', error);
          setSyncError('同步失败，将使用本地数据');
        } finally {
          setIsSyncing(false);
        }
      };

      syncOnLogin();
    }
  }, [isAuthenticated, refetchBookmarks, syncAllMutation]);

  // 登出时重置同步状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      hasSyncedRef.current = false;
    }
  }, [status]);

  // 保存到 localStorage (每次书签变化)
  useEffect(() => {
    saveLocalBookmarks(bookmarks);
  }, [bookmarks]);

  // 添加书签
  const addBookmark = useCallback(
    (data: Omit<Bookmark, 'id' | 'createdAt' | 'position'>) => {
      const newBookmark: Bookmark = {
        ...data,
        id: `bm-${Date.now()}`,
        position: bookmarks.length,
        createdAt: new Date().toISOString(),
      };

      // 立即更新本地状态
      setBookmarks((prev) => [...prev, newBookmark]);

      // 如果已登录，同步到云端
      if (isAuthenticated) {
        createMutation.mutate(
          {
            clientId: newBookmark.id,
            title: newBookmark.title,
            url: newBookmark.url,
            position: newBookmark.position,
            createdAt: newBookmark.createdAt,
          },
          {
            onError: (error) => {
              console.error('Failed to sync new bookmark:', error);
              setSyncError('添加书签同步失败');
            },
          }
        );
      }
    },
    [bookmarks.length, isAuthenticated, createMutation]
  );

  // 更新书签
  const updateBookmark = useCallback(
    (id: string, data: Partial<Pick<Bookmark, 'title' | 'url'>>) => {
      setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));

      if (isAuthenticated) {
        updateMutation.mutate(
          {
            clientId: id,
            ...data,
          },
          {
            onError: (error) => {
              console.error('Failed to sync bookmark update:', error);
              setSyncError('更新书签同步失败');
            },
          }
        );
      }
    },
    [isAuthenticated, updateMutation]
  );

  // 删除书签
  const deleteBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));

      if (isAuthenticated) {
        deleteMutation.mutate(
          { clientId: id },
          {
            onError: (error) => {
              console.error('Failed to sync bookmark deletion:', error);
              setSyncError('删除书签同步失败');
            },
          }
        );
      }
    },
    [isAuthenticated, deleteMutation]
  );

  // 重新排序书签
  const reorderBookmarks = useCallback(
    (activeId: string, overId: string) => {
      setBookmarks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === activeId);
        const newIndex = prev.findIndex((b) => b.id === overId);

        if (oldIndex === -1 || newIndex === -1) return prev;

        const newBookmarks = [...prev];
        const [movedItem] = newBookmarks.splice(oldIndex, 1);
        newBookmarks.splice(newIndex, 0, movedItem);

        const reorderedBookmarks = newBookmarks.map((bookmark, index) => ({
          ...bookmark,
          position: index,
        }));

        // 如果已登录，同步到云端
        if (isAuthenticated) {
          reorderMutation.mutate(
            reorderedBookmarks.map((b) => ({
              clientId: b.id,
              position: b.position,
            })),
            {
              onError: (error) => {
                console.error('Failed to sync bookmark reorder:', error);
                setSyncError('排序同步失败');
              },
            }
          );
        }

        return reorderedBookmarks;
      });
    },
    [isAuthenticated, reorderMutation]
  );

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        reorderBookmarks,
        isSyncing,
        syncError,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return context;
}
