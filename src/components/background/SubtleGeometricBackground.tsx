'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';
import Circle from './shapes/Circle';
import SoftRectangle from './shapes/SoftRectangle';
import { BACKGROUND_SHAPES } from '@/lib/constants/shapes';

export default function SubtleGeometricBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const shapes = containerRef.current.querySelectorAll('.shape');
    const animations: gsap.core.Tween[] = [];

    shapes.forEach((shape, index) => {
      const config = BACKGROUND_SHAPES[index];
      if (!config) return;

      const animation = gsap.to(shape, {
        x: `random(-30, 30)`,
        y: `random(-30, 30)`,
        rotation: `random(-10, 10)`,
        duration: config.animationDuration,
        ease: 'none',
        repeat: -1,
        yoyo: true,
        delay: config.animationDelay
      });

      animations.push(animation);
    });

    return () => {
      animations.forEach((anim) => anim.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {BACKGROUND_SHAPES.map((shape) => (
        <div
          key={shape.id}
          className="shape absolute"
          style={{
            left: `${shape.position.x}%`,
            top: `${shape.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {shape.type === 'circle' ? (
            <Circle size={shape.size} color={shape.color} opacity={shape.opacity} />
          ) : (
            <SoftRectangle
              size={shape.size}
              color={shape.color}
              opacity={shape.opacity}
              rotation={shape.rotation}
            />
          )}
        </div>
      ))}
    </div>
  );
}
