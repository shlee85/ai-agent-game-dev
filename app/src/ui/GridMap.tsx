import React, { useState, useEffect } from "react";
import { View, LayoutChangeEvent, Pressable, Text, Animated, Image } from "react-native";

import { StageConfig } from "../data/stages";
import { ENEMY_ASSETS } from "../data/enemyAssets";
import { getTowerImage } from "../data/towerAssets";
import { getEnemyThreatTag } from "../data/visualTheme";
import { PROJECTILE_ASSETS } from "../data/projectileAssets";

interface TowerData {
  type: string;
  color: string;
  level: number;
}

export interface ProjectileData {
  id: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  spawnTime: number;
  duration: number;
  color: string;
  towerType: string;
  angle: number;
}

export interface AttackEffect {
  id: string;
  row: number;
  col: number;
  color: string;
  size: number;
  effectType?: "impact_single" | "impact_slow" | "impact_aoe" | "recoil" | "item_aoe";
}

export interface FloatingTextData {
  id: string;
  row: number;
  col: number;
  text: string;
  color: string;
}

export interface EnemyData {
  id: string;
  type: string;
  hp: number;
  maxHp: number;
  baseSpeed: number;
  speed: number;
  pathIndex: number;
  progress: number;
  selectedPathIndex?: number;
  immuneToSlow?: boolean;
  isSlowed?: boolean;
  slowTimer?: number;
  hitTimer?: number;
  color?: string;
  size?: number;
  killReward?: number;
  spawnAt?: number;
}

interface GridMapProps {
  stage: StageConfig;
  selectedCell: { row: number; col: number } | null;
  towers: Record<string, TowerData>;
  enemies?: EnemyData[];
  attackEffects?: AttackEffect[];
  floatingTexts?: FloatingTextData[];
  rangeDisplay?: { row: number; col: number; radius: number } | null;
  flashColor?: string | null;
  towerAngles?: Record<string, number>;
  projectiles?: ProjectileData[];
  onSelectCell: (row: number, col: number) => void;
}

function tileKey(r: number, c: number) {
  return `${r},${c}`;
}

function getEnemyAsset(type: string) {
  return ENEMY_ASSETS[type] || ENEMY_ASSETS.guard;
}

// 플로팅 텍스트 애니메이션 처리를 위한 개별 컴포넌트
function FloatingTextItem({ data, tileSize }: { data: FloatingTextData; tileSize: number }) {
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: data.row * tileSize - 10,
        left: data.col * tileSize,
        width: tileSize,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        pointerEvents: "none",
        transform: [{ translateY }],
        opacity,
      }}
    >
      <Text style={{ color: data.color, fontWeight: "900", fontSize: 14, textShadowColor: "rgba(0,0,0,0.8)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
        {data.text}
      </Text>
    </Animated.View>
  );
}

