'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function WaveBackground() {
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pathRef.current,
        { y: 200, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }
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
        <path
          ref={pathRef}
          d="M0 318L13.3 313.5C26.7 309 53.3 300 80 290.7C106.7 281.3 133.3 271.7 160 277C186.7 282.3 213.3 302.7 240 318.3C266.7 334 293.3 345 320 351.7C346.7 358.3 373.3 360.7 400 357.8C426.7 355 453.3 347 480 344C506.7 341 533.3 343 560 351.8C586.7 360.7 613.3 376.3 640 364.2C666.7 352 693.3 312 720 307.3C746.7 302.7 773.3 333.3 800 331C826.7 328.7 853.3 293.3 880 297C906.7 300.7 933.3 343.3 946.7 364.7L960 386L960 541L946.7 541C933.3 541 906.7 541 880 541C853.3 541 826.7 541 800 541C773.3 541 746.7 541 720 541C693.3 541 666.7 541 640 541C613.3 541 586.7 541 560 541C533.3 541 506.7 541 480 541C453.3 541 426.7 541 400 541C373.3 541 346.7 541 320 541C293.3 541 266.7 541 240 541C213.3 541 186.7 541 160 541C133.3 541 106.7 541 80 541C53.3 541 26.7 541 13.3 541L0 541Z"
          fill="#E85A2B"
          strokeLinecap="round"
          strokeLinejoin="miter"
        />
      </svg>
    </div>
  );
}
