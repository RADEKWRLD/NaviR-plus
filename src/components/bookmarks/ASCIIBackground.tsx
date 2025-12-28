'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap/config';

export default function ASCIIBackground() {
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // 移动端不启用动画，优化性能
    if (isMobile) return;

    // 为每一行添加不同速度的滚动动画
    const animations = rowsRef.current.map((row, index) => {
      const speed = 15 + (index % 5) * 3; // 不同行不同速度 15-27秒
      return gsap.to(row, {
        x: '-=200',
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    });

    return () => {
      animations.forEach(anim => anim.kill());
    };
  }, [isMobile]);

  // 移动端减少渲染的字符数量
  const grid = useMemo(() => {
    const chars = ['/', '\\', '|', '-', '_', '+', '=', '*', '#', '.', '~', '^', '<', '>'];

    // 移动端使用更少的行列数
    const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 768;
    const rowCount = isMobileSize ? 8 : Math.ceil(window.innerHeight / 30);
    const colCount = isMobileSize ? 20 : Math.ceil(window.innerWidth / 10);

    return Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }, () => ({
        char: chars[Math.floor(Math.random() * chars.length)],
        isHighlight: Math.random() < 0.12,
      }))
    );
  }, []);

  // 移动端完全不渲染 ASCII 背景
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 scale-300">
        <div className="font-mono text-sm leading-relaxed">
          {grid.map((row, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) rowsRef.current[i] = el;
              }}
              className="flex justify-center whitespace-nowrap"
            >
              {row.map((cell, j) => (
                <span
                  key={j}
                  className={cell.isHighlight ? 'text-[#FF6B35]' : 'text-gray-400'}
                >
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
