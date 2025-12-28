"use client";

import { useRef, useState } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import { useSettings } from "@/context/SettingsContext";
import SettingsButton from "../controls/SettingsButton";
import type { Bookmark } from "@/types/bookmark";

export default function DataSection() {
  const { bookmarks, addBookmark } = useBookmarks();
  const { resetSettings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // 导出为 JSON
  const exportAsJSON = () => {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      bookmarks: bookmarks,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `navir-bookmarks-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导出为 HTML (Netscape Bookmark File Format)
  const exportAsHTML = () => {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>NaviR Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

    bookmarks.forEach((bookmark) => {
      html += `    <DT><A HREF="${bookmark.url}">${bookmark.title}</A>\n`;
    });

    html += `</DL><p>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `navir-bookmarks-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入书签
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content);
          const importedBookmarks = data.bookmarks || data;

          let count = 0;
          importedBookmarks.forEach(
            (bookmark: Omit<Bookmark, "id" | "position" | "createdAt">) => {
              if (bookmark.title && bookmark.url) {
                addBookmark({ title: bookmark.title, url: bookmark.url });
                count++;
              }
            }
          );

          setImportStatus(`Successfully imported ${count} bookmarks`);
        } else if (file.name.endsWith(".html")) {
          // 解析 HTML 书签文件
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, "text/html");
          const links = doc.querySelectorAll("a");

          let count = 0;
          links.forEach((link) => {
            const title = link.textContent || link.href;
            const url = link.href;
            if (url && url.startsWith("http")) {
              addBookmark({ title, url });
              count++;
            }
          });

          setImportStatus(`Successfully imported ${count} bookmarks`);
        } else {
          setImportStatus("Unsupported file format. Please use JSON or HTML.");
        }
      } catch {
        setImportStatus("Failed to import bookmarks. Invalid file format.");
      }
    };
    reader.readAsText(file);

    // 重置 input 以便再次选择同一文件
    event.target.value = "";
  };

  // 清除本地数据
  const clearLocalData = () => {
    if (
      confirm(
        "Are you sure you want to clear all local data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("navir_bookmarks");
      localStorage.removeItem("navir_settings");
      localStorage.removeItem("navir_user");
      resetSettings();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <h3
        className="text-3xl font-bold uppercase tracking-wide mb-6 text-(--text-primary)"
        style={{ fontFamily: "var(--font-oxanium)" }}
      >
        Data
      </h3>
      <div className="flex flex-col gap-4">
        {/* Export */}
        <div
          className="space-y-4 p-6 border-b-[3px] border-(--border-default)"
          style={{ paddingBottom: "1rem" }}
        >
          <h4
            className="font-bold uppercase text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Export Bookmarks
          </h4>
          <p className="text-sm text-(--text-muted)">
            Download your bookmarks as a file that can be imported later.
          </p>
          <div className="flex gap-4">
            <SettingsButton onClick={exportAsJSON}>
              Export as JSON
            </SettingsButton>
            <SettingsButton onClick={exportAsHTML}>
              Export as HTML
            </SettingsButton>
          </div>
        </div>

        {/* Import */}
        <div
          className="space-y-4 p-6 border-b-[3px] border-(--border-default)"
          style={{ paddingBottom: "1rem" }}
        >
          <h4
            className="font-bold uppercase text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Import Bookmarks
          </h4>
          <p className="text-sm text-(--text-muted)">
            Import bookmarks from a JSON or HTML file.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.html"
            onChange={handleImport}
            className="hidden"
          />
          <SettingsButton onClick={() => fileInputRef.current?.click()}>
            Choose File
          </SettingsButton>
          {importStatus && (
            <p
              className={`text-sm ${
                importStatus.includes("Failed")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {importStatus}
            </p>
          )}
        </div>

        {/* Clear Local Data */}
        <div className="space-y-4 p-6 border-[3px] border-red-500 bg-red-50 dark:bg-red-900/20">
          <h4
            className="font-bold uppercase text-red-600"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Clear Local Data
          </h4>
          <p className="text-sm text-red-600">
            This will remove all locally stored bookmarks and settings. Cloud
            data will not be affected.
          </p>
          <SettingsButton variant="danger" onClick={clearLocalData}>
            Clear All Local Data
          </SettingsButton>
        </div>
      </div>
    </div>
  );
}
