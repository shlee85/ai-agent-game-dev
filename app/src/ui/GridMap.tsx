import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";

import { StageConfig } from "../data/stages";

interface GridMapProps {
  stage: StageConfig;
}

function tileKey(r: number, c: number) {
  return `${r},${c}`;
}

export function GridMap({ stage }: GridMapProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const pathSet = new Set(stage.pathTiles.map(([r, c]) => tileKey(r, c)));
  const startSet = new Set(stage.startTiles.map(([r, c]) => tileKey(r, c)));
  const goalKey = tileKey(stage.goalTile[0], stage.goalTile[1]);

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
                
                let bg = "#111827"; // 기본 (배치 가능 셀)
                if (isStart) bg = "#22C55E"; // 시작
                else if (isGoal) bg = "#EF4444"; // 목표
                else if (isPath) bg = "#475569"; // 길

                return (
                  <View
                    key={key}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: bg,
                      borderWidth: 0.5,
                      borderColor: "#1E293B",
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
