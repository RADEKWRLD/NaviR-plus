'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GraphicBackground from '@/components/background/GraphicBackground';
import ClockDisplay from '@/components/clock/ClockDisplay';
import SearchInput from '@/components/search/SearchInput';
import HeaderIcons from '@/components/header/HeaderIcons';
import { useSettings } from '@/context/SettingsContext';

const BlobBackground = dynamic(() => import('@/components/background/BlobBackground'), { ssr: false });
const WaveBackground = dynamic(() => import('@/components/background/WaveBackground'), { ssr: false });
const BlobScatterBackground = dynamic(() => import('@/components/background/BlobScatterBackground'), { ssr: false });
const LayeredPeaksBackground = dynamic(() => import('@/components/background/LayeredPeaksBackground'), { ssr: false });
const LayeredStepsBackground = dynamic(() => import('@/components/background/LayeredStepsBackground'), { ssr: false });
const WorldMapBackground = dynamic(() => import('@/components/background/WorldMapBackground'), { ssr: false });
const CustomImageBackground = dynamic(() => import('@/components/background/CustomImageBackground'), { ssr: false });
const AnimatedTypographyLayer = dynamic(() => import('@/components/typography/AnimatedTypographyLayer'), { ssr: false });
const TypographicHero = dynamic(() => import('@/components/typography/TypographicHero'), { ssr: false });
const BookmarkModal = dynamic(() => import('@/components/bookmarks/BookmarkModal'), { ssr: false });

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
      {settings.appearance.showGrid && <GraphicBackground />}
      {settings.appearance.backgroundEffect === 'blob' && <BlobBackground />}
      {settings.appearance.backgroundEffect === 'wave' && <WaveBackground />}
      {settings.appearance.backgroundEffect === 'blob-scatter' && <BlobScatterBackground />}
      {settings.appearance.backgroundEffect === 'layered-peaks' && <LayeredPeaksBackground />}
      {settings.appearance.backgroundEffect === 'layered-steps' && <LayeredStepsBackground />}
      {settings.appearance.backgroundEffect === 'world-map' && <WorldMapBackground />}
      {settings.appearance.backgroundEffect === 'custom' && settings.appearance.customBackgroundUrl && (
        <CustomImageBackground url={settings.appearance.customBackgroundUrl} />
      )}

      {/* GSAP animated typography layer */}
      {settings.appearance.showAnimatedText && <AnimatedTypographyLayer />}

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
      {settings.appearance.showTypographicHero && (
        <div className="fixed top-8 left-8 md:top-8 md:left-8 z-5 pointer-events-none">
          <TypographicHero />
        </div>
      )}

      {/* Header icons - fixed position top right */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-20">
        <HeaderIcons />
      </div>

      {/* Bookmark Modal */}
      <BookmarkModal isOpen={showBookmarkModal} onClose={() => setShowBookmarkModal(false)} />
    </main>
  );
}
