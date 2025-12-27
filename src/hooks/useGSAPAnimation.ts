'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap/config';

/**
 * Hook to manage GSAP animations with automatic cleanup
 */
export const useGSAPAnimation = <T extends HTMLElement>(
  animationFn: (element: T) => gsap.core.Timeline | gsap.core.Tween | void,
  deps: any[] = []
) => {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const result = animationFn(elementRef.current);
    if (result) {
      animationRef.current = result;
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return elementRef;
};
