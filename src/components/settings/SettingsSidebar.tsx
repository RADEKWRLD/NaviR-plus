'use client';

import { useAuth } from '@/context/AuthContext';
import type { SettingsCategory } from '@/types/settings';

interface SettingsSidebarProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

const CATEGORIES: Array<{ id: SettingsCategory; label: string; icon: string }> = [
  { id: 'appearance', label: 'APPEARANCE', icon: '◐' },
  { id: 'search', label: 'SEARCH', icon: '⌕' },
  { id: 'bookmarks', label: 'BOOKMARKS', icon: '★' },
  { id: 'account', label: 'ACCOUNT', icon: '⚙' }, 
  { id: 'data', label: 'DATA', icon: '⬡' },
];

export default function SettingsSidebar({
  activeCategory,
  onCategoryChange,
}: SettingsSidebarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full md:w-56 shrink-0 border-b-[3px] md:border-b-0 md:border-r-[3px] border-(--border-default) flex flex-col">
      {/* Header - hidden on mobile */}
      <div className="hidden md:block p-4 border-b-[3px] border-(--border-default)">
        <h2
          className="text-xl font-bold uppercase tracking-wider text-(--text-primary)"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        >
          Settings
        </h2>
      </div>

      {/* Navigation items - horizontal scroll on mobile, vertical on desktop */}
      <nav className="flex md:flex-col md:flex-1 md:py-2 overflow-x-auto md:overflow-x-visible">
        {CATEGORIES.map((category) => {
          // 仅登录用户显示 Account
          if (category.id === 'account' && !isAuthenticated) {
            return null;
          }

          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                shrink-0 px-4 py-3 md:px-4 md:py-3 flex items-center gap-2 md:gap-3
                font-bold uppercase tracking-wide text-sm md:text-base
                transition-all duration-200 md:w-full md:text-left
                ${
                  isActive
                    ? 'bg-(--color-accent) text-(--color-white) md:border-l-4 md:border-(--color-accent)'
                    : 'text-(--text-primary) hover:bg-(--color-gray-light) md:border-l-4 md:border-transparent'
                }
              `}
              style={{ fontFamily: 'var(--font-oxanium)' }}
            >
              <span className="text-lg md:text-xl w-5 md:w-6 text-center">{category.icon}</span>
              <span className="whitespace-nowrap">{category.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
