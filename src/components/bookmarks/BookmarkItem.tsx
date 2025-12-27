'use client';

import { useState } from 'react';
import { Bookmark } from '@/types/bookmark';
import { useBookmarks } from '@/context/BookmarkContext';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

export default function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const { deleteBookmark } = useBookmarks();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this bookmark?')) {
      deleteBookmark(bookmark.id);
    }
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
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-30 h-30 border-[3px] border-black bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
    >
      {isHovered && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-[#FF6B35] transition-colors"
        >
          ✕
        </button>
      )}

      <img
        src={getFaviconUrl(bookmark.url)}
        alt=""
        className="w-12 h-12 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      <span
        className="mt-2 text-xs font-bold text-center truncate w-full px-2"
        style={{ fontFamily: 'var(--font-oxanium)' }}
      >
        {bookmark.title}
      </span>
    </div>
  );
}
