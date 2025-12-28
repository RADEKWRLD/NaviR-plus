'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bookmark } from '@/types/bookmark';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'position'>) => void;
  deleteBookmark: (id: string) => void;
  reorderBookmarks: (activeId: string, overId: string) => void;
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

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // 从 localStorage 加载数据
  useEffect(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks(DEFAULT_BOOKMARKS);
      }
    } else {
      setBookmarks(DEFAULT_BOOKMARKS);
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (data: Omit<Bookmark, 'id' | 'createdAt' | 'position'>) => {
    const newBookmark: Bookmark = {
      ...data,
      id: `bm-${Date.now()}`,
      position: bookmarks.length,
      createdAt: new Date().toISOString(),
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const reorderBookmarks = (activeId: string, overId: string) => {
    setBookmarks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === activeId);
      const newIndex = prev.findIndex((b) => b.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newBookmarks = [...prev];
      const [movedItem] = newBookmarks.splice(oldIndex, 1);
      newBookmarks.splice(newIndex, 0, movedItem);

      return newBookmarks.map((bookmark, index) => ({
        ...bookmark,
        position: index,
      }));
    });
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, deleteBookmark, reorderBookmarks }}>
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
