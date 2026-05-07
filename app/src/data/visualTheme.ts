export interface TowerVisualTheme {
  roleTag: string;
  roleLabel: string;
}

export interface EnemyVisualTheme {
  threatTag: string;
}

export const TOWER_VISUAL_THEME: Record<string, TowerVisualTheme> = {
  sniper: { roleTag: "SN", roleLabel: "Precision" },
  aoe: { roleTag: "AOE", roleLabel: "Blast" },
  slow: { roleTag: "CC", roleLabel: "Control" },
  chain: { roleTag: "VOLT", roleLabel: "Chain" },
};

export const ENEMY_VISUAL_THEME: Record<string, EnemyVisualTheme> = {
  runner: { threatTag: "RUSH" },
  guard: { threatTag: "HOLD" },
  phantom: { threatTag: "GHOST" },
};

export function getTowerRoleTag(towerId: string): string {
  return TOWER_VISUAL_THEME[towerId]?.roleTag ?? "T";
}

export function getTowerRoleLabel(towerId: string): string {
  return TOWER_VISUAL_THEME[towerId]?.roleLabel ?? "Tower";
}

export function getEnemyThreatTag(enemyType: string): string {
  return ENEMY_VISUAL_THEME[enemyType]?.threatTag ?? "UNIT";
}
