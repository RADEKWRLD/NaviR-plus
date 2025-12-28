"use client";

import { useSettings } from "@/context/SettingsContext";
import SettingsToggle from "../controls/SettingsToggle";

export default function BookmarksSection() {
  const { settings, updateBookmarks } = useSettings();

  return (
    <div className="space-y-8">
      <h3
        className="text-3xl font-bold uppercase tracking-wide mb-6 text-(--text-primary)"
        style={{ fontFamily: "var(--font-oxanium)" }}
      >
        Bookmarks
      </h3>
      <div className="flex flex-col gap-4">
        {/* Show Title */}
        <div
          className="flex items-center justify-between py-4 border-b-[3px] border-(black) "
          style={{ paddingBottom: "1rem" }}
        >
          <div>
            <p
              className="font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Show Bookmark Titles
            </p>
            <p className="text-sm text-(--text-muted) mt-1">
              Display title text below bookmark icons
            </p>
          </div>
          <SettingsToggle
            checked={settings.bookmarks.showTitle}
            onChange={(checked) => updateBookmarks({ showTitle: checked })}
          />
        </div>
      </div>
    </div>
  );
}
