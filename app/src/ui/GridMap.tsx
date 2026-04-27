import React, { useState, useEffect } from "react";
import { View, LayoutChangeEvent, Pressable, Text, Animated, Image } from "react-native";

import { StageConfig } from "../data/stages";
import { ENEMY_ASSETS } from "../data/enemyAssets";
import { TOWER_ASSETS } from "../data/towerAssets";

interface TowerData {
  type: string;
  color: string;
  level: number;
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
  baseSpeed: number; // 원래 이동 속도
  speed: number; // 현재 이동 속도 (디버프 적용됨)
  pathIndex: number; // 현재 위치한 경로(pathTiles)의 인덱스
  progress: number; // 0.0 ~ 1.0 (현재 타일과 다음 타일 사이의 진행도)
  selectedPathIndex?: number; // 멀티 패스일 때 이 적이 사용할 경로 번호
  isSlowed?: boolean;
  slowTimer?: number;
  hitTimer?: number; // 피격 플래시 타이머
  color?: string; // 적의 색상 (에셋 교체 전 임시)
  size?: number; // 적의 렌더링 크기 비율
  killReward?: number; // 처치 시 획득 골드
  spawnAt?: number; // 스폰 직후 연출용 타임스탬프
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
  onSelectCell: (row: number, col: number) => void;
}

function tileKey(r: number, c: number) {
  return `${r},${c}`;
}

function getEnemyAsset(type: string) {
  return ENEMY_ASSETS[type] || ENEMY_ASSETS.guard;
}

function getEnemyPulseScale(enemyType: string, nowMs: number) {
  if (enemyType !== "runner") return 1;
  return 1 + Math.sin(nowMs / 120) * 0.045;
}

// 플로팅 텍스트 애니메이션 처리를 위한 개별 컴포넌트
function FloatingTextItem({ data, tileSize }: { data: FloatingTextData; tileSize: number }) {
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 800, // 0.8초 동안 위로 떠오르며 페이드아웃
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30], // 30픽셀 위로 이동
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1, 0], // 절반까지 보이다가 서서히 투명
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

