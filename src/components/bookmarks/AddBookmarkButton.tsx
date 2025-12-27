'use client';

import { useState } from 'react';
import AddBookmarkForm from './AddBookmarkForm';

export default function AddBookmarkButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="w-30 h-30 border-[3px] border-black border-dashed bg-gray-50 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
      >
        <span className="text-4xl font-bold text-gray-400">+</span>
      </button>

      {showForm && <AddBookmarkForm onClose={() => setShowForm(false)} />}
    </>
  );
}
