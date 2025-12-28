'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function BlobBackground() {
  const topBlobRef = useRef<SVGGElement>(null);
  const bottomBlobRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        topBlobRef.current,
        {y: -405 },
        {y: 0, duration: 1, ease: 'power2.out', delay: 0.2 }
      );

      gsap.fromTo(
        bottomBlobRef.current,
        { y: 910 },
        { y: 505, duration: 1, ease: 'power2.out', delay: 0.4 }
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
        <defs>
          <linearGradient id="grad1_0" x1="43.8%" y1="0%" x2="100%" y2="100%">
            <stop offset="14.444444444444446%" stopColor="#ff6b35" stopOpacity="1" />
            <stop offset="85.55555555555554%" stopColor="#ff6b35" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="grad1_1" x1="43.8%" y1="0%" x2="100%" y2="100%">
            <stop offset="14.444444444444446%" stopColor="#ff6b35" stopOpacity="1" />
            <stop offset="85.55555555555554%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="grad2_0" x1="0%" y1="0%" x2="56.3%" y2="100%">
            <stop offset="14.444444444444446%" stopColor="#ff6b35" stopOpacity="1" />
            <stop offset="85.55555555555554%" stopColor="#ff6b35" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="grad2_1" x1="0%" y1="0%" x2="56.3%" y2="100%">
            <stop offset="14.444444444444446%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="85.55555555555554%" stopColor="#ff6b35" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* blob右上角 */}
        <g ref={topBlobRef} transform="translate(960, 0)">
          <path
            d="M0 405C-33.6 366.4 -67.1 327.8 -100.7 310C-134.4 292.3 -168.1 295.3 -210.4 289.6C-252.8 283.9 -303.8 269.4 -327.7 238.1C-351.5 206.7 -348.3 158.4 -356.6 115.9C-365 73.4 -385 36.7 -405 0L0 0Z"
            fill="#ffb798"
          />
          <path
            d="M0 202.5C-16.8 183.2 -33.6 163.9 -50.4 155C-67.2 146.1 -84 147.7 -105.2 144.8C-126.4 142 -151.9 134.7 -163.8 119C-175.8 103.3 -174.1 79.2 -178.3 57.9C-182.5 36.7 -192.5 18.3 -202.5 0L0 0Z"
            fill="#ff6b35"
          />
        </g>

        {/* blob左下角 */}
        <g ref={bottomBlobRef} transform="translate(0, 540)">
          <path
            d="M0 -405C29.3 -359.4 58.6 -313.8 97.3 -299.6C136 -285.4 184.1 -302.7 208.1 -286.4C232 -270.1 231.9 -220.2 262.9 -191C294 -161.9 356.3 -153.5 385.2 -125.2C414.1 -96.8 409.5 -48.4 405 0L0 0Z"
            fill="#ffb798"
          />
          <path
            d="M0 -202.5C14.7 -179.7 29.3 -156.9 48.7 -149.8C68 -142.7 92.1 -151.4 104 -143.2C116 -135 115.9 -110.1 131.5 -95.5C147 -80.9 178.1 -76.8 192.6 -62.6C207 -48.4 204.8 -24.2 202.5 0L0 0Z"
            fill="#ff6b35"
          />
        </g>
      </svg>
    </div>
  );
}
