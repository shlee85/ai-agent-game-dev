import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DIFFICULTY_CONFIG } from "../data/difficulty";
import { STAGE_CONFIG } from "../data/stages";
import { WAVE_CONFIG } from "../data/waves";
import { TOWER_CONFIG } from "../data/towers";
import { GridMap, EnemyData, AttackEffect } from "../ui/GridMap";
import { HUD } from "../ui/HUD";
import { BuildMenu, TOWER_OPTIONS } from "../ui/BuildMenu";

type GameState = "playing" | "game_over" | "wave_clear" | "paused";

export function WaveScreen({ waveId, onBackToLobby, onNextWave, onRestartWave }: { waveId: 1 | 2 | 3, onBackToLobby: () => void, onNextWave: () => void, onRestartWave: () => void }) {
  const difficulty = DIFFICULTY_CONFIG.normal;
  const wave = WAVE_CONFIG[waveId];
  const stage = STAGE_CONFIG[waveId];

  const [gameState, setGameState] = useState<GameState>("playing");
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [gold, setGold] = useState(difficulty.startGold);
  const [heart, setHeart] = useState(difficulty.startHeart);
  const [towers, setTowers] = useState<Record<string, any>>({});
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [attackEffects, setAttackEffects] = useState<AttackEffect[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Game Loop Refs
  const lastTimeRef = useRef(Date.now());
  const requestRef = useRef<number>(0);
  const spawnTimerRef = useRef(0);
  const spawnCountRef = useRef(0);
  const towersRef = useRef(towers);
  const towerCooldownsRef = useRef<Record<string, number>>({});
  const gameStateRef = useRef(gameState);

  // 타워 상태가 바뀔 때마다 Ref 갱신
  useEffect(() => {
    towersRef.current = towers;
  }, [towers]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // 웨이브 클리어 시 로컬 스토리지에 진행 상황 저장
  useEffect(() => {
    if (gameState === "wave_clear") {
      const saveProgress = async () => {
        try {
          const saved = await AsyncStorage.getItem("maxUnlockedWave");
          const currentMax = saved ? Number(saved) : 1;
          // 다음 웨이브가 있고(waveId < 3), 현재 클리어한 웨이브가 현재 해금된 최대 웨이브와 같거나 크다면 업데이트
          if (waveId >= currentMax && waveId < 3) {
            await AsyncStorage.setItem("maxUnlockedWave", String(waveId + 1));
          }
        } catch (e) {
          console.error("Failed to save progress", e);
        }
      };
      saveProgress();
    }
  }, [gameState, waveId]);

  useEffect(() => {
    lastTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000; // 초 단위 델타타임
      lastTimeRef.current = now;

      if (gameStateRef.current !== "playing") {
        requestRef.current = requestAnimationFrame(loop);
        return;
      }

      // 1. 적군 스폰 로직
      if (spawnCountRef.current < wave.totalSpawnCount) {
        spawnTimerRef.current += dt;
        if (spawnTimerRef.current >= wave.spawnIntervalSec) {
          spawnTimerRef.current -= wave.spawnIntervalSec;
          spawnCountRef.current += 1;
          
          // 멀티 패스 지원: stage.paths가 존재하면 그 중에서 랜덤(또는 비율별)으로 경로 선택
          // 여기서는 간단하게 비율로 분배 (예: 홀수번째는 pathA, 짝수번째는 pathB 등, 혹은 배열 길이로 모듈러 연산)
          let selectedPathIndex = 0;
          if (stage.paths && stage.paths.length > 1) {
            // wave3 같은 경우 paths 배열의 길이만큼 골고루 분배
            // (예: 100마리라면 1번 경로는 짝수번째, 2번 경로는 홀수번째 등으로 간단히 분배)
            // 기획에서 "한쪽 30마리, 한쪽 70마리" 같은 세부 비율이 있다면 Math.random() 사용
            if (waveId === 3) {
              // 3:7 비율로 왼쪽/오른쪽 입구 결정
              selectedPathIndex = Math.random() < 0.3 ? 0 : 1;
            } else {
              selectedPathIndex = spawnCountRef.current % stage.paths.length;
            }
          }

          const newEnemy: EnemyData = {
            id: `enemy-${Date.now()}-${spawnCountRef.current}`,
            type: "basic",
            hp: 100,
            maxHp: 100,
            baseSpeed: 1.5,
            speed: 1.5, // 초당 1.5칸 이동
            pathIndex: 0,
            progress: 0,
            selectedPathIndex: selectedPathIndex, // 선택된 경로 인덱스 저장
          };
          setEnemies((prev) => [...prev, newEnemy]);
        }
      }

      // 2. 적군 스탯/상태 및 타워 공격 로직 통합
      setEnemies((prevEnemies: EnemyData[]) => {
        let currentEnemies = prevEnemies.map((e: EnemyData) => ({ ...e }));
        const effectsToDraw: AttackEffect[] = [];
        let newGoldEarned = 0;
        let heartsLost = 0;

        // 2-1. 적군 상태 이상(Slow 등) 타이머 차감
        currentEnemies.forEach((e: EnemyData) => {
          if (e.isSlowed && e.slowTimer && e.slowTimer > 0) {
            e.slowTimer -= dt;
            if (e.slowTimer <= 0) {
              e.isSlowed = false;
              e.slowTimer = 0;
              e.speed = e.baseSpeed; // 원래 속도로 복귀
            }
          }
        });

        // 2-2. 타워 공격
        Object.keys(towersRef.current).forEach((towerKey) => {
          const towerData = towersRef.current[towerKey];
          const towerStats = TOWER_CONFIG[towerData.type];
          if (!towerStats) return;

          // 쿨다운 갱신
          if (!towerCooldownsRef.current[towerKey]) {
            towerCooldownsRef.current[towerKey] = 0;
          }
          if (towerCooldownsRef.current[towerKey] > 0) {
            towerCooldownsRef.current[towerKey] -= dt;
            return; // 쿨타임 중이면 공격 패스
          }

          const [tRow, tCol] = towerKey.split(",").map(Number);
          let target: EnemyData | null = null;
          let minDistance = 9999;

          // 사거리 내 적 찾기 로직
          currentEnemies.forEach((e: EnemyData) => {
            if (e.hp <= 0) return;

            // 현재 적이 타고 있는 경로(paths 배열이 있으면 그 중 선택, 없으면 기본 pathTiles)
            const enemyPath = (stage.paths && e.selectedPathIndex !== undefined) ? stage.paths[e.selectedPathIndex] : stage.pathTiles;

            const cTile = enemyPath[e.pathIndex];
            const nTile = enemyPath[e.pathIndex + 1];
            if (!cTile) return;
            const tTile = nTile || cTile;
            
            // 현재 적의 픽셀(격자상 실수 좌표) 계산
            const eRow = cTile[0] + (tTile[0] - cTile[0]) * e.progress;
            const eCol = cTile[1] + (tTile[1] - cTile[1]) * e.progress;

            // 거리 계산 (피타고라스 정리)
            const dist = Math.sqrt(Math.pow(tRow - eRow, 2) + Math.pow(tCol - eCol, 2));

            if (dist <= towerStats.baseRange) {
              if (dist < minDistance) {
                minDistance = dist;
                target = e;
              }
            }
          });

          // 타겟 발견 시 타격 처리
          if (target) {
            const t = target as EnemyData; // 타입 캐스팅
            towerCooldownsRef.current[towerKey] = towerStats.baseCooldown;

            // 실제로는 레벨별로 데미지를 곱해줘야 함
            const actualDamage = towerStats.baseDamage * (1 + 0.5 * (towerData.level - 1));

            // 타겟 픽셀 좌표 (이펙트용)
            const targetPath = (stage.paths && t.selectedPathIndex !== undefined) ? stage.paths[t.selectedPathIndex] : stage.pathTiles;
            const cTile = targetPath[t.pathIndex];
            const nTile = targetPath[t.pathIndex + 1];
            const tTile = nTile || cTile;
            const eRow = cTile[0] + (tTile[0] - cTile[0]) * t.progress;
            const eCol = cTile[1] + (tTile[1] - cTile[1]) * t.progress;

            // 이펙트 추가 (타겟팅된 적 위치에 레이저/스플래시 폭발 렌더링)
            effectsToDraw.push({
              id: `fx-${Date.now()}-${Math.random()}`,
              row: eRow,
              col: eCol,
              color: towerStats.color,
              size: towerStats.attackType === "aoe" ? 40 : 16,
            });

            // 타입별 데미지/효과 적용
            if (towerStats.attackType === "single") {
              t.hp -= actualDamage;
            } else if (towerStats.attackType === "slow") {
              t.hp -= actualDamage;
              t.isSlowed = true;
              t.slowTimer = towerStats.slowDuration;
              t.speed = t.baseSpeed * (towerStats.slowMultiplier || 0.5);
            } else if (towerStats.attackType === "aoe") {
              // 광역(Splash) 처리
              const radius = towerStats.aoeRadius || 1.5;
              currentEnemies.forEach((aoeTarget: EnemyData) => {
                if (aoeTarget.hp <= 0) return;
                const aoePath = (stage.paths && aoeTarget.selectedPathIndex !== undefined) ? stage.paths[aoeTarget.selectedPathIndex] : stage.pathTiles;
                const acTile = aoePath[aoeTarget.pathIndex];
                const anTile = aoePath[aoeTarget.pathIndex + 1];
                if (!acTile) return;
                const atTile = anTile || acTile;
                const aRow = acTile[0] + (atTile[0] - acTile[0]) * aoeTarget.progress;
                const aCol = acTile[1] + (atTile[1] - acTile[1]) * aoeTarget.progress;

                const dist = Math.sqrt(Math.pow(eRow - aRow, 2) + Math.pow(eCol - aCol, 2));
                if (dist <= radius) {
                  aoeTarget.hp -= actualDamage;
                }
              });
            }
          }
        });

        // 2-3. 이펙트를 State로 보내기 (잠깐 띄웠다가 삭제)
        if (effectsToDraw.length > 0) {
          setAttackEffects((prev) => [...prev, ...effectsToDraw]);
          setTimeout(() => {
            setAttackEffects((prev) => prev.filter(p => !effectsToDraw.find(e => e.id === p.id)));
          }, 150); // 0.15초 뒤 삭제
        }

        // 2-4. 체력이 다 닳은 적 제거 및 골드 획득
        const aliveEnemies = currentEnemies.filter(e => {
          if (e.hp <= 0) {
            newGoldEarned += 10; // 처치 당 10골드 획득 (나중에 난이도 배율 적용 가능)
            return false;
          }
          return true;
        });

        if (newGoldEarned > 0) {
          setGold((prev) => prev + newGoldEarned);
        }

        // 2-5. 생존한 적 이동 로직 및 누수 판정
        const nextEnemies: EnemyData[] = [];

        for (const e of aliveEnemies) {
          let newProgress = e.progress + e.speed * dt;
          let newPathIndex = e.pathIndex;
          
          const ePath = (stage.paths && e.selectedPathIndex !== undefined) ? stage.paths[e.selectedPathIndex] : stage.pathTiles;

          while (newProgress >= 1.0) {
            newProgress -= 1.0;
            newPathIndex += 1;
          }

          if (newPathIndex >= ePath.length - 1) {
            heartsLost += 1;
          } else {
            nextEnemies.push({ ...e, pathIndex: newPathIndex, progress: newProgress });
          }
        }

        if (heartsLost > 0) {
          setHeart((h) => {
            const nextH = Math.max(0, h - heartsLost);
            if (nextH === 0) setGameState("game_over");
            return nextH;
          });
        }

        // 2-6. 웨이브 클리어 판정
        if (
          spawnCountRef.current >= wave.totalSpawnCount &&
          nextEnemies.length === 0 &&
          gameStateRef.current === "playing"
        ) {
          setGameState("wave_clear");
        }

        return nextEnemies;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const tileKey = (r: number, c: number) => `${r},${c}`;
  // 모든 경로의 타일들을 모아서 Set으로 만듦 (pathTiles + paths 배열 안의 모든 경로)
  const allPathTiles = stage.paths ? stage.paths.flat() : stage.pathTiles;
  const pathSet = new Set(allPathTiles.map(([r, c]) => tileKey(r, c)));
  
  // 멀티 시작점 지원 (multiStartTiles가 있으면 사용, 없으면 기본 startTiles)
  const allStartTiles = stage.multiStartTiles ? stage.multiStartTiles : stage.startTiles;
  const startSet = new Set(allStartTiles.map(([r, c]) => tileKey(r, c)));
  
  const goalKey = tileKey(stage.goalTile[0], stage.goalTile[1]);

  const handleSelectCell = (row: number, col: number) => {
    const key = tileKey(row, col);

    // 예외 1: 길(Path), 시작점, 도착점 터치 시 선택 무시 및 메뉴 취소
    if (pathSet.has(key) || startSet.has(key) || goalKey === key) {
      console.log(`[WaveScreen] Invalid cell touched: ${key}`);
      setSelectedCell(null);
      return;
    }

    // 빈 타일이거나 이미 타워가 있는 타일 선택
    setSelectedCell({ row, col });
  };

  const handleBuildTower = (towerId: string, cost: number) => {
    if (!selectedCell || gold < cost) return;

    const key = tileKey(selectedCell.row, selectedCell.col);
    
    // 예외 2: 이미 타워가 있는 경우 빌드 차단
    if (towers[key]) return;

    // 비용 차감 및 타워 배치
    setGold((prev) => prev - cost);
    setTowers((prev) => ({
      ...prev,
      [key]: {
        type: towerId,
        level: 1,
        color: TOWER_OPTIONS.find((t) => t.id === towerId)?.color || "#ffffff",
      },
    }));

    // 설치 직후 메뉴 닫기
    setSelectedCell(null);
  };

  const selectedKey = selectedCell ? tileKey(selectedCell.row, selectedCell.col) : null;
  const showBuildMenu = selectedKey && !towers[selectedKey];

  return (
    <View className="flex-1 bg-slate-900 relative">
      {/* 맵 영역 (터치 시 선택 해제를 위해 Pressable로 감싸지만 GridMap 내의 터치는 방해하지 않음) */}
      <Pressable className="flex-1" onPress={() => setSelectedCell(null)}>
        <GridMap
          stage={stage}
          selectedCell={selectedCell}
          towers={towers}
          enemies={enemies}
          attackEffects={attackEffects}
          onSelectCell={handleSelectCell}
        />
      </Pressable>

      {/* 상단 HUD 오버레이 */}
      <View 
        className="absolute top-2 w-full flex-row justify-center px-4 z-10"
        style={{ elevation: 10 }}
        pointerEvents="box-none"
      >
        <HUD 
          gold={gold} 
          heart={heart} 
          waveId={wave.id} 
          speedMultiplier={speedMultiplier}
          onToggleSpeed={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : 1))}
        />
      </View>

      {/* 메뉴(일시정지) 버튼 */}
      <View 
        className="absolute top-4 right-6 z-20"
        style={{ elevation: 20 }}
        pointerEvents="box-none"
      >
        <TouchableOpacity 
          className="rounded-xl bg-slate-800/90 px-4 py-2 border border-slate-600 active:bg-slate-700 shadow-md"
          onPress={() => setGameState("paused")}
        >
          <Text className="font-bold text-slate-300">⚙️ 메뉴</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 건설 메뉴 오버레이 */}
      {showBuildMenu && (
        <View className="absolute bottom-4 w-full z-50" style={{ elevation: 50 }} pointerEvents="box-none">
          <BuildMenu
            gold={gold}
            onBuild={handleBuildTower}
            onClose={() => setSelectedCell(null)}
          />
        </View>
      )}

      {/* 게임 오버 / 클리어 팝업 오버레이 */}
      {(gameState === "game_over" || gameState === "wave_clear") && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-slate-950/80" style={{ elevation: 100 }}>
          <View className="items-center rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <Text className={`text-4xl font-black ${gameState === "game_over" ? "text-red-500" : "text-emerald-400"}`}>
              {gameState === "game_over" ? "GAME OVER" : "WAVE CLEAR!"}
            </Text>
            <Text className="mt-2 text-slate-400 text-base">
              {gameState === "game_over" ? "하트가 모두 소진되었습니다." : "모든 적을 막아냈습니다!"}
            </Text>
            
            {gameState === "wave_clear" && waveId < 3 && (
              <TouchableOpacity 
                className="mt-6 w-full rounded-xl bg-emerald-600 px-8 py-3 border border-emerald-500 active:bg-emerald-700"
                onPress={() => {
                  onNextWave();
                }}
              >
                <Text className="text-slate-100 font-bold text-lg text-center">다음 웨이브로 진행</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              className={`w-full rounded-xl bg-slate-800 px-8 py-3 border border-slate-600 active:bg-slate-700 ${gameState === "wave_clear" && waveId < 3 ? "mt-3" : "mt-6"}`}
              onPress={() => {
                onBackToLobby();
              }}
            >
              <Text className="text-slate-200 font-bold text-lg text-center">로비로 돌아가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 일시정지(메뉴) 팝업 오버레이 */}
      {gameState === "paused" && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-slate-950/80" style={{ elevation: 100 }}>
          <View className="w-80 items-center rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <Text className="text-3xl font-black text-slate-200">일시 정지</Text>
            <Text className="mt-2 text-slate-400 text-sm">게임을 잠시 멈췄습니다.</Text>
            
            <TouchableOpacity 
              className="mt-8 w-full rounded-xl bg-emerald-600 px-8 py-3 border border-emerald-500 active:bg-emerald-700"
              onPress={() => setGameState("playing")}
            >
              <Text className="text-slate-100 font-bold text-lg text-center">계속 하기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-3 w-full rounded-xl bg-amber-600 px-8 py-3 border border-amber-500 active:bg-amber-700"
              onPress={() => onRestartWave()}
            >
              <Text className="text-slate-100 font-bold text-lg text-center">이 웨이브 다시 시작</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-3 w-full rounded-xl bg-slate-800 px-8 py-3 border border-slate-600 active:bg-slate-700"
              onPress={() => onBackToLobby()}
            >
              <Text className="text-slate-200 font-bold text-lg text-center">로비로 돌아가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
