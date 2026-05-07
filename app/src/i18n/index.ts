export type Lang = "en" | "kr";

export interface I18nStrings {
  // Lobby
  tagline: string;
  waveLabel: string;
  shop: string;
  reset: string;
  // Difficulty
  easy: string;
  normal: string;
  hard: string;
  // HUD
  timeLabel: string;
  // Actions
  upgrade: string;
  sell: string;
  max: string;
  back: string;
  // Tower
  towerName: Record<string, string>;
  roleLabel: Record<string, string>;
  // Enemy
  enemyName: Record<string, string>;
  // Affinity
  affinityEnemy: Record<string, string>;
  affinityLabel: string;
  // Shop
  shopTitle: string;
  stock: string;
  diamond: string;
  shopItemLabel: Record<string, string>;
  // ItemShop
  skills: string;
  // Result screen
  gameOver: string;
  waveClear: string;
  gameOverDesc: string;
  timeObjectiveClearDesc: string;
  waveClearDesc: string;
  resultReport: string;
  kills: string;
  leaks: string;
  goldEarned: string;
  diamondEarned: string;
  usedItems: string;
  nextWave: string;
  backToLobby: string;
  // Pause screen
  pauseTitle: string;
  pauseDesc: string;
  continueGame: string;
  restartWave: string;
  menu: string;
  // Alert
  restartWaveTitle: string;
  restartWaveMsg: string;
  cancel: string;
  confirm: string;
  // Guide screen
  guide: string;
  guideTabTower: string;
  guideTabItem: string;
  guideTabEnemy: string;
  guidePros: string;
  guideCons: string;
  guideSummary: string;
  guideCost: string;
  guideShopPrice: string;
  guideAttackType: string;
  guideAffinity: string;
  guideBaseHp: string;
  guideSpeed: string;
  guideReward: string;
}

export const STRINGS: Record<Lang, I18nStrings> = {
  en: {
    tagline: "DEFEND THE SPACE UNION",
    waveLabel: "Wave",
    shop: "SHOP",
    reset: "RESET",
    easy: "EASY",
    normal: "NORMAL",
    hard: "HARD",
    timeLabel: "Time",
    upgrade: "Upgrade",
    sell: "Sell",
    max: "Max",
    back: "BACK",
    towerName: {
      sniper: "Pulse Lancer",
      aoe: "Nova Cannon",
      slow: "Cryo Field",
      chain: "Volt Striker",
    },
    roleLabel: {
      sniper: "Precision",
      aoe: "Blast",
      slow: "Control",
      chain: "Chain",
    },
    enemyName: {
      guard: "Guard Shell",
      runner: "Runner Drone",
      phantom: "Phantom Crawler",
    },
    affinityEnemy: {
      guard: "GUARD",
      runner: "RUNNER",
      phantom: "PHANTOM",
    },
    affinityLabel: "Affinity",
    shopTitle: "SHOP",
    stock: "Stock",
    diamond: "DIAMOND",
    shopItemLabel: {
      global_bomb: "Global Attack",
      bomb: "Targeted Attack",
      freeze: "Slow Down",
      heart_boost: "Heart +1",
    },
    skills: "SKILLS",
    gameOver: "GAME OVER",
    waveClear: "WAVE CLEAR!",
    gameOverDesc: "All hearts have been depleted.",
    timeObjectiveClearDesc: "Time objective achieved!",
    waveClearDesc: "All enemies repelled!",
    resultReport: "RESULT REPORT",
    kills: "Kills",
    leaks: "Leaks",
    goldEarned: "Gold Earned",
    diamondEarned: "Diamond Earned",
    usedItems: "Items Used",
    nextWave: "Next Wave",
    backToLobby: "Back to Lobby",
    pauseTitle: "PAUSED",
    pauseDesc: "Game is paused.",
    continueGame: "Continue",
    restartWave: "Restart Wave",
    menu: "⚙️ Menu",
    restartWaveTitle: "Restart Wave",
    restartWaveMsg: "Progress will be reset. Continue?",
    cancel: "Cancel",
    confirm: "Confirm",
    guide: "GUIDE",
    guideTabTower: "Towers",
    guideTabItem: "Items",
    guideTabEnemy: "Enemies",
    guidePros: "Pros",
    guideCons: "Cons",
    guideSummary: "Summary",
    guideCost: "Build Cost",
    guideShopPrice: "Shop Price",
    guideAttackType: "Type",
    guideAffinity: "Affinity",
    guideBaseHp: "Base HP",
    guideSpeed: "Speed",
    guideReward: "Kill Reward",
  },
  kr: {
    tagline: "우주 연합을 수호하라",
    waveLabel: "웨이브",
    shop: "상점",
    reset: "초기화",
    easy: "쉬움",
    normal: "보통",
    hard: "어려움",
    timeLabel: "시간",
    upgrade: "업그레이드",
    sell: "판매",
    max: "최대",
    back: "뒤로",
    towerName: {
      sniper: "펄스 랜서",
      aoe: "노바 캐논",
      slow: "크라이오 필드",
      chain: "볼트 스트라이커",
    },
    roleLabel: {
      sniper: "정밀",
      aoe: "폭격",
      slow: "제압",
      chain: "연쇄",
    },
    enemyName: {
      guard: "가드 쉘",
      runner: "러너 드론",
      phantom: "팬텀 크롤러",
    },
    affinityEnemy: {
      guard: "가드",
      runner: "러너",
      phantom: "팬텀",
    },
    affinityLabel: "상성",
    shopTitle: "상점",
    stock: "보유 수량",
    diamond: "다이아",
    shopItemLabel: {
      global_bomb: "전체공격",
      bomb: "일부공격",
      freeze: "느리게",
      heart_boost: "하트 증가",
    },
    skills: "스킬",
    gameOver: "게임 오버",
    waveClear: "웨이브 클리어!",
    gameOverDesc: "하트가 모두 소진되었습니다.",
    timeObjectiveClearDesc: "시간 목표를 달성했습니다!",
    waveClearDesc: "모든 적을 막아냈습니다!",
    resultReport: "결과 보고",
    kills: "처치 수",
    leaks: "누수 수",
    goldEarned: "획득 골드",
    diamondEarned: "획득 보석",
    usedItems: "사용 아이템",
    nextWave: "다음 웨이브로 진행",
    backToLobby: "로비로 돌아가기",
    pauseTitle: "일시 정지",
    pauseDesc: "게임을 잠시 멈췄습니다.",
    continueGame: "계속 하기",
    restartWave: "이 웨이브 다시 시작",
    menu: "⚙️ 메뉴",
    restartWaveTitle: "웨이브 다시 시작",
    restartWaveMsg: "진행 상황이 초기화됩니다. 계속할까요?",
    cancel: "취소",
    confirm: "확인",
    guide: "가이드",
    guideTabTower: "타워",
    guideTabItem: "아이템",
    guideTabEnemy: "적",
    guidePros: "장점",
    guideCons: "단점",
    guideSummary: "설명",
    guideCost: "건설 비용",
    guideShopPrice: "상점 가격",
    guideAttackType: "공격 타입",
    guideAffinity: "상성",
    guideBaseHp: "기본 체력",
    guideSpeed: "이동 속도",
    guideReward: "처치 보상",
  },
};
