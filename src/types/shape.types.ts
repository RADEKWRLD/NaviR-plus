export type ShapeType = 'circle' | 'soft-rectangle';

export interface ShapeConfig {
  id: string;
  type: ShapeType;
  size: number;
  color: string;
  position: { x: number; y: number };
  opacity: number;
  rotation?: number;
  animationDuration: number;
  animationDelay: number;
}
