'use client';

import { useState } from 'react';
import BookmarkForm from '@/components/bookmarks/AddBookmarkForm';

export default function AddRecentLinkButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Add quick link"
        onClick={() => setShowForm(true)}
        className="w-14 h-14 md:w-16 md:h-16 border-2 border-dashed border-black/40 bg-white/40 flex items-center justify-center cursor-pointer"
      >
        <span className="text-2xl md:text-3xl font-light leading-none text-black/40">
          +
        </span>
      </button>

      {showForm && (
        <BookmarkForm createPinnedToHome onClose={() => setShowForm(false)} />
      )}
    </>
  );
}
