'use client';

import { useState } from 'react';
import AddBookmarkForm from './AddBookmarkForm';

export default function AddBookmarkButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="group w-20 h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 rounded-xl md:rounded-2xl border-2 md:border-[3px] border-(--border-default) border-dashed bg-(--bg-secondary) hover:bg-(--color-gray-light) hover:shadow-lg hover:border-(--color-accent) flex items-center justify-center cursor-pointer transition-all duration-300"
      >
        <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-(--text-muted) group-hover:text-(--color-accent) transition-colors">+</span>
      </button>

      {showForm && <AddBookmarkForm onClose={() => setShowForm(false)} />}
    </>
  );
}
