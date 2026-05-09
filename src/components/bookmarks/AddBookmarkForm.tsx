"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useBookmarks } from "@/context/BookmarkContext";
import { useBlurStyle } from "@/context/SettingsContext";
import { Bookmark } from "@/types/bookmark";
import FaviconImage from "@/components/common/FaviconImage";

interface BookmarkFormProps {
  onClose: () => void;
  editBookmark?: Bookmark;
}

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);
const MAX_SIZE = 512 * 1024;

export default function BookmarkForm({ onClose, editBookmark }: BookmarkFormProps) {
  const { addBookmark, updateBookmark } = useBookmarks();
  const blurStyle = useBlurStyle();
  const [title, setTitle] = useState(editBookmark?.title || "");
  const [url, setUrl] = useState(editBookmark?.url || "");
  const [iconUrl, setIconUrl] = useState(editBookmark?.iconUrl || "");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconError, setIconError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!editBookmark;

  // 本地文件预览：派生 ObjectURL，卸载/换文件时通过 effect 清理
  const filePreviewUrl = useMemo(
    () => (iconFile ? URL.createObjectURL(iconFile) : null),
    [iconFile],
  );
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const fetchSiteTitle = async (inputUrl: string) => {
    if (!inputUrl || title) return;
    try {
      const urlObj = new URL(inputUrl);
      setIsFetchingTitle(true);
      const response = await fetch(
        `/api/fetch-title?url=${encodeURIComponent(urlObj.href)}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.title && !title) setTitle(data.title);
      }
    } catch {
      try {
        const urlObj = new URL(inputUrl);
        if (!title) setTitle(urlObj.hostname.replace("www.", ""));
      } catch {}
    } finally {
      setIsFetchingTitle(false);
    }
  };

  const handleUrlBlur = () => {
    if (url && !title) fetchSiteTitle(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME.has(file.type)) {
      setIconError("Unsupported file type (png/jpg/webp/svg/gif only)");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      setIconError("File too large (max 512 KB)");
      e.target.value = "";
      return;
    }

    setIconFile(file);
    setIconUrl(""); // 文件优先于 URL
  };

  const clearIcon = () => {
    setIconFile(null);
    setIconUrl("");
    setIconError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    let finalIconUrl: string | null = iconUrl.trim() || null;

    if (iconFile) {
      setIsUploading(true);
      setIconError(null);
      try {
        const fd = new FormData();
        fd.append("file", iconFile);
        const res = await fetch("/api/upload-icon", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setIconError(data.error || "Upload failed");
          setIsUploading(false);
          return;
        }
        const data = await res.json();
        finalIconUrl = data.url;
      } catch {
        setIconError("Upload failed");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (isEditMode && editBookmark) {
      updateBookmark(editBookmark.id, { title, url, iconUrl: finalIconUrl });
    } else {
      addBookmark({ title, url, iconUrl: finalIconUrl });
    }
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center"
      style={{ zIndex: 1000, ...blurStyle }}
      onClick={onClose}
    >
      <div
        className="bg-(--bg-main) border-[3px] border-(--border-default) w-full max-w-md"
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
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                required
                className="w-full px-4 py-3 border-[3px] border-(--border-default) bg-(--bg-main) text-(--text-primary) text-lg font-bold focus:outline-none focus:border-(--color-accent) transition-colors"
                style={{ fontFamily: "var(--font-oxanium)" }}
              />
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-bold uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Title{" "}
                {isFetchingTitle && (
                  <span className="text-gray-400 normal-case">(fetching...)</span>
                )}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isFetchingTitle ? "Loading..." : "My Website"}
                required
                className="w-full px-4 py-3 border-[3px] border-(--border-default) bg-(--bg-main) text-(--text-primary) text-lg font-bold focus:outline-none focus:border-(--color-accent) transition-colors"
                style={{ fontFamily: "var(--font-oxanium)" }}
              />
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-bold uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Icon (optional)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-[3px] border-(--border-default) bg-(--bg-main) flex items-center justify-center shrink-0">
                  {filePreviewUrl ? (
                    <img
                      src={filePreviewUrl}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  ) : iconUrl ? (
                    <img src={iconUrl} alt="" className="w-8 h-8 object-contain" />
                  ) : url ? (
                    <FaviconImage url={url} className="w-8 h-8 object-contain" />
                  ) : null}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => {
                      setIconUrl(e.target.value);
                      if (e.target.value) setIconFile(null);
                    }}
                    placeholder="https://… or upload below"
                    disabled={!!iconFile}
                    className="w-full px-3 py-2 border-[3px] border-(--border-default) bg-(--bg-main) text-(--text-primary) text-sm focus:outline-none focus:border-(--color-accent) transition-colors disabled:opacity-50"
                    style={{ fontFamily: "var(--font-oxanium)" }}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-bold uppercase border-[3px] border-(--border-default) hover:bg-(--bg-secondary) transition-colors"
                      style={{ fontFamily: "var(--font-oxanium)" }}
                    >
                      {iconFile ? iconFile.name.slice(0, 18) : "Upload"}
                    </button>
                    {(iconFile || iconUrl) && (
                      <button
                        type="button"
                        onClick={clearIcon}
                        className="px-3 py-1.5 text-xs font-bold uppercase border-[3px] border-(--border-default) hover:bg-(--bg-secondary) transition-colors"
                        style={{ fontFamily: "var(--font-oxanium)" }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {iconError && (
                <p className="mt-2 text-xs text-red-500">{iconError}</p>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 h-10 py-3 px-6 bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-white) font-bold uppercase border-[3px] border-(--border-default) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                {isUploading
                  ? "Uploading..."
                  : isEditMode
                  ? "Save"
                  : "Add"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 py-3 px-6 h-10 bg-(--bg-main) hover:bg-(--bg-secondary) text-(--text-primary) font-bold uppercase border-[3px] border-(--border-default) transition-colors disabled:opacity-50"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
