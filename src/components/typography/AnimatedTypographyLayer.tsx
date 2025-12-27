'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap/config';
import SplitType from 'split-type';

const ANIMATED_WORDS = [
  'SEARCH',
  'DISCOVER',
  'EXPLORE',
  'NAVIGATE',
  'FIND',
  'BROWSE',
  'SURF',
  'QUERY',
  'CODE'
];

// Coolors palette - modern tech colors with low opacity
const COLORS = [
  'rgba(255, 56, 92, 0.12)',      // #FF385C - Coral Red
  'rgba(101, 84, 192, 0.12)',     // #6554C0 - Purple
  'rgba(0, 184, 217, 0.12)',      // #00B8D9 - Cyan
  'rgba(255, 171, 0, 0.12)',      // #FFAB00 - Amber
  'rgba(54, 179, 126, 0.12)',     // #36B37E - Green
  'rgba(87, 96, 106, 0.12)',      // #57606A - Blue Gray
];

interface AnimatedWord {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export default function AnimatedTypographyLayer() {
  const [activeWords, setActiveWords] = useState<AnimatedWord[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnWord = useCallback(() => {
    if (activeWords.length >= 1) return;

    const word = ANIMATED_WORDS[Math.floor(Math.random() * ANIMATED_WORDS.length)];
    const x = gsap.utils.random(10, 80);  // 10%-80% width
    const y = gsap.utils.random(10, 80);  // 10%-80% height
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const newWord: AnimatedWord = {
      id: `word-${Date.now()}-${Math.random()}`,
      text: word,
      x,
      y,
      color
    };

    setActiveWords((prev) => [...prev, newWord]);

    // Remove after animation completes
    // Type-in (~0.1s * avg 8 chars = 0.8s) + hold (1.5s) + delete (~0.05s * 8 = 0.4s) = ~2.7s + buffer
    setTimeout(() => {
      setActiveWords((prev) => prev.filter((w) => w.id !== newWord.id));
    }, 3500);
  }, [activeWords.length]);

  useEffect(() => {
    const interval = setInterval(spawnWord, 3000);
    return () => clearInterval(interval);
  }, [spawnWord]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {activeWords.map((word) => (
        <AnimatedWord key={word.id} word={word} />
      ))}
    </div>
  );
}

function AnimatedWord({ word }: { word: AnimatedWord }) {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordRef.current) return;

    // Use SplitType to split letters
    const split = new SplitType(wordRef.current, { types: 'chars' });
    const chars = split.chars;

    if (!chars) return;

    const tl = gsap.timeline();

    // Typewriter effect: type in from left to right
    tl.fromTo(chars,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,  // Each character appears 0.1s after the previous
        ease: 'none'
      }
    );

    // Hold for a moment
    tl.to({}, { duration: 1.5 });

    // Delete effect: remove from right to left
    tl.to(chars, {
      opacity: 0,
      duration: 0.1,
      stagger: {
        each: 0.05,
        from: 'end'  // Start from the last character
      },
      ease: 'none'
    });

    return () => {
      tl.kill();
      split.revert();
    };
  }, []);

  return (
    <div
      ref={wordRef}
      className="absolute text-hero font-bold pointer-events-none"
      style={{
        left: `${word.x}%`,
        top: `${word.y}%`,
        transform: 'translate(-50%, -50%)',
        color: word.color,
        WebkitTextStroke: `2px ${word.color}`,
        paintOrder: 'stroke fill',
        willChange: 'transform, opacity'
      }}
    >
      {word.text}
    </div>
  );
}
