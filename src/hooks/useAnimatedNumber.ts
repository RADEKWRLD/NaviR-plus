'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';

/**
 * Hook for animated number transitions (for clock digits)
 */
export const useAnimatedNumber = (value: number, duration = 0.4) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const previousValue = useRef(value);

  useEffect(() => {
    if (!elementRef.current || previousValue.current === value) return;

    gsap.to(elementRef.current, {
      textContent: value,
      duration,
      ease: 'expo.out',
      snap: { textContent: 1 },
      onUpdate: function () {
        const target = this.targets()[0] as HTMLElement;
        const currentValue = parseFloat(target.textContent || '0');
        target.textContent = Math.round(currentValue).toString();
      }
    });

    previousValue.current = value;
  }, [value, duration]);

  return elementRef;
};
