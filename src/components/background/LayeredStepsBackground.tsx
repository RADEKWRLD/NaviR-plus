'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function LayeredStepsBackground() {
  const step1Ref = useRef<SVGPathElement>(null);
  const step2Ref = useRef<SVGPathElement>(null);
  const step3Ref = useRef<SVGPathElement>(null);
  const step4Ref = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const steps = [step1Ref, step2Ref, step3Ref, step4Ref];

      steps.forEach((stepRef, index) => {
        gsap.fromTo(
          stepRef.current,
          { x: 300, opacity: 0 },
          {
            x: 0,
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
          ref={step1Ref}
          d="M537 540L430 540L430 463L532 463L532 386L558 386L558 309L393 309L393 231L464 231L464 154L576 154L576 77L427 77L427 0L960 0L960 77L960 77L960 154L960 154L960 231L960 231L960 309L960 309L960 386L960 386L960 463L960 463L960 540L960 540Z"
          style={{ fill: 'var(--color-accent-dark)' }}
        />
        <path
          ref={step2Ref}
          d="M608 540L626 540L626 463L611 463L611 386L684 386L684 309L644 309L644 231L632 231L632 154L623 154L623 77L558 77L558 0L960 0L960 77L960 77L960 154L960 154L960 231L960 231L960 309L960 309L960 386L960 386L960 463L960 463L960 540L960 540Z"
          style={{ fill: 'var(--color-accent-mid)' }}
        />
        <path
          ref={step3Ref}
          d="M717 540L733 540L733 463L663 463L663 386L781 386L781 309L747 309L747 231L705 231L705 154L692 154L692 77L663 77L663 0L960 0L960 77L960 77L960 154L960 154L960 231L960 231L960 309L960 309L960 386L960 386L960 463L960 463L960 540L960 540Z"
          style={{ fill: 'var(--color-accent-mid)' }}
        />
        <path
          ref={step4Ref}
          d="M766 540L851 540L851 463L844 463L844 386L773 386L773 309L838 309L838 231L814 231L814 154L794 154L794 77L797 77L797 0L960 0L960 77L960 77L960 154L960 154L960 231L960 231L960 309L960 309L960 386L960 386L960 463L960 463L960 540L960 540Z"
          style={{ fill: 'var(--color-accent-dark)' }}
        />
      </svg>
    </div>
  );
}
