export type EnemyType = "runner" | "guard";

export interface WaveConfig {
  id: 1 | 2 | 3;
  durationSec: number;
  spawnIntervalSec: number;
  enemies: Array<{ type: EnemyType; weight: number }>;
  totalSpawnCount: number;
}

export const WAVE_CONFIG: Record<1 | 2 | 3, WaveConfig> = {
  1: {
    id: 1,
    durationSec: 180,
    spawnIntervalSec: 2.2,
    enemies: [{ type: "guard", weight: 100 }],
    totalSpawnCount: 36,
  },
  2: {
    id: 2,
    durationSec: 300,
    spawnIntervalSec: 1.8,
    enemies: [
      { type: "guard", weight: 70 },
      { type: "runner", weight: 30 },
    ],
    totalSpawnCount: 90,
  },
  3: {
    id: 3,
    durationSec: 420,
    spawnIntervalSec: 1.5,
    enemies: [
      { type: "guard", weight: 55 },
      { type: "runner", weight: 45 },
    ],
    totalSpawnCount: 168,
  },
};
