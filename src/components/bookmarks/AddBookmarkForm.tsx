"use client";

import { useState } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import { Bookmark } from "@/types/bookmark";

interface BookmarkFormProps {
  onClose: () => void;
  editBookmark?: Bookmark;
}

export default function BookmarkForm({ onClose, editBookmark }: BookmarkFormProps) {
  const { addBookmark, updateBookmark } = useBookmarks();
  const [title, setTitle] = useState(editBookmark?.title || "");
  const [url, setUrl] = useState(editBookmark?.url || "");
  const isEditMode = !!editBookmark;
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);

  const fetchSiteTitle = async (inputUrl: string) => {
    if (!inputUrl || title) return;

    try {
      const urlObj = new URL(inputUrl);
      setIsFetchingTitle(true);

      const response = await fetch(
        `/api/fetch-title?url=${encodeURIComponent(urlObj.href)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.title && !title) {
          setTitle(data.title);
        }
      }
    } catch {
      // URL 无效或请求失败，使用域名作为默认标题
      try {
        const urlObj = new URL(inputUrl);
        if (!title) {
          setTitle(urlObj.hostname.replace("www.", ""));
        }
      } catch {
        // 忽略
      }
    } finally {
      setIsFetchingTitle(false);
    }
  };

  const handleUrlBlur = () => {
    if (url && !title) {
      fetchSiteTitle(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      if (isEditMode && editBookmark) {
        updateBookmark(editBookmark.id, { title, url });
      } else {
        addBookmark({ title, url });
      }
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center"
      style={{ zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        className="bg-white border-[3px]  border-black  w-full max-w-md"
        style={{ padding: "20px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-2xl font-bold mb-8 uppercase"
          style={{ fontFamily: "var(--font-oxanium)" }}
        >
          {isEditMode ? "Edit Bookmark" : "Add Bookmark"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-2 text-sm font-bold uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Title{" "}
                {isFetchingTitle && (
                  <span className="text-gray-400 normal-case">
                    (fetching...)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isFetchingTitle ? "Loading..." : "My Website"}
                required
                className="w-full px-4 py-3 border-[3px] border-black bg-white text-lg font-bold focus:outline-none focus:border-[#FF6B35] transition-colors"
                style={{ fontFamily: "var(--font-oxanium)" }}
              />
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-bold uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                required
                className="w-full px-4 py-3 border-[3px] border-black bg-white text-lg font-bold focus:outline-none focus:border-[#FF6B35] transition-colors"
                style={{ fontFamily: "var(--font-oxanium)" }}
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                className="flex-1 h-10 py-3 px-6 bg-[#FF6B35] hover:bg-[#E85A2B] text-white font-bold uppercase border-[3px] border-black transition-colors"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                {isEditMode ? "Save" : "Add"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 h-10 bg-white hover:bg-gray-50 text-black font-bold uppercase border-[3px] border-black transition-colors"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
