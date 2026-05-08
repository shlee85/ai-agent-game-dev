import { EnemyType } from "./enemies";

export interface TowerStats {
  id: string;
  name: string;
  cost: number;
  color: string;
  baseDamage: number;
  baseRange: number; // 반경 (타일 단위)
  baseCooldown: number; // 초 단위
  upgradeCost: number; // 업그레이드 비용
  attackType: "single" | "aoe" | "slow";
  slowMultiplier?: number; // 0.5면 50% 감속
  slowDuration?: number; // 초 단위
  aoeRadius?: number; // 광역 범위 (타일 단위)
  affinityEnemyType?: EnemyType; // 상성 적 타입
  affinityMultiplier?: number;   // 상성 대상에게 적용되는 데미지 배율
}

export const TOWER_CONFIG: Record<string, TowerStats> = {
  sniper: {
    id: "sniper",
    name: "펄스 랜서 (Pulse Lancer)",
    cost: 120,
    color: "#3B82F6",
    baseDamage: 45,
    baseRange: 3.5,
    baseCooldown: 1.2,
    upgradeCost: 180,
    attackType: "single",
    affinityEnemyType: "guard",
    affinityMultiplier: 1.3,
  },
  aoe: {
    id: "aoe",
    name: "노바 캐논 (Nova Cannon)",
    cost: 160,
    color: "#F97316",
    baseDamage: 15,
    baseRange: 2.5,
    baseCooldown: 1.5,
    upgradeCost: 240,
    attackType: "aoe",
    aoeRadius: 1.5,
    affinityEnemyType: "runner",
    affinityMultiplier: 1.3,
  },
  slow: {
    id: "slow",
    name: "크라이오 필드 (Cryo Field)",
    cost: 140,
    color: "#06B6D4",
    baseDamage: 5,
    baseRange: 2.5,
    baseCooldown: 1.0,
    upgradeCost: 210,
    attackType: "slow",
    slowMultiplier: 0.5,
    slowDuration: 2.0,
    affinityEnemyType: "golem",
    affinityMultiplier: 1.4,
  },
  chain: {
    id: "chain",
    name: "볼트 스트라이커 (Volt Striker)",
    cost: 150,
    color: "#A855F7",
    baseDamage: 8,
    baseRange: 3.0,
    baseCooldown: 0.7,
    upgradeCost: 225,
    attackType: "aoe",
    aoeRadius: 1.0,
    affinityEnemyType: "phantom",
    affinityMultiplier: 1.3,
  },
};
