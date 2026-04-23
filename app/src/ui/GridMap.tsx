import React, { useState } from "react";
import { View, LayoutChangeEvent, Pressable } from "react-native";

import { StageConfig } from "../data/stages";

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
}

interface GridMapProps {
  stage: StageConfig;
  selectedCell: { row: number; col: number } | null;
  towers: Record<string, TowerData>;
  enemies?: EnemyData[];
  attackEffects?: AttackEffect[];
  onSelectCell: (row: number, col: number) => void;
}

function tileKey(r: number, c: number) {
  return `${r},${c}`;
}

export function GridMap({ stage, selectedCell, towers, enemies = [], attackEffects = [], onSelectCell }: GridMapProps) {
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
      className="flex-1 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 p-2"
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
                
                let bg = "#111827"; // 기본 (배치 가능 셀)
                if (isStart) bg = "#22C55E"; // 시작
                else if (isGoal) bg = "#EF4444"; // 목표
                else if (isPath) bg = "#475569"; // 길

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
                      borderColor: isSelected ? "#FCD34D" : "#1E293B",
                      zIndex: isSelected ? 10 : 1, // 선택된 셀이 위로 올라오도록 (테두리 겹침 방지)
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* 설치된 타워 시각화 */}
                    {tower && (
                      <View
                        style={{
                          width: tileSize * 0.7,
                          height: tileSize * 0.7,
                          backgroundColor: tower.color,
                          borderRadius: 999, // 둥글게 (임시 타워 그래픽)
                          borderWidth: 1.5,
                          borderColor: "#ffffff40",
                        }}
                      />
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
                    width: tileSize * 0.6,
                    height: tileSize * 0.6,
                    backgroundColor: enemy.isSlowed ? "#3B82F6" : "#EF4444", // 감속 시 파란색
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: enemy.isSlowed ? "#1D4ED8" : "#7F1D1D",
                  }}
                >
                  {/* HP Bar */}
                  <View style={{ position: "absolute", top: -8, width: "100%", height: 4, backgroundColor: "#000" }}>
                    <View style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`, height: "100%", backgroundColor: "#22C55E" }} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
