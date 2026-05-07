import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { useLanguage } from "../contexts/LanguageContext";
import { TOWER_CONFIG } from "../data/towers";
import { ITEM_CONFIG } from "../data/items";
import { ENEMY_CONFIG, EnemyType } from "../data/enemies";
import { SHOP_ITEMS } from "../data/shop";
import { TOWER_GUIDE, ITEM_GUIDE, ENEMY_GUIDE } from "../data/guideData";
import { ITEM_ASSETS } from "../data/itemAssets";
import { getTowerRoleTag, getEnemyThreatTag } from "../data/visualTheme";

type GuideTab = "tower" | "item" | "enemy";

export function GuideScreen({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<GuideTab>("tower");

  const attackTypeLabel = (type: string) =>
    type === "aoe" ? "AOE" : type === "slow" ? "SLOW" : "SINGLE";
  const attackTypeColor = (type: string) =>
    type === "aoe" ? "#F97316" : type === "slow" ? "#06B6D4" : "#3B82F6";

  const shopPriceFor = (itemId: string) =>
    SHOP_ITEMS.find((s) => s.targetItemId === itemId)?.price ?? "—";

  const tabs: { key: GuideTab; label: string }[] = [
    { key: "tower", label: t.guideTabTower },
    { key: "item", label: t.guideTabItem },
    { key: "enemy", label: t.guideTabEnemy },
  ];

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      className="flex-1 bg-slate-950"
      imageStyle={{ opacity: 0.4 }}
    >
      {/* 헤더 */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <TouchableOpacity
          onPress={onBack}
          className="mr-4 rounded-xl border border-slate-600 bg-slate-800/90 px-4 py-2 active:bg-slate-700"
        >
          <Text className="font-bold text-slate-300 text-sm">{t.back}</Text>
        </TouchableOpacity>
        <Text className="text-xl font-black tracking-widest text-amber-300">{t.guide}</Text>
      </View>

      {/* 탭 바 */}
      <View className="flex-row px-4 gap-2 mb-3">
        {tabs.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            onPress={() => setActiveTab(key)}
            className={`flex-1 rounded-xl py-2 items-center border ${
              activeTab === key
                ? "bg-amber-900/50 border-amber-500"
                : "bg-slate-900/80 border-slate-700"
            }`}
          >
            <Text
              className={`font-black text-sm tracking-wider ${
                activeTab === key ? "text-amber-300" : "text-slate-400"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 콘텐츠 */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* ── 타워 탭 ── */}
        {activeTab === "tower" &&
          Object.values(TOWER_CONFIG).map((stats) => {
            const guide = TOWER_GUIDE[stats.id];
            const aColor = attackTypeColor(stats.attackType);
            const aLabel = attackTypeLabel(stats.attackType);
            return (
              <View
                key={stats.id}
                className="mb-4 rounded-2xl border border-slate-700 bg-slate-900/95 p-4"
              >
                {/* 타워 헤더 — 게임 내 표현과 동일한 색상 원 + 역할 태그 */}
                <View className="flex-row items-center gap-3 mb-3">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center border-2 border-slate-500"
                    style={{ backgroundColor: stats.color }}
                  >
                    <Text className="text-sm font-black text-slate-950">{getTowerRoleTag(stats.id)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-black text-white">
                      {t.towerName[stats.id] ?? stats.name}
                    </Text>
                    <Text className="text-xs font-bold text-cyan-300/80">
                      {t.roleLabel[stats.id]}
                    </Text>
                  </View>
                  <View
                    className="rounded-lg px-2 py-1"
                    style={{ backgroundColor: aColor + "33", borderWidth: 1, borderColor: aColor + "88" }}
                  >
                    <Text className="text-[10px] font-black" style={{ color: aColor }}>{aLabel}</Text>
                  </View>
                </View>

                {/* 스탯 그리드 */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                  <StatChip icon="coins" iconLib="fa5" color="#FDE68A" label={t.guideCost} value={`${stats.cost}g`} />
                  <StatChip icon="bolt" iconLib="fa5" color="#93C5FD" label="ATK" value={String(stats.baseDamage)} />
                  <StatChip icon="expand-arrows-alt" iconLib="fa5" color="#6EE7B7" label="RNG" value={`${stats.baseRange}`} />
                  <StatChip icon="clock" iconLib="fa5" color="#C4B5FD" label="CD" value={`${stats.baseCooldown}s`} />
                  {stats.affinityEnemyType && (
                    <StatChip
                      icon="star"
                      iconLib="fa5"
                      color="#FDE68A"
                      label={t.guideAffinity}
                      value={`${t.affinityEnemy[stats.affinityEnemyType]} ×${stats.affinityMultiplier}`}
                    />
                  )}
                </View>

                {/* 설명 + 장단점 */}
                {guide && (
                  <>
                    <Text className="text-xs text-slate-400 mb-2 leading-5">
                      {guide.summary[lang]}
                    </Text>
                    <ProCon pros={guide.pros[lang]} cons={guide.cons[lang]} tPros={t.guidePros} tCons={t.guideCons} />
                  </>
                )}
              </View>
            );
          })}

        {/* ── 아이템 탭 ── */}
        {activeTab === "item" &&
          Object.values(ITEM_CONFIG).map((item) => {
            const guide = ITEM_GUIDE[item.id];
            const shopPrice = shopPriceFor(item.id);
            const typeLabel =
              item.type === "targeted_aoe" ? "TARGETED" :
              item.type === "global_freeze" ? "FREEZE" :
              item.type === "global_aoe" ? "AOE" : "SUPPORT";
            const typeColor =
              item.type === "targeted_aoe" ? "#F43F5E" :
              item.type === "global_freeze" ? "#38BDF8" :
              item.type === "global_aoe" ? "#F59E0B" : "#10B981";
            return (
              <View
                key={item.id}
                className="mb-4 rounded-2xl border border-slate-700 bg-slate-900/95 p-4"
              >
                {/* 아이템 헤더 — 인게임 ItemShop과 동일한 실제 이미지 사용 */}
                <View className="flex-row items-center gap-3 mb-3">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center border-2"
                    style={{ backgroundColor: item.color + "33", borderColor: item.color }}
                  >
                    <Image
                      source={ITEM_ASSETS[item.id]}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-black text-white">
                      {t.shopItemLabel[item.id] ?? item.name}
                    </Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <FontAwesome5 name="gem" size={10} color="#A78BFA" />
                      <Text className="text-xs font-bold text-violet-300">
                        {shopPrice}💎
                      </Text>
                    </View>
                  </View>
                  <View
                    className="rounded-lg px-2 py-1"
                    style={{ backgroundColor: typeColor + "33", borderWidth: 1, borderColor: typeColor + "88" }}
                  >
                    <Text className="text-[10px] font-black" style={{ color: typeColor }}>{typeLabel}</Text>
                  </View>
                </View>

                {/* 스탯 */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {item.damage > 0 && (
                    <StatChip icon="bolt" iconLib="fa5" color="#93C5FD" label="DMG" value={String(item.damage)} />
                  )}
                  {item.radius && (
                    <StatChip icon="expand-arrows-alt" iconLib="fa5" color="#6EE7B7" label="Radius" value={`${item.radius}`} />
                  )}
                  {item.duration && (
                    <StatChip icon="clock" iconLib="fa5" color="#C4B5FD" label="Duration" value={`${item.duration}s`} />
                  )}
                </View>

                {guide && (
                  <>
                    <Text className="text-xs text-slate-400 mb-2 leading-5">
                      {guide.summary[lang]}
                    </Text>
                    <ProCon pros={guide.pros[lang]} cons={guide.cons[lang]} tPros={t.guidePros} tCons={t.guideCons} />
                  </>
                )}
              </View>
            );
          })}

        {/* ── 적 탭 ── */}
        {activeTab === "enemy" &&
          (Object.keys(ENEMY_CONFIG) as EnemyType[]).map((enemyId) => {
            const enemy = ENEMY_CONFIG[enemyId];
            const guide = ENEMY_GUIDE[enemyId];
            return (
              <View
                key={enemyId}
                className="mb-4 rounded-2xl border border-slate-700 bg-slate-900/95 p-4"
              >
                {/* 적 헤더 — 게임 내 표현과 동일한 색상 원 + 위협 태그 */}
                <View className="flex-row items-center gap-3 mb-3">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center border-2 border-slate-500"
                    style={{ backgroundColor: enemy.color }}
                  >
                    <Text className="text-[10px] font-black text-slate-950">{getEnemyThreatTag(enemyId)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-black text-white">
                      {t.enemyName[enemyId] ?? enemy.name}
                    </Text>
                  </View>
                </View>

                {/* 스탯 */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                  <StatChip icon="heart" iconLib="ion" color="#FDA4AF" label={t.guideBaseHp} value={String(enemy.baseHp)} />
                  <StatChip icon="speedometer" iconLib="ion" color="#6EE7B7" label={t.guideSpeed} value={`${enemy.baseSpeed} t/s`} />
                  <StatChip icon="coins" iconLib="fa5" color="#FDE68A" label={t.guideReward} value={`${enemy.killReward}g`} />
                </View>

                {guide && (
                  <>
                    <Text className="text-xs text-slate-400 mb-2 leading-5">
                      {guide.summary[lang]}
                    </Text>
                    <ProCon pros={guide.pros[lang]} cons={guide.cons[lang]} tPros={t.guidePros} tCons={t.guideCons} />
                  </>
                )}
              </View>
            );
          })}

        <View className="h-8" />
      </ScrollView>
    </ImageBackground>
  );
}

function StatChip({
  icon,
  iconLib,
  color,
  label,
  value,
}: {
  icon: string;
  iconLib: "ion" | "fa5";
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1">
      {iconLib === "ion" ? (
        <Ionicons name={icon as any} size={11} color={color} />
      ) : (
        <FontAwesome5 name={icon as any} size={10} color={color} />
      )}
      <Text className="text-[10px] text-slate-400">{label}</Text>
      <Text className="text-[10px] font-bold" style={{ color }}>{value}</Text>
    </View>
  );
}

function ProCon({
  pros,
  cons,
  tPros,
  tCons,
}: {
  pros: string;
  cons: string;
  tPros: string;
  tCons: string;
}) {
  return (
    <View className="gap-1.5">
      <View className="flex-row items-start gap-2 rounded-lg bg-emerald-950/50 border border-emerald-900/60 px-3 py-2">
        <Ionicons name="checkmark-circle" size={13} color="#34D399" style={{ marginTop: 1 }} />
        <View className="flex-1">
          <Text className="text-[10px] font-black text-emerald-400 mb-0.5">{tPros}</Text>
          <Text className="text-[10px] text-emerald-300/90 leading-4">{pros}</Text>
        </View>
      </View>
      <View className="flex-row items-start gap-2 rounded-lg bg-rose-950/50 border border-rose-900/60 px-3 py-2">
        <Ionicons name="close-circle" size={13} color="#F87171" style={{ marginTop: 1 }} />
        <View className="flex-1">
          <Text className="text-[10px] font-black text-rose-400 mb-0.5">{tCons}</Text>
          <Text className="text-[10px] text-rose-300/90 leading-4">{cons}</Text>
        </View>
      </View>
    </View>
  );
}
