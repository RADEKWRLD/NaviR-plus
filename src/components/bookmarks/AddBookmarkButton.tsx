'use client';

import { useState } from 'react';
import AddBookmarkForm from './AddBookmarkForm';

export default function AddBookmarkButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="group w-30 h-30 border-[3px] border-black border-dashed bg-gray-50 hover:bg-gray-100 hover:shadow-lg hover:border-[#FF6B35] flex items-center justify-center cursor-pointer transition-all duration-300"
      >
        <span className="text-4xl font-bold text-gray-400 group-hover:text-[#FF6B35] transition-colors">+</span>
      </button>

      {showForm && <AddBookmarkForm onClose={() => setShowForm(false)} />}
    </>
  );
}
