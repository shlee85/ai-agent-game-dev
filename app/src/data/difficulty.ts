export type Difficulty = "easy" | "normal" | "hard";

export interface DifficultyConfig {
  id: Difficulty;
  startGold: number;
  startHeart: number;
  startDiamond: number;
  enemyHpMultiplier: number;
  enemySpeedMultiplier: number;
  killGoldMultiplier: number;
  spawnCountMultiplier: number;
  enemyTypeLimit: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: "easy",
    startGold: 360,
    startHeart: 10,
    startDiamond: 30, // 베타 기간 테스트 넉넉히
    enemyHpMultiplier: 0.9,
    enemySpeedMultiplier: 0.93,
    killGoldMultiplier: 1.0,
    spawnCountMultiplier: 1.0,
    enemyTypeLimit: 1,
  },
  normal: {
    id: "normal",
    startGold: 360,
    startHeart: 10,
    startDiamond: 20,
    enemyHpMultiplier: 1.0,
    enemySpeedMultiplier: 1.0,
    killGoldMultiplier: 1.0,
    spawnCountMultiplier: 1.0,
    enemyTypeLimit: 2,
  },
  hard: {
    id: "hard",
    startGold: 360,
    startHeart: 10,
    startDiamond: 10,
    enemyHpMultiplier: 1.25,
    enemySpeedMultiplier: 1.08,
    killGoldMultiplier: 1.0,
    spawnCountMultiplier: 1.0,
    enemyTypeLimit: 99,
  },
};
