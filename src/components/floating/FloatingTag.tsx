'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';

interface FloatingTagProps {
  text: string;
  color: string;
  initialX: number;
  initialY: number;
  onComplete: () => void;
}

export default function FloatingTag({ text, color, initialX, initialY, onComplete }: FloatingTagProps) {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tagRef.current) return;

    const tl = gsap.timeline({
      onComplete
    });

    // 1. Fade in from bottom with rise
    tl.fromTo(
      tagRef.current,
      {
        y: 50,
        x: initialX,
        opacity: 0,
        scale: 0.8
      },
      {
        y: initialY,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'expo.out'
      }
    );

    // 2. Gentle floating motion
    tl.to(tagRef.current, {
      y: `+=${gsap.utils.random(-10, 10)}`,
      duration: 3,
      ease: 'sine.inOut',
      repeat: 2,
      yoyo: true
    }, '+=0.5');

    // 3. Fade out
    tl.to(tagRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: 'expo.in'
    }, '+=1');

    return () => {
      tl.kill();
    };
  }, [initialX, initialY, onComplete]);

  return (
    <div
      ref={tagRef}
      className="absolute pointer-events-none"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <div
        className="px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-lg whitespace-nowrap"
        style={{
          backgroundColor: color,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {text}
      </div>
    </div>
  );
}
