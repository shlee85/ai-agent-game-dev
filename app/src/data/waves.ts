import { EnemyType } from "./enemies";
import { Difficulty } from "./difficulty";

export type WaveId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type LobbyWaveId = WaveId;
export type TimeObjectiveWaveId = 7 | 19;
export type WaveIdAll = WaveId;

export interface WaveConfig {
  id: WaveIdAll;
  durationSec: number;
  spawnIntervalSecByDifficulty: Record<Difficulty, number>;
  enemies: Array<{ type: EnemyType; weight: number }>;
  totalSpawnCountByDifficulty: Record<Difficulty, number>;
  clearGoldRewardByDifficulty: Record<Difficulty, number>;
  clearDiamondRewardByDifficulty: Record<Difficulty, number>;
  isTimeObjective?: boolean;
  // Time objective에서 kill 골드가 없거나(=clear 골드로 대체) 싶을 때 사용
  killGoldMultiplierByDifficulty?: Record<Difficulty, number>;
}

export const WAVE_CONFIG: Record<WaveIdAll, WaveConfig> = {
  1: {
    id: 1,
    durationSec: 180,
    spawnIntervalSecByDifficulty: {
      easy: 2.3,
      normal: 2.2,
      hard: 2.0,
    },
    enemies: [{ type: "guard", weight: 100 }],
    totalSpawnCountByDifficulty: {
      easy: 30,
      normal: 36,
      hard: 44,
    },
    clearGoldRewardByDifficulty: {
      easy: 30,
      normal: 40,
      hard: 55,
    },
    clearDiamondRewardByDifficulty: {
      easy: 1,
      normal: 1,
      hard: 2,
    },
  },
  2: {
    id: 2,
    durationSec: 240,
    spawnIntervalSecByDifficulty: {
      easy: 2.1,
      normal: 2.0,
      hard: 1.8,
    },
    enemies: [
      { type: "guard", weight: 70 },
      { type: "runner", weight: 30 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 56,
      normal: 72,
      hard: 88,
    },
    clearGoldRewardByDifficulty: {
      easy: 45,
      normal: 60,
      hard: 80,
    },
    clearDiamondRewardByDifficulty: {
      easy: 1,
      normal: 2,
      hard: 2,
    },
  },
  3: {
    id: 3,
    durationSec: 300,
    spawnIntervalSecByDifficulty: {
      easy: 1.9,
      normal: 1.8,
      hard: 1.6,
    },
    enemies: [
      { type: "guard", weight: 60 },
      { type: "runner", weight: 40 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 84,
      normal: 108,
      hard: 132,
    },
    clearGoldRewardByDifficulty: {
      easy: 60,
      normal: 85,
      hard: 110,
    },
    clearDiamondRewardByDifficulty: {
      easy: 2,
      normal: 2,
      hard: 3,
    },
  },
  4: {
    id: 4,
    durationSec: 360,
    spawnIntervalSecByDifficulty: {
      easy: 1.7,
      normal: 1.6,
      hard: 1.4,
    },
    enemies: [
      { type: "guard", weight: 50 },
      { type: "runner", weight: 50 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 112,
      normal: 144,
      hard: 176,
    },
    clearGoldRewardByDifficulty: {
      easy: 80,
      normal: 110,
      hard: 145,
    },
    clearDiamondRewardByDifficulty: {
      easy: 2,
      normal: 3,
      hard: 3,
    },
  },
  5: {
    id: 5,
    durationSec: 420,
    spawnIntervalSecByDifficulty: {
      easy: 1.55,
      normal: 1.45,
      hard: 1.25,
    },
    enemies: [
      { type: "guard", weight: 45 },
      { type: "runner", weight: 55 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 140,
      normal: 180,
      hard: 220,
    },
    clearGoldRewardByDifficulty: {
      easy: 100,
      normal: 140,
      hard: 185,
    },
    clearDiamondRewardByDifficulty: {
      easy: 3,
      normal: 3,
      hard: 4,
    },
  },
  6: {
    id: 6,
    durationSec: 480,
    spawnIntervalSecByDifficulty: {
      easy: 1.4,
      normal: 1.3,
      hard: 1.1,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 60 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 168,
      normal: 220,
      hard: 264,
    },
    clearGoldRewardByDifficulty: {
      easy: 130,
      normal: 180,
      hard: 230,
    },
    clearDiamondRewardByDifficulty: {
      easy: 3,
      normal: 4,
      hard: 5,
    },
  },
  7: {
    id: 7,
    // time objective: 시간에 맞춰 클리어, UI에 타임 표시
    durationSec: 180,
    spawnIntervalSecByDifficulty: {
      easy: 1.6,
      normal: 1.4,
      hard: 1.2,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 60 },
    ],
    // duration / spawnInterval을 기반으로 예상 마리수(내림)
    totalSpawnCountByDifficulty: {
      easy: 112,
      normal: 126,
      hard: 144,
    },
    // time objective에서는 "마리당 골드"를 clear 골드로 대체
    // (기존 wave 평균 처치 골드 대비 낮게 설계)
    clearGoldRewardByDifficulty: {
      easy: 851,
      normal: 957,
      hard: 1094,
    },
    clearDiamondRewardByDifficulty: {
      // "10마리에 1개 정도"
      easy: 11,
      normal: 12,
      hard: 14,
    },
    isTimeObjective: true,
    // clearGoldRewardByDifficulty로 골드를 대체하므로 kill 골드는 0으로 둠
    killGoldMultiplierByDifficulty: {
      easy: 0,
      normal: 0,
      hard: 0,
    },
  },
  8: {
    id: 8,
    durationSec: 390,
    spawnIntervalSecByDifficulty: {
      easy: 1.35,
      normal: 1.25,
      hard: 1.12,
    },
    enemies: [
      { type: "guard", weight: 35 },
      { type: "runner", weight: 65 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 165,
      normal: 198,
      hard: 234,
    },
    clearGoldRewardByDifficulty: {
      easy: 180,
      normal: 235,
      hard: 290,
    },
    clearDiamondRewardByDifficulty: {
      easy: 4,
      normal: 5,
      hard: 6,
    },
  },
  9: {
    id: 9,
    durationSec: 450,
    spawnIntervalSecByDifficulty: {
      easy: 1.25,
      normal: 1.15,
      hard: 1.02,
    },
    enemies: [
      { type: "guard", weight: 30 },
      { type: "runner", weight: 70 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 190,
      normal: 228,
      hard: 265,
    },
    clearGoldRewardByDifficulty: {
      easy: 210,
      normal: 270,
      hard: 330,
    },
    clearDiamondRewardByDifficulty: {
      easy: 4,
      normal: 5,
      hard: 6,
    },
  },
  10: {
    id: 10,
    durationSec: 520,
    spawnIntervalSecByDifficulty: {
      easy: 1.15,
      normal: 1.05,
      hard: 0.95,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 50 },
      { type: "golem", weight: 10 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 220,
      normal: 260,
      hard: 300,
    },
    clearGoldRewardByDifficulty: {
      easy: 250,
      normal: 320,
      hard: 390,
    },
    clearDiamondRewardByDifficulty: {
      easy: 5,
      normal: 6,
      hard: 7,
    },
  },
  11: {
    id: 11,
    durationSec: 540,
    spawnIntervalSecByDifficulty: {
      easy: 1.1,
      normal: 1.0,
      hard: 0.9,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 60 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 240,
      normal: 290,
      hard: 340,
    },
    clearGoldRewardByDifficulty: {
      easy: 280,
      normal: 360,
      hard: 440,
    },
    clearDiamondRewardByDifficulty: {
      easy: 5,
      normal: 6,
      hard: 7,
    },
  },
  12: {
    id: 12,
    // time objective: 200초 생존하면 wave_clear
    durationSec: 200,
    spawnIntervalSecByDifficulty: {
      easy: 1.0,
      normal: 0.92,
      hard: 0.84,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 60 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 200,
      normal: 217,
      hard: 238,
    },
    // kill 골드 0, clear 골드는 마리 수 기반 (avg 7.6 gold/enemy)
    clearGoldRewardByDifficulty: {
      easy: 1520,
      normal: 1649,
      hard: 1809,
    },
    clearDiamondRewardByDifficulty: {
      easy: 20,
      normal: 21,
      hard: 23,
    },
    isTimeObjective: true,
    killGoldMultiplierByDifficulty: {
      easy: 0,
      normal: 0,
      hard: 0,
    },
  },
  13: {
    id: 13,
    durationSec: 600,
    spawnIntervalSecByDifficulty: {
      easy: 0.95,
      normal: 0.88,
      hard: 0.8,
    },
    enemies: [
      { type: "guard", weight: 30 },
      { type: "runner", weight: 55 },
      { type: "golem", weight: 15 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 285,
      normal: 350,
      hard: 420,
    },
    clearGoldRewardByDifficulty: {
      easy: 350,
      normal: 450,
      hard: 550,
    },
    clearDiamondRewardByDifficulty: {
      easy: 6,
      normal: 7,
      hard: 8,
    },
  },
  14: {
    id: 14,
    durationSec: 630,
    spawnIntervalSecByDifficulty: {
      easy: 0.9,
      normal: 0.83,
      hard: 0.76,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 60 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 310,
      normal: 390,
      hard: 470,
    },
    clearGoldRewardByDifficulty: {
      easy: 390,
      normal: 500,
      hard: 620,
    },
    clearDiamondRewardByDifficulty: {
      easy: 7,
      normal: 8,
      hard: 9,
    },
  },
  15: {
    id: 15,
    durationSec: 660,
    spawnIntervalSecByDifficulty: {
      easy: 0.85,
      normal: 0.78,
      hard: 0.72,
    },
    enemies: [
      { type: "guard", weight: 35 },
      { type: "runner", weight: 45 },
      { type: "golem", weight: 20 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 340,
      normal: 430,
      hard: 520,
    },
    clearGoldRewardByDifficulty: {
      easy: 430,
      normal: 560,
      hard: 700,
    },
    clearDiamondRewardByDifficulty: {
      easy: 8,
      normal: 9,
      hard: 10,
    },
  },
  16: {
    id: 16,
    durationSec: 480,
    spawnIntervalSecByDifficulty: {
      easy: 1.3,
      normal: 1.2,
      hard: 1.0,
    },
    enemies: [
      { type: "guard", weight: 40 },
      { type: "runner", weight: 30 },
      { type: "phantom", weight: 30 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 200,
      normal: 240,
      hard: 280,
    },
    clearGoldRewardByDifficulty: {
      easy: 450,
      normal: 580,
      hard: 720,
    },
    clearDiamondRewardByDifficulty: {
      easy: 8,
      normal: 9,
      hard: 10,
    },
  },
  17: {
    id: 17,
    durationSec: 510,
    spawnIntervalSecByDifficulty: {
      easy: 1.2,
      normal: 1.1,
      hard: 0.95,
    },
    enemies: [
      { type: "guard", weight: 35 },
      { type: "phantom", weight: 40 },
      { type: "golem", weight: 25 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 220,
      normal: 265,
      hard: 310,
    },
    clearGoldRewardByDifficulty: {
      easy: 490,
      normal: 640,
      hard: 790,
    },
    clearDiamondRewardByDifficulty: {
      easy: 9,
      normal: 10,
      hard: 11,
    },
  },
  18: {
    id: 18,
    durationSec: 540,
    spawnIntervalSecByDifficulty: {
      easy: 1.1,
      normal: 1.0,
      hard: 0.9,
    },
    enemies: [
      { type: "runner", weight: 60 },
      { type: "phantom", weight: 40 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 240,
      normal: 290,
      hard: 340,
    },
    clearGoldRewardByDifficulty: {
      easy: 540,
      normal: 700,
      hard: 860,
    },
    clearDiamondRewardByDifficulty: {
      easy: 9,
      normal: 10,
      hard: 12,
    },
  },
  19: {
    id: 19,
    durationSec: 220,
    spawnIntervalSecByDifficulty: {
      easy: 0.95,
      normal: 0.85,
      hard: 0.75,
    },
    enemies: [
      { type: "guard", weight: 30 },
      { type: "runner", weight: 30 },
      { type: "phantom", weight: 40 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 231,
      normal: 258,
      hard: 293,
    },
    clearGoldRewardByDifficulty: {
      easy: 1800,
      normal: 2100,
      hard: 2500,
    },
    clearDiamondRewardByDifficulty: {
      easy: 23,
      normal: 25,
      hard: 28,
    },
    isTimeObjective: true,
    killGoldMultiplierByDifficulty: {
      easy: 0,
      normal: 0,
      hard: 0,
    },
  },
  20: {
    id: 20,
    durationSec: 720,
    spawnIntervalSecByDifficulty: {
      easy: 0.82,
      normal: 0.75,
      hard: 0.68,
    },
    enemies: [
      { type: "guard", weight: 20 },
      { type: "runner", weight: 25 },
      { type: "phantom", weight: 30 },
      { type: "golem", weight: 25 },
    ],
    totalSpawnCountByDifficulty: {
      easy: 380,
      normal: 480,
      hard: 580,
    },
    clearGoldRewardByDifficulty: {
      easy: 600,
      normal: 800,
      hard: 1000,
    },
    clearDiamondRewardByDifficulty: {
      easy: 10,
      normal: 12,
      hard: 15,
    },
  },
};
