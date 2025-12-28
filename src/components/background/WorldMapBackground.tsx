'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function WorldMapBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-5 pointer-events-none overflow-hidden"
      style={{
        backgroundImage: 'url("/World Map.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0
      }}
    />
  );
}
