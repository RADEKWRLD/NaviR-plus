'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Bookmark } from '@/types/bookmark';
import { useBookmarks } from '@/context/BookmarkContext';
import BookmarkContextMenu from './BookmarkContextMenu';

interface BookmarkItemProps {
  bookmark: Bookmark;
  isDragging?: boolean;
}

export default function BookmarkItem({ bookmark, isDragging = false }: BookmarkItemProps) {
  const { deleteBookmark } = useBookmarks();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

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
    if (isDragging) {
      e.preventDefault();
      return;
    }
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  return (
    <>
      <div
        ref={itemRef}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`
          relative w-30 h-30 border-[3px] rounded-2xl border-black bg-white
          flex flex-col items-center justify-center
          hover:bg-gray-50 hover:shadow-lg hover:border-[#FF6B35]
          transition-all duration-300
          ${isDragging ? 'shadow-2xl scale-105 border-[#FF6B35] cursor-grabbing' : 'cursor-grab'}
        `}
      >
        <img
          src={getFaviconUrl(bookmark.url)}
          alt=""
          className="w-12 h-12 object-contain pointer-events-none"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        <span
          className="mt-2 text-xs font-bold text-center truncate w-full px-2 pointer-events-none"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        >
          {bookmark.title}
        </span>
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
