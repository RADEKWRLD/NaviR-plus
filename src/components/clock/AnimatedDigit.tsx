'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';

interface AnimatedDigitProps {
  value: number;
}

export default function AnimatedDigit({ value }: AnimatedDigitProps) {
  const digitRef = useRef<HTMLSpanElement>(null);
  const previousValue = useRef(value);

  useEffect(() => {
    if (!digitRef.current || previousValue.current === value) return;

    const oldValue = previousValue.current;

    // Create a timeline for the digit change animation
    const tl = gsap.timeline();

    // Slide out old digit
    tl.to(digitRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.2,
      ease: 'expo.in'
    });

    // Update the content
    tl.call(() => {
      if (digitRef.current) {
        digitRef.current.textContent = value.toString();
      }
    });

    // Slide in new digit
    tl.fromTo(
      digitRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'expo.out' }
    );

    previousValue.current = value;

    return () => {
      tl.kill();
    };
  }, [value]);

  return (
    <span ref={digitRef} className="inline-block" style={{ willChange: 'transform, opacity' }}>
      {value}
    </span>
  );
}
