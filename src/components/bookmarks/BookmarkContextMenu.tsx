"use client";

import { useState } from "react";
import { Bookmark } from "@/types/bookmark";
import BookmarkForm from "./AddBookmarkForm";

interface BookmarkContextMenuProps {
  bookmark: Bookmark;
  position: { x: number; y: number };
  onClose: () => void;
  onDelete: () => void;
}

export default function BookmarkContextMenu({
  bookmark,
  position,
  onClose,
  onDelete,
}: BookmarkContextMenuProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return <BookmarkForm onClose={onClose} editBookmark={bookmark} />;
  }

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 999 }}
      onClick={onClose}
    >
      <div
        className="absolute bg-white border-[3px] border-black shadow-lg"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-120%, -150%)",
          minWidth: "120px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleEdit}
          className="w-full px-6 py-4 text-center font-bold uppercase text-xl  hover:bg-gray-100 transition-colors border-b-2 border-black"
          style={{ fontFamily: "var(--font-oxanium)" }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="w-full px-6 py-4 text-center font-bold uppercase text-xl hover:bg-red-100 text-red-600 transition-colors"
          style={{ fontFamily: "var(--font-oxanium)" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
