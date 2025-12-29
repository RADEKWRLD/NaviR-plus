'use client';

import { useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Bookmark } from '@/types/bookmark';
import { useBookmarks } from '@/context/BookmarkContext';
import { useSettings } from '@/context/SettingsContext';
import BookmarkContextMenu from './BookmarkContextMenu';
import FaviconImage from '@/components/common/FaviconImage';

interface BookmarkItemProps {
  bookmark: Bookmark;
  isDragging?: boolean;
}

export default function BookmarkItem({ bookmark, isDragging = false }: BookmarkItemProps) {
  const { deleteBookmark } = useBookmarks();
  const { settings } = useSettings();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleDelete = () => {
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 0,
        opacity: 0,
        rotation: 15,
        duration: 0.3,
        ease: 'back.in(2)',
        onComplete: () => {
          deleteBookmark(bookmark.id);
        },
      });
    } else {
      deleteBookmark(bookmark.id);
    }
    setContextMenu(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || isLongPress.current) {
      e.preventDefault();
      isLongPress.current = false;
      return;
    }
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // 移动端长按处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    isLongPress.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setContextMenu({ x: touch.clientX, y: touch.clientY });
    }, 500); // 500ms 长按
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    // 移动时取消长按
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return (
    <>
      <div
        ref={itemRef}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className={`
          relative w-20 h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 border-2 md:border-[3px] rounded-xl md:rounded-2xl border-black bg-white
          flex flex-col items-center justify-center
          hover:bg-[#f5f5f5] hover:shadow-lg hover:border-(--color-accent)
          transition-all duration-300 select-none
          ${isDragging ? 'shadow-2xl scale-105 border-(--color-accent) cursor-grabbing' : 'cursor-grab'}
        `}
      >
        <FaviconImage
          url={bookmark.url}
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain pointer-events-none"
        />

        {settings.bookmarks.showTitle && (
          <span
            className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-center text-black truncate w-full px-1 md:px-2 pointer-events-none"
            style={{ fontFamily: 'var(--font-oxanium)' }}
          >
            {bookmark.title}
          </span>
        )}
      </div>

      {contextMenu && (
        <BookmarkContextMenu
          bookmark={bookmark}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
