'use client';

import { useState, useEffect, useCallback } from 'react';
import { gsap } from '@/lib/gsap/config';
import FloatingTag from './FloatingTag';
import { FLOATING_TEXTS, TAG_COLORS, TAG_SPAWN_CONFIG } from '@/lib/constants/floatingTexts';
import type { FloatingText } from '@/types/floating.types';

export default function FloatingTagManager() {
  const [activeTags, setActiveTags] = useState<FloatingText[]>([]);

  const getRandomPosition = useCallback(() => {
    // Get window dimensions (with fallback for SSR)
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Random position anywhere on screen (with margins)
    const margin = 100; // Keep tags away from edges
    const x = gsap.utils.random(margin - windowWidth / 2, windowWidth / 2 - margin);
    const y = gsap.utils.random(margin - windowHeight / 2, windowHeight / 2 - margin);

    return { x, y };
  }, []);

  const spawnNewTag = useCallback(() => {
    const { maxActiveTags } = TAG_SPAWN_CONFIG;

    if (activeTags.length >= maxActiveTags) return;

    const randomText = FLOATING_TEXTS[Math.floor(Math.random() * FLOATING_TEXTS.length)];
    const randomColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    const position = getRandomPosition();

    const newTag: FloatingText = {
      id: `tag-${Date.now()}-${Math.random()}`,
      text: randomText,
      color: randomColor,
      position
    };

    setActiveTags((prev) => [...prev, newTag]);
  }, [activeTags.length, getRandomPosition]);

  const removeTag = useCallback((id: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  useEffect(() => {
    // Initial spawn
    const initialDelay = setTimeout(() => {
      spawnNewTag();
    }, 1000);

    // Continuous spawning
    const interval = setInterval(() => {
      if (activeTags.length < TAG_SPAWN_CONFIG.maxActiveTags) {
        spawnNewTag();
      }
    }, gsap.utils.random(TAG_SPAWN_CONFIG.minInterval, TAG_SPAWN_CONFIG.maxInterval));

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [activeTags.length, spawnNewTag]);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-5">
      {activeTags.map((tag) => (
        <FloatingTag
          key={tag.id}
          text={tag.text}
          color={tag.color}
          initialX={tag.position.x}
          initialY={tag.position.y}
          onComplete={() => removeTag(tag.id)}
        />
      ))}
    </div>
  );
}
