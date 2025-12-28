'use client';

import { Bookmark } from '@/types/bookmark';

interface DragOverlayBookmarkProps {
  bookmark: Bookmark;
}

export default function DragOverlayBookmark({ bookmark }: DragOverlayBookmarkProps) {
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://api.freejk.com/gongju/favicon/?url=${urlObj.origin}/`;
    } catch {
      return '';
    }
  };

  return (
    <div
      className="relative w-20 h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 border-2 md:border-[3px] rounded-xl md:rounded-2xl border-(--color-accent) bg-white
        flex flex-col items-center justify-center cursor-grabbing
        shadow-2xl rotate-3"
      style={{ transform: 'translate(-100%, -100%) rotate(3deg)' }}
    >
      <img
        src={getFaviconUrl(bookmark.url)}
        alt=""
        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
      />
      <span
        className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-center text-black truncate w-full px-1 md:px-2"
        style={{ fontFamily: 'var(--font-oxanium)' }}
      >
        {bookmark.title}
      </span>
    </div>
  );
}
