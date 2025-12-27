'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';
import BookmarkGrid from './BookmarkGrid';
import ASCIIBackground from './ASCIIBackground';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookmarkModal({ isOpen, onClose }: BookmarkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
      className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-white/95 backdrop-blur-lg border-[3px] border-black overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ASCIIBackground />
        <div className="relative z-10">
          <BookmarkGrid />
        </div>
      </div>
    </div>
  );
}
