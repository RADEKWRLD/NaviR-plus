'use client';

import { useState, useEffect } from 'react';
import GraphicBackground from '@/components/background/GraphicBackground';
import BlobBackground from '@/components/background/BlobBackground';
import WaveBackground from '@/components/background/WaveBackground';
import BlobScatterBackground from '@/components/background/BlobScatterBackground';
import LayeredPeaksBackground from '@/components/background/LayeredPeaksBackground';
import LayeredStepsBackground from '@/components/background/LayeredStepsBackground';
import WorldMapBackground from '@/components/background/WorldMapBackground';
import AnimatedTypographyLayer from '@/components/typography/AnimatedTypographyLayer';
import TypographicHero from '@/components/typography/TypographicHero';
import ClockDisplay from '@/components/clock/ClockDisplay';
import SearchInput from '@/components/search/SearchInput';
import HeaderIcons from '@/components/header/HeaderIcons';
import BookmarkModal from '@/components/bookmarks/BookmarkModal';
import { useSettings } from '@/context/SettingsContext';

export default function Home() {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { settings } = useSettings();

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 书签栏触发：桌面端右键，移动端单击背景
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowBookmarkModal(true);
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // 移动端单击：点击背景打开/关闭书签栏
  useEffect(() => {
    if (!isMobile) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 排除交互元素的点击
      if (target.closest('button, a, input, [role="button"]')) {
        return;
      }
      // 点击模态框内部不处理（模态框自己处理关闭）
      if (target.closest('.bookmark-modal')) {
        return;
      }
      // 切换模态框状态
      setShowBookmarkModal(prev => !prev);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isMobile]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      {/* Background effects based on settings */}
      <GraphicBackground />
      {settings.appearance.backgroundEffect === 'blob' && <BlobBackground />}
      {settings.appearance.backgroundEffect === 'wave' && <WaveBackground />}
      {settings.appearance.backgroundEffect === 'blob-scatter' && <BlobScatterBackground />}
      {settings.appearance.backgroundEffect === 'layered-peaks' && <LayeredPeaksBackground />}
      {settings.appearance.backgroundEffect === 'layered-steps' && <LayeredStepsBackground />}
      {settings.appearance.backgroundEffect === 'world-map' && <WorldMapBackground />}

      {/* GSAP animated typography layer */}
      <AnimatedTypographyLayer />

      {/* Main content - vertically centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Centered search area */}
        <div className="w-full flex flex-col items-center gap-8">
          {/* Clock above search box */}
          <ClockDisplay />

          {/* Search input */}
          <SearchInput />
        </div>
      </div>

      {/* Typographic hero - fixed position top left */}
      <div className="fixed top-8 left-8 md:top-8 md:left-8 z-5 pointer-events-none">
        <TypographicHero />
      </div>

      {/* Header icons - fixed position top right */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-20">
        <HeaderIcons />
      </div>

      {/* Bookmark Modal */}
      <BookmarkModal isOpen={showBookmarkModal} onClose={() => setShowBookmarkModal(false)} />
    </main>
  );
}
