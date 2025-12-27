import type { ShapeConfig } from '@/types/shape.types';

// Predefined subtle geometric shapes for background (5-8 shapes)
export const BACKGROUND_SHAPES: ShapeConfig[] = [
  {
    id: 'shape-1',
    type: 'circle',
    size: 300,
    color: 'var(--shape-light-blue)',
    position: { x: 10, y: 15 },
    opacity: 1,
    animationDuration: 45,
    animationDelay: 0
  },
  {
    id: 'shape-2',
    type: 'soft-rectangle',
    size: 250,
    color: 'var(--shape-light-purple)',
    position: { x: 85, y: 20 },
    opacity: 1,
    rotation: 25,
    animationDuration: 38,
    animationDelay: 2
  },
  {
    id: 'shape-3',
    type: 'circle',
    size: 200,
    color: 'var(--shape-light-green)',
    position: { x: 15, y: 75 },
    opacity: 1,
    animationDuration: 42,
    animationDelay: 4
  },
  {
    id: 'shape-4',
    type: 'soft-rectangle',
    size: 180,
    color: 'var(--shape-light-orange)',
    position: { x: 80, y: 70 },
    opacity: 1,
    rotation: -15,
    animationDuration: 50,
    animationDelay: 6
  },
  {
    id: 'shape-5',
    type: 'circle',
    size: 150,
    color: 'var(--shape-light-blue)',
    position: { x: 50, y: 10 },
    opacity: 1,
    animationDuration: 35,
    animationDelay: 3
  },
  {
    id: 'shape-6',
    type: 'soft-rectangle',
    size: 220,
    color: 'var(--shape-light-purple)',
    position: { x: 45, y: 80 },
    opacity: 1,
    rotation: 40,
    animationDuration: 40,
    animationDelay: 5
  }
];
