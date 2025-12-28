"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap/config";
import type { SettingsCategory } from "@/types/settings";
import AppearanceSection from "./sections/AppearanceSection";
import SearchSection from "./sections/SearchSection";
import BookmarksSection from "./sections/BookmarksSection";
import AccountSection from "./sections/AccountSection";
import DataSection from "./sections/DataSection";

interface SettingsContentProps {
  category: SettingsCategory;
  onClose: () => void;
}

export default function SettingsContent({
  category,
  onClose,
}: SettingsContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [category]);

  const renderSection = () => {
    switch (category) {
      case "appearance":
        return <AppearanceSection />;
      case "search":
        return <SearchSection />;
      case "bookmarks":
        return <BookmarksSection />;
      case "account":
        return <AccountSection />;
      case "data":
        return <DataSection />;
      default:
        return null;
    }
  };

  return (
    <div
    style={{paddingLeft:"1rem"}} 
    className="flex-1 flex flex-col relative bg-(--bg-main)">
      {/* Close button */}
      <div className="absolute top-0 right-0 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 border-[3px] border-(--border-default) bg-(--bg-main) hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] flex items-center justify-center transition-colors rounded-full text-2xl font-bold text-(--text-primary)"
        >
          ×
        </button>
      </div>

      {/* Content area */}
      <div ref={contentRef} className="flex-1 p-8 overflow-y-auto">
        {renderSection()}
      </div>
    </div>
  );
}
