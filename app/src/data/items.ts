export type ItemType = "targeted_aoe" | "global_freeze" | "global_aoe";

export interface ItemStats {
  id: string;
  name: string;
  type: ItemType;
  cost: number; // 다이아몬드 소모량
  damage: number;
  radius?: number; // 타겟팅 폭탄용 반경
  duration?: number; // 빙결 지속 시간 (초)
  color: string;
  description: string;
}

export const ITEM_CONFIG: Record<string, ItemStats> = {
  bomb: {
    id: "bomb",
    name: "정밀 폭격 (Bomb)",
    type: "targeted_aoe",
    cost: 5, // 예: 다이아몬드 5개 소모
    damage: 50, // 강한 데미지
    radius: 2.5, // 반경 2.5타일
    color: "#F43F5E", // 빨간 폭발
    description: "원하는 위치 주변에 강력한 폭탄을 투하합니다.",
  },
  freeze: {
    id: "freeze",
    name: "절대 영도 (Global Freeze)",
    type: "global_freeze",
    cost: 8,
    damage: 10, // 약한 데미지
    duration: 4.0, // 4초간 빙결/감속
    color: "#38BDF8", // 파란 얼음
    description: "맵 전체의 적을 4초간 꽁꽁 얼리고 약한 피해를 줍니다.",
  },
  global_bomb: {
    id: "global_bomb",
    name: "융단 폭격 (Global Bomb)",
    type: "global_aoe",
    cost: 10,
    damage: 35, // 광역치고는 쏠쏠한 데미지
    color: "#F59E0B", // 노란 화염
    description: "맵 전체의 모든 적에게 즉시 폭격을 가합니다.",
  },
};
