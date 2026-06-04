'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bookmark } from '@/types/bookmark';
import { useSettings } from '@/context/SettingsContext';
import FaviconImage from '@/components/common/FaviconImage';

interface RecentLinkTileProps {
  bookmark: Bookmark;
}

export default function RecentLinkTile({ bookmark }: RecentLinkTileProps) {
  const { settings } = useSettings();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto' as const,
  };

  const handleClick = () => {
    if (isDragging) return;
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center gap-1.5 w-14 md:w-16">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className={`
          relative w-14 h-14 md:w-16 md:h-16 border-2 border-black bg-white
          flex items-center justify-center select-none
          ${isDragging ? 'cursor-grabbing shadow-[3px_3px_0_0_rgba(0,0,0,1)]' : 'cursor-grab'}
        `}
      >
        <FaviconImage
          url={bookmark.url}
          customIconUrl={bookmark.iconUrl ?? undefined}
          className="w-7 h-7 md:w-8 md:h-8 object-contain pointer-events-none"
        />
      </div>

      {settings.bookmarks.showTitle && (
        <span
          className="text-[10px] leading-tight font-bold text-center truncate w-full text-(--text-primary) pointer-events-none"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        >
          {bookmark.title}
        </span>
      )}
    </div>
  );
}
