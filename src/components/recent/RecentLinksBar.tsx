'use client';

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBookmarks } from '@/context/BookmarkContext';
import { useSettings } from '@/context/SettingsContext';
import RecentLinkTile from './RecentLinkTile';
import AddRecentLinkButton from './AddRecentLinkButton';

export default function RecentLinksBar() {
  const { settings } = useSettings();
  const { bookmarks, reorderBookmarks } = useBookmarks();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // 开关关闭时不渲染
  if (!settings.appearance.showRecentLinks) return null;

  const pinned = bookmarks
    .filter((b) => b.pinnedToHome)
    .sort((a, b) => a.position - b.position);
  const pinnedIds = pinned.map((b) => b.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBookmarks(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-wrap items-start justify-center gap-3 md:gap-4 max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw]">
        <SortableContext items={pinnedIds} strategy={horizontalListSortingStrategy}>
          {pinned.map((bookmark) => (
            <RecentLinkTile key={bookmark.id} bookmark={bookmark} />
          ))}
        </SortableContext>
        <AddRecentLinkButton />
      </div>
    </DndContext>
  );
}
