"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { gsap } from "@/lib/gsap/config";
import { useAuth } from "@/context/AuthContext";
import UserIcon from "@/components/icons/UserIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import SettingsModal from "@/components/settings/SettingsModal";

export default function HeaderIcons() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showUserMenu && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [showUserMenu]);

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
            <div
              ref={menuRef}
              className="absolute right-0 w-48 bg-white border-[3px] border-black z-40 shadow-lg rounded-xl"
            >
              <div className="p-4 h-18 border-b-[3px] border-black flex flex-col items-center justify-center">
                <div className="w-full h-1/2 flex justify-center items-center">
                  <p
                    className="font-bold text-sm text-[#FF6B35] text-center truncate"
                    style={{ fontFamily: "var(--font-oxanium)" }}
                  >
                    {user?.name}
                  </p>
                </div>
                <div className="w-full h-1/4 flex justify-center items-center">
                  <p className="text-xs text-center text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div
                onClick={handleLogout}
                className="w-full cursor-pointer text-center font-bold text-sm hover:bg-[#FF6B35] transition-colors uppercase rounded-b-lg"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                Logout
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings icon square */}
      <button
        onClick={() => setShowSettings(true)}
        className="w-12 h-12 border-[3px] border-(--border-default) bg-(--bg-secondary) hover:bg-(--color-gray-light) flex items-center justify-center transition-colors cursor-pointer rounded-4xl"
      >
        <SettingsIcon />
      </button>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
