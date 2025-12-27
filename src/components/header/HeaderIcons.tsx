'use client';

import UserIcon from '@/components/icons/UserIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';

export default function HeaderIcons() {
  return (
    <div className="flex gap-4">
      {/* User icon square */}
      <div className="w-12 h-12 border-[3px] border-black bg-gray-50 flex items-center justify-center">
        <UserIcon />
      </div>

      {/* Settings icon square */}
      <div className="w-12 h-12 border-[3px] border-black bg-gray-50 flex items-center justify-center">
        <SettingsIcon />
      </div>
    </div>
  );
}
