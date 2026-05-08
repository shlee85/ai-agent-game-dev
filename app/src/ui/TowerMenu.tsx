import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TOWER_CONFIG } from "../data/towers";
import { getTowerRoleTag } from "../data/visualTheme";
import { useLanguage } from "../contexts/LanguageContext";

interface TowerMenuProps {
  towerData: { type: string; color: string; level: number };
  gold: number;
  onUpgrade: (cost: number) => void;
  onSell: (refund: number) => void;
  onClose: () => void;
}

export function TowerMenu({ towerData, gold, onUpgrade, onSell, onClose }: TowerMenuProps) {
  const { t } = useLanguage();
  const stats = TOWER_CONFIG[towerData.type];
  if (!stats) return null;

  const isMaxLevel = towerData.level >= 3;
  const upgradeCost1 = stats.upgradeCost;
  const upgradeCost2 = Math.floor(stats.upgradeCost * 1.5);
  const currentUpgradeCost = towerData.level === 1 ? upgradeCost1 : upgradeCost2;
  const canAffordUpgrade = gold >= currentUpgradeCost;

  const attackTypeLabel = stats.attackType === "aoe" ? "AOE" : stats.attackType === "slow" ? "SLOW" : "SINGLE";
  const attackTypeColor = stats.attackType === "aoe" ? "#F97316" : stats.attackType === "slow" ? "#06B6D4" : "#3B82F6";

  const totalInvested = stats.cost + (towerData.level >= 2 ? upgradeCost1 : 0) + (towerData.level >= 3 ? upgradeCost2 : 0);
  const refundAmount = Math.floor(totalInvested * 0.7);

  return (
    <View className="w-full items-center" pointerEvents="box-none">
      <View className="w-11/12 max-w-lg rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-lg flex-row items-center justify-between">

        {/* 타워 정보 */}
        <View className="flex-row items-center flex-1">
          <View style={{ backgroundColor: towerData.color }} className="mr-3 h-10 w-10 items-center justify-center rounded-full border-2 border-slate-500">
            <Text className="text-[10px] font-black text-slate-950">{getTowerRoleTag(towerData.type)}</Text>
            {towerData.level === 2 && <Text className="absolute -bottom-1 -right-1 text-[10px] font-bold text-white">U</Text>}
            {towerData.level >= 3 && <Text className="absolute -bottom-1 -right-1 text-[10px] font-bold text-yellow-300">MAX</Text>}
          </View>
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="text-base font-bold text-white">{t.towerName[towerData.type] ?? stats.name}</Text>
              <Text className="text-base font-bold text-yellow-400">Lv.{towerData.level}</Text>
            </View>
            <Text className="text-[10px] font-black tracking-wider text-cyan-300/90">
              {getTowerRoleTag(towerData.type)} | {t.roleLabel[towerData.type] ?? towerData.type}
            </Text>
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-slate-400 text-xs">
                ATK: {Math.round(stats.baseDamage * (1 + 0.5 * (towerData.level - 1)))} | RNG: {stats.baseRange} | CD: {stats.baseCooldown}s
              </Text>
              <View
                className="rounded px-1 py-0.5"
                style={{ backgroundColor: attackTypeColor + "33", borderWidth: 1, borderColor: attackTypeColor + "88" }}
              >
                <Text className="text-[9px] font-black" style={{ color: attackTypeColor }}>{attackTypeLabel}</Text>
              </View>
            </View>
            {stats.affinityEnemyType && (
              <Text className="text-[9px] font-bold text-yellow-400/90">
                ▲{t.affinityEnemy[stats.affinityEnemyType] ?? stats.affinityEnemyType.toUpperCase()} x{stats.affinityMultiplier} {t.affinityLabel}
              </Text>
            )}
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View className="flex-row gap-2 items-center">
          {/* 판매 버튼 */}
          <Pressable
            onPress={() => onSell(refundAmount)}
            className="items-center justify-center rounded-xl border border-rose-800 bg-rose-950/50 p-2 w-16 h-12 active:bg-rose-900"
          >
            <Text className="text-[10px] font-semibold text-rose-300 mb-0.5">{t.sell}</Text>
            <View className="flex-row items-center">
              <FontAwesome5 name="coins" size={8} color="#34D399" className="mr-0.5" />
              <Text className="text-[10px] font-bold text-emerald-400">+{refundAmount}</Text>
            </View>
          </Pressable>

          {/* 업그레이드 버튼 */}
          <Pressable
            onPress={() => {
              if (!isMaxLevel && canAffordUpgrade) {
                onUpgrade(currentUpgradeCost);
              }
            }}
            className={`items-center justify-center rounded-xl border p-2 w-16 h-12 ${
              isMaxLevel
                ? "border-slate-700 bg-slate-800 opacity-50"
                : canAffordUpgrade
                  ? "border-amber-600 bg-amber-900/40 active:bg-amber-800/60"
                  : "border-slate-800 bg-slate-900 opacity-50"
            }`}
          >
            <Text className="text-[10px] font-semibold text-amber-200 mb-0.5">{isMaxLevel ? t.max : t.upgrade}</Text>
            {!isMaxLevel && (
              <View className="flex-row items-center">
                <FontAwesome5 name="coins" size={8} color={canAffordUpgrade ? "#FBBF24" : "#F87171"} className="mr-0.5" />
                <Text className={`text-[10px] font-bold ${canAffordUpgrade ? "text-yellow-400" : "text-red-400"}`}>
                  -{currentUpgradeCost}
                </Text>
              </View>
            )}
          </Pressable>

          {/* 닫기 버튼 */}
          <Pressable onPress={onClose} className="w-8 h-8 ml-1 bg-slate-800 rounded-full border border-slate-600 items-center justify-center">
            <Text className="text-slate-300 font-bold">X</Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}