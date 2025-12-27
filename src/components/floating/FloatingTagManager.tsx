'use client';

import { useState, useEffect, useCallback } from 'react';
import { gsap } from '@/lib/gsap/config';
import FloatingTag from './FloatingTag';
import { FLOATING_TEXTS, TAG_COLORS, TAG_SPAWN_CONFIG } from '@/lib/constants/floatingTexts';
import type { FloatingText } from '@/types/floating.types';

export default function FloatingTagManager() {
  const [activeTags, setActiveTags] = useState<FloatingText[]>([]);

  const getRandomPosition = useCallback(() => {
    const { areaRadius } = TAG_SPAWN_CONFIG;

    // Random angle in radians
    const angle = Math.random() * Math.PI * 2;

    // Random distance from center (100px to areaRadius)
    const distance = gsap.utils.random(100, areaRadius);

    // Convert polar coordinates to cartesian
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

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
