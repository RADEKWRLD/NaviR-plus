'use client';

import { Bookmark } from '@/types/bookmark';

interface DragOverlayBookmarkProps {
  bookmark: Bookmark;
}

export default function DragOverlayBookmark({ bookmark }: DragOverlayBookmarkProps) {
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
      className="relative w-30 h-30 border-[3px] rounded-2xl border-(--color-accent) bg-(--bg-main)
        flex flex-col items-center justify-center cursor-grabbing
        shadow-2xl rotate-3"
      style={{ transform: 'translate(-100%, -100%) rotate(3deg)' }}
    >
      <img
        src={getFaviconUrl(bookmark.url)}
        alt=""
        className="w-12 h-12 object-contain"
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
