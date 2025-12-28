'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function LayeredPeaksBackground() {
  const layer1Ref = useRef<SVGPathElement>(null);
  const layer2Ref = useRef<SVGPathElement>(null);
  const layer3Ref = useRef<SVGPathElement>(null);
  const layer4Ref = useRef<SVGPathElement>(null);
  const layer5Ref = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const layers = [layer1Ref, layer2Ref, layer3Ref, layer4Ref, layer5Ref];

      layers.forEach((layerRef, index) => {
        gsap.fromTo(
          layerRef.current,
          { y: 300, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1 + index * 0.15
          }
        );
      });
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
          ref={layer1Ref}
          d="M0 346L137 398L274 383L411 392L549 345L686 339L823 379L960 329L960 541L823 541L686 541L549 541L411 541L274 541L137 541L0 541Z"
          style={{ fill: 'var(--color-accent)' }}
        />
        <path
          ref={layer2Ref}
          d="M0 367L137 369L274 392L411 362L549 403L686 368L823 425L960 423L960 541L823 541L686 541L549 541L411 541L274 541L137 541L0 541Z"
          style={{ fill: 'var(--color-accent-hover)' }}
        />
        <path
          ref={layer3Ref}
          d="M0 394L137 403L274 402L411 405L549 416L686 440L823 442L960 435L960 541L823 541L686 541L549 541L411 541L274 541L137 541L0 541Z"
          style={{ fill: 'var(--color-accent-mid)' }}
        />
        <path
          ref={layer4Ref}
          d="M0 439L137 483L274 477L411 470L549 477L686 452L823 467L960 461L960 541L823 541L686 541L549 541L411 541L274 541L137 541L0 541Z"
          style={{ fill: 'var(--color-accent-mid)', opacity: 0.8 }}
        />
        <path
          ref={layer5Ref}
          d="M0 480L137 498L274 503L411 500L549 500L686 514L823 493L960 516L960 541L823 541L686 541L549 541L411 541L274 541L137 541L0 541Z"
          style={{ fill: 'var(--color-accent-dark)' }}
        />
      </svg>
    </div>
  );
}
