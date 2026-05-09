'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

interface CustomImageBackgroundProps {
  url: string;
}

export default function CustomImageBackground({ url }: CustomImageBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
      );
    });

    return () => ctx.revert();
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-5 pointer-events-none overflow-hidden"
      style={{ opacity: 0 }}
    >
      <img
        src={url}
        alt=""
        aria-hidden
        decoding="async"
        loading="eager"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
