'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap/config';
import { useSettings } from '@/context/SettingsContext';
import BookmarkGrid from './BookmarkGrid';
import ASCIIBackground from './ASCIIBackground';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookmarkModal({ isOpen, onClose }: BookmarkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const enableBlur = settings.appearance.enableBlur;

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }
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
      className={`fixed inset-0 z-50 ${enableBlur ? 'bg-black/10 backdrop-blur-md' : 'bg-black/30'}`}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`bookmark-modal absolute top-[10%] left-[10%] w-[80%] h-[80%] border-[3px] border-(--border-default) overflow-hidden rounded-4xl ${enableBlur ? 'bg-(--bg-main)/95 backdrop-blur-lg' : 'bg-(--bg-main)'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ASCIIBackground />
        <div className="relative z-10 h-full">
          <BookmarkGrid />
        </div>
      </div>
    </div>
  );
}