export function GridMap({ stage, selectedCell, towers, enemies = [], attackEffects = [], floatingTexts = [], rangeDisplay = null, flashColor = null, onSelectCell }: GridMapProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // 타일 크기 자동 계산: 가로/세로 중 더 타이트한 쪽에 맞춰서 tileSize 결정 (여백 제외)
  const padding = 16; // p-2 (Tailwind 8px * 2) = 16
  const availableWidth = Math.max(0, containerSize.width - padding);
  const availableHeight = Math.max(0, containerSize.height - padding);

  let tileSize = 0;
  if (availableWidth > 0 && availableHeight > 0) {
    tileSize = Math.floor(
      Math.min(availableWidth / stage.cols, availableHeight / stage.rows)
    );
  }

  // 화면을 그릴 때 필요한 전체 path 타일과 start 타일 Set
  const allPathTiles = stage.paths ? stage.paths.flat() : stage.pathTiles;
  const pathSet = new Set(allPathTiles.map(([r, c]) => tileKey(r, c)));
  
  const allStartTiles = stage.multiStartTiles ? stage.multiStartTiles : stage.startTiles;
  const startSet = new Set(allStartTiles.map(([r, c]) => tileKey(r, c)));
  
  const goalKey = tileKey(stage.goalTile[0], stage.goalTile[1]);

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
                const tower = towers[key];
                
                let bg = "rgba(17, 24, 39, 0.4)"; // 기본 (배치 가능 셀)
                if (isStart) bg = "rgba(34, 197, 94, 0.6)"; // 시작
                else if (isGoal) bg = "rgba(239, 68, 68, 0.6)"; // 목표
                else if (isPath) bg = "rgba(71, 85, 105, 0.6)"; // 길

                const isSelected = selectedCell?.row === row && selectedCell?.col === col;

                return (
                  <Pressable
                    key={key}
                    onPress={() => onSelectCell(row, col)}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: bg,
                      borderWidth: isSelected ? 2 : 0.5,
                      borderColor: isSelected ? "#FCD34D" : "rgba(30, 41, 59, 0.5)",
                      zIndex: isSelected ? 10 : 1, // 선택된 셀이 위로 올라오도록 (테두리 겹침 방지)
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* 설치된 타워 시각화 */}
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
                          source={TOWER_ASSETS[tower.type]}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode="contain"
                        />
                        {tower.level >= 2 && (
                          <View
                            style={{
                              position: "absolute",
                              bottom: -2,
                              right: -2,
                              backgroundColor: "rgba(251, 191, 36, 0.95)",
                              borderWidth: 1,
                              borderColor: "#fef3c7",
                              borderRadius: 999,
                              width: tileSize * 0.24,
                              height: tileSize * 0.24,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ color: "#111827", fontWeight: "900", fontSize: tileSize * 0.13 }}>
                              U
                            </Text>
                          </View>
                        )}
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

            // 목적지에 도착한 상태라면 현재 타일에 고정
            const targetTile = nextTile || currentTile;
            
            // 보간(Interpolation)을 통한 픽셀 단위 부드러운 위치 계산
            const row = currentTile[0] + (targetTile[0] - currentTile[0]) * enemy.progress;
            const col = currentTile[1] + (targetTile[1] - currentTile[1]) * enemy.progress;
            const nowMs = Date.now();
            const directionRow = targetTile[0] - currentTile[0];
            const directionCol = targetTile[1] - currentTile[1];
            const directionLen = Math.max(0.001, Math.sqrt(directionRow * directionRow + directionCol * directionCol));
            const unitRow = directionRow / directionLen;
            const unitCol = directionCol / directionLen;
            const isRunner = enemy.type === "runner";
            const isGuard = enemy.type === "guard";
            const spawnElapsed = nowMs - (enemy.spawnAt || nowMs);
            const showSpawnFlash = spawnElapsed < 280;
            const spawnFlashOpacity = Math.max(0, 0.45 - spawnElapsed / 650);
            const runnerPulseScale = getEnemyPulseScale(enemy.type, nowMs);
            const guardBounceOffset = isGuard ? Math.sin(nowMs / 200) * 2.2 : 0;

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
                  zIndex: 20, // 타워/타일보다 위에 표시
                  pointerEvents: "none", // 터치 방해 금지
                }}
              >
                <View
                  style={{
                    width: tileSize * (enemy.size || 0.6),
                    height: tileSize * (enemy.size || 0.6),
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: isHit ? "#FFFFFF" : enemy.isSlowed ? "#60A5FA" : "#7F1D1D",
                    backgroundColor: "rgba(15, 23, 42, 0.35)",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    transform: [{ translateY: guardBounceOffset }, { scale: runnerPulseScale }],
                  }}
                >
                  {isRunner && (
                    <View
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={getEnemyAsset(enemy.type)}
                        style={{
                          position: "absolute",
                          width: "90%",
                          height: "90%",
                          opacity: 0.18,
                          transform: [
                            { translateX: -unitCol * tileSize * 0.18 },
                            { translateY: -unitRow * tileSize * 0.18 },
                          ],
                        }}
                        resizeMode="contain"
                      />
                      <Image
                        source={getEnemyAsset(enemy.type)}
                        style={{
                          position: "absolute",
                          width: "84%",
                          height: "84%",
                          opacity: 0.12,
                          transform: [
                            { translateX: -unitCol * tileSize * 0.3 },
                            { translateY: -unitRow * tileSize * 0.3 },
                          ],
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <Image
                    source={getEnemyAsset(enemy.type)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
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
                  {/* 숫자 체력 표시 (테스트용) */}
                  <Text style={{ color: "white", fontSize: 8, fontWeight: "bold" }}>
                    {Math.floor(enemy.hp)}
                  </Text>
                </View>
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

          {/* 사거리 표시 렌더링 (홀로그램 레이더 스타일) */}
          {rangeDisplay && (
            <View
              style={{
                position: "absolute",
                top: (rangeDisplay.row - rangeDisplay.radius + 0.5) * tileSize,
                left: (rangeDisplay.col - rangeDisplay.radius + 0.5) * tileSize,
                width: rangeDisplay.radius * 2 * tileSize,
                height: rangeDisplay.radius * 2 * tileSize,
                borderRadius: 9999,
                backgroundColor: "rgba(6, 182, 212, 0.08)", // Cyan 500
                borderWidth: 1.5,
                borderColor: "rgba(6, 182, 212, 0.6)",
                borderStyle: "dashed", // 레이더 느낌의 점선
                zIndex: 5, // 타워보다는 아래, 배경보다는 위
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
