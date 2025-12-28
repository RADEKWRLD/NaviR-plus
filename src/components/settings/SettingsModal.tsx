'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap/config';
import SettingsSidebar from './SettingsSidebar';
import SettingsContent from './SettingsContent';
import type { SettingsCategory } from '@/types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] =
    useState<SettingsCategory>('appearance');

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, xPercent: -50, yPercent: -50, y: 50 },
        { scale: 1, opacity: 1, xPercent: -50, yPercent: -50, y: 0, duration: 0.4, ease: 'expo.out' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/10 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 max-w-[90%] h-125 max-h-[80%] bg-(--bg-main)/95 backdrop-blur-lg border-[3px] border-(--border-default) overflow-hidden rounded-4xl flex"
        style={{padding:"1rem"}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左侧导航 */}
        <SettingsSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* 右侧内容 */}
        <SettingsContent category={activeCategory} onClose={onClose} />
      </div>
    </div>
  );
}
