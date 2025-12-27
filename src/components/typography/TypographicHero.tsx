'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';

export default function TypographicHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.word');

    // Entrance animation with 3D rotation
    gsap.fromTo(words,
      {
        y: 100,
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.out'
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="select-none">
      <h1 className="leading-none">
        {/* Mixed-size typography composition */}
        <div className="word text-hero">NAVIR</div>
        <div className="word text-medium mt-4">
          <span className="text-inverted">SEARCH</span>
          <span className="text-accent ml-2">•</span>
          <span className="ml-2">DISCOVER</span>
        </div>
      </h1>
    </div>
  );
}
