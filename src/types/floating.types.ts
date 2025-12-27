export interface FloatingText {
  id: string;
  text: string;
  color: string;
  position: { x: number; y: number };
}

export interface TagSpawnConfig {
  minInterval: number;  // Minimum generation interval (ms)
  maxInterval: number;  // Maximum generation interval (ms)
  maxActiveTags: number; // Maximum number of tags displayed simultaneously
  areaRadius: number;   // Radius around the search box
}
