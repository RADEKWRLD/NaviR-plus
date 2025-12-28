'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useBookmarks } from '@/context/BookmarkContext';
import SortableBookmarkItem from './SortableBookmarkItem';
import DragOverlayBookmark from './DragOverlayBookmark';
import AddBookmarkButton from './AddBookmarkButton';
import { Bookmark } from '@/types/bookmark';

export default function BookmarkGrid() {
  const { bookmarks, reorderBookmarks } = useBookmarks();
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const sortedBookmarks = [...bookmarks].sort((a, b) => a.position - b.position);
  const bookmarkIds = sortedBookmarks.map((b) => b.id);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const bookmark = bookmarks.find((b) => b.id === active.id);
    if (bookmark) {
      setActiveBookmark(bookmark);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveBookmark(null);

    if (over && active.id !== over.id) {
      reorderBookmarks(active.id as string, over.id as string);
    }
  };

  const handleDragCancel = () => {
    setActiveBookmark(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="max-h-full overflow-y-auto" style={{ padding: '16px' }}>
          <SortableContext items={bookmarkIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-16">
              {sortedBookmarks.map((bookmark) => (
                <SortableBookmarkItem key={bookmark.id} bookmark={bookmark} />
              ))}
              <div>
                <AddBookmarkButton />
              </div>
            </div>
          </SortableContext>
        </div>
      </div>

      <DragOverlay adjustScale={false}>
        {activeBookmark ? (
          <DragOverlayBookmark bookmark={activeBookmark} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
