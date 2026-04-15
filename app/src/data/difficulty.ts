export type Difficulty = "easy" | "normal" | "hard";

export interface DifficultyConfig {
  id: Difficulty;
  startGold: number;
  startHeart: number;
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
    enemyHpMultiplier: 0.85,
    enemySpeedMultiplier: 1.0,
    killGoldMultiplier: 1.15,
    spawnCountMultiplier: 0.9,
    enemyTypeLimit: 1,
  },
  normal: {
    id: "normal",
    startGold: 360,
    startHeart: 10,
    enemyHpMultiplier: 1.0,
    enemySpeedMultiplier: 1.0,
    killGoldMultiplier: 1.15,
    spawnCountMultiplier: 1.0,
    enemyTypeLimit: 2,
  },
  hard: {
    id: "hard",
    startGold: 360,
    startHeart: 10,
    enemyHpMultiplier: 1.2,
    enemySpeedMultiplier: 1.0,
    killGoldMultiplier: 1.15,
    spawnCountMultiplier: 1.2,
    enemyTypeLimit: 99,
  },
};
