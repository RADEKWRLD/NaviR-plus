'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bookmark } from '@/types/bookmark';
import BookmarkItem from './BookmarkItem';

interface SortableBookmarkItemProps {
  bookmark: Bookmark;
}

export default function SortableBookmarkItem({ bookmark }: SortableBookmarkItemProps) {
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
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BookmarkItem bookmark={bookmark} isDragging={isDragging} />
    </div>
  );
}
