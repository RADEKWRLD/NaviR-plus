"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import UserIcon from "@/components/icons/UserIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";

export default function HeaderIcons() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      router.push("/auth");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setShowUserMenu(false);
  };

  return (
    <div className="flex gap-4">
      {/* User icon square */}
      <div className="relative">
        <button
          onClick={handleUserClick}
          className="w-12 h-12 border-[3px] border-black bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer rounded-4xl"
        >
          <UserIcon />
        </button>

        {/* User dropdown menu */}
        {showUserMenu && isAuthenticated && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border-[3px] border-black z-40 shadow-lg rounded-xl">
              <div className="p-4 border-b-[3px] border-black">
                <p
                  className="font-bold text-sm text-center truncate"
                  style={{ fontFamily: "var(--font-oxanium)" }}
                >
                  {user?.name}
                </p>
                <p className="text-xs text-center text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
              <div
                onClick={handleLogout}
                className="w-full cursor-pointer text-center font-bold text-sm hover:bg-[#FF6B35] transition-colors uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Logout
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings icon square */}
      <div className="w-12 h-12 border-[3px] border-black bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer rounded-4xl">
        <SettingsIcon />
      </div>
    </div>
  );
}
