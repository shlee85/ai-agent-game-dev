export interface GuideEntry {
  summary: { en: string; kr: string };
  pros: { en: string; kr: string };
  cons: { en: string; kr: string };
}

export const TOWER_GUIDE: Record<string, GuideEntry> = {
  sniper: {
    summary: {
      en: "High-damage single-target cannon. Excels at picking off armored enemies from long range.",
      kr: "고데미지 단일 타겟 저격포. 장거리에서 장갑 적 처리에 탁월.",
    },
    pros: {
      en: "Longest range · High single-hit damage · Guard affinity (×1.3)",
      kr: "가장 긴 사거리 · 높은 타격 데미지 · 가드 상성(×1.3)",
    },
    cons: {
      en: "Single target only · Slow cooldown (1.2s)",
      kr: "단일 타겟 · 느린 쿨타임(1.2초)",
    },
  },
  aoe: {
    summary: {
      en: "Splash cannon that damages all enemies in the blast radius. Best against Runner clusters.",
      kr: "폭발 반경 내 모든 적을 공격하는 광역포. 러너 군집 대응에 최적.",
    },
    pros: {
      en: "Area damage · Runner affinity (×1.3) · Great vs. grouped enemies",
      kr: "광역 데미지 · 러너 상성(×1.3) · 군집 대응 탁월",
    },
    cons: {
      en: "Low base damage per hit · Short range (2.5 tiles)",
      kr: "낮은 기본 타격 데미지 · 짧은 사거리(2.5타일)",
    },
  },
  slow: {
    summary: {
      en: "Freezes enemies and reduces speed by 50%. Keeps enemies in the kill zone longer.",
      kr: "적을 냉동시켜 이동 속도를 50% 감소. 킬존 체류 시간 연장.",
    },
    pros: {
      en: "50% speed reduction · Guard affinity (×1.3) · Synergizes with all towers",
      kr: "이동속도 50% 감소 · 가드 상성(×1.3) · 모든 타워와 시너지",
    },
    cons: {
      en: "Very low damage (5) · Requires support towers to deal kills",
      kr: "매우 낮은 데미지(5) · 보조 타워 없이 처치 비효율",
    },
  },
  chain: {
    summary: {
      en: "Fast-firing AOE tower that chains lightning across nearby enemies. Lower damage per hit but overwhelms with speed.",
      kr: "빠른 연사 광역 타워. 근처 적에게 번개를 연쇄. 타격 데미지는 낮지만 연사 속도로 압도.",
    },
    pros: {
      en: "Fastest attack speed (0.7s CD) · AOE radius · Phantom affinity (×1.3)",
      kr: "최고 공격 속도(0.7초 쿨타임) · 광역 범위 · 팬텀 상성(×1.3)",
    },
    cons: {
      en: "Low damage per hit (8) · Short AOE radius (1.0 tile) · Weak vs. heavy armor alone",
      kr: "낮은 타격 데미지(8) · 짧은 광역 반경(1.0타일) · 단독 중장갑 처리 비효율",
    },
  },
};

export const ITEM_GUIDE: Record<string, GuideEntry> = {
  bomb: {
    summary: {
      en: "Tap a tile to drop a precision bomb. High damage in a 2.5-tile radius.",
      kr: "타일을 탭하여 정밀 폭탄 투하. 반경 2.5타일 범위 고데미지.",
    },
    pros: {
      en: "High focused damage (50) · Best for tough single enemies",
      kr: "집중 고데미지(50) · 강적 처리에 탁월",
    },
    cons: {
      en: "Requires manual targeting · Limited blast area",
      kr: "수동 타겟 지정 필요 · 제한된 폭발 범위",
    },
  },
  freeze: {
    summary: {
      en: "Instantly freezes all enemies on the map for 4 seconds with minor damage.",
      kr: "맵 전체 적을 4초간 즉시 빙결하고 약한 데미지를 줌.",
    },
    pros: {
      en: "Affects all enemies · Buys critical defense time",
      kr: "전체 적 동시 영향 · 위기 방어 시간 확보",
    },
    cons: {
      en: "Low damage (10) · Temporary freeze only",
      kr: "낮은 데미지(10) · 일시적 효과",
    },
  },
  global_bomb: {
    summary: {
      en: "Bombs every enemy on the map simultaneously for solid damage.",
      kr: "맵 전체 적에게 동시에 폭탄 투하. 안정적인 전체 데미지.",
    },
    pros: {
      en: "Hits all enemies (35 dmg) · No targeting needed · Instant",
      kr: "전체 적 타격(데미지 35) · 타겟 불필요 · 즉발",
    },
    cons: {
      en: "Cannot concentrate fire · High shop cost (5💎)",
      kr: "집중 공격 불가 · 상점 가격 높음(5💎)",
    },
  },
  heart_boost: {
    summary: {
      en: "Immediately restores 1 heart. Essential for last-second saves.",
      kr: "즉시 하트 1개 회복. 마지막 순간 역전에 필수.",
    },
    pros: {
      en: "Prevents game-over instantly · Cheapest item (1💎)",
      kr: "즉각 게임오버 방지 · 최저 가격(1💎)",
    },
    cons: {
      en: "No offensive effect · Only +1 heart per use",
      kr: "공격 효과 없음 · 1회 +1하트만 회복",
    },
  },
};

