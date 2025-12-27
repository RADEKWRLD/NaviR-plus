'use client';

import { useBookmarks } from '@/context/BookmarkContext';
import BookmarkItem from './BookmarkItem';
import AddBookmarkButton from './AddBookmarkButton';

export default function BookmarkGrid() {
  const { bookmarks } = useBookmarks();

  const sortedBookmarks = [...bookmarks].sort((a, b) => a.position - b.position);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-h-full overflow-y-auto">
        <div className="grid grid-cols-5 gap-30">
          {sortedBookmarks.map((bookmark) => (
            <div key={bookmark.id}>
              <BookmarkItem bookmark={bookmark} />
            </div>
          ))}
          <div>
            <AddBookmarkButton />
          </div>
        </div>
      </div>
    </div>
  );
}
