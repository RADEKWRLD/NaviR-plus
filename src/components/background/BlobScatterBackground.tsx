'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function BlobScatterBackground() {
  const blob1Ref = useRef<SVGGElement>(null);
  const blob2Ref = useRef<SVGGElement>(null);
  const blob3Ref = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Blob 1: 淡入 + 缩放
      gsap.fromTo(
        blob1Ref.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', delay: 0.1 }
      );

      // Blob 2: 淡入 + 缩放
      gsap.fromTo(
        blob2Ref.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
      );

      // Blob 3: 淡入 + 缩放
      gsap.fromTo(
        blob3Ref.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', delay: 0.5 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 960 540"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={blob1Ref} transform="translate(162 77)">
          <path
            d="M97.1 -31.8C109.5 6.5 91.9 54.4 57.7 79.1C23.5 103.9 -27.2 105.5 -56.9 82.9C-86.5 60.2 -95.2 13.2 -82.2 -26C-69.3 -65.1 -34.6 -96.5 3.9 -97.8C42.4 -99.1 84.7 -70.2 97.1 -31.8Z"
            fill="#E85A2B"
          />
        </g>
        <g ref={blob2Ref} transform="translate(229 491)">
          <path
            d="M62.3 -21.4C70.8 6 61 38.2 38.3 55.2C15.7 72.2 -19.8 74.1 -44.6 57.1C-69.5 40.1 -83.8 4.1 -74.6 -24.3C-65.4 -52.6 -32.7 -73.4 -2.9 -72.4C26.9 -71.5 53.8 -48.9 62.3 -21.4Z"
            fill="#E85A2B"
          />
        </g>
        <g ref={blob3Ref} transform="translate(821 180)">
          <path
            d="M93.2 -30.2C105 5.9 87.8 51.6 55 75.3C22.3 99 -26.1 100.7 -58.7 77.7C-91.4 54.7 -108.3 7 -95.9 -30C-83.5 -67 -41.8 -93.3 -0.5 -93.1C40.7 -93 81.5 -66.3 93.2 -30.2Z"
            fill="#E85A2B"
          />
        </g>
      </svg>
    </div>
  );
}
