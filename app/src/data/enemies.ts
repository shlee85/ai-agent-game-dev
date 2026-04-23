export type EnemyType = "runner" | "guard";

export interface EnemyStats {
  id: EnemyType;
  name: string;
  baseHp: number;
  baseSpeed: number; // 타일/초
  killReward: number; // 기본 처치 골드
  color: string;
  size: number; // 1.0이 1타일 크기
}

export const ENEMY_CONFIG: Record<EnemyType, EnemyStats> = {
  guard: {
    id: "guard",
    name: "Guard Shell",
    baseHp: 120, // 기본형(튼튼함)
    baseSpeed: 1.0, // 느림
    killReward: 10,
    color: "#EF4444", // 진한 빨강
    size: 0.6,
  },
  runner: {
    id: "runner",
    name: "Runner Drone",
    baseHp: 45, // 돌격형(체력 낮음)
    baseSpeed: 2.2, // 아주 빠름
    killReward: 12,
    color: "#F43F5E", // 밝은 분홍/빨강
    size: 0.45, // 크기가 조금 작음
  }
};
