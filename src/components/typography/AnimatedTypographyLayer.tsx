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
  'QUERY'
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
    if (activeWords.length >= 3) return;

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

    // Remove after 5 seconds
    setTimeout(() => {
      setActiveWords((prev) => prev.filter((w) => w.id !== newWord.id));
    }, 5000);
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

    // Letters slide in one by one with rotation
    tl.fromTo(chars,
      {
        y: 100,
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'expo.out'
      }
    );

    // Hold for a moment
    tl.to({}, { duration: 1.5 });

    // Scatter effect - letters fly away in different directions
    tl.to(chars, {
      x: () => gsap.utils.random(-100, 100),
      y: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-45, 45),
      opacity: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power2.in'
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