export const ENEMY_GUIDE: Record<string, GuideEntry> = {
  guard: {
    summary: {
      en: "Heavy armored unit. Slow but extremely tanky. GUARD-affinity towers deal ×1.3 damage.",
      kr: "중장갑 유닛. 느리지만 체력이 매우 높음. 가드 상성 타워가 ×1.3 데미지.",
    },
    pros: {
      en: "Very high HP (120 base) · Difficult to burst down quickly",
      kr: "매우 높은 체력(기본 120) · 순간 처치 어려움",
    },
    cons: {
      en: "Slow speed (1.0 tile/s) · Vulnerable to Pulse Lancer & Cryo Field",
      kr: "느린 속도(1.0타일/초) · 펄스 랜서·크라이오 필드에 취약",
    },
  },
  runner: {
    summary: {
      en: "Fast and fragile unit. Low HP but rushes to the goal quickly. RUNNER-affinity towers deal ×1.3 damage.",
      kr: "빠르고 약한 유닛. 체력은 낮지만 목표 지점으로 빠르게 돌진. 러너 상성 타워가 ×1.3 데미지.",
    },
    pros: {
      en: "Very fast (2.2 tiles/s) · Can slip past slow-firing towers",
      kr: "매우 빠른 속도(2.2타일/초) · 쿨타임 긴 타워를 피할 수 있음",
    },
    cons: {
      en: "Low HP (45 base) · Countered hard by Nova Cannon (AOE)",
      kr: "낮은 체력(기본 45) · 노바 캐논(AOE)에 매우 취약",
    },
  },
  phantom: {
    summary: {
      en: "Ghostly unit immune to all slow effects. Moderate HP and speed — Cryo Field is useless against it.",
      kr: "슬로우 효과 완전 면역의 유령 유닛. 중간 체력과 속도 — 크라이오 필드가 무효.",
    },
    pros: {
      en: "Immune to slow (Cryo Field has no effect) · Medium HP+speed balance",
      kr: "슬로우 면역(크라이오 필드 무효) · 체력·속도 균형 중간형",
    },
    cons: {
      en: "No armor bonus · Countered by Volt Striker affinity (×1.3)",
      kr: "방어 보너스 없음 · 볼트 스트라이커 상성에 취약(×1.3)",
    },
  },
  golem: {
    summary: {
      en: "Armored titan with massive HP. Extremely slow but absorbs AOE splash at only 40%. Immune to slow. Appears from Wave 10.",
      kr: "압도적 체력의 기갑 거인. 매우 느리지만 광역 스플래시를 40%만 받음. 슬로우 면역. Wave 10부터 등장.",
    },
    pros: {
      en: "Highest HP of all enemies · 60% AOE damage reduction · Immune to slow · High kill reward (28g)",
      kr: "전 적 중 최고 체력 · AOE 데미지 60% 감소 · 슬로우 면역 · 높은 처치 보상(28골드)",
    },
    cons: {
      en: "Slowest movement speed · Countered by Cryo Field affinity (×1.4 direct damage) · Vulnerable to single-target burst",
      kr: "가장 느린 이동속도 · 크라이오 필드 상성 취약(×1.4 직접 데미지) · 단일 집중 공격에 취약",
    },
  },
};
