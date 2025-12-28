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
    <div className="w-64 border-r-[3px] border-(--border-default) flex flex-col">
      {/* Header */}
      <div className="p-6 border-b-[3px] border-(--border-default)">
        <h2
          className="text-2xl font-bold uppercase tracking-wider text-(--text-primary)"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        >
          Settings
        </h2>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4">
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
                w-full px-6 py-4 flex items-center gap-4
                text-left font-bold uppercase tracking-wide
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-(--color-accent) text-(--color-white) border-l-4 border-(--color-accent)'
                    : 'text-(--text-primary) hover:bg-(--color-gray-light) border-l-4 border-transparent'
                }
              `}
              style={{ fontFamily: 'var(--font-oxanium)' }}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
