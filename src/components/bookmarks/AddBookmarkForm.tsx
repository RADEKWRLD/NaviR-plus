'use client';

import { useState } from 'react';
import { useBookmarks } from '@/context/BookmarkContext';

interface AddBookmarkFormProps {
  onClose: () => void;
}

export default function AddBookmarkForm({ onClose }: AddBookmarkFormProps) {
  const { addBookmark } = useBookmarks();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      addBookmark({ title, url });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-60 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white border-[3px] p-18 border-black rounded-4xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 uppercase" style={{ fontFamily: 'var(--font-oxanium)' }}>
          Add Bookmark
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-bold uppercase" style={{ fontFamily: 'var(--font-oxanium)' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Website"
              required
              className="w-full px-4 py-3 border-[3px] border-black bg-white text-lg font-bold focus:outline-none focus:border-[#FF6B35] transition-colors"
              style={{ fontFamily: 'var(--font-oxanium)' }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold uppercase" style={{ fontFamily: 'var(--font-oxanium)' }}>
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-3 border-[3px] border-black bg-white text-lg font-bold focus:outline-none focus:border-[#FF6B35] transition-colors"
              style={{ fontFamily: 'var(--font-oxanium)' }}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-[#FF6B35] hover:bg-[#E85A2B] text-white font-bold uppercase border-[3px] border-black transition-colors"
              style={{ fontFamily: 'var(--font-oxanium)' }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-white hover:bg-gray-50 text-black font-bold uppercase border-[3px] border-black transition-colors"
              style={{ fontFamily: 'var(--font-oxanium)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
