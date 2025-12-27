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
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!tagRef.current || hasAnimated.current) return;

    hasAnimated.current = true;

    const tl = gsap.timeline({
      onComplete
    });

    // Slow rise from bottom to top - single continuous movement
    tl.fromTo(
      tagRef.current,
      {
        y: 200,  // Start from further below
        x: initialX,
        opacity: 0
      },
      {
        y: initialY - 400,  // End much higher (slow continuous rise)
        opacity: 1,
        duration: 1,  
        ease: 'none'  // Linear movement for continuous feel
      }
    );

    // Fade out at the end
    tl.to(tagRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.in'
    }, '-=1.5');  // Start fading before reaching the top

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once, won't re-render

  return (
    <div
      ref={tagRef}
      className="absolute pointer-events-none"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <div
        className="px-8 py-4 p-12 text-white shadow-lg whitespace-nowrap font-bold text-7xl"
        style={{
          backgroundColor: color,
          borderRadius: '1rem'
        }}
      >
        {text}
      </div>
    </div>
  );
}
