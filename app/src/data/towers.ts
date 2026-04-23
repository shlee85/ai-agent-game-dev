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
}

export const TOWER_CONFIG: Record<string, TowerStats> = {
  sniper: {
    id: "sniper",
    name: "Aegis Lance",
    cost: 120,
    color: "#3B82F6",
    baseDamage: 45,
    baseRange: 3.5,
    baseCooldown: 1.2,
    upgradeCost: 180,
    attackType: "single",
  },
  aoe: {
    id: "aoe",
    name: "Ember Nova",
    cost: 160,
    color: "#F97316",
    baseDamage: 15,
    baseRange: 2.5,
    baseCooldown: 1.5,
    upgradeCost: 240,
    attackType: "aoe",
    aoeRadius: 1.5,
  },
  slow: {
    id: "slow",
    name: "Frost Ward",
    cost: 140,
    color: "#06B6D4",
    baseDamage: 5,
    baseRange: 2.5,
    baseCooldown: 1.0,
    upgradeCost: 210,
    attackType: "slow",
    slowMultiplier: 0.5,
    slowDuration: 2.0,
  },
};
