export type EnemyType = "runner" | "guard" | "phantom" | "golem";

export interface EnemyStats {
  id: EnemyType;
  name: string;
  baseHp: number;
  baseSpeed: number; // 타일/초
  killReward: number; // 기본 처치 골드
  color: string;
  size: number; // 1.0이 1타일 크기
  immuneToSlow?: boolean;
  aoeResistance?: number; // 1.0 = 풀 데미지, 0.4 = AOE 데미지 40%만 받음
}

export const ENEMY_CONFIG: Record<EnemyType, EnemyStats> = {
  guard: {
    id: "guard",
    name: "가드 쉘 (Guard Shell)",
    baseHp: 120,
    baseSpeed: 1.0,
    killReward: 10,
    color: "#EF4444",
    size: 0.6,
  },
  runner: {
    id: "runner",
    name: "러너 드론 (Runner Drone)",
    baseHp: 45,
    baseSpeed: 2.2,
    killReward: 12,
    color: "#F43F5E",
    size: 0.45,
  },
  phantom: {
    id: "phantom",
    name: "팬텀 크롤러 (Phantom Crawler)",
    baseHp: 75,
    baseSpeed: 1.7,
    killReward: 14,
    color: "#8B5CF6",
    size: 0.5,
    immuneToSlow: true,
  },
  golem: {
    id: "golem",
    name: "시즈 골렘 (Siege Golem)",
    baseHp: 350,
    baseSpeed: 0.45,
    killReward: 28,
    color: "#78716C",
    size: 0.82,
    immuneToSlow: true,
    aoeResistance: 0.4,
  },
};
