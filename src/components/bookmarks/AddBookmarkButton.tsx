'use client';

import { useState } from 'react';
import AddBookmarkForm from './AddBookmarkForm';

export default function AddBookmarkButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="group w-30 h-30 rounded-2xl border-[3px] border-(--border-default) border-dashed bg-(--bg-secondary) hover:bg-(--color-gray-light) hover:shadow-lg hover:border-(--color-accent) flex items-center justify-center cursor-pointer transition-all duration-300"
      >
        <span className="text-4xl font-bold text-(--text-muted) group-hover:text-(--color-accent) transition-colors">+</span>
      </button>

      {showForm && <AddBookmarkForm onClose={() => setShowForm(false)} />}
    </>
  );
}