export function GridMap({ stage, selectedCell, towers, enemies = [], attackEffects = [], floatingTexts = [], rangeDisplay = null, flashColor = null, towerAngles = {}, projectiles = [], onSelectCell }: GridMapProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const padding = 16;
  const availableWidth = Math.max(0, containerSize.width - padding);
  const availableHeight = Math.max(0, containerSize.height - padding);

  let tileSize = 0;
  if (availableWidth > 0 && availableHeight > 0) {
    tileSize = Math.floor(
      Math.min(availableWidth / stage.cols, availableHeight / stage.rows)
    );
  }

  const allPathTiles = stage.paths ? stage.paths.flat() : stage.pathTiles;
  const pathSet = new Set(allPathTiles.map(([r, c]) => tileKey(r, c)));

  const allStartTiles = stage.multiStartTiles ? stage.multiStartTiles : stage.startTiles;
  const startSet = new Set(allStartTiles.map(([r, c]) => tileKey(r, c)));

  const goalKey = tileKey(stage.goalTile[0], stage.goalTile[1]);
  const blockedSet = new Set((stage.blockedTiles || []).map(([r, c]) => tileKey(r, c)));

  const inPlacementMode = selectedCell !== null;

  return (
    <View
      className="flex-1 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/40 p-2"
      onLayout={handleLayout}
    >
      {tileSize > 0 && (
        <View
          style={{
            width: tileSize * stage.cols,
            height: tileSize * stage.rows,
          }}
        >
          {Array.from({ length: stage.rows }).map((_, row) => (
            <View key={`row-${row}`} className="flex-row">
              {Array.from({ length: stage.cols }).map((__, col) => {
                const key = tileKey(row, col);
                const isStart = startSet.has(key);
                const isGoal = key === goalKey;
                const isPath = pathSet.has(key);
                const isBlocked = blockedSet.has(key);
                const tower = towers[key];
                const isSelected = selectedCell?.row === row && selectedCell?.col === col;

                const isPlaceable = !isPath && !isStart && !isGoal && !isBlocked && !tower;

                // 평상시 배경: 경로/골/장애물만 구분, 빈 타일은 투명
                let bg = "transparent";
                if (isPath || isStart) bg = "rgba(40, 50, 70, 0.82)";
                else if (isGoal) bg = "rgba(180, 40, 60, 0.55)";
                else if (isBlocked) bg = "rgba(30, 25, 20, 0.85)";

                // 배치 모드일 때 색상 오버레이
                let placementBg = "transparent";
                let borderWidth = 0;
                let borderColor = "transparent";

                if (inPlacementMode && !isPath && !isStart && !isGoal) {
                  if (isPlaceable) {
                    placementBg = "rgba(16, 185, 129, 0.12)";
                    borderWidth = 0.5;
                    borderColor = "rgba(16, 185, 129, 0.35)";
                  } else if (!isBlocked) {
                    placementBg = "rgba(244, 63, 94, 0.1)";
                    borderWidth = 0.5;
                    borderColor = "rgba(244, 63, 94, 0.3)";
                  }
                }

                // 선택된 타일 강조
                if (isSelected) {
                  placementBg = isPlaceable ? "rgba(16, 185, 129, 0.38)" : "rgba(244, 63, 94, 0.38)";
                  borderWidth = 2;
                  borderColor = isPlaceable ? "#10B981" : "#F43F5E";
                }

                return (
                  <Pressable
                    key={key}
                    onPress={() => onSelectCell(row, col)}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: bg,
                      zIndex: isSelected ? 10 : 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* 배치 모드 오버레이 */}
                    {(inPlacementMode || isSelected) && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: placementBg,
                          borderWidth,
                          borderColor,
                        }}
                      />
                    )}

                    {/* 경로 타일: 진입/목표 마커 */}
                    {isStart && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          width: tileSize * 0.5,
                          height: tileSize * 0.5,
                          borderRadius: tileSize * 0.25,
                          backgroundColor: "rgba(16, 185, 129, 0.6)",
                          borderWidth: 1.5,
                          borderColor: "#10B981",
                        }}
                      />
                    )}
                    {isGoal && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          width: tileSize * 0.48,
                          height: tileSize * 0.48,
                          borderRadius: 4,
                          backgroundColor: "rgba(244, 63, 94, 0.65)",
                          borderWidth: 1.5,
                          borderColor: "#F43F5E",
                        }}
                      />
                    )}

                    {/* 장애물 타일: 바위 느낌 */}
                    {isBlocked && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          width: tileSize * 0.72,
                          height: tileSize * 0.72,
                          borderRadius: 6,
                          backgroundColor: "rgba(55, 45, 35, 0.9)",
                          borderWidth: 1,
                          borderColor: "rgba(100, 80, 60, 0.6)",
                        }}
                      >
                        <View style={{
                          position: "absolute",
                          top: "20%", left: "15%",
                          width: "35%", height: "18%",
                          borderRadius: 3,
                          backgroundColor: "rgba(120, 100, 80, 0.4)",
                        }} />
                        <View style={{
                          position: "absolute",
                          top: "55%", left: "40%",
                          width: "28%", height: "14%",
                          borderRadius: 2,
                          backgroundColor: "rgba(120, 100, 80, 0.3)",
                        }} />
                      </View>
                    )}

                    {/* 설치된 타워 */}
                    {tower && (
                      <View
                        style={{
                          width: tileSize * 0.74,
                          height: tileSize * 0.74,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={getTowerImage(tower.type, tower.level)}
                          style={{
                            width: "100%",
                            height: "100%",
                            transform: [{ rotate: `${towerAngles[key] ?? 0}deg` }],
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* 적군 렌더링 */}
          {enemies.map((enemy) => {
            const ePath = (stage.paths && enemy.selectedPathIndex !== undefined) ? stage.paths[enemy.selectedPathIndex] : stage.pathTiles;
            const currentTile = ePath[enemy.pathIndex];
            const nextTile = ePath[enemy.pathIndex + 1];
            if (!currentTile) return null;

            const targetTile = nextTile || currentTile;
            const row = currentTile[0] + (targetTile[0] - currentTile[0]) * enemy.progress;
            const col = currentTile[1] + (targetTile[1] - currentTile[1]) * enemy.progress;
            const nowMs = Date.now();
            const spawnElapsed = nowMs - (enemy.spawnAt || nowMs);
            const showSpawnFlash = spawnElapsed < 280;
            const spawnFlashOpacity = Math.max(0, 0.45 - spawnElapsed / 650);
            const isHit = enemy.hitTimer && enemy.hitTimer > 0;

            return (
              <View
                key={enemy.id}
                style={{
                  position: "absolute",
                  top: row * tileSize,
                  left: col * tileSize,
                  width: tileSize,
                  height: tileSize,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                <View
                  style={{
                    width: tileSize * (enemy.size || 0.6),
                    height: tileSize * (enemy.size || 0.6),
                    borderRadius: 6,
                    borderWidth: isHit ? 2 : enemy.isSlowed ? 1.5 : 0,
                    borderColor: isHit ? "#FFFFFF" : enemy.isSlowed ? "#60A5FA" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={getEnemyAsset(enemy.type)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                  {/* 슬로우 파란 틴트 */}
                  {enemy.isSlowed && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: "rgba(59, 130, 246, 0.28)",
                      }}
                    />
                  )}
                  {/* 피격 흰 플래시 */}
                  {isHit && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.45)",
                      }}
                    />
                  )}
                  {/* 스폰 플래시 */}
                  {showSpawnFlash && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: "#E2E8F0",
                        opacity: spawnFlashOpacity,
                      }}
                    />
                  )}
                  {/* HP Bar */}
                  <View style={{ position: "absolute", top: -8, width: "100%", height: 4, backgroundColor: "#000" }}>
                    <View style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`, height: "100%", backgroundColor: "#22C55E" }} />
                  </View>
                  <Text
                    style={{
                      position: "absolute",
                      top: -17,
                      fontSize: 7,
                      fontWeight: "900",
                      color: "#fecdd3",
                      letterSpacing: 0.5,
                    }}
                  >
                    {getEnemyThreatTag(enemy.type)}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* 발사체 렌더링 */}
          {projectiles.map((proj) => {
            const now = Date.now();
            const progress = Math.min(1, (now - proj.spawnTime) / proj.duration);
            const curRow = proj.startRow + (proj.endRow - proj.startRow) * progress;
            const curCol = proj.startCol + (proj.endCol - proj.startCol) * progress;
            const opacity = 1 - progress * 0.3;

            let imgW: number, imgH: number;
            switch (proj.towerType) {
              case "sniper": imgW = tileSize * 1.0; imgH = tileSize * 0.22; break;
              case "aoe":    imgW = tileSize * 0.5; imgH = tileSize * 0.36; break;
              case "slow":   imgW = tileSize * 0.45; imgH = tileSize * 0.41; break;
              case "chain":  imgW = tileSize * 0.8; imgH = tileSize * 0.3; break;
              default:       imgW = tileSize * 0.3; imgH = tileSize * 0.3;
            }

            return (
              <View
                key={proj.id}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: curRow * tileSize + tileSize / 2 - imgH / 2,
                  left: curCol * tileSize + tileSize / 2 - imgW / 2,
                  width: imgW,
                  height: imgH,
                  transform: [{ rotate: `${proj.angle}deg` }],
                  opacity,
                  zIndex: 25,
                }}
              >
                <Image
                  source={PROJECTILE_ASSETS[proj.towerType] ?? PROJECTILE_ASSETS.sniper}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            );
          })}

          {/* 공격 이펙트 렌더링 */}
          {attackEffects.map((effect) => {
            const commonStyle = {
              position: "absolute" as const,
              top: effect.row * tileSize + tileSize / 2 - effect.size / 2,
              left: effect.col * tileSize + tileSize / 2 - effect.size / 2,
              width: effect.size,
              height: effect.size,
              borderRadius: 999,
              zIndex: 30,
              pointerEvents: "none" as const,
            };

            if (effect.effectType === "recoil") {
              return (
                <View key={effect.id} style={{ ...commonStyle, alignItems: "center", justifyContent: "center" }}>
                  <View
                    style={{
                      position: "absolute",
                      width: effect.size,
                      height: effect.size,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: effect.color,
                      opacity: 0.75,
                    }}
                  />
                  <View
                    style={{
                      width: effect.size * 0.45,
                      height: effect.size * 0.45,
                      borderRadius: 999,
                      backgroundColor: effect.color,
                      opacity: 0.55,
                    }}
                  />
                </View>
              );
            }

            if (effect.effectType === "impact_single") {
              return (
                <View
                  key={effect.id}
                  style={{
                    ...commonStyle,
                    backgroundColor: effect.color,
                    opacity: 0.85,
                    transform: [{ scaleX: 0.65 }, { scaleY: 1.2 }],
                  }}
                />
              );
            }

            if (effect.effectType === "impact_slow") {
              return (
                <View key={effect.id} style={{ ...commonStyle, alignItems: "center", justifyContent: "center" }}>
                  <View
                    style={{
                      position: "absolute",
                      width: effect.size,
                      height: effect.size,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: effect.color,
                      opacity: 0.9,
                    }}
                  />
                  <View
                    style={{
                      width: effect.size * 0.6,
                      height: effect.size * 0.6,
                      borderRadius: 999,
                      backgroundColor: effect.color,
                      opacity: 0.3,
                    }}
                  />
                </View>
              );
            }

            if (effect.effectType === "impact_aoe" || effect.effectType === "item_aoe") {
              return (
                <View key={effect.id} style={{ ...commonStyle, alignItems: "center", justifyContent: "center" }}>
                  <View
                    style={{
                      position: "absolute",
                      width: effect.size,
                      height: effect.size,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: effect.color,
                      opacity: 0.9,
                    }}
                  />
                  <View
                    style={{
                      width: effect.size * 0.72,
                      height: effect.size * 0.72,
                      borderRadius: 999,
                      backgroundColor: effect.color,
                      opacity: 0.45,
                    }}
                  />
                </View>
              );
            }

            return (
              <View
                key={effect.id}
                style={{
                  ...commonStyle,
                  backgroundColor: effect.color,
                  opacity: 0.6,
                }}
              />
            );
          })}

          {/* 플로팅 텍스트 렌더링 */}
          {floatingTexts.map((txt) => (
            <FloatingTextItem key={txt.id} data={txt} tileSize={tileSize} />
          ))}

          {/* 사거리 표시 렌더링 */}
          {rangeDisplay && (
            <View
              style={{
                position: "absolute",
                top: (rangeDisplay.row - rangeDisplay.radius + 0.5) * tileSize,
                left: (rangeDisplay.col - rangeDisplay.radius + 0.5) * tileSize,
                width: rangeDisplay.radius * 2 * tileSize,
                height: rangeDisplay.radius * 2 * tileSize,
                borderRadius: 9999,
                backgroundColor: "rgba(6, 182, 212, 0.08)",
                borderWidth: 1.5,
                borderColor: "rgba(6, 182, 212, 0.6)",
                borderStyle: "dashed",
                zIndex: 5,
                pointerEvents: "none",
              }}
            />
          )}

          {/* 글로벌 이펙트 플래시 */}
          {flashColor && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: stage.cols * tileSize,
                height: stage.rows * tileSize,
                backgroundColor: flashColor,
                opacity: 0.3,
                zIndex: 40,
                pointerEvents: "none",
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
