import { gsap } from './config';

/**
 * Creates a slow drift animation for background elements
 */
export const createDriftAnimation = (element: HTMLElement, duration: number = 30) => {
  return gsap.to(element, {
    x: `random(-30, 30)`,
    y: `random(-30, 30)`,
    rotation: `random(-10, 10)`,
    duration,
    ease: 'none',
    repeat: -1,
    yoyo: true
  });
};

/**
 * Creates a fade-in animation for elements
 */
export const createFadeIn = (element: HTMLElement, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay }
  );
};

/**
 * Creates a scale transition animation
 */
export const createScaleTransition = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, { scale: 0.8, duration: 0.15, ease: 'power2.in' })
    .to(element, { scale: 1, duration: 0.15, ease: 'power2.out' });

  return tl;
};

/**
 * Animation configuration presets
 */
export const AnimationPresets = {
  fastTransition: {
    duration: 0.2,
    ease: 'power2.out'
  },
  normalTransition: {
    duration: 0.3,
    ease: 'expo.out'
  },
  slowTransition: {
    duration: 0.5,
    ease: 'expo.out'
  },
  numberChange: {
    duration: 0.4,
    ease: 'expo.out',
    snap: { textContent: 1 }
  }
};
