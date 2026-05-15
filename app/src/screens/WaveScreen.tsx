import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text, TouchableOpacity, Animated, ImageBackground, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { DIFFICULTY_CONFIG, Difficulty } from "../data/difficulty";
import { STAGE_CONFIG } from "../data/stages";
import { WAVE_CONFIG, WaveId } from "../data/waves";
import { TOWER_CONFIG } from "../data/towers";
import { ENEMY_CONFIG, EnemyType } from "../data/enemies";
import { ITEM_CONFIG, ItemStats } from "../data/items";
import { GridMap, EnemyData, AttackEffect, FloatingTextData, ProjectileData } from "../ui/GridMap";
import { HUD } from "../ui/HUD";
import { BuildMenu, TOWER_OPTIONS } from "../ui/BuildMenu";
import { TowerMenu } from "../ui/TowerMenu";
import { ItemShop } from "../ui/ItemShop";
import { useLanguage } from "../contexts/LanguageContext";
import { soundManager } from "../utils/soundManager";
import { getWaveBackground } from "../data/backgroundAssets";

type GameState = "playing" | "game_over" | "wave_clear" | "paused";

export function WaveScreen({
  waveId,
  difficultyLevel,
  diamond,
  itemInventory,
  onConsumeItem,
  onWaveClearReward,
  onBackToLobby,
  onNextWave,
  onRestartWave,
  initialGoldOverride,
}: {
  waveId: WaveId;
  difficultyLevel: Difficulty;
  diamond: number;
  itemInventory: Record<string, number>;
  onConsumeItem: (itemId: string) => boolean;
  onWaveClearReward: (rewardDiamond: number) => void;
  onBackToLobby: () => void;
  onNextWave: () => void;
  onRestartWave: () => void;
  initialGoldOverride?: number;
}) {
  const difficulty = DIFFICULTY_CONFIG[difficultyLevel || "normal"];
  const wave = WAVE_CONFIG[waveId];
  const stage = STAGE_CONFIG[waveId];
  const waveSpawnInterval = wave.spawnIntervalSecByDifficulty[difficultyLevel];
  const waveSpawnCount = wave.totalSpawnCountByDifficulty[difficultyLevel];
  const waveClearGoldReward = wave.clearGoldRewardByDifficulty[difficultyLevel];
  const waveClearDiamondReward = wave.clearDiamondRewardByDifficulty[difficultyLevel];
  const isTimeObjective = wave.isTimeObjective === true;
  const waveKillGoldMultiplier =
    wave.killGoldMultiplierByDifficulty?.[difficultyLevel] ?? 1;

  const [gameState, setGameState] = useState<GameState>("playing");
  const { t } = useLanguage();
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const initialGold = initialGoldOverride ?? difficulty.startGold;
  const [gold, setGold] = useState(initialGold);
  const [heart, setHeart] = useState(difficulty.startHeart);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(isTimeObjective ? wave.durationSec : 0);
  const [killCount, setKillCount] = useState<number>(0);
  const [usedItemCount, setUsedItemCount] = useState<number>(0);
  const [leakedCount, setLeakedCount] = useState<number>(0);
  const [earnedGoldFromKills, setEarnedGoldFromKills] = useState<number>(0);
  const [towers, setTowers] = useState<Record<string, any>>({});
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [attackEffects, setAttackEffects] = useState<AttackEffect[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextData[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeItem, setActiveItem] = useState<ItemStats | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null); // 글로벌 이펙트용
  const [tutorialStepIdx, setTutorialStepIdx] = useState<number | null>(null);
  const tutorialAnim = useRef(new Animated.Value(0)).current;
  const tutorialActiveRef = useRef(waveId === 1); // Wave 1은 튜토리얼 확인 전까지 잠시 정지

  const [isQuickPaused, setIsQuickPaused] = useState(false);
  const isQuickPausedRef = useRef(false);

  const handleRestartWaveWithConfirm = () => {
    Alert.alert(
      t.restartWaveTitle,
      t.restartWaveMsg,
      [
        { text: t.cancel, style: "cancel" },
        { text: t.confirm, style: "destructive", onPress: () => onRestartWave() },
      ],
      { cancelable: true }
    );
  };

  // Game Loop Refs
  const lastTimeRef = useRef(Date.now());
  const requestRef = useRef<number>(0);
  const spawnTimerRef = useRef(0);
  const spawnCountRef = useRef(0);
  const towersRef = useRef(towers);
  const towerCooldownsRef = useRef<Record<string, number>>({});
  const towerAnglesRef = useRef<Record<string, number>>({});
  const [towerAngles, setTowerAngles] = useState<Record<string, number>>({});
  const gameStateRef = useRef(gameState);
  const heartRef = useRef(heart);
  const timeLeftRef = useRef<number>(wave.durationSec);
  const timeShownRef = useRef<number>(Math.ceil(wave.durationSec));
  const timeObjectiveClearTriggeredRef = useRef(false);
  const clearRewardGrantedRef = useRef(false);

  // 타워 상태가 바뀔 때마다 Ref 갱신
  useEffect(() => {
    towersRef.current = towers;
  }, [towers]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    heartRef.current = heart;
  }, [heart]);

  useEffect(() => {
    if (!isTimeObjective) return;
    timeLeftRef.current = wave.durationSec;
    timeShownRef.current = Math.ceil(wave.durationSec);
    setTimeLeftSec(wave.durationSec);
    timeObjectiveClearTriggeredRef.current = false;
  }, [isTimeObjective, wave.durationSec]);

  useEffect(() => {
    if (gameState === "wave_clear" && !clearRewardGrantedRef.current) {
      clearRewardGrantedRef.current = true;
      setGold((prev) => prev + waveClearGoldReward);
      onWaveClearReward(waveClearDiamondReward);
      soundManager.playSfx("sfx_wave_clear", 0.85, 0);
      soundManager.setBgmVolume(0.15);
    }
    if (gameState === "game_over") {
      soundManager.playSfx("sfx_game_over", 0.85, 0);
      soundManager.setBgmVolume(0.15);
    }
  }, [gameState, onWaveClearReward, waveClearDiamondReward, waveClearGoldReward]);

  // 팝업 애니메이션 처리용
  const popupAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameState === "game_over" || gameState === "wave_clear" || gameState === "paused") {
      Animated.spring(popupAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      popupAnim.setValue(0);
    }
  }, [gameState, popupAnim]);

  // 웨이브 클리어 시 로컬 스토리지에 진행 상황 저장
  useEffect(() => {
    if (gameState === "wave_clear") {
      const saveProgress = async () => {
        try {
          const progressKey = `maxUnlockedWave_${difficultyLevel}`;
          const saved = await AsyncStorage.getItem(progressKey);
          const currentMax = saved ? Number(saved) : 1;
          // 다음 웨이브가 있고(waveId < 15), 현재 클리어한 웨이브가 현재 해금된 최대 웨이브와 같거나 크다면 업데이트
          if (waveId >= currentMax && waveId < 20) {
            await AsyncStorage.setItem(progressKey, String(waveId + 1));
          }
        } catch (e) {
          console.error("Failed to save progress", e);
        }
      };
      saveProgress();
    }
  }, [difficultyLevel, gameState, waveId]);

  // 사운드 초기화 및 BGM
  useEffect(() => {
    soundManager.init().then(() => {
      soundManager.playBgm("bgm_wave", 0.35);
    });
    return () => {
      soundManager.stopBgm();
      soundManager.unloadSfx();
    };
  }, []);

  // isQuickPaused → Ref 동기화
  useEffect(() => {
    isQuickPausedRef.current = isQuickPaused;
  }, [isQuickPaused]);

  // 튜토리얼: Wave 1 첫 진입 시에만 표시
  useEffect(() => {
    if (waveId !== 1) return;
    AsyncStorage.getItem("tutorialShown").then((val) => {
      if (!val) {
        setTutorialStepIdx(0); // tutorialActiveRef는 이미 true
      } else {
        tutorialActiveRef.current = false; // 이미 본 경우 즉시 해제
      }
    });
  }, [waveId]);

  useEffect(() => {
    if (tutorialStepIdx !== null) {
      Animated.spring(tutorialAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
    } else {
      tutorialAnim.setValue(0);
    }
  }, [tutorialStepIdx, tutorialAnim]);

  useEffect(() => {
    lastTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000; // 초 단위 델타타임
      lastTimeRef.current = now;

      if (gameStateRef.current !== "playing" || tutorialActiveRef.current || isQuickPausedRef.current) {
        requestRef.current = requestAnimationFrame(loop);
        return;
      }

      // Time objective 웨이브일 때만 타이머를 갱신한다.
      let timeUpNow = false;
      if (isTimeObjective) {
        timeLeftRef.current -= dt;
        timeUpNow = timeLeftRef.current <= 0;

        const clamped = Math.max(0, timeLeftRef.current);
        const nextShown = Math.ceil(clamped);
        if (nextShown !== timeShownRef.current) {
          timeShownRef.current = nextShown;
          setTimeLeftSec(clamped);
        }
      }

      // 1. 적군 스폰 로직
      const maxSpawnCount = Math.floor(waveSpawnCount * difficulty.spawnCountMultiplier);
      if (spawnCountRef.current < maxSpawnCount && (!isTimeObjective || !timeUpNow)) {
        spawnTimerRef.current += dt;
        if (spawnTimerRef.current >= waveSpawnInterval) {
          spawnTimerRef.current -= waveSpawnInterval;
          spawnCountRef.current += 1;
          
          // 난이도에 따른 적 종류 제한(enemyTypeLimit) 반영하여 스폰할 적 후보 필터링
          const availableEnemies = wave.enemies.slice(0, difficulty.enemyTypeLimit);
          
          // 가중치(weight) 기반 랜덤 선택 로직
          const totalWeight = availableEnemies.reduce((acc, curr) => acc + curr.weight, 0);
          let randomWeight = Math.random() * totalWeight;
          let selectedEnemyType = availableEnemies[0].type;
          
          for (const enemyDef of availableEnemies) {
            randomWeight -= enemyDef.weight;
            if (randomWeight <= 0) {
              selectedEnemyType = enemyDef.type;
              break;
            }
          }
          
          const enemyStats = ENEMY_CONFIG[selectedEnemyType];
          
          // 멀티 패스 지원: stage.paths가 존재하면 그 중에서 랜덤(또는 비율별)으로 경로 선택
          let selectedPathIndex = 0;
          if (stage.paths && stage.paths.length > 1) {
            if (waveId === 3) {
              // 3:7 비율로 왼쪽/오른쪽 입구 결정
              selectedPathIndex = Math.random() < 0.3 ? 0 : 1;
            } else {
              selectedPathIndex = spawnCountRef.current % stage.paths.length;
            }
          }

          // 난이도 배율 적용
          const maxHp = Math.floor(enemyStats.baseHp * difficulty.enemyHpMultiplier);
          const killReward = Math.floor(
            enemyStats.killReward * difficulty.killGoldMultiplier * waveKillGoldMultiplier
          );

          const newEnemy: EnemyData = {
            id: `enemy-${Date.now()}-${spawnCountRef.current}`,
            type: enemyStats.id,
            hp: maxHp,
            maxHp: maxHp,
            baseSpeed: enemyStats.baseSpeed * difficulty.enemySpeedMultiplier,
            speed: enemyStats.baseSpeed * difficulty.enemySpeedMultiplier,
            pathIndex: 0,
            progress: 0,
            selectedPathIndex: selectedPathIndex,
            immuneToSlow: enemyStats.immuneToSlow,
            color: enemyStats.color,
            size: enemyStats.size,
            killReward: killReward,
            spawnAt: Date.now(),
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

        // 2-1. 적군 상태 이상(Slow, Hit 등) 타이머 차감
        currentEnemies.forEach((e: EnemyData) => {
          if (e.isSlowed && e.slowTimer && e.slowTimer > 0) {
            e.slowTimer -= dt;
            if (e.slowTimer <= 0) {
              e.isSlowed = false;
              e.slowTimer = 0;
              e.speed = e.baseSpeed; // 원래 속도로 복귀
            }
          }
          if (e.hitTimer && e.hitTimer > 0) {
            e.hitTimer -= dt;
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

            // 레벨 및 상성 배율 적용
            const levelMult = 1 + 0.5 * (towerData.level - 1);
            const affinityMult =
              towerStats.affinityEnemyType && towerStats.affinityEnemyType === t.type
                ? (towerStats.affinityMultiplier ?? 1)
                : 1;
            const actualDamage = towerStats.baseDamage * levelMult * affinityMult;

            // 타겟 픽셀 좌표 (이펙트용)
            const targetPath = (stage.paths && t.selectedPathIndex !== undefined) ? stage.paths[t.selectedPathIndex] : stage.pathTiles;
            const cTile = targetPath[t.pathIndex];
            const nTile = targetPath[t.pathIndex + 1];
            const tTile = nTile || cTile;
            const eRow = cTile[0] + (tTile[0] - cTile[0]) * t.progress;
            const eCol = cTile[1] + (tTile[1] - cTile[1]) * t.progress;
            const [towerRowStr, towerColStr] = towerKey.split(",");
            const towerRow = Number(towerRowStr);
            const towerCol = Number(towerColStr);

            // 타워 조준 각도 업데이트 (이미지 기본 방향: 위쪽 → +90° 보정)
            towerAnglesRef.current[towerKey] = Math.atan2(eRow - towerRow, eCol - towerCol) * (180 / Math.PI) + 90;

            // 발사체 생성
            const projDuration = towerStats.attackType === "aoe" ? 240 : towerStats.attackType === "slow" ? 280 : 160;
            const projAngle = Math.atan2(eRow - towerRow, eCol - towerCol) * (180 / Math.PI);
            const projId = `proj-${Date.now()}-${Math.random()}`;
            setProjectiles((prev) => [...prev, {
              id: projId,
              startRow: towerRow,
              startCol: towerCol,
              endRow: eRow,
              endCol: eCol,
              spawnTime: Date.now(),
              duration: projDuration,
              color: towerStats.color,
              towerType: towerData.type,
              angle: projAngle,
            }]);
            setTimeout(() => setProjectiles((prev) => prev.filter((p) => p.id !== projId)), projDuration + 50);

            // 이펙트 추가: 타워 발사 리코일 + 타겟 임팩트
            soundManager.playSfx(soundManager.getTowerSfxKey(towerStats.id), 0.55, 80);
            effectsToDraw.push({
              id: `fx-recoil-${Date.now()}-${Math.random()}`,
              row: towerRow,
              col: towerCol,
              color: towerStats.color,
              size: towerStats.attackType === "aoe" ? 22 : 16,
              effectType: "recoil",
            });

            effectsToDraw.push({
              id: `fx-${Date.now()}-${Math.random()}`,
              row: eRow,
              col: eCol,
              color: towerStats.color,
              size: towerStats.attackType === "aoe" ? 40 : 16,
              effectType:
                towerStats.attackType === "aoe"
                  ? "impact_aoe"
                  : towerStats.attackType === "slow"
                    ? "impact_slow"
                    : "impact_single",
            });

            // 타입별 데미지/효과 적용
            if (towerStats.attackType === "single") {
              t.hp -= actualDamage;
              t.hitTimer = 0.1;
            } else if (towerStats.attackType === "slow") {
              t.hp -= actualDamage;
              t.hitTimer = 0.1;
              if (!t.immuneToSlow) {
                t.isSlowed = true;
                t.slowTimer = towerStats.slowDuration;
                t.speed = t.baseSpeed * (towerStats.slowMultiplier || 0.5);
              }
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
                  const aoeAffinityMult =
                    towerStats.affinityEnemyType && towerStats.affinityEnemyType === aoeTarget.type
                      ? (towerStats.affinityMultiplier ?? 1)
                      : 1;
                  const aoeResist = ENEMY_CONFIG[aoeTarget.type as EnemyType]?.aoeResistance ?? 1.0;
                  aoeTarget.hp -= towerStats.baseDamage * levelMult * aoeAffinityMult * aoeResist;
                  aoeTarget.hitTimer = 0.1;
                }
              });
            }
          }
        });

        // 2-3. 타워 조준 각도 state 반영
        setTowerAngles({ ...towerAnglesRef.current });

        // 2-4. 이펙트를 State로 보내기 (잠깐 띄웠다가 삭제)
        if (effectsToDraw.length > 0) {
          setAttackEffects((prev) => [...prev, ...effectsToDraw]);
          setTimeout(() => {
            setAttackEffects((prev) => prev.filter(p => !effectsToDraw.find(e => e.id === p.id)));
          }, 150); // 0.15초 뒤 삭제
        }

        // 2-4. 체력이 다 닳은 적 제거 및 골드 획득
        const textsToDraw: FloatingTextData[] = [];
        let killedThisFrame = 0;
        const aliveEnemies = currentEnemies.filter(e => {
          if (e.hp <= 0) {
            const reward = e.killReward || 10;
            newGoldEarned += reward; // 적 개별 처치 골드
            killedThisFrame += 1;
            
            // 플로팅 텍스트 추가
            const ePath = (stage.paths && e.selectedPathIndex !== undefined) ? stage.paths[e.selectedPathIndex] : stage.pathTiles;
            const cTile = ePath[e.pathIndex];
            const nTile = ePath[e.pathIndex + 1];
            const tTile = nTile || cTile;
            const eRow = cTile[0] + (tTile[0] - cTile[0]) * e.progress;
            const eCol = cTile[1] + (tTile[1] - cTile[1]) * e.progress;
            
            textsToDraw.push({
              id: `txt-${Date.now()}-${Math.random()}`,
              row: eRow,
              col: eCol,
              text: `+${reward}`,
              color: "#FCD34D", // yellow-300
            });
            return false;
          }
          return true;
        });

        if (textsToDraw.length > 0) {
          setFloatingTexts((prev) => [...prev, ...textsToDraw]);
          setTimeout(() => {
            setFloatingTexts((prev) => prev.filter(p => !textsToDraw.find(t => t.id === p.id)));
          }, 800); // 0.8초 뒤 삭제
        }

        if (killedThisFrame > 0) {
          setKillCount((prev) => prev + killedThisFrame);
        }

        if (newGoldEarned > 0) {
          setEarnedGoldFromKills((prev) => prev + newGoldEarned);
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

        const projectedHeart = heartRef.current - heartsLost;

        if (heartsLost > 0) {
          soundManager.playSfx("sfx_enemy_leak", 0.7, 200);
          setLeakedCount((prev) => prev + heartsLost);
          setHeart((h) => {
            const nextH = Math.max(0, h - heartsLost);
            if (nextH === 0) setGameState("game_over");
            return nextH;
          });
        }

        // 2-6. 웨이브 클리어 판정
        if (isTimeObjective) {
          // Time objective: 타이머 종료 시 Heart가 남아있으면 즉시 클리어
          if (
            timeUpNow &&
            projectedHeart > 0 &&
            gameStateRef.current === "playing" &&
            !timeObjectiveClearTriggeredRef.current
          ) {
            timeObjectiveClearTriggeredRef.current = true;
            setGameState("wave_clear");
          }
        } else {
          const maxSpawnCountForClear = Math.floor(waveSpawnCount * difficulty.spawnCountMultiplier);
          if (
            spawnCountRef.current >= maxSpawnCountForClear &&
            nextEnemies.length === 0 &&
            gameStateRef.current === "playing"
          ) {
            setGameState("wave_clear");
          }
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

  const handleUseItem = (item: ItemStats) => {
    if (activeItem?.id === item.id) {
      // 이미 선택된 아이템을 다시 누르면 취소
      setActiveItem(null);
      setSelectedCell(null);
      return;
    }

    if ((itemInventory[item.id] || 0) <= 0) return;

    if (item.type === "targeted_aoe") {
      setActiveItem(item);
      setSelectedCell(null); // 새로운 타겟팅 시작
    } else {
      if (!onConsumeItem(item.id)) return;
      setUsedItemCount((prev) => prev + 1);
      soundManager.playSfx("sfx_item_use", 0.7, 0);
      // 즉시 발동형 스킬 처리

      // 시각적 피드백 (플래시)
      setFlashColor(item.color);
      setTimeout(() => setFlashColor(null), 300);

      // 적군 상태 일괄 변경
      setEnemies((prevEnemies) => {
        let newEnemies = [...prevEnemies];
        
        if (item.type === "global_aoe") {
          newEnemies = newEnemies.map((e) => ({
            ...e,
            hp: e.hp - item.damage,
            hitTimer: 0.1,
          }));
        } else if (item.type === "global_freeze") {
          newEnemies = newEnemies.map((e) => ({
            ...e,
            hp: e.hp - item.damage,
            hitTimer: 0.1,
            ...(e.immuneToSlow ? {} : {
              isSlowed: true,
              slowTimer: item.duration || 4.0,
              speed: e.baseSpeed * 0.1,
            }),
          }));
        } else if (item.type === "heart_boost") {
          setHeart((prev) => prev + 1);
        }
        
        return newEnemies;
      });
    }
  };

  const handleSelectCell = (row: number, col: number) => {
    const key = tileKey(row, col);

    if (activeItem && activeItem.type === "targeted_aoe") {
      // 타겟형 스킬 사용 로직
      if ((itemInventory[activeItem.id] || 0) <= 0) {
        setActiveItem(null);
        return;
      }
      if (!onConsumeItem(activeItem.id)) return;
      setUsedItemCount((prev) => prev + 1);
      soundManager.playSfx("sfx_item_use", 0.7, 0);

      // 해당 타일 중앙 좌표 (픽셀 대신 타일 좌표계 기준)
      const targetRow = row;
      const targetCol = col;
      const radius = activeItem.radius || 2.5;

      // 이펙트 추가 (범위 폭발)
      const effectId = `fx-item-${Date.now()}`;
      setAttackEffects((prev) => [
        ...prev,
        {
          id: effectId,
          row: targetRow,
          col: targetCol,
          color: activeItem.color,
          size: radius * 2 * 32, // 임시 크기 계산 (GridMap에서 타일 기반으로 사이즈 처리하면 더 좋음, 여기서는 크게)
          effectType: "item_aoe",
        }
      ]);
      setTimeout(() => {
        setAttackEffects((prev) => prev.filter(e => e.id !== effectId));
      }, 300);

      // 적 데미지 처리
      setEnemies((prevEnemies) => {
        return prevEnemies.map((e) => {
          if (e.hp <= 0) return e;
          
          const ePath = (stage.paths && e.selectedPathIndex !== undefined) ? stage.paths[e.selectedPathIndex] : stage.pathTiles;
          const cTile = ePath[e.pathIndex];
          const nTile = ePath[e.pathIndex + 1];
          if (!cTile) return e;
          const tTile = nTile || cTile;
          
          const eRow = cTile[0] + (tTile[0] - cTile[0]) * e.progress;
          const eCol = cTile[1] + (tTile[1] - cTile[1]) * e.progress;

          const dist = Math.sqrt(Math.pow(targetRow - eRow, 2) + Math.pow(targetCol - eCol, 2));
          if (dist <= radius) {
            return { ...e, hp: e.hp - activeItem.damage, hitTimer: 0.1 };
          }
          return e;
        });
      });

      setActiveItem(null);
      setSelectedCell(null);
      return;
    }

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
  const existingTower = selectedKey ? towers[selectedKey] : null;
  const showBuildMenu = selectedKey && !existingTower;
  const showTowerMenu = selectedKey && existingTower;

  let rangeDisplay = null;
  if (selectedCell && existingTower) {
    const stats = TOWER_CONFIG[existingTower.type];
    if (stats) {
      rangeDisplay = {
        row: selectedCell.row,
        col: selectedCell.col,
        radius: stats.baseRange,
      };
    }
  } else if (activeItem && activeItem.type === "targeted_aoe" && selectedCell) {
    // 사실 타겟팅 중일때는 드래그 앤 드롭이거나 클릭 시 즉발이므로
    // 클릭 전에 range를 띄우긴 어려움. 여기서는 로직만 유지.
  }

  const handleUpgradeTower = (cost: number) => {
    if (!selectedKey || !existingTower || gold < cost) return;
    setGold((prev) => prev - cost);
    setTowers((prev) => ({
      ...prev,
      [selectedKey]: {
        ...existingTower,
        level: existingTower.level + 1,
      },
    }));
  };

  const handleSellTower = (refund: number) => {
    if (!selectedKey || !existingTower) return;
    setGold((prev) => prev + refund);
    setTowers((prev) => {
      const newTowers = { ...prev };
      delete newTowers[selectedKey];
      return newTowers;
    });
    setSelectedCell(null);
  };

  return (
    <ImageBackground 
      source={getWaveBackground(waveId)}
      className="flex-1 bg-slate-950 relative"
      imageStyle={{ opacity: 0.7 }}
    >
      {/* 맵 영역 (터치 시 선택 해제를 위해 Pressable로 감싸지만 GridMap 내의 터치는 방해하지 않음) */}
      <Pressable className="flex-1" onPress={() => setSelectedCell(null)}>
        <GridMap
          stage={stage}
          selectedCell={selectedCell}
          towers={towers}
          enemies={enemies}
          attackEffects={attackEffects}
          floatingTexts={floatingTexts}
          onSelectCell={handleSelectCell}
          rangeDisplay={rangeDisplay}
          flashColor={flashColor}
          towerAngles={towerAngles}
          projectiles={projectiles}
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
          diamond={diamond}
          heart={heart} 
          waveId={wave.id} 
          speedMultiplier={speedMultiplier}
          onToggleSpeed={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : 1))}
          timeLeftSec={isTimeObjective ? timeLeftSec : null}
        />
      </View>

      {/* 스킬 상점 오버레이 */}
      <ItemShop 
        inventory={itemInventory}
        onUseItem={handleUseItem} 
        activeItemType={activeItem?.id || null} 
      />

      {/* 우측 상단 버튼 그룹: 재생/일시정지 + 메뉴 */}
      <View
        className="absolute top-4 right-6 z-20 flex-row gap-2"
        style={{ elevation: 20 }}
        pointerEvents="box-none"
      >
        {/* 재생/일시정지 토글 버튼 */}
        {gameState === "playing" && (
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-xl border border-slate-600 bg-slate-800/90 active:bg-slate-700"
            onPress={() => setIsQuickPaused((v) => !v)}
          >
            <Ionicons
              name={isQuickPaused ? "play" : "pause"}
              size={16}
              color={isQuickPaused ? "#34D399" : "#94A3B8"}
            />
          </TouchableOpacity>
        )}

        {/* ⚙️ 메뉴 버튼 */}
        <TouchableOpacity
          className="rounded-xl bg-slate-800/90 px-4 py-2 border border-slate-600 active:bg-slate-700 shadow-md"
          onPress={() => {
            setIsQuickPaused(false); // 퀵 포즈 해제 후 메뉴 진입
            setGameState("paused");
          }}
        >
          <Text className="font-bold text-slate-300">{t.menu}</Text>
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

      {/* 하단 관리 메뉴 오버레이 */}
      {showTowerMenu && existingTower && (
        <View className="absolute bottom-4 w-full z-50" style={{ elevation: 50 }} pointerEvents="box-none">
          <TowerMenu
            towerData={existingTower}
            gold={gold}
            onUpgrade={handleUpgradeTower}
            onSell={handleSellTower}
            onClose={() => setSelectedCell(null)}
          />
        </View>
      )}

      {/* Wave 20 최종 클리어 엔딩 팝업 */}
      {waveId === 20 && gameState === "wave_clear" && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-amber-950/80" style={{ elevation: 100 }}>
          <Animated.View
            style={{ transform: [{ scale: popupAnim }, { translateY: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }], opacity: popupAnim, backgroundColor: "#0F0A00", borderWidth: 2, borderColor: "#F59E0B", minWidth: 320 }}
            className="items-center rounded-2xl p-8 shadow-2xl"
          >
            {/* 골든 별 장식 */}
            <View className="flex-row gap-2 mb-3">
              {["★", "★", "★"].map((s, i) => (
                <Text key={i} className="text-3xl" style={{ color: "#F59E0B" }}>{s}</Text>
              ))}
            </View>

            <Text className="text-4xl font-black text-amber-400 text-center tracking-wider" style={{ textShadowColor: "#F59E0B", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 }}>
              {t.allWavesCleared}
            </Text>
            <Text className="mt-2 text-amber-200 text-base text-center">{t.allWavesClearedDesc}</Text>

            <View className="mt-5 w-full rounded-xl px-4 py-3" style={{ backgroundColor: "#1C1000", borderWidth: 1, borderColor: "#92400E" }}>
              <Text className="text-xs font-bold text-amber-500 mb-2 tracking-widest">{t.finalReport}</Text>
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="skull-outline" size={14} color="#67E8F9" />
                <Text className="text-sm font-bold text-cyan-300">{t.kills}: {killCount}</Text>
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="warning-outline" size={14} color="#FDA4AF" />
                <Text className="text-sm font-bold text-rose-300">{t.leaks}: {leakedCount}</Text>
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <FontAwesome5 name="coins" size={12} color="#FDE68A" />
                <Text className="text-sm font-bold text-amber-300">{t.goldEarned}: {earnedGoldFromKills + waveClearGoldReward}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <FontAwesome5 name="gem" size={12} color="#DDD6FE" />
                <Text className="text-sm font-bold text-violet-300">{t.diamondEarned}: {waveClearDiamondReward}</Text>
              </View>
            </View>

            <TouchableOpacity
              className="mt-6 w-full rounded-xl px-8 py-3 active:opacity-80"
              style={{ backgroundColor: "#92400E", borderWidth: 1, borderColor: "#F59E0B" }}
              onPress={() => onBackToLobby()}
            >
              <Text className="text-amber-200 font-bold text-lg text-center">{t.backToLobby}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* 게임 오버 / 클리어 팝업 오버레이 */}
      {(gameState === "game_over" || (gameState === "wave_clear" && waveId !== 20)) && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-slate-950/80" style={{ elevation: 100 }}>
          <Animated.View
            style={{ transform: [{ scale: popupAnim }, { translateY: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }], opacity: popupAnim }}
            className="items-center rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
          >
            {/* 등급 배지 */}
            {(() => {
              const gradeColor = leakedCount === 0 ? "#10B981" : leakedCount <= 3 ? "#3B82F6" : leakedCount <= 7 ? "#F59E0B" : "#EF4444";
              const gradeLetter = leakedCount === 0 ? "S" : leakedCount <= 3 ? "A" : leakedCount <= 7 ? "B" : "C";
              return (
                <View className="mb-3 items-center">
                  <View
                    className="w-14 h-14 rounded-2xl border-2 items-center justify-center"
                    style={{ borderColor: gradeColor, backgroundColor: gradeColor + "22" }}
                  >
                    <Text className="text-3xl font-black" style={{ color: gradeColor }}>{gradeLetter}</Text>
                  </View>
                  <Text className="text-[9px] font-bold text-slate-500 mt-0.5 tracking-wider">GRADE</Text>
                </View>
              );
            })()}

            <Text className={`text-4xl font-black ${gameState === "game_over" ? "text-red-500" : "text-emerald-400"}`}>
              {gameState === "game_over" ? t.gameOver : t.waveClear}
            </Text>
            <Text className="mt-2 text-slate-400 text-base">
              {gameState === "game_over"
                ? t.gameOverDesc
                : wave.isTimeObjective
                  ? t.timeObjectiveClearDesc
                  : t.waveClearDesc}
            </Text>

            <View className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3">
              <Text className="text-xs font-bold text-slate-400 mb-2">{t.resultReport}</Text>
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="skull-outline" size={14} color="#67E8F9" />
                <Text className="text-sm font-bold text-cyan-300">{t.kills}: {killCount}</Text>
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="warning-outline" size={14} color="#FDA4AF" />
                <Text className="text-sm font-bold text-rose-300">{t.leaks}: {leakedCount}</Text>
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <FontAwesome5 name="coins" size={12} color="#FDE68A" />
                <Text className="text-sm font-bold text-amber-300">
                  {t.goldEarned}: {earnedGoldFromKills + (gameState === "wave_clear" ? waveClearGoldReward : 0)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <FontAwesome5 name="gem" size={12} color="#DDD6FE" />
                <Text className="text-sm font-bold text-violet-300">
                  {t.diamondEarned}: {gameState === "wave_clear" ? waveClearDiamondReward : 0}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="flash-outline" size={14} color="#6EE7B7" />
                <Text className="text-sm font-bold text-emerald-300">{t.usedItems}: {usedItemCount}</Text>
              </View>
            </View>

            {gameState === "wave_clear" && waveId < 20 && (
              <TouchableOpacity
                className="mt-6 w-full rounded-xl bg-emerald-600 px-8 py-3 border border-emerald-500 active:bg-emerald-700"
                onPress={() => {
                  onNextWave();
                }}
              >
                <Text className="text-slate-100 font-bold text-lg text-center">{t.nextWave}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`w-full rounded-xl bg-slate-800 px-8 py-3 border border-slate-600 active:bg-slate-700 ${gameState === "wave_clear" && waveId < 20 ? "mt-3" : "mt-6"}`}
              onPress={() => {
                onBackToLobby();
              }}
            >
              <Text className="text-slate-200 font-bold text-lg text-center">{t.backToLobby}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* 튜토리얼 오버레이 */}
      {tutorialStepIdx !== null && (
        <View className="absolute inset-0 z-[200] items-center justify-center bg-slate-950/85" style={{ elevation: 200 }}>
          <Animated.View
            style={{ transform: [{ scale: tutorialAnim }], opacity: tutorialAnim, maxWidth: 340 }}
            className="w-11/12 rounded-2xl border border-cyan-700 bg-slate-900 p-7"
          >
            {/* 진행 도트 */}
            <View className="flex-row justify-center gap-2 mb-4">
              {t.tutorialStep.map((_, i) => (
                <View
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === tutorialStepIdx ? 20 : 8,
                    height: 8,
                    backgroundColor: i === tutorialStepIdx ? "#22D3EE" : "#334155",
                  }}
                />
              ))}
            </View>

            <Text className="text-[10px] font-bold text-cyan-500 tracking-widest mb-1">
              {t.tutorialTitle}  {tutorialStepIdx + 1}/{t.tutorialStep.length}
            </Text>
            <Text className="text-xl font-black text-slate-100 mb-3">
              {t.tutorialStep[tutorialStepIdx].title}
            </Text>
            <Text className="text-sm text-slate-300 leading-5">
              {t.tutorialStep[tutorialStepIdx].desc}
            </Text>

            <TouchableOpacity
              className="mt-6 w-full rounded-xl bg-cyan-600 py-3 border border-cyan-500 active:bg-cyan-700"
              onPress={async () => {
                if (tutorialStepIdx < t.tutorialStep.length - 1) {
                  tutorialAnim.setValue(0);
                  setTutorialStepIdx(tutorialStepIdx + 1);
                } else {
                  await AsyncStorage.setItem("tutorialShown", "1");
                  tutorialActiveRef.current = false; // 게임 시작
                  setTutorialStepIdx(null);
                }
              }}
            >
              <Text className="text-slate-100 font-bold text-base text-center">
                {tutorialStepIdx < t.tutorialStep.length - 1 ? t.tutorialNext : t.tutorialGotIt}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* 일시정지(메뉴) 팝업 오버레이 */}
      {gameState === "paused" && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-slate-950/80" style={{ elevation: 100 }}>
          <Animated.View 
            style={{ transform: [{ scale: popupAnim }, { translateY: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }], opacity: popupAnim }}
            className="w-80 items-center rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
          >
            <Text className="text-3xl font-black text-slate-200">{t.pauseTitle}</Text>
            <Text className="mt-2 text-slate-400 text-sm">{t.pauseDesc}</Text>

            <TouchableOpacity
              className="mt-8 w-full rounded-xl bg-emerald-600 px-8 py-3 border border-emerald-500 active:bg-emerald-700"
              onPress={() => setGameState("playing")}
            >
              <Text className="text-slate-100 font-bold text-lg text-center">{t.continueGame}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 w-full rounded-xl bg-amber-600 px-8 py-3 border border-amber-500 active:bg-amber-700"
              onPress={handleRestartWaveWithConfirm}
            >
              <Text className="text-slate-100 font-bold text-lg text-center">{t.restartWave}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 w-full rounded-xl bg-slate-800 px-8 py-3 border border-slate-600 active:bg-slate-700"
              onPress={() => onBackToLobby()}
            >
              <Text className="text-slate-200 font-bold text-lg text-center">{t.backToLobby}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ImageBackground>
  );
}
