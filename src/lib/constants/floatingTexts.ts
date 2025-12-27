import type { TagSpawnConfig } from '@/types/floating.types';

export const FLOATING_TEXTS = [
  "Code with passion",
  "Debug like a detective",
  "Stay curious, keep learning",
  "Build the future",
  "Coffee & Code",
  "Embrace the bugs",
  "Ship it!",
  "Think different",
  "Make it work, make it right, make it fast",
  "Less code, more impact",
  "Fail fast, learn faster",
  "Code is poetry",
  "Iterate and improve",
  "Simplicity is key",
  "Keep it DRY",
  "Write tests, save time",
  "Refactor fearlessly",
  "Git commit often",
  "Automate everything",
  "Deploy on Friday",
  "Measure twice, code once",
  "First make it work",
  "Never stop learning",
  "Clean code matters",
  "Performance is a feature",
  "Security first",
  "User experience wins",
  "Document your code",
  "Review before merge",
  "Break it, fix it, improve it"
];

export const TAG_COLORS = [
  '#3B82F6',  // blue
  '#8B5CF6',  // purple
  '#10B981',  // green
  '#F59E0B',  // orange
  '#EC4899',  // pink
  '#14B8A6',  // teal
  '#6366F1',  // indigo
];

export const TAG_SPAWN_CONFIG: TagSpawnConfig = {
  minInterval: 3000,
  maxInterval: 5000,
  maxActiveTags: 4,
  areaRadius: 300
};
