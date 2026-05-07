import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { Difficulty } from "../data/difficulty";
import { WaveId } from "../data/waves";
import { useLanguage } from "../contexts/LanguageContext";

interface LobbyScreenProps {
  initialDifficulty: Difficulty;
  onSelectWave: (waveId: WaveId, difficulty: Difficulty) => void;
  onOpenShop: () => void;
  onOpenGuide: () => void;
  adminEnabled: boolean;
  onToggleAdmin: () => void;
  onAdminResetDifficultyProgress: (difficulty: Difficulty) => Promise<void>;
  onAdminAddItems: (amount: number) => void;
}

export function LobbyScreen({
  initialDifficulty,
  onSelectWave,
  onOpenShop,
  onOpenGuide,
  adminEnabled,
  onToggleAdmin,
  onAdminResetDifficultyProgress,
  onAdminAddItems,
}: LobbyScreenProps) {
  const { t, lang, toggleLang } = useLanguage();
  const [allMaxUnlocked, setAllMaxUnlocked] = useState<Record<Difficulty, number>>({ easy: 1, normal: 1, hard: 1 });
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>(initialDifficulty);
  const WAVE_CARD_SIZE = 64;
  const WAVE_GAP = 8;
  const VISIBLE_WAVE_COUNT = 6;
  const waveViewportWidth = WAVE_CARD_SIZE * VISIBLE_WAVE_COUNT + WAVE_GAP * (VISIBLE_WAVE_COUNT - 1);
  const waveToneById: Record<number, { border: string; accent: string; text: string }> = {
    1: { border: "#22C55E", accent: "#14532D", text: "#86EFAC" },
    2: { border: "#84CC16", accent: "#365314", text: "#BEF264" },
    3: { border: "#06B6D4", accent: "#164E63", text: "#67E8F9" },
    4: { border: "#3B82F6", accent: "#1E3A8A", text: "#93C5FD" },
    5: { border: "#A855F7", accent: "#581C87", text: "#D8B4FE" },
    6: { border: "#F43F5E", accent: "#881337", text: "#FDA4AF" },
    7: { border: "#F59E0B", accent: "#78350F", text: "#FDE68A" },
    8: { border: "#EAB308", accent: "#713F12", text: "#FDE047" },
    9: { border: "#14B8A6", accent: "#134E4A", text: "#5EEAD4" },
    10: { border: "#0EA5E9", accent: "#0C4A6E", text: "#7DD3FC" },
    11: { border: "#6366F1", accent: "#312E81", text: "#C7D2FE" },
    12: { border: "#8B5CF6", accent: "#4C1D95", text: "#DDD6FE" },
    13: { border: "#D946EF", accent: "#701A75", text: "#F5D0FE" },
    14: { border: "#F97316", accent: "#7C2D12", text: "#FED7AA" },
    15: { border: "#EF4444", accent: "#7F1D1D", text: "#FECACA" },
  };

  // 로비에 진입할 때마다 3개 난이도 진행도를 동시에 읽어옴
  const loadProgress = useCallback(async () => {
    try {
      const [easy, normal, hard] = await Promise.all([
        AsyncStorage.getItem("maxUnlockedWave_easy"),
        AsyncStorage.getItem("maxUnlockedWave_normal"),
        AsyncStorage.getItem("maxUnlockedWave_hard"),
      ]);
      setAllMaxUnlocked({
        easy: easy ? Number(easy) : 1,
        normal: normal ? Number(normal) : 1,
        hard: hard ? Number(hard) : 1,
      });
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <ImageBackground 
      source={require('../../assets/bg.png')} 
      className="flex-1 items-center justify-center bg-slate-950"
      imageStyle={{ opacity: 0.6 }} // 우주 배경이 너무 밝지 않게
    >
      <View className="absolute right-4 top-4 z-10 flex-row items-center gap-2">
        <TouchableOpacity
          onPress={toggleLang}
          className="rounded-md border border-slate-600 bg-slate-900/90 px-2 py-1 active:bg-slate-800"
        >
          <Text className="text-[10px] font-black tracking-wider text-slate-300">
            {lang === "en" ? "KR" : "EN"}
          </Text>
        </TouchableOpacity>
        <View className="rounded-md border border-cyan-500/40 bg-slate-950/80 px-2 py-1">
          <Text className="text-[10px] font-black tracking-wider text-cyan-400/90">beta5.0</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onToggleAdmin}
        className="absolute left-4 top-4 z-10 rounded-md border px-3 py-2 active:opacity-90"
        style={{
          borderColor: adminEnabled ? "#F59E0B" : "#64748B",
          backgroundColor: adminEnabled ? "#7C2D12" : "#0F172A",
        }}
      >
        <Text
          className="text-[10px] font-black tracking-wider"
          style={{ color: adminEnabled ? "#FDE68A" : "#94A3B8" }}
        >
          {adminEnabled ? "ADMIN ON" : "ADMIN OFF"}
        </Text>
      </TouchableOpacity>

      {adminEnabled && (
        <View className="absolute left-4 top-16 z-10 gap-2">
          <TouchableOpacity
            onPress={async () => {
              await onAdminResetDifficultyProgress(selectedDiff);
              setAllMaxUnlocked((prev) => ({ ...prev, [selectedDiff]: 1 }));
            }}
            className="rounded-md border border-rose-600 bg-rose-950/90 px-3 py-2 active:opacity-90"
          >
            <Text className="text-[10px] font-black tracking-wider text-rose-300">
              RESET {selectedDiff.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onAdminAddItems(5)}
            className="rounded-md border border-amber-600 bg-amber-950/90 px-3 py-2 active:opacity-90"
          >
            <Text className="text-[10px] font-black tracking-wider text-amber-300">ITEM +5</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 타이틀 영역 */}
      <View className="items-center mb-6 mt-4">
        <Image 
          source={require('../../assets/logo.png')} 
          style={{ width: 80, height: 80, marginBottom: 12, borderRadius: 16, borderWidth: 2, borderColor: "rgba(6, 182, 212, 0.5)" }} 
        />
        <Text 
          className="text-4xl font-black text-cyan-400 tracking-wider" 
          style={{ textShadowColor: "rgba(6, 182, 212, 0.8)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 }}
        >
          SENTINEL PROTOCOL
        </Text>
        <Text className="text-xs font-bold text-fuchsia-400 tracking-[0.3em] mt-1">
          {t.tagline}
        </Text>
      </View>
      
      {/* 난이도 선택 영역 */}
      <View className="mb-6 flex-row gap-4">
        {(["easy", "normal", "hard"] as Difficulty[]).map((diff) => {
          const isSelected = selectedDiff === diff;
          let colorClass = "text-slate-400";
          let borderClass = "border-slate-700 bg-slate-900";
          let shadow = {};
          
          if (isSelected) {
            if (diff === "easy") {
              colorClass = "text-emerald-400";
              borderClass = "border-emerald-500 bg-emerald-900/40";
              shadow = { shadowColor: "#10B981", shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 };
            } else if (diff === "normal") {
              colorClass = "text-cyan-400";
              borderClass = "border-cyan-500 bg-cyan-900/40";
              shadow = { shadowColor: "#06B6D4", shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 };
            } else {
              colorClass = "text-fuchsia-400";
              borderClass = "border-fuchsia-500 bg-fuchsia-900/40";
              shadow = { shadowColor: "#D946EF", shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 };
            }
          }

          return (
            <TouchableOpacity
              key={diff}
              onPress={() => setSelectedDiff(diff)}
              style={shadow}
              className={`px-6 py-3 rounded-xl border-2 flex-row items-center gap-2 ${borderClass}`}
            >
              <Ionicons
                name={diff === "easy" ? "shield-checkmark" : diff === "normal" ? "flash" : "skull"}
                size={16}
                color={isSelected ? (diff === "easy" ? "#34D399" : diff === "normal" ? "#22D3EE" : "#E879F9") : "#94A3B8"}
              />
              <View className="items-start">
                <Text className={`font-black tracking-widest ${colorClass}`}>
                  {diff === "easy" ? t.easy : diff === "normal" ? t.normal : t.hard}
                </Text>
                <Text className="text-[9px] font-bold text-slate-400 tracking-wider mt-0.5">
                  {allMaxUnlocked[diff]}/15
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 웨이브(섹터) 선택 영역 */}
      <View className="w-full items-center px-4">
        <View style={{ width: waveViewportWidth }} className="overflow-hidden rounded-xl">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={WAVE_CARD_SIZE + WAVE_GAP}
          decelerationRate="fast"
          disableIntervalMomentum
          contentContainerStyle={{ gap: WAVE_GAP, paddingRight: 4 }}
        >
          {Array.from({ length: 15 }, (_, idx) => idx + 1).map((wave) => {
            const isUnlocked = adminEnabled || wave <= allMaxUnlocked[selectedDiff];
            const tone = waveToneById[wave];
            return (
              <TouchableOpacity
                key={wave}
                disabled={!isUnlocked}
                onPress={() => onSelectWave(wave as WaveId, selectedDiff)}
                style={{
                  width: WAVE_CARD_SIZE,
                  height: WAVE_CARD_SIZE,
                  borderColor: isUnlocked ? tone.border : "#1E293B",
                  backgroundColor: isUnlocked ? "#0B1220" : "#020617",
                  shadowColor: isUnlocked ? tone.border : "transparent",
                  shadowOpacity: isUnlocked ? 0.35 : 0,
                  shadowRadius: 10,
                  elevation: isUnlocked ? 5 : 0,
                }}
                className={`items-center justify-center rounded-xl border-2 relative overflow-hidden ${isUnlocked ? "" : "opacity-60"}`}
              >
                <View
                  className="absolute top-0 h-1 w-full"
                  style={{ backgroundColor: isUnlocked ? tone.accent : "#0F172A" }}
                />

                <Text className="text-[7px] font-bold text-slate-400 mb-0.5 tracking-wider">{t.waveLabel.toUpperCase()}</Text>
                <Text
                  className="text-lg font-black"
                  style={{
                    color: isUnlocked ? tone.text : "#475569",
                    textShadowColor: isUnlocked ? `${tone.border}AA` : "transparent",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  }}
                >
                  {String(wave).padStart(2, "0")}
                </Text>

                <View className="mt-0.5 flex-row items-center rounded-full border border-slate-800 bg-slate-950/80 px-1.5 py-0.5">
                  <Ionicons name={isUnlocked ? "play" : "lock-closed"} size={8} color={isUnlocked ? tone.text : "#475569"} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        </View>
      </View>

      <TouchableOpacity 
        onPress={async () => {
          await AsyncStorage.removeItem(`maxUnlockedWave_${selectedDiff}`);
          setAllMaxUnlocked((prev) => ({ ...prev, [selectedDiff]: 1 }));
        }}
        className="absolute bottom-8 right-8 px-4 py-2 bg-slate-900/80 rounded-lg border border-rose-900/50 active:bg-slate-800"
      >
         <Text className="text-rose-500/80 font-bold text-xs tracking-wider">{t.reset} {selectedDiff.toUpperCase()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onOpenShop}
        className="absolute bottom-14 left-10 items-center active:opacity-85"
      >
        <View className="mb-1 h-16 w-16 items-center justify-center rounded-2xl border-2 border-cyan-500/70 bg-slate-900/95">
          <FontAwesome5 name="gem" size={30} color="#67E8F9" />
        </View>
        <Text className="text-xs font-black tracking-[0.2em] text-cyan-300">{t.shop}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onOpenGuide}
        className="absolute bottom-14 left-36 items-center active:opacity-85"
      >
        <View className="mb-1 h-16 w-16 items-center justify-center rounded-2xl border-2 border-amber-500/70 bg-slate-900/95">
          <FontAwesome5 name="book-open" size={26} color="#FDE68A" />
        </View>
        <Text className="text-xs font-black tracking-[0.2em] text-amber-300">{t.guide}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
