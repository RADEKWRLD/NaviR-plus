'use client';

import gsap from 'gsap';

// Configure GSAP global settings (client-side only)
if (typeof window !== 'undefined') {
  gsap.config({
    autoSleep: 60,        // Pause inactive animations after 60 seconds
    force3D: true,        // Enable GPU acceleration by default
    nullTargetWarn: false // Reduce console warnings for null targets
  });

  // Set default animation properties
  gsap.defaults({
    ease: 'power2.out',
    duration: 1
  });
}

export { gsap };
